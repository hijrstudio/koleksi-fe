"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "@/components/i18n/Link";
import { Loader2, X } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { setBookmarkAction } from "@/app/actions/bookmark";
import { bookmarkHref } from "@/lib/bookmark";
import type { BookmarkItem, ForumPage } from "@/types";

const DEFAULT_IMAGE = "/images/sample-image1.png";

export default function BookmarkList({ initialPage }: { initialPage: ForumPage<BookmarkItem> }) {
  const { locale, t } = useI18n();
  const [items, setItems] = useState(initialPage.items);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function remove(item: BookmarkItem) {
    setItems((prev) => prev.filter((i) => !(i.type === item.type && i.slug === item.slug)));
    startTransition(async () => {
      const result = await setBookmarkAction({ type: item.type, slug: item.slug }, false);
      if (!result.ok) {
        setItems((prev) => [item, ...prev]);
        setError(result.message);
      }
    });
  }

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch(`/api/member/bookmarks?lang=${locale}&page=${page + 1}`, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as ForumPage<BookmarkItem>;
      setItems((prev) => [...prev, ...data.items.filter((n) => !prev.some((p) => p.type === n.type && p.slug === n.slug))]);
      setHasMore(data.hasMore);
      setPage((p) => p + 1);
    } catch {
      setError(t.forum.loadError);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return <p className="mt-8 text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/60">{t.bookmark.empty}</p>;
  }

  return (
    <div className="mt-8">
      {error && <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
      <ul className="divide-y divide-border-light dark:divide-border-dark">
        {items.map((item) => (
          <li key={`${item.type}-${item.slug}`} className="flex items-center gap-4 py-4 first:pt-0">
            <Link href={bookmarkHref(item)} className="group flex min-w-0 flex-1 items-center gap-4">
              <div className="relative aspect-27/16 w-28 shrink-0 overflow-hidden rounded-xl bg-koleksi-navy-dark/10 sm:w-40">
                <Image
                  src={item.image ?? DEFAULT_IMAGE}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="160px"
                />
              </div>
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-koleksi-green px-3 py-1 text-[12px] leading-3 font-semibold text-white">
                  {t.bookmark.types[item.type]}
                </span>
                <p className="mt-2 line-clamp-2 text-base font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                  {item.title}
                </p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => remove(item)}
              aria-label={`${t.bookmark.remove}: ${item.title}`}
              title={t.bookmark.remove}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-koleksi-navy-dark/50 transition hover:bg-koleksi-navy-dark/5 hover:text-red-600 dark:text-ink-dark/50"
            >
              <X size={18} />
            </button>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-koleksi-navy-deep px-6 py-2.5 text-sm font-bold text-koleksi-navy-deep transition disabled:opacity-60 dark:border-white dark:text-white"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? t.common.loading : t.list.loadMore}
        </button>
      )}
    </div>
  );
}
