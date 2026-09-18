"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { DOKUMEN_REGULASI_PER_PAGE, dokumenRegulasiItems } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function DokumenRegulasiPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const query = search.trim().toLowerCase();
  const filteredItems = dokumenRegulasiItems.filter(
    (item) => !query || item.title.toLowerCase().includes(query),
  );

  const filterKey = search;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / DOKUMEN_REGULASI_PER_PAGE),
  );
  const pageItems = filteredItems.slice(
    (page - 1) * DOKUMEN_REGULASI_PER_PAGE,
    page * DOKUMEN_REGULASI_PER_PAGE,
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <div>
        <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
          Dokumen Regulasi
        </h2>

        <div className="mt-6 relative min-w-[160px] max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-koleksi-navy-dark/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari"
            className="w-full rounded-full border border-border-light bg-transparent py-2.5 pl-10 pr-4 text-sm text-koleksi-navy-dark placeholder:text-koleksi-navy-dark/40 transition focus:border-koleksi-navy-deep focus:outline-none dark:border-border-dark dark:text-ink-dark"
          />
        </div>

        {pageItems.length === 0 && (
          <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            Tidak ada dokumen yang cocok dengan pencarian ini.
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-8">
          {pageItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: EASE_OUT,
                delay: (index % DOKUMEN_REGULASI_PER_PAGE) * 0.08,
              }}
              className="group flex max-w-[600px] flex-col justify-between gap-4 rounded-[20px] border border-koleksi-navy-dark/10 p-6 transition hover:border-muted-steel"
            >
              <p className="text-[20px] font-bold leading-6 text-koleksi-navy-dark dark:text-ink-dark">
                {item.title}
              </p>
              <div className="flex justify-end">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-muted-steel px-5 py-2.5 text-base font-bold leading-6 text-white"
                >
                  Lihat
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-18"
        />
      </div>

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
