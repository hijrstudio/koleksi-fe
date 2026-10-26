"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/i18n/Link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import clsx from "@/lib/clsx";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { ArticleCategory, ArticlePage, ArticleSort } from "@/types";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PAGE_SIZE = 5;
const SEARCH_DEBOUNCE_MS = 400;


interface Filters {
  search: string;
  sort: ArticleSort;
  category: number | null;
}

/**
 * List artikel dengan pencarian, urutan, filter kategori, dan "Muat lebih banyak" (5 per halaman).
 * Halaman pertama dirender server (initialPage); perubahan berikutnya diambil lewat /api/articles.
 */
export default function ArticleList({
  initialPage,
  categories,
}: {
  initialPage: ArticlePage;
  categories: ArticleCategory[];
}) {
  const { t } = useI18n();
  const SORT_OPTIONS: { label: string; value: ArticleSort }[] = [
    { label: t.list.sortLatest, value: "latest" },
    { label: t.list.sortOldest, value: "oldest" },
  ];
  const [filters, setFilters] = useState<Filters>({ search: "", sort: "latest", category: null });
  const [items, setItems] = useState(initialPage.items);
  const [page, setPage] = useState(initialPage.page);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [loading, setLoading] = useState<"replace" | "append" | null>(null);
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

  async function load(next: Filters, nextPage: number, mode: "replace" | "append") {
    // Batalkan request sebelumnya supaya hasil lama tidak menimpa hasil filter terbaru
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(mode);
    setError(false);

    const params = new URLSearchParams({ sort: next.sort, page: String(nextPage) });
    if (next.search.trim()) params.set("search", next.search.trim());
    if (next.category) params.set("category", String(next.category));

    try {
      const res = await fetch(`/api/articles?${params}`, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result: ArticlePage = await res.json();

      setItems((prev) => (mode === "append" ? [...prev, ...result.items] : result.items));
      setPage(result.page);
      setHasMore(result.hasMore);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(true);
    } finally {
      if (abortRef.current === controller) setLoading(null);
    }
  }

  function applyFilters(next: Filters) {
    setFilters(next);
    void load(next, 1, "replace");
  }

  function handleSearchChange(search: string) {
    const next = { ...filters, search };
    setFilters(next);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => void load(next, 1, "replace"), SEARCH_DEBOUNCE_MS);
  }

  const sortLabel = SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? t.list.sortLatest;
  const categoryLabel = categories.find((c) => c.id === filters.category)?.name ?? null;

  return (
    <div>
      <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
        {t.guide.articles.title}
      </h2>

      <SearchFilterBar
        className="mt-4"
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
          options={[t.common.all, ...categories.map((c) => c.name)]}
          value={categoryLabel}
          onChange={(name) =>
            applyFilters({
              ...filters,
              category: categories.find((c) => c.name === name)?.id ?? null,
            })
          }
        />
      </SearchFilterBar>

      {error && (
        <p className="mt-6 text-sm text-red-500">
          {t.guide.articles.error}
        </p>
      )}

      {!error && loading !== "replace" && items.length === 0 && (
        <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          {t.guide.articles.empty}
        </p>
      )}

      <div
        className={clsx(
          "mt-6 divide-y divide-border-light transition-opacity dark:divide-border-dark",
          loading === "replace" && "opacity-50",
        )}
      >
        {items.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: EASE_OUT,
              delay: (index % PAGE_SIZE) * 0.08,
            }}
            className="py-5 first:pt-0"
          >
            <Link
              href={`/panduan-praktis/artikel/${item.slug}`}
              className="group flex gap-4"
            >
              <div className="relative aspect-270/183 w-[160px] shrink-0 overflow-hidden rounded-xl bg-koleksi-navy-dark/10 sm:w-[200px] lg:w-[270px]">
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
                <span
                  className={clsx(
                    "inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] leading-3 font-semibold text-white",
                    item.category.color,
                  )}
                >
                  {item.category.name}
                </span>
                <h3 className="mt-2 text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                  {item.title}
                </h3>
                {item.author && (
                  <p className="mt-2 text-[14px] leading-[14px] text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                    {t.common.by}: {item.author}
                  </p>
                )}
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => void load(filters, page + 1, "append")}
          disabled={loading !== null}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-koleksi-navy-deep px-6 py-2.5 text-sm font-bold text-koleksi-navy-deep transition hover:border-koleksi-navy-deep/60 disabled:opacity-60"
        >
          {loading === "append" && <Loader2 size={16} className="animate-spin" />}
          {loading === "append" ? t.common.loading : t.list.loadMore}
        </button>
      )}
    </div>
  );
}
