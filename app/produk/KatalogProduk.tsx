"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import CatalogToolbar from "@/components/ui/CatalogToolbar";
import Pagination from "@/components/ui/Pagination";
import ProdukCard from "./ProdukCard";
import {
  PRODUK_PER_PAGE,
  SORT_OPTIONS,
  TAB_ALL,
  TAB_OPTIONS,
  produkList,
  type ProdukSort,
  type ProdukTab,
} from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function KatalogProduk() {
  const [tab, setTab] = useState<ProdukTab>(TAB_ALL);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ProdukSort>("Terbaru");
  const [page, setPage] = useState(1);

  const query = search.trim().toLowerCase();
  const filteredProduk = produkList
    .filter((item) => {
      const matchesTab = tab === TAB_ALL || item.category === tab;
      const matchesQuery = !query || item.name.toLowerCase().includes(query);
      return matchesTab && matchesQuery;
    })
    .sort((a, b) => {
      if (sort === "Terpopuler") return b.popularity - a.popularity;
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === "Terbaru" ? -diff : diff;
    });

  // Reset ke halaman 1 saat tab/pencarian/sort berubah (adjust state saat
  // render, sama seperti page lain, tanpa effect).
  const filterKey = `${tab}|${search}|${sort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProduk.length / PRODUK_PER_PAGE),
  );
  const pageItems = filteredProduk.slice(
    (page - 1) * PRODUK_PER_PAGE,
    page * PRODUK_PER_PAGE,
  );

  return (
    <SectionContainer withGuides withOrnament variant="white">
      <SectionHeader title={tab === TAB_ALL ? "Semua Produk" : tab} />

      <CatalogToolbar
        tabs={TAB_OPTIONS}
        activeTab={tab}
        onTabChange={setTab}
        search={search}
        onSearchChange={setSearch}
        dropdown={{
          label: "Sort",
          options: [...SORT_OPTIONS],
          value: sort,
          onChange: (v) => setSort(v as ProdukSort),
          showActiveDot: false,
        }}
      />

      {pageItems.length === 0 && (
        <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          Tidak ada produk yang cocok dengan pencarian ini.
        </p>
      )}

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
        {pageItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: EASE_OUT,
              delay: (index % PRODUK_PER_PAGE) * 0.06,
            }}
          >
            <ProdukCard produk={item} />
          </motion.div>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-20"
      />
    </SectionContainer>
  );
}
