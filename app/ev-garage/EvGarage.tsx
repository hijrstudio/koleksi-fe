"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import clsx from "@/lib/clsx";
import type { GarageBrand, GaragePage, GarageSort } from "@/types";
import { GARAGE_PER_PAGE, SORT_OPTIONS } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SEARCH_DEBOUNCE_MS = 400;

const COLUMNS = [
  { label: "Merek", width: "w-[17%]" },
  { label: "Jenis / Tipe", width: "w-[22%]" },
  { label: "Baterai (kWh)", width: "w-[16%]" },
  { label: "AC (maks.)", width: "w-[14%]" },
  { label: "DC (maks.)", width: "w-[14%]" },
  { label: "Jangkauan", width: "w-[17%]" },
];

interface Filters {
  /** Slug merek terpilih; null = semua merek. */
  brand: string | null;
  search: string;
  sort: GarageSort;
}

/**
 * EV Garage: grid logo merek (filter), pencarian, urutan A-Z / Z-A, dan tabel
 * spesifikasi 18 per halaman. Halaman pertama dirender server; perubahan
 * berikutnya diambil lewat /api/ev-garage.
 */
export default function EvGarage({
  initialPage,
  initialError,
  brands,
}: {
  initialPage: GaragePage;
  initialError: boolean;
  brands: GarageBrand[];
}) {
  const [filters, setFilters] = useState<Filters>({
    brand: null,
    search: "",
    sort: "asc",
  });
  const [data, setData] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const tableTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      abortRef.current?.abort();
    },
    [],
  );

  async function load(next: Filters, page: number) {
    // Batalkan request sebelumnya supaya hasil lama tidak menimpa hasil terbaru
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(false);

    const params = new URLSearchParams({ sort: next.sort, page: String(page) });
    if (next.brand) params.set("brand", next.brand);
    if (next.search.trim()) params.set("search", next.search.trim());

    try {
      const res = await fetch(`/api/ev-garage?${params}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(true);
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  function applyFilters(next: Filters) {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setFilters(next);
    void load(next, 1);
  }

  function handleSearchChange(search: string) {
    const next = { ...filters, search };
    setFilters(next);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(
      () => void load(next, 1),
      SEARCH_DEBOUNCE_MS,
    );
  }

  function handlePageChange(page: number) {
    void load(filters, page);
    tableTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? "A–Z";

  return (
    <SectionContainer withGuides withOrnament variant="white">
      <h1 className="font-display text-2xl leading-8 font-bold tracking-[-0.03em] text-koleksi-navy md:text-[32px] md:leading-10 dark:text-ink-dark">
        EV Garage
      </h1>
      <p className="mt-5 text-base leading-6 font-normal text-koleksi-navy-dark/80 dark:text-ink-dark/60">
        Cari jenis dan spesifikasi pengisian daya kendaraan listrik Anda.
      </p>

      {/* Logo merek: 6 kolom (kartu 140x60) di desktop, di-center. Klik untuk
          memfilter tabel per merek; klik lagi untuk melepas. */}
      {brands.length > 0 && (
        <div className="mt-14 grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6 xl:grid-cols-[repeat(6,140px)] xl:justify-center xl:gap-5">
          {brands.map((b, index) => {
            const selected = filters.brand === b.slug;
            return (
              <motion.button
                key={b.slug}
                type="button"
                aria-pressed={selected}
                aria-label={`Filter merek ${b.name}`}
                onClick={() =>
                  applyFilters({ ...filters, brand: selected ? null : b.slug })
                }
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
                <span className="absolute inset-x-4.5 inset-y-3.5 flex items-center justify-center">
                  {b.logo ? (
                    <Image
                      src={b.logo}
                      alt={b.name}
                      fill
                      className="object-contain"
                      sizes="140px"
                    />
                  ) : (
                    <span className="font-display truncate text-sm leading-none font-bold tracking-[-0.02em] text-koleksi-navy uppercase sm:text-base">
                      {b.name}
                    </span>
                  )}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Pencarian + urutan A-Z / Z-A, di-center */}
      <div className="mx-auto mt-20 max-w-195">
        <SearchFilterBar
          iconPosition="right"
          search={filters.search}
          onSearchChange={handleSearchChange}
        >
          <FilterDropdown
            label="A–Z"
            options={SORT_OPTIONS.map((o) => o.label)}
            value={sortLabel}
            onChange={(label) =>
              applyFilters({
                ...filters,
                sort:
                  SORT_OPTIONS.find((o) => o.label === label)?.value ?? "asc",
              })
            }
          />
        </SearchFilterBar>
      </div>

      {/* Tabel spesifikasi -- geser horizontal di layar kecil */}
      <div
        ref={tableTopRef}
        aria-busy={loading}
        className={clsx(
          "mt-12 scroll-mt-28 overflow-x-auto transition-opacity duration-300",
          loading && "opacity-50",
        )}
      >
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
            {data.items.map((v, index) => (
              <motion.tr
                key={`${data.page}-${v.id}`}
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
                  className="py-4 pr-4 font-bold text-koleksi-navy-dark/80 uppercase dark:text-ink-dark/80"
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

      {error ? (
        <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          Gagal memuat data EV Garage. Silakan coba lagi.
        </p>
      ) : (
        !loading &&
        data.items.length === 0 && (
          <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            {filters.brand || filters.search.trim()
              ? "Tidak ada kendaraan yang cocok dengan pencarian/filter ini."
              : "Belum ada data kendaraan."}
          </p>
        )
      )}

      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
        className="mt-20"
      />
    </SectionContainer>
  );
}
