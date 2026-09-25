"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import Pagination from "@/components/ui/Pagination";
import CatalogToolbar from "@/components/ui/CatalogToolbar";
import {
  CATEGORY_ALL,
  CATEGORY_OPTIONS,
  KEGIATAN_PER_PAGE,
  STATUS_OPTIONS,
  kegiatanList,
  type KegiatanStatus,
} from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function KalenderKegiatan() {
  const [status, setStatus] = useState<KegiatanStatus>("On Going");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const query = search.trim().toLowerCase();
  const filteredItems = kegiatanList.filter((item) => {
    const matchesStatus = item.status === status;
    const matchesQuery = !query || item.title.toLowerCase().includes(query);
    const matchesCategory = !category || item.category === category;
    return matchesStatus && matchesQuery && matchesCategory;
  });

  // Reset ke halaman 1 saat tab/pencarian/filter berubah (adjust state
  // saat render, sama seperti page lain, tanpa effect).
  const filterKey = `${status}|${search}|${category}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / KEGIATAN_PER_PAGE),
  );
  const pageItems = filteredItems.slice(
    (page - 1) * KEGIATAN_PER_PAGE,
    page * KEGIATAN_PER_PAGE,
  );

  return (
    <SectionContainer withGuides withOrnament topDivider variant="white">
      <SectionHeader title="Kalender Kegiatan" />

      <CatalogToolbar
        tabs={STATUS_OPTIONS}
        activeTab={status}
        onTabChange={setStatus}
        search={search}
        onSearchChange={setSearch}
        dropdown={{
          options: CATEGORY_OPTIONS,
          value: category,
          onChange: (v) => setCategory(v === CATEGORY_ALL ? null : v),
        }}
      />

      {pageItems.length === 0 && (
        <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          Tidak ada kegiatan {status} yang cocok dengan pencarian/filter ini.
        </p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {pageItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: EASE_OUT,
              delay: (index % KEGIATAN_PER_PAGE) * 0.06,
            }}
          >
            <Link href={`/kegiatan/${item.slug}`} className="group block">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <h3 className="mt-4 line-clamp-2 text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                {item.title}
              </h3>
              <p className="mt-2.5 flex items-center gap-1.5 text-sm font-normal leading-3.5 text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                <Image
                  src="/images/icon-kegiatan.svg"
                  alt=""
                  width={16}
                  height={16}
                />
                {item.date}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-16"
      />
    </SectionContainer>
  );
}
