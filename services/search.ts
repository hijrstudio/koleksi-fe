import "server-only";

import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { clientIp } from "@/lib/auth/clientIp";
import type { Locale, NumberedPage, SearchGroup, SearchItem, SearchType } from "@/types";

/**
 * Pencarian website. Backend sudah meng-cache hasil per kata kunci (2 menit), jadi di sini tidak di-cache lagi.
 * IP pengunjung diteruskan sebagai X-Forwarded-For → rate limit backend per pengunjung, bukan per server Next.js.
 */
export const SEARCH_TYPES: SearchType[] = ["news", "article", "event", "video"];
export const SEARCH_MIN = 2;
export const SEARCH_MAX = 100;

async function headers(): Promise<Record<string, string>> {
  const ip = await clientIp();
  return ip ? { "X-Forwarded-For": ip } : {};
}

export async function searchAll(q: string, lang: Locale): Promise<{ groups: SearchGroup[]; total: number }> {
  const res = await apiFetch<{ data: SearchGroup[]; total: number }>(API_ENDPOINTS.search, {
    headers: await headers(),
    query: { q, lang },
    revalidate: false,
  });
  return { groups: res.data, total: res.total };
}

export async function searchType(q: string, type: SearchType, lang: Locale, page: number): Promise<NumberedPage<SearchItem> & { total: number }> {
  const res = await apiFetch<{ data: SearchItem[]; meta: { current_page: number; last_page: number; total: number } }>(API_ENDPOINTS.search, {
    headers: await headers(),
    query: { q, type, lang, page },
    revalidate: false,
  });
  return { items: res.data, page: res.meta.current_page, lastPage: Math.max(1, res.meta.last_page), total: res.meta.total };
}
