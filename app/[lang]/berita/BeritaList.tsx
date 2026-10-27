"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/i18n/Link";
import { motion } from "framer-motion";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import NewsTag from "@/components/ui/NewsTag";
import clsx from "@/lib/clsx";
import { useI18n } from "@/components/i18n/I18nProvider";
import { NEWS_CATEGORIES, type NewsCategoryValue } from "@/lib/newsCategories";
import type { NewsListItem, NewsPage } from "@/types";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BERITA_PER_PAGE = 5;
const SEARCH_DEBOUNCE_MS = 400;

interface Filters {
  search: string;
  sort: "latest" | "oldest";
  category: NewsCategoryValue | null;
}

/**
 * List berita: pencarian, urutan, filter kategori, paginasi bernomor (5 per halaman).
 * Halaman pertama dirender server sesuai ?tags= (initialCategory); perubahan berikutnya
 * diambil lewat /api/news. Komponen di-remount (key) saat ?tags= berubah dari menu.
 */
export default function BeritaList({
  initialPage,
  initialCategory,
}: {
  initialPage: NewsPage;
  initialCategory: NewsCategoryValue | null;
}) {
  const { t } = useI18n();
  const SORT_OPTIONS = [
    { label: t.list.sortLatest, value: "latest" },
    { label: t.list.sortOldest, value: "oldest" },
  ] as const;
  const categoryOptions = NEWS_CATEGORIES.map((c) => ({ value: c.value, label: t.nav[c.labelKey] }));
  const [filters, setFilters] = useState<Filters>({
    search: "",
    sort: "latest",
    category: initialCategory,
  });
  const [data, setData] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const listTopRef = useRef<HTMLHeadingElement | null>(null);

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
    if (next.search.trim()) params.set("search", next.search.trim());
    if (next.category) params.set("category", next.category);

    try {
      const res = await fetch(`/api/news?${params}`, { signal: controller.signal });
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
    setFilters(next);
    void load(next, 1);
  }

  /**
   * Kategori dari dropdown → ?tags= di URL ikut diganti (tanpa navigasi ke server), supaya menu aktif di sidebar
   * ikut berubah dan link bisa dibagikan. Next.js menyinkronkan history.replaceState dengan useSearchParams.
   */
  function syncTagsParam(category: NewsCategoryValue | null) {
    const url = new URL(window.location.href);
    const slug = NEWS_CATEGORIES.find((c) => c.value === category)?.slug;
    if (slug) url.searchParams.set("tags", slug);
    else url.searchParams.delete("tags");
    // state harus null: Next.js melewatkan sinkronisasi kalau state berisi data internalnya (__NA)
    window.history.replaceState(null, "", url);
  }

  function handleSearchChange(search: string) {
    const next = { ...filters, search };
    setFilters(next);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => void load(next, 1), SEARCH_DEBOUNCE_MS);
  }

  function handlePageChange(page: number) {
    void load(filters, page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const sortLabel = SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? t.list.sortLatest;
  const categoryLabel = categoryOptions.find((c) => c.value === filters.category)?.label ?? null;

  return (
    <div>
      <h2
        ref={listTopRef}
        className="scroll-mt-28 text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark"
      >
        {t.guide.news.title}
      </h2>

      <SearchFilterBar
        className="mt-6"
        search={filters.search}
        onSearchChange={handleSearchChange}
      >
        <FilterDropdown
          label={t.list.sortLatest}
          options={SORT_OPTIONS.map((o) => o.label)}
          value={sortLabel}
          onChange={(label) =>
            applyFilters({
              ...filters,
              sort: SORT_OPTIONS.find((o) => o.label === label)?.value ?? "latest",
            })
          }
        />
        <FilterDropdown
          label={t.list.categoryTag}
          options={[t.common.all, ...categoryOptions.map((c) => c.label)]}
          value={categoryLabel}
          onChange={(label) => {
            const category = categoryOptions.find((c) => c.label === label)?.value ?? null;
            applyFilters({ ...filters, category });
            syncTagsParam(category);
          }}
        />
      </SearchFilterBar>

      {error && (
        <p className="mt-6 text-sm text-red-500">
          {t.guide.news.error}
        </p>
      )}

      {!error && !loading && data.items.length === 0 && (
        <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          {t.guide.news.empty}
        </p>
      )}

      <div
        className={clsx(
          "mt-6 divide-y divide-border-light transition-opacity dark:divide-border-dark",
          loading && "opacity-50",
        )}
      >
        {data.items.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: EASE_OUT,
              delay: (index % BERITA_PER_PAGE) * 0.08,
            }}
            className="py-5 first:pt-0"
          >
            <NewsLink item={item} newTabLabel={t.common.opensInNewTab}>
              <div className="relative aspect-270/183 w-[130px] shrink-0 overflow-hidden rounded-xl bg-koleksi-navy-dark/10 sm:w-[200px] lg:w-[270px]">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="270px"
                  />
                )}
              </div>
              <div className="min-w-0">
                <NewsTag tag={item.tag} badge={item.badge} />
                <h3 className="mt-2 text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                  {item.title}
                </h3>
                {item.author && (
                  <p className="mt-2 text-[14px] leading-[14px] text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                    {t.common.by}: {item.author}
                  </p>
                )}
                {item.summary && (
                  <p className="mt-3 line-clamp-3 text-[14px] leading-[21px] text-koleksi-navy-dark/80 dark:text-ink-dark/70">
                    {item.summary}
                  </p>
                )}
              </div>
            </NewsLink>
          </motion.article>
        ))}
      </div>

      {data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
          className="mt-10"
        />
      )}
    </div>
  );
}

/** Kartu berita: Berita EV dibuka di tab baru ke berita aslinya, lainnya ke halaman detail. */
function NewsLink({
  item,
  newTabLabel,
  children,
}: {
  item: NewsListItem;
  newTabLabel: string;
  children: React.ReactNode;
}) {
  const className = "group flex gap-4";

  return item.externalUrl ? (
    <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only">{newTabLabel}</span>
    </a>
  ) : (
    <Link href={`/berita/${item.slug}`} className={className}>
      {children}
    </Link>
  );
}
