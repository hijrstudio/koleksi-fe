"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import clsx from "@/lib/clsx";
import {
  GARAGE_PER_PAGE,
  SORT_AZ,
  SORT_OPTIONS,
  SORT_ZA,
  garageBrands,
  garageVehicles,
} from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const COLUMNS = [
  { label: "Merek", width: "w-[17%]" },
  { label: "Jenis / Tipe", width: "w-[22%]" },
  { label: "Baterai (kWh)", width: "w-[16%]" },
  { label: "AC (maks.)", width: "w-[14%]" },
  { label: "DC (maks.)", width: "w-[14%]" },
  { label: "Jangkauan", width: "w-[17%]" },
];

export default function EvGarage() {
  const [brand, setBrand] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(SORT_AZ);
  const [page, setPage] = useState(1);

  const query = search.trim().toLowerCase();
  const filteredVehicles = garageVehicles
    .filter((v) => {
      const matchesBrand = !brand || v.brand === brand;
      const matchesQuery =
        !query ||
        v.brand.toLowerCase().includes(query) ||
        v.type.toLowerCase().includes(query);
      return matchesBrand && matchesQuery;
    })
    .sort((a, b) => {
      const cmp =
        a.brand.localeCompare(b.brand) || a.type.localeCompare(b.type);
      return sort === SORT_ZA ? -cmp : cmp;
    });

  // Reset ke halaman 1 saat brand/pencarian/urutan berubah (adjust state
  // saat render, sama seperti page lain, tanpa effect).
  const filterKey = `${brand}|${search}|${sort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredVehicles.length / GARAGE_PER_PAGE),
  );
  const pageItems = filteredVehicles.slice(
    (page - 1) * GARAGE_PER_PAGE,
    page * GARAGE_PER_PAGE,
  );

  return (
    <SectionContainer withGuides withOrnament variant="white">
      <h1 className="font-display text-2xl leading-8 font-bold tracking-[-0.03em] text-koleksi-navy md:text-[32px] md:leading-10 dark:text-ink-dark">
        EV Garage
      </h1>
      <p className="mt-5 text-base leading-6 font-normal text-koleksi-navy-dark/80 dark:text-ink-dark/60">
        Cari jenis dan spesifikasi pengisian daya kendaraan listrik Anda.
      </p>

      {/* Logo brand: 6 kolom (kartu 140x60) di desktop, di-center. Klik untuk
          memfilter tabel per merek; klik lagi untuk melepas. */}
      <div className="mt-14 grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6 xl:grid-cols-[repeat(6,140px)] xl:justify-center xl:gap-5">
        {garageBrands.map((b, index) => {
          const selected = brand === b.name;
          return (
            <motion.button
              key={b.name}
              type="button"
              aria-pressed={selected}
              aria-label={`Filter merek ${b.name}`}
              onClick={() => setBrand(selected ? null : b.name)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: EASE_OUT,
                delay: index * 0.03,
              }}
              className={clsx(
                "relative aspect-7/3 w-full cursor-pointer border bg-white transition",
                selected
                  ? "border-koleksi-navy-deep"
                  : "border-border-light hover:border-koleksi-navy-dark/30",
              )}
            >
              {/* Area logo maks. 104x32: wordmark lebar tidak menabrak tepi,
                  logo persegi (BMW, Volvo) tetap proporsional. */}
              <span className="absolute inset-x-4.5 inset-y-3.5">
                <Image
                  src={b.logo}
                  alt={b.name}
                  fill
                  className="object-contain"
                  sizes="140px"
                />
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Pencarian + urutan A-Z / Z-A, di-center */}
      <div className="mx-auto mt-20 max-w-195">
        <SearchFilterBar
          iconPosition="right"
          search={search}
          onSearchChange={setSearch}
        >
          <FilterDropdown
            label={SORT_AZ}
            options={SORT_OPTIONS}
            value={sort}
            onChange={setSort}
          />
        </SearchFilterBar>
      </div>

      {/* Tabel spesifikasi -- geser horizontal di layar kecil */}
      <div className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.label} className={c.width} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark">
              {COLUMNS.map((c) => (
                <th
                  key={c.label}
                  scope="col"
                  className="py-4 pr-4 text-base leading-6 font-bold text-koleksi-navy-dark/80 dark:text-ink-dark/70"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((v, index) => (
              <motion.tr
                key={v.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: EASE_OUT,
                  delay: (index % GARAGE_PER_PAGE) * 0.02,
                }}
                className="border-b border-border-light text-sm leading-[21px] dark:border-border-dark"
              >
                <th
                  scope="row"
                  className="py-4 pr-4 font-bold text-koleksi-navy-dark/80 dark:text-ink-dark/80"
                >
                  {v.brand}
                </th>
                <td className="py-4 pr-4 text-koleksi-navy-dark/70 dark:text-ink-dark/60">
                  {v.type}
                </td>
                <td className="py-4 pr-4 text-koleksi-navy-dark/70 dark:text-ink-dark/60">
                  {v.batteryKwh.toFixed(1)} kWh
                </td>
                <td className="py-4 pr-4 text-koleksi-navy-dark/70 dark:text-ink-dark/60">
                  {v.acKw.toFixed(1)} kW
                </td>
                <td className="py-4 pr-4 text-koleksi-navy-dark/70 dark:text-ink-dark/60">
                  {v.dcKw === null ? "–" : `${v.dcKw.toFixed(1)} kW`}
                </td>
                <td className="py-4 pr-4 text-koleksi-navy-dark/70 dark:text-ink-dark/60">
                  {v.rangeKm} km
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageItems.length === 0 && (
        <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          Tidak ada kendaraan yang cocok dengan pencarian/filter ini.
        </p>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-20"
      />
    </SectionContainer>
  );
}
