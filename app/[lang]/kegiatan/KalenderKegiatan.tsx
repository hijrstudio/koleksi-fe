"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/i18n/Link";
import { motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import Pagination from "@/components/ui/Pagination";
import CatalogToolbar from "@/components/ui/CatalogToolbar";
import clsx from "@/lib/clsx";
import { format, useI18n } from "@/components/i18n/I18nProvider";
import type { EventCategory, EventPage, EventPhase } from "@/types";
import { KEGIATAN_PER_PAGE, PHASE_TABS } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SEARCH_DEBOUNCE_MS = 400;

interface Filters {
  /** Fase di backend (dihitung dari start_date & end_date); null = semua kegiatan (belum ada tab yang diklik). */
  status: EventPhase | null;
  search: string;
  category: EventCategory | null;
}

/**
 * Kalender kegiatan: tab fase, pencarian, filter kategori, paginasi bernomor (8 per halaman).
 * Halaman pertama (semua kegiatan) dirender server; perubahan berikutnya diambil lewat /api/events.
 * Klik tab yang sedang aktif = kembali ke semua kegiatan.
 */
export default function KalenderKegiatan({
  initialPage,
  categories,
}: {
  initialPage: EventPage;
  categories: EventCategory[];
}) {
  const { t } = useI18n();
  const [filters, setFilters] = useState<Filters>({
    status: null,
    search: "",
    category: null,
  });
  const [data, setData] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

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

    const params = new URLSearchParams({ page: String(page) });
    if (next.status) params.set("phase", next.status);
    if (next.search.trim()) params.set("search", next.search.trim());
    if (next.category) params.set("category", String(next.category.id));

    try {
      const res = await fetch(`/api/events?${params}`, { signal: controller.signal });
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
    searchTimer.current = setTimeout(() => void load(next, 1), SEARCH_DEBOUNCE_MS);
  }

  return (
    <SectionContainer withGuides withOrnament topDivider variant="white">
      <SectionHeader title={t.events.calendar} />

      <CatalogToolbar
        tabs={PHASE_TABS}
        tabLabel={(phase) => t.events.phases[phase]}
        activeTab={filters.status}
        onTabChange={(status) =>
          applyFilters({
            ...filters,
            status: status === filters.status ? null : status,
          })
        }
        search={filters.search}
        onSearchChange={handleSearchChange}
        dropdown={{
          options: [t.common.all, ...categories.map((c) => c.name)],
          value: filters.category?.name ?? null,
          onChange: (name) =>
            applyFilters({
              ...filters,
              category: categories.find((c) => c.name === name) ?? null,
            }),
        }}
      />

      {error && (
        <p className="mt-6 text-sm text-red-500">
          {t.events.error}
        </p>
      )}

      {!error && !loading && data.items.length === 0 && (
        <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          {filters.status
            ? format(t.events.emptyPhase, { phase: t.events.phases[filters.status] })
            : t.events.empty}
        </p>
      )}

      <div
        className={clsx(
          "mt-10 grid grid-cols-1 gap-x-8 gap-y-10 transition-opacity sm:grid-cols-2 lg:grid-cols-4",
          loading && "opacity-50",
        )}
      >
        {data.items.map((item, index) => (
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
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-koleksi-navy-dark/10">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                )}
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

      {data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={(page) => void load(filters, page)}
          className="mt-16"
        />
      )}
    </SectionContainer>
  );
}
