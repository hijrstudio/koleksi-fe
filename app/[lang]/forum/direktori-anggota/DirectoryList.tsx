"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import RoleBadge from "@/components/ui/RoleBadge";
import clsx from "@/lib/clsx";
import { useI18n } from "@/components/i18n/I18nProvider";
import { expiredPath } from "@/lib/auth/validation";
import type { DirectoryCity, DirectoryMember, NumberedPage } from "@/types";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SEARCH_DELAY_MS = 350;
const PATH = "/forum/direktori-anggota";

/**
 * Direktori anggota. Halaman pertama dari server; cari (nama / No. lambung), filter kota & pindah halaman lewat
 * /api/forum/members. Semua anggota berlabel "Member"; kotak info hover: No. lambung, merek EV, kota.
 */
export default function DirectoryList({
  initialPage,
  cities,
}: {
  initialPage: NumberedPage<DirectoryMember>;
  cities: DirectoryCity[];
}) {
  const { locale, t } = useI18n();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState<DirectoryCity | null>(null);
  const [data, setData] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const firstRender = useRef(true);
  const listTop = useRef<HTMLDivElement>(null);

  async function load(page: number) {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ page: String(page) });
    if (search.trim()) params.set("search", search.trim());
    if (city) params.set("city", city.code);

    try {
      const res = await fetch(`/api/forum/members?${params}`, { cache: "no-store" });
      if (res.status === 401) return window.location.assign(expiredPath(PATH, locale));
      if (!res.ok) throw new Error(String(res.status));
      const next = (await res.json()) as NumberedPage<DirectoryMember>;
      if (id === requestId.current) setData(next);
    } catch {
      if (id === requestId.current) setError(t.forum.loadError);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }

  // Cari / kota berubah → halaman 1 (pencarian ditunda sedikit supaya tidak request tiap ketukan)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => load(1), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, city]);

  function goTo(page: number) {
    load(page);
    listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <div ref={listTop} className="scroll-mt-28">
        <h2 className="flex items-center gap-2 text-xl font-bold text-koleksi-navy-dark dark:text-badge-liputan">
          {t.forum.directory}
          {loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
        </h2>

        <SearchFilterBar className="mt-9" iconPosition="right" search={search} onSearchChange={setSearch}>
          <FilterDropdown
            label={t.forum.city}
            options={[t.common.all, ...cities.map((c) => c.name)]}
            value={city?.name ?? null}
            onChange={(v) => setCity(cities.find((c) => c.name === v) ?? null)}
          />
        </SearchFilterBar>

        {error && <p role="alert" className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {data.items.length === 0 && !loading && (
          <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">{t.forum.noMembers}</p>
        )}

        <div aria-busy={loading} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item, index) => {
            // Kolom paling kanan: kotak info dibuka ke kiri supaya tidak keluar dari konten (2 kolom di sm, 3 di lg+)
            const flipAtSm = index % 2 === 1;
            const flipAtLg = index % 3 === 2;
            const infoId = `info-${item.no_lambung.replace(/\W/g, "")}`;

            return (
              <motion.div
                key={item.no_lambung}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: index * 0.05 }}
                className="group relative hover:z-30 focus-within:z-30"
              >
                {/* Fokusable supaya kotak info juga muncul saat di-tap / lewat keyboard */}
                <div
                  tabIndex={0}
                  aria-describedby={infoId}
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
                    <RoleBadge role="Member" />
                    <p className="mt-1 truncate text-sm font-bold text-koleksi-navy-dark dark:text-ink-dark">{item.name}</p>
                  </div>
                </div>

                <div
                  id={infoId}
                  role="tooltip"
                  className={clsx(
                    "pointer-events-none invisible absolute z-20 w-full scale-[0.98] rounded-[10px] bg-surface-light p-4 opacity-0 shadow-[0_4px_32px_rgba(0,0,0,0.1)] transition-[opacity,visibility,scale] duration-200 ease-out group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:visible group-hover:scale-100 group-hover:opacity-100 dark:bg-surface-dark dark:shadow-[0_4px_32px_rgba(0,0,0,0.4)]",
                    // < sm: di bawah card; sm+: di samping card, sejajar bagian atas
                    "top-[calc(100%+8px)] left-0 sm:top-0",
                    flipAtSm ? "sm:right-[calc(100%+10px)] sm:left-auto" : "sm:left-[calc(100%+10px)]",
                    flipAtLg ? "lg:right-[calc(100%+10px)] lg:left-auto" : "lg:left-[calc(100%+10px)] lg:right-auto",
                  )}
                >
                  <span className="inline-block rounded-full bg-koleksi-navy-dark/[0.0667] px-2 py-0.5 text-[10px] leading-3 font-bold text-muted-steel dark:bg-white/10">
                    {item.no_lambung}
                  </span>
                  <p className="mt-2 text-sm font-bold wrap-break-word text-koleksi-navy-dark dark:text-ink-dark">{item.name}</p>
                  <dl className="mt-1 grid grid-cols-[3.5rem_0.75rem_1fr] text-xs leading-5 text-koleksi-navy-dark dark:text-ink-dark">
                    <dt className="text-koleksi-navy-dark/50 dark:text-ink-dark/50">EV</dt>
                    <dd aria-hidden="true">:</dd>
                    <dd>{item.vehicle_brand ?? "—"}</dd>
                    <dt className="text-koleksi-navy-dark/50 dark:text-ink-dark/50">{t.forum.location}</dt>
                    <dd aria-hidden="true">:</dd>
                    <dd>{item.city ?? "—"}</dd>
                  </dl>
                </div>
              </motion.div>
            );
          })}
        </div>

        {data.lastPage > 1 && (
          <Pagination currentPage={data.page} totalPages={data.lastPage} onPageChange={goTo} className="mt-18" />
        )}
      </div>

      {/* Spacer selebar kolom widget kanan, supaya lebar kolom isi sama dengan halaman forum lain */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
