import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import formatDate from "@/lib/formatDate";
import type { EventVideoListResponse, EventVideoPage, EventVideoQuery, Locale } from "@/types";

/** List video kegiatan (4 per halaman) dengan pencarian judul. */
export async function getEventVideos(query: EventVideoQuery = {}, locale: Locale = "id"): Promise<EventVideoPage> {
  const res = await apiFetch<EventVideoListResponse>(API_ENDPOINTS.eventVideos, {
    query: {
      search: query.search?.trim() || undefined,
      page: query.page ?? 1,
    },
    revalidate: 60,
    tags: ["event-videos"],
  });

  return {
    items: res.data.map((video) => ({
      id: `event-video-${video.id}`,
      title: video.title[locale] || video.title.id,
      date: formatDate(video.published_at, locale, "long"),
      image: video.image,
      youtubeId: video.youtube_id,
    })),
    page: res.meta.current_page,
    totalPages: Math.max(1, res.meta.last_page),
  };
}
