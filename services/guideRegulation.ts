import "server-only";

import { apiFetch, apiFetchRaw } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { RegulationListResponse, RegulationPage, RegulationQuery } from "@/types";

/** List dokumen regulasi published (5 per halaman) dengan pencarian judul. Judul tidak bilingual. */
export async function getRegulations(query: RegulationQuery = {}): Promise<RegulationPage> {
  const res = await apiFetch<RegulationListResponse>(API_ENDPOINTS.regulations, {
    query: {
      search: query.search?.trim() || undefined,
      page: query.page ?? 1,
    },
    revalidate: 60,
    tags: ["regulations"],
  });

  return {
    items: res.data.map((item) => ({
      id: item.id,
      title: item.title,
      url: `/api/regulations/${item.id}/file`,
    })),
    page: res.meta.current_page,
    totalPages: Math.max(1, res.meta.last_page),
  };
}

/** Isi PDF (siapa saja). Response mentah dari backend, untuk di-stream ulang. */
export function fetchRegulationPdf(id: number): Promise<Response> {
  return apiFetchRaw(API_ENDPOINTS.regulationFile(id));
}
