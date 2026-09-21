"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import RoleBadge from "@/components/ui/RoleBadge";
import clsx from "@/lib/clsx";
import {
  ANGGOTA_PER_PAGE,
  anggotaList,
  CITY_ALL,
  CITY_OPTIONS,
} from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function DirektoriAnggotaPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const query = search.trim().toLowerCase();
  const filteredAnggota = anggotaList.filter((item) => {
    const matchesQuery = !query || item.name.toLowerCase().includes(query);
    const matchesCity = !city || item.city === city;
    return matchesQuery && matchesCity;
  });

  // Reset ke halaman 1 saat filter berubah (adjust state saat render, sama
  // seperti page lain, tanpa effect).
  const filterKey = `${search}|${city}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAnggota.length / ANGGOTA_PER_PAGE),
  );
  const pageItems = filteredAnggota.slice(
    (page - 1) * ANGGOTA_PER_PAGE,
    page * ANGGOTA_PER_PAGE,
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <div>
        <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
          Direktori Anggota
        </h2>

        <SearchFilterBar
          className="mt-9"
          iconPosition="right"
          search={search}
          onSearchChange={setSearch}
        >
          <FilterDropdown
            label="Kota"
            options={CITY_OPTIONS}
            value={city}
            onChange={(v) => setCity(v === CITY_ALL ? null : v)}
          />
        </SearchFilterBar>

        {pageItems.length === 0 && (
          <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            Tidak ada anggota yang cocok dengan pencarian/filter ini.
          </p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((item, index) => {
            // Kolom paling kanan: kotak info dibuka ke kiri supaya tidak
            // keluar dari konten. Jumlah kolom: 2 di sm, 3 di lg+.
            const flipAtSm = index % 2 === 1;
            const flipAtLg = index % 3 === 2;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: EASE_OUT,
                  delay: (index % ANGGOTA_PER_PAGE) * 0.05,
                }}
                className="group relative hover:z-30 focus-within:z-30"
              >
                {/* Card: bg rgba(10,22,40,0.0333) + radius 10px; hover =
                    border navy + latar putih. Fokusable supaya kotak info
                    juga muncul saat di-tap / lewat keyboard. */}
                <div
                  tabIndex={0}
                  aria-describedby={`info-${item.id}`}
                  className="flex cursor-default items-center gap-3 rounded-[10px] border border-transparent bg-koleksi-navy-dark/[0.0333] p-5 transition outline-none hover:border-koleksi-navy-deep hover:bg-surface-light focus:border-koleksi-navy-deep focus:bg-surface-light dark:bg-white/5 dark:hover:border-ink-dark dark:hover:bg-surface-dark dark:focus:border-ink-dark dark:focus:bg-surface-dark"
                >
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <RoleBadge role={item.role} />
                    <p className="mt-1 truncate text-sm font-bold text-koleksi-navy-dark dark:text-ink-dark">
                      {item.name}
                    </p>
                  </div>
                </div>

                {/* Kotak info saat hover: shadow 0 4px 32px rgba(0,0,0,0.1) */}
                <div
                  id={`info-${item.id}`}
                  role="tooltip"
                  className={clsx(
                    "pointer-events-none invisible absolute z-20 w-full scale-[0.98] rounded-[10px] bg-surface-light p-4 opacity-0 shadow-[0_4px_32px_rgba(0,0,0,0.1)] transition-[opacity,visibility,scale] duration-200 ease-out group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:visible group-hover:scale-100 group-hover:opacity-100 dark:bg-surface-dark dark:shadow-[0_4px_32px_rgba(0,0,0,0.4)]",
                    // < sm: di bawah card
                    "top-[calc(100%+8px)] left-0",
                    // sm+: di samping card, sejajar bagian atas
                    "sm:top-0",
                    flipAtSm
                      ? "sm:right-[calc(100%+10px)] sm:left-auto"
                      : "sm:left-[calc(100%+10px)]",
                    flipAtLg
                      ? "lg:right-[calc(100%+10px)] lg:left-auto"
                      : "lg:left-[calc(100%+10px)] lg:right-auto",
                  )}
                >
                  <span className="inline-block rounded-full bg-koleksi-navy-dark/[0.0667] px-2 py-0.5 text-[10px] leading-3 font-bold text-muted-steel dark:bg-white/10">
                    Level {item.level}
                  </span>
                  <p className="mt-2 text-sm font-bold text-koleksi-navy-dark dark:text-ink-dark">
                    {item.name}
                  </p>
                  <dl className="mt-1 grid grid-cols-[2.5rem_0.75rem_1fr] text-xs leading-5 text-koleksi-navy-dark dark:text-ink-dark">
                    <dt className="text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                      EV
                    </dt>
                    <dd aria-hidden="true">:</dd>
                    <dd>{item.ev}</dd>
                    <dt className="text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                      Lokasi
                    </dt>
                    <dd aria-hidden="true">:</dd>
                    <dd>{item.city}</dd>
                  </dl>
                </div>
              </motion.div>
            );
          })}
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
