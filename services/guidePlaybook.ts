import "server-only";

import { apiFetch, apiFetchRaw } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Locale, PlaybookListResponse, PlaybookPage, PlaybookQuery } from "@/types";

/** List Web Playbook published (9 per halaman) dengan pencarian judul. */
export async function getPlaybooks(query: PlaybookQuery = {}, locale: Locale = "id"): Promise<PlaybookPage> {
  const res = await apiFetch<PlaybookListResponse>(API_ENDPOINTS.playbooks, {
    query: {
      search: query.search?.trim() || undefined,
      page: query.page ?? 1,
    },
    revalidate: 60,
    tags: ["playbooks"],
  });

  return {
    items: res.data.map((item) => ({
      id: item.id,
      title: item.title[locale] || item.title.id,
      cover: item.cover,
    })),
    page: res.meta.current_page,
    totalPages: Math.max(1, res.meta.last_page),
  };
}

/** Isi PDF untuk dibaca (siapa saja). Response mentah dari backend, untuk di-stream ulang. */
export function fetchPlaybookPdf(id: number): Promise<Response> {
  return apiFetchRaw(API_ENDPOINTS.playbookFile(id));
}

/** Unduh PDF atas nama member yang login (backend menolak token selain token member). */
export function downloadPlaybookPdf(id: number, memberToken: string): Promise<Response> {
  return apiFetchRaw(API_ENDPOINTS.memberPlaybookDownload(id), { bearer: memberToken });
}
