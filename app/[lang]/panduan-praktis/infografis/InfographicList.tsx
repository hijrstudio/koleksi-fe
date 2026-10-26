"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import clsx from "@/lib/clsx";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { InfographicListItem, InfographicPage, VideoCategory } from "@/types";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const INFOGRAFIS_PER_PAGE = 6;
const SEARCH_DEBOUNCE_MS = 400;

interface Filters {
  search: string;
  category: number | null;
}

/**
 * List infografis: pencarian, filter kategori, paginasi bernomor (6 per halaman),
 * klik item membuka popup gambar penuh. Halaman pertama dirender server (initialPage);
 * perubahan berikutnya diambil lewat /api/infographics.
 */
export default function InfographicList({
  initialPage,
  categories,
}: {
  initialPage: InfographicPage;
  categories: VideoCategory[];
}) {
  const { t } = useI18n();
  const [filters, setFilters] = useState<Filters>({ search: "", category: null });
  const [data, setData] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeItem, setActiveItem] = useState<InfographicListItem | null>(null);

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

  // Popup: tutup dengan tombol Esc
  useEffect(() => {
    if (!activeItem) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveItem(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeItem]);

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
      const res = await fetch(`/api/infographics?${params}`, { signal: controller.signal });
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
        {t.guide.infographics.title}
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
          {t.guide.infographics.error}
        </p>
      )}

      {!error && !loading && data.items.length === 0 && (
        <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          {t.guide.infographics.empty}
        </p>
      )}

      <div
        className={clsx(
          "mt-6 grid grid-cols-2 gap-x-4 gap-y-8 transition-opacity sm:gap-x-6 sm:gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
          loading && "opacity-50",
        )}
      >
        {data.items.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => item.image && setActiveItem(item)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: EASE_OUT,
              delay: (index % INFOGRAFIS_PER_PAGE) * 0.08,
            }}
            className="group text-left cursor-pointer"
          >
            <div className="relative aspect-236/300 w-full overflow-hidden rounded-[10px] border border-border-light bg-koleksi-navy-dark/5 dark:border-border-dark">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              )}
            </div>
            <span className="mt-5 inline-flex w-fit items-center rounded-full bg-badge-liputan px-2.5 py-1 text-xs font-bold text-koleksi-navy-dark">
              {item.category.name}
            </span>
            <h3 className="mt-3 text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
              {item.title}
            </h3>
          </motion.button>
        ))}
      </div>

      {data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
          className="mt-18"
        />
      )}

      <AnimatePresence>
        {activeItem?.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-236/300 h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                aria-label={t.common.close}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
              >
                <X size={18} />
              </button>
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
