import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import formatDate from "@/lib/formatDate";
import type {
  ApiCollection,
  GuideCategoryResponse,
  Locale,
  VideoCardResponse,
  VideoCategory,
  VideoListResponse,
  VideoPage,
  VideoQuery,
} from "@/types";

function toCategory(category: GuideCategoryResponse, locale: Locale): VideoCategory {
  return { id: category.id, name: category.name[locale] || category.name.id };
}

function toListItem(video: VideoCardResponse, locale: Locale) {
  return {
    id: `video-${video.id}`,
    title: video.title[locale] || video.title.id,
    category: toCategory(video.category, locale),
    date: formatDate(video.published_at, locale, "long"),
    image: video.image,
    youtubeId: video.youtube_id,
  };
}

/** List video edukasi (4 per halaman) dengan pencarian & filter kategori. */
export async function getVideos(query: VideoQuery = {}, locale: Locale = "id"): Promise<VideoPage> {
  const res = await apiFetch<VideoListResponse>(API_ENDPOINTS.videos, {
    query: {
      search: query.search?.trim() || undefined,
      category: query.category ?? undefined,
      page: query.page ?? 1,
    },
    revalidate: 60,
    tags: ["videos"],
  });

  return {
    items: res.data.map((video) => toListItem(video, locale)),
    page: res.meta.current_page,
    totalPages: Math.max(1, res.meta.last_page),
  };
}

export async function getVideoCategories(locale: Locale = "id"): Promise<VideoCategory[]> {
  const { data } = await apiFetch<ApiCollection<GuideCategoryResponse>>(API_ENDPOINTS.videoCategories, {
    revalidate: 300,
    tags: ["videos"],
  });

  return data.map((category) => toCategory(category, locale));
}
