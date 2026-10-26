"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import Pagination from "@/components/ui/Pagination";
// import clsx from "@/lib/clsx";
// import { LEVELS, type Level } from "./data";
import type { PlaybookListItem, PlaybookPage } from "@/types";
import { useI18n } from "@/components/i18n/I18nProvider";
import PdfViewerModal from "./PdfViewerModal";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SEARCH_DEBOUNCE_MS = 400;

/**
 * List Web Playbook: pencarian + paginasi bernomor (9 per halaman). Halaman pertama dirender server
 * (initialPage); perubahan berikutnya lewat /api/playbooks. Klik kartu → popup baca PDF.
 * `canDownload` = member login (tombol Unduh di popup).
 */
export default function PlaybookList({
  initialPage,
  canDownload,
}: {
  initialPage: PlaybookPage;
  canDownload: boolean;
}) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  // const [level, setLevel] = useState<Level>("Beginner");
  const [data, setData] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [active, setActive] = useState<PlaybookListItem | null>(null);

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

  async function load(nextSearch: string, page: number) {
    // Batalkan request sebelumnya supaya hasil lama tidak menimpa hasil terbaru
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(false);

    const params = new URLSearchParams({ page: String(page) });
    if (nextSearch.trim()) params.set("search", nextSearch.trim());

    try {
      const res = await fetch(`/api/playbooks?${params}`, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(true);
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => void load(value, 1), SEARCH_DEBOUNCE_MS);
  }

  function handlePageChange(page: number) {
    void load(search, page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const closeViewer = useCallback(() => setActive(null), []);

  return (
    <div>
      <h2
        ref={listTopRef}
        className="scroll-mt-28 text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark"
      >
        {t.guide.playbook.title}
      </h2>

      <SearchFilterBar className="mt-6" search={search} onSearchChange={handleSearchChange} />

      {/* Tab level — sementara dinonaktifkan sampai backend punya kolom level (lihat ./data.ts)
      <div className="mt-6 flex flex-wrap gap-1 sm:gap-3">
        {LEVELS.map((opt) => {
          const isActive = opt === level;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setLevel(opt)}
              className={clsx(
                "rounded-full px-5 py-2.5 text-base font-bold leading-6 transition",
                isActive
                  ? "bg-muted-steel text-white"
                  : "bg-koleksi-navy-deep/10 text-koleksi-navy-deep hover:bg-koleksi-navy-deep/15",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      */}

      {error && (
        <p className="mt-6 text-sm text-red-500">{t.guide.playbook.error}</p>
      )}

      {!error && !loading && data.items.length === 0 && (
        <p className="mt-10 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          {t.guide.playbook.empty}
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${data.page}-${search}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: loading ? 0.5 : 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          aria-busy={loading}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {data.items.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              aria-label={`${t.common.view} ${item.title}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: (index % 6) * 0.08 }}
              className="group relative overflow-hidden rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-koleksi-green"
            >
              <div className="relative aspect-388/200 w-full bg-koleksi-navy-deep/10 sm:aspect-270/320">
                {item.cover && (
                  <Image
                    src={item.cover}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className="absolute inset-x-0 top-0 p-4">
                <p className="text-[20px] font-bold leading-6 text-white">{item.title}</p>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex justify-end p-4">
                <span className="rounded-full bg-koleksi-amber px-5 py-2 text-base font-bold leading-6 text-koleksi-navy-deep transition group-hover:brightness-95">
                  {t.common.view}
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {data.totalPages > 1 && (
        <Pagination
          className="mt-10"
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <PdfViewerModal playbook={active} canDownload={canDownload} onClose={closeViewer} />
    </div>
  );
}
