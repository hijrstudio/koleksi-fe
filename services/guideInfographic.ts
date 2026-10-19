import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ApiCollection,
  GuideCategoryResponse,
  InfographicListResponse,
  InfographicPage,
  InfographicQuery,
  Locale,
  VideoCategory,
} from "@/types";

function toCategory(category: GuideCategoryResponse, locale: Locale): VideoCategory {
  return { id: category.id, name: category.name[locale] || category.name.id };
}

/** List infografis (6 per halaman) dengan pencarian & filter kategori. */
export async function getInfographics(
  query: InfographicQuery = {},
  locale: Locale = "id",
): Promise<InfographicPage> {
  const res = await apiFetch<InfographicListResponse>(API_ENDPOINTS.infographics, {
    query: {
      search: query.search?.trim() || undefined,
      category: query.category ?? undefined,
      page: query.page ?? 1,
    },
    revalidate: 60,
    tags: ["infographics"],
  });

  return {
    items: res.data.map((item) => ({
      id: `infografis-${item.id}`,
      title: item.title[locale] || item.title.id,
      category: toCategory(item.category, locale),
      image: item.image,
    })),
    page: res.meta.current_page,
    totalPages: Math.max(1, res.meta.last_page),
  };
}

export async function getInfographicCategories(locale: Locale = "id"): Promise<VideoCategory[]> {
  const { data } = await apiFetch<ApiCollection<GuideCategoryResponse>>(API_ENDPOINTS.infographicCategories, {
    revalidate: 300,
    tags: ["infographics"],
  });

  return data.map((category) => toCategory(category, locale));
}
