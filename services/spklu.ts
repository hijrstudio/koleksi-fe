import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ApiCollection,
  SpkluBrand,
  SpkluBrandResponse,
  SpkluOperator,
  SpkluOperatorListResponse,
  SpkluOperatorResponse,
  SpkluPage,
  SpkluQuery,
} from "@/types";

const REVALIDATE = 300;
const TAGS = ["spklu"];

function toOperator(o: SpkluOperatorResponse): SpkluOperator {
  return {
    id: `spklu-${o.id}`,
    name: o.brand_spklu,
    company: o.nama_operator,
    app: o.aplikasi,
    logo: o.logo,
    playStore: o.link_playstore,
    appStore: o.link_appstore,
  };
}

/** List operator SPKLU published (10 per halaman, diatur backend) + pencarian & urutan brand. */
export async function getSpkluOperators(query: SpkluQuery = {}): Promise<SpkluPage> {
  const res = await apiFetch<SpkluOperatorListResponse>(API_ENDPOINTS.spkluOperators, {
    query: {
      search: query.search?.trim() || undefined,
      sort: query.sort ?? "asc",
      page: query.page ?? 1,
    },
    revalidate: REVALIDATE,
    tags: TAGS,
  });

  return {
    items: res.data.map(toOperator),
    page: res.meta.current_page,
    totalPages: Math.max(1, res.meta.last_page),
    total: res.meta.total,
  };
}

/**
 * Semua brand published (A-Z) untuk slider logo.
 * Kalau API gagal, kembalikan [] supaya halaman tetap render (slider disembunyikan).
 */
export async function getSpkluBrands(): Promise<SpkluBrand[]> {
  try {
    const { data } = await apiFetch<ApiCollection<SpkluBrandResponse>>(API_ENDPOINTS.spkluBrands, {
      revalidate: REVALIDATE,
      tags: TAGS,
    });

    return data.map((b) => ({ id: `spklu-${b.id}`, name: b.brand_spklu, logo: b.logo }));
  } catch (error) {
    console.error("[getSpkluBrands]", error);
    return [];
  }
}
