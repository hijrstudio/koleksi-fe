"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import CatalogToolbar from "@/components/ui/CatalogToolbar";
import Pagination from "@/components/ui/Pagination";
import { useI18n } from "@/components/i18n/I18nProvider";
import ProdukCard from "./ProdukCard";
import {
  PRODUK_PER_PAGE,
  SORT_OPTIONS,
  TAB_OPTIONS,
  produkList,
  type ProdukSort,
  type ProdukTab,
} from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function KatalogProduk() {
  const { t } = useI18n();
  const [tab, setTab] = useState<ProdukTab>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ProdukSort>("latest");

  const sortLabel: Record<ProdukSort, string> = {
    latest: t.list.sortLatest,
    oldest: t.list.sortOldest,
    popular: t.list.sortPopular,
  };
  const [page, setPage] = useState(1);

  const query = search.trim().toLowerCase();
  const filteredProduk = produkList
    .filter((item) => {
      const matchesTab = tab === "all" || item.category === tab;
      const matchesQuery = !query || item.name.toLowerCase().includes(query);
      return matchesTab && matchesQuery;
    })
    .sort((a, b) => {
      if (sort === "popular") return b.popularity - a.popularity;
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === "latest" ? -diff : diff;
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
      <SectionHeader title={tab === "all" ? t.products.allProducts : t.products.tabs[tab]} />

      <CatalogToolbar
        tabs={TAB_OPTIONS}
        activeTab={tab}
        onTabChange={setTab}
        tabLabel={(value) => t.products.tabs[value]}
        search={search}
        onSearchChange={setSearch}
        dropdown={{
          label: t.list.sort,
          options: SORT_OPTIONS.map((value) => sortLabel[value]),
          value: sortLabel[sort],
          onChange: (label) => setSort(SORT_OPTIONS.find((value) => sortLabel[value] === label) ?? "latest"),
          showActiveDot: false,
        }}
      />

      {pageItems.length === 0 && (
        <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          {t.products.empty}
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
