"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/i18n/Link";
import { motion } from "framer-motion";
import { Loader2, Pin } from "lucide-react";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Dot from "@/components/ui/Dot";
import RoleBadge from "@/components/ui/RoleBadge";
import { format, useI18n } from "@/components/i18n/I18nProvider";
import { expiredPath } from "@/lib/auth/validation";
import type {
  ForumCategory,
  ForumDiscussionSummary,
  ForumOverview,
  ForumPage,
} from "@/types";
import { DEFAULT_DISCUSSION_IMAGE, formatTanggal } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PAGE_SIZE = 10;
const SEARCH_DELAY_MS = 350;
type SortOrder = "latest" | "oldest";

interface DiskusiListProps {
  categories: ForumCategory[];
  overview: ForumOverview;
  initialPage: ForumPage<ForumDiscussionSummary>;
}

/**
 * Daftar diskusi forum. Halaman pertama dari server; cari / kategori / urutan / "Muat lebih banyak" memanggil
 * /api/forum/discussions (token member dibaca di server, tidak pernah di browser).
 */
export default function DiskusiList({ categories, overview, initialPage }: DiskusiListProps) {
  const { locale, t } = useI18n();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [items, setItems] = useState(initialPage.items);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstRender = useRef(true);
  const requestId = useRef(0);

  async function load(nextPage: number, append: boolean) {
    const id = ++requestId.current;
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({ sort: sortOrder, page: String(nextPage) });
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category.slug);

    try {
      const res = await fetch(`/api/forum/discussions?${params}`, { cache: "no-store" });
      if (res.status === 401) {
        // Sesi habis: /api/auth/expired menghapus cookie lalu ke halaman masuk (kembali ke sini setelahnya)
        window.location.assign(expiredPath("/forum/diskusi", locale));
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as ForumPage<ForumDiscussionSummary>;
      if (id !== requestId.current) return; // hasil request lama (filter sudah berubah)

      setItems((prev) => (append ? [...prev, ...data.items] : data.items));
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch {
      if (id === requestId.current) setError(t.forum.loadError);
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }

  // Filter berubah → muat ulang halaman 1 (pencarian ditunda sedikit supaya tidak request tiap ketukan)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => load(1, false), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortOrder, category]);

  const categoryNames = categories.map((c) => c.name);

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
        <div>
          <h1 className="font-display text-[32px] font-bold leading-10 text-koleksi-navy dark:text-badge-liputan">
            {t.forum.title}
          </h1>
          <p className="mt-6 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/60">
            {t.forum.intro}
          </p>
        </div>
        {/* Spacer selebar kolom widget kanan, supaya lebar kolom daftar sama */}
        <div aria-hidden="true" className="hidden xl:block" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 md:mt-16 xl:grid-cols-[1fr_270px]">
        <div>
          <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-badge-liputan">
            {t.forum.discussions}
          </h2>

          <SearchFilterBar
            className="mt-4"
            iconPosition="right"
            search={search}
            onSearchChange={setSearch}
          >
            <FilterDropdown
              label={t.list.sortLatest}
              options={[t.list.sortLatest, t.list.sortOldest]}
              value={sortOrder === "latest" ? t.list.sortLatest : t.list.sortOldest}
              onChange={(v) => setSortOrder(v === t.list.sortOldest ? "oldest" : "latest")}
            />
            <FilterDropdown
              label={t.forum.categoryTag}
              options={[t.list.allCategories, ...categoryNames]}
              value={category?.name ?? null}
              onChange={(name) => setCategory(categories.find((c) => c.name === name) ?? null)}
            />
          </SearchFilterBar>

          {error && (
            <p role="alert" className="mt-6 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {!error && items.length === 0 && !isLoading && (
            <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
              {t.forum.noDiscussions}
            </p>
          )}

          <div className="mt-6 divide-y divide-border-light dark:divide-border-dark" aria-busy={isLoading}>
            {items.map((item, index) => (
              <motion.article
                key={item.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: (index % PAGE_SIZE) * 0.08 }}
                className="py-5 first:pt-0"
              >
                <Link href={`/forum/diskusi/${item.slug}`} className="group flex gap-4">
                  <div className="relative aspect-270/183 w-[160px] shrink-0 overflow-hidden rounded-xl bg-koleksi-navy-dark/10 sm:w-[200px] lg:w-[270px]">
                    <Image
                      src={item.image ?? DEFAULT_DISCUSSION_IMAGE}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 270px, (min-width: 640px) 200px, 160px"
                    />
                  </div>
                  <div className="min-w-0">
                    {/* Penulis · Tanggal · Kategori */}
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                      {item.is_pinned && (
                        <>
                          <span className="inline-flex items-center gap-1 font-semibold text-koleksi-green-dark">
                            <Pin size={12} aria-hidden="true" />
                            {t.forum.pinned}
                          </span>
                          <Dot />
                        </>
                      )}
                      <span>{item.author.name}</span>
                      {item.author.role !== "Member" && <RoleBadge role={item.author.role} />}
                      <Dot />
                      <span>{formatTanggal(item.created_at, locale)}</span>
                      <Dot />
                      <span className="inline-flex w-fit items-center rounded-full bg-koleksi-green px-3 py-1 text-[12px] leading-3 font-semibold text-white">
                        {item.category.name}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[20px] font-bold leading-6 wrap-break-word text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                      {item.title}
                    </h3>
                    {/* Komentar · Dilihat */}
                    <p className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                      <span>{format(t.forum.comments, { count: item.comments_count })}</span>
                      <Dot />
                      <span>{format(t.forum.views, { count: item.views_count })}</span>
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {hasMore && (
            <button
              type="button"
              onClick={() => load(page + 1, true)}
              disabled={isLoading}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-koleksi-navy-deep px-6 py-2.5 text-sm font-bold text-koleksi-navy-deep transition hover:border-koleksi-navy-deep/60 disabled:opacity-60 dark:border-white dark:text-white dark:hover:border-koleksi-green dark:hover:text-koleksi-green"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? t.common.loading : t.list.loadMore}
            </button>
          )}
        </div>

        {/* Widget kanan */}
        <aside className="flex flex-col gap-12">
          <div>
            <h3 className="text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
              {t.forum.trending}
            </h3>
            {overview.trending.length === 0 ? (
              <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">{t.forum.noTrending}</p>
            ) : (
              <ul className="mt-8 divide-y divide-border-light dark:divide-border-dark">
                {overview.trending.map((topic) => (
                  <li key={topic.slug} className="py-3 first:pt-0">
                    <Link
                      href={`/forum/diskusi/${topic.slug}`}
                      className="text-sm font-semibold leading-[21px] text-koleksi-navy-dark transition hover:text-koleksi-green dark:text-ink-dark"
                    >
                      {topic.title}
                    </Link>
                    <p className="mt-1 text-xs text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                      {formatTanggal(topic.created_at, locale)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
              {t.forum.mostActive}
            </h3>
            {overview.active_members.length === 0 ? (
              <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">{t.forum.noActiveMembers}</p>
            ) : (
              <ul className="mt-8 flex flex-col gap-7">
                {overview.active_members.map((member, i) => (
                  <li key={`${member.name}-${i}`} className="flex items-center gap-3">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={48}
                      height={48}
                      className="size-12 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <RoleBadge role={member.role} />
                      <p className="mt-1 truncate text-sm font-bold text-koleksi-navy-dark dark:text-ink-dark">
                        {member.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
