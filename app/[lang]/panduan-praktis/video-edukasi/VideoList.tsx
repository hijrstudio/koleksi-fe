"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import YoutubeModal, { type YoutubeModalVideo } from "@/components/ui/YoutubeModal";
import clsx from "@/lib/clsx";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { VideoCategory, VideoPage } from "@/types";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const VIDEOS_PER_PAGE = 4;
const SEARCH_DEBOUNCE_MS = 400;

interface Filters {
  search: string;
  category: number | null;
}

/**
 * List video edukasi: pencarian, filter kategori, paginasi bernomor (4 per halaman),
 * klik video membuka popup YouTube. Halaman pertama dirender server (initialPage);
 * perubahan berikutnya diambil lewat /api/videos.
 */
export default function VideoList({
  initialPage,
  categories,
}: {
  initialPage: VideoPage;
  categories: VideoCategory[];
}) {
  const { t } = useI18n();
  const [filters, setFilters] = useState<Filters>({ search: "", category: null });
  const [data, setData] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeVideo, setActiveVideo] = useState<YoutubeModalVideo | null>(null);
  const closeVideo = useCallback(() => setActiveVideo(null), []);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const listTopRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      abortRef.current?.abort();
    },
    [],
  );

  async function load(next: Filters, page: number) {
    // Batalkan request sebelumnya supaya hasil lama tidak menimpa hasil terbaru
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(false);

    const params = new URLSearchParams({ page: String(page) });
    if (next.search.trim()) params.set("search", next.search.trim());
    if (next.category) params.set("category", String(next.category));

    try {
      const res = await fetch(`/api/videos?${params}`, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(true);
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  function handleSearchChange(search: string) {
    const next = { ...filters, search };
    setFilters(next);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => void load(next, 1), SEARCH_DEBOUNCE_MS);
  }

  function handleCategoryChange(name: string) {
    const next = { ...filters, category: categories.find((c) => c.name === name)?.id ?? null };
    setFilters(next);
    void load(next, 1);
  }

  function handlePageChange(page: number) {
    void load(filters, page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const categoryLabel = categories.find((c) => c.id === filters.category)?.name ?? null;

  return (
    <div>
      <h2
        ref={listTopRef}
        className="scroll-mt-28 text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark"
      >
        {t.guide.videos.title}
      </h2>

      <SearchFilterBar
        className="mt-6"
        search={filters.search}
        onSearchChange={handleSearchChange}
      >
        <FilterDropdown
          label={t.list.categoryTag}
          options={[t.common.all, ...categories.map((c) => c.name)]}
          value={categoryLabel}
          onChange={handleCategoryChange}
        />
      </SearchFilterBar>

      {error && (
        <p className="mt-6 text-sm text-red-500">
          {t.guide.videos.error}
        </p>
      )}

      {!error && !loading && data.items.length === 0 && (
        <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          {t.guide.videos.empty}
        </p>
      )}

      <div
        className={clsx(
          "mt-6 divide-y divide-border-light transition-opacity dark:divide-border-dark",
          loading && "opacity-50",
        )}
      >
        {data.items.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => setActiveVideo({ youtubeId: item.youtubeId, title: item.title })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: EASE_OUT,
              delay: (index % VIDEOS_PER_PAGE) * 0.08,
            }}
            className="group flex w-full gap-4 py-5 text-left first:pt-0 cursor-pointer"
          >
            <div className="relative aspect-270/183 w-[160px] shrink-0 overflow-hidden rounded-xl bg-koleksi-navy-dark/10 sm:w-[200px] lg:w-[270px]">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="270px"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-koleksi-navy-deep transition group-hover:bg-white">
                  <Play size={18} className="ml-0.5 fill-current" />
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <span className="inline-flex w-fit items-center rounded-full bg-badge-video px-3 py-1 text-[12px] leading-3 font-semibold text-white">
                {item.category.name}
              </span>
              <h3 className="mt-2 text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                {item.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[14px] text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                {item.date}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
          className="mt-10"
        />
      )}

      <YoutubeModal video={activeVideo} onClose={closeVideo} />
    </div>
  );
}
