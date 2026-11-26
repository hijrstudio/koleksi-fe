import "server-only";

import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { BookmarkItem, BookmarkTarget, ForumPage, Locale } from "@/types";

/** Simpanan (bookmark) member — token dari cookie httpOnly, tanpa cache. */
function auth(token: string) {
  return { headers: { Authorization: `Bearer ${token}` }, revalidate: false as const };
}

export async function getBookmarkStatus(token: string, target: BookmarkTarget): Promise<boolean> {
  const res = await apiFetch<{ data: { saved: boolean } }>(API_ENDPOINTS.memberBookmarkStatus, {
    ...auth(token),
    query: { type: target.type, slug: target.slug },
  });
  return res.data.saved;
}

export async function setBookmark(token: string, target: BookmarkTarget, saved: boolean): Promise<boolean> {
  const res = await apiFetch<{ data: { saved: boolean } }>(API_ENDPOINTS.memberBookmarks, {
    ...auth(token),
    method: saved ? "PUT" : "DELETE",
    headers: { ...auth(token).headers, "Content-Type": "application/json" },
    body: JSON.stringify(target),
  });
  return res.data.saved;
}

export async function getBookmarks(token: string, locale: Locale, page = 1): Promise<ForumPage<BookmarkItem>> {
  const res = await apiFetch<{ data: BookmarkItem[]; meta: { current_page: number; last_page: number } }>(
    API_ENDPOINTS.memberBookmarks,
    { ...auth(token), query: { lang: locale, page } },
  );
  return { items: res.data, hasMore: res.meta.current_page < res.meta.last_page };
}
