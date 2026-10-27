"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import Pagination from "@/components/ui/Pagination";
import clsx from "@/lib/clsx";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { RegulationPage } from "@/types";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const REGULATIONS_PER_PAGE = 5;
const SEARCH_DEBOUNCE_MS = 400;

/**
 * List dokumen regulasi: pencarian judul, paginasi bernomor (5 per halaman), tombol Lihat membuka PDF
 * di tab baru. Halaman pertama dirender server (initialPage); perubahan berikutnya diambil lewat /api/regulations.
 */
export default function RegulationList({ initialPage }: { initialPage: RegulationPage }) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [data, setData] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
      const res = await fetch(`/api/regulations?${params}`, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(true);
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  function handleSearchChange(next: string) {
    setSearch(next);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => void load(next, 1), SEARCH_DEBOUNCE_MS);
  }

  function handlePageChange(page: number) {
    void load(search, page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <h2
        ref={listTopRef}
        className="scroll-mt-28 text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark"
      >
        {t.guide.regulations.title}
      </h2>

      <SearchFilterBar className="mt-6" search={search} onSearchChange={handleSearchChange} />

      {error && (
        <p className="mt-6 text-sm text-red-500">
          {t.guide.regulations.error}
        </p>
      )}

      {!error && !loading && data.items.length === 0 && (
        <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          {search.trim() ? t.guide.regulations.noResults : t.guide.regulations.empty}
        </p>
      )}

      <div className={clsx("mt-6 grid grid-cols-1 gap-8 transition-opacity", loading && "opacity-50")}>
        {data.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: EASE_OUT,
              delay: (index % REGULATIONS_PER_PAGE) * 0.08,
            }}
            className="group flex max-w-[600px] flex-col justify-between gap-4 rounded-[20px] border border-koleksi-navy-dark/10 p-6 transition hover:border-muted-steel"
          >
            <p className="text-[20px] font-bold leading-6 text-koleksi-navy-dark dark:text-ink-dark">
              {item.title}
            </p>
            <div className="flex justify-end">
              {/* Bukan Link i18n: /api tidak memakai prefix bahasa */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-muted-steel px-5 py-2.5 text-base font-bold leading-6 text-white"
              >
                {t.common.view}
                <span className="sr-only"> {item.title} ({t.common.opensInNewTab})</span>
              </a>
            </div>
          </motion.div>
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
    </div>
  );
}
