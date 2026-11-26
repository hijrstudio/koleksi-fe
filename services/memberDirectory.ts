import "server-only";

import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { DirectoryCity, DirectoryMember, NumberedPage } from "@/types";

/** Direktori anggota forum atas nama member yang login (token dari cookie httpOnly). */
function auth(token: string) {
  return { headers: { Authorization: `Bearer ${token}` }, revalidate: false as const };
}

export const CITY_CODE = /^\d{2}\.\d{2}$/;

export interface DirectoryQuery {
  search?: string;
  city?: string;
  page?: number;
}

export async function getDirectoryMembers(token: string, q: DirectoryQuery): Promise<NumberedPage<DirectoryMember>> {
  const res = await apiFetch<{ data: DirectoryMember[]; meta?: { current_page: number; last_page: number } }>(API_ENDPOINTS.forumMembers, {
    ...auth(token),
    query: { search: q.search || undefined, city: q.city && CITY_CODE.test(q.city) ? q.city : undefined, page: q.page },
  });

  return { items: res.data, page: res.meta?.current_page ?? 1, lastPage: Math.max(1, res.meta?.last_page ?? 1) };
}

export async function getDirectoryCities(token: string): Promise<DirectoryCity[]> {
  return (await apiFetch<{ data: DirectoryCity[] }>(API_ENDPOINTS.forumMemberCities, auth(token))).data;
}
