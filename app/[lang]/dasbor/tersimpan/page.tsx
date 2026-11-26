import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { expiredPath } from "@/lib/auth/validation";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getBookmarks } from "@/services/bookmark";
import BookmarkList from "./BookmarkList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: `${t.bookmark.pageTitle} - KOLEKSI`, robots: { index: false } };
}

/** Diskusi, berita & artikel yang disimpan member (tombol Simpan). */
export default async function TersimpanPage() {
  const locale = await getLocale();
  const expired = expiredPath("/dasbor/tersimpan", locale);
  const token = await getSessionToken();
  if (!token) redirect(expired);

  const [firstPage, t] = await Promise.all([
    getBookmarks(token, locale, 1).catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 401) redirect(expired);
      throw error;
    }),
    getDictionary(locale),
  ]);

  return (
    <AuthShell title={t.bookmark.pageTitle} backHref="/dasbor" backLabel={t.common.back}>
      <p className="text-base leading-6 text-koleksi-navy-dark/70 dark:text-ink-dark/60">{t.bookmark.pageIntro}</p>
      <BookmarkList initialPage={firstPage} />
    </AuthShell>
  );
}
