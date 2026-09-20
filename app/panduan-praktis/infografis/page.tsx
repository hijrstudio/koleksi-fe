"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import { INFOGRAFIS_PER_PAGE, InfografisItem, infografisItems } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CATEGORY_OPTIONS = ["Semua", "Kendaraan", "Teknologi"];

export default function InfografisPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [activeItem, setActiveItem] = useState<InfografisItem | null>(null);

  const query = search.trim().toLowerCase();
  const filteredItems = infografisItems.filter((item) => {
    const matchesQuery = !query || item.title.toLowerCase().includes(query);
    const matchesCategory =
      !category || category === "Semua" || item.category === category;
    return matchesQuery && matchesCategory;
  });

  const filterKey = `${search}|${category}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / INFOGRAFIS_PER_PAGE),
  );
  const pageItems = filteredItems.slice(
    (page - 1) * INFOGRAFIS_PER_PAGE,
    page * INFOGRAFIS_PER_PAGE,
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <div>
        <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
          Infografis
        </h2>

        <SearchFilterBar
          className="mt-6"
          search={search}
          onSearchChange={setSearch}
        >
          <FilterDropdown
            label="Kategori/Tag"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={setCategory}
          />
        </SearchFilterBar>

        {pageItems.length === 0 && (
          <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            Tidak ada infografis yang cocok dengan pencarian/filter ini.
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActiveItem(item)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: EASE_OUT,
                delay: (index % INFOGRAFIS_PER_PAGE) * 0.08,
              }}
              className="group text-left cursor-pointer"
            >
              <div className="relative aspect-236/300 w-full overflow-hidden rounded-[10px] border border-border-light dark:border-border-dark">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <span className="mt-5 inline-flex w-fit items-center rounded-full bg-badge-liputan px-2.5 py-1 text-xs font-bold text-koleksi-navy-dark">
                {item.category}
              </span>
              <h3 className="mt-3 text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                {item.title}
              </h3>
            </motion.button>
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

      <AnimatePresence>
        {activeItem && (
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
                aria-label="Tutup"
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
