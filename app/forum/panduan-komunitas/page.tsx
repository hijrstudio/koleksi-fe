"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { KATEGORI_ALL, KATEGORI_OPTIONS, panduanList } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function PanduanKomunitasPage() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState<string | null>(null);

  const query = search.trim().toLowerCase();
  const filteredPanduan = panduanList.filter((item) => {
    const matchesQuery = !query || item.title.toLowerCase().includes(query);
    const matchesKategori = !kategori || item.category === kategori;
    return matchesQuery && matchesKategori;
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <div>
        <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
          Panduan Komunitas
        </h2>

        <SearchFilterBar
          className="mt-9"
          iconPosition="right"
          search={search}
          onSearchChange={setSearch}
        >
          <FilterDropdown
            label="Kategori / Tag"
            options={KATEGORI_OPTIONS}
            value={kategori}
            onChange={(v) => setKategori(v === KATEGORI_ALL ? null : v)}
          />
        </SearchFilterBar>

        {filteredPanduan.length === 0 && (
          <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            Tidak ada panduan yang cocok dengan pencarian/filter ini.
          </p>
        )}

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {filteredPanduan.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: EASE_OUT,
                delay: index * 0.08,
              }}
            >
              {/* Kartu persegi bg muted-steel, radius 20px (sama dengan kartu
                  promo di widget kanan artikel); "Baca" di pojok kanan bawah. */}
              <Link
                href={`/forum/panduan-komunitas/${item.slug}`}
                className="group flex aspect-square flex-col rounded-[20px] bg-muted-steel p-4 sm:p-5"
              >
                <h3 className="line-clamp-3 text-[20px] leading-6 font-bold text-white">
                  {item.title}
                </h3>
                <span className="mt-auto inline-flex w-fit items-center self-end rounded-full bg-koleksi-navy-deep px-5 py-2.5 text-base leading-6 font-bold text-white transition group-hover:bg-koleksi-navy">
                  Baca
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
