import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiCollection, ArticleCard, LatestGuideResponse, Locale } from "@/types";

const TAG_LABEL: Record<Locale, Record<LatestGuideResponse["type"], string>> = {
  id: { article: "Artikel", video: "Video Edukasi" },
  en: { article: "Article", video: "Educational Video" },
};

function toArticleCard(guide: LatestGuideResponse, locale: Locale): ArticleCard {
  const isVideo = guide.type === "video";

  return {
    id: `${guide.type}-${guide.id}`,
    tag: TAG_LABEL[locale][guide.type],
    tagColor: isVideo ? "video" : "artikel",
    title: guide.title[locale] || guide.title.id,
    author: guide.author,
    image: guide.image,
    isVideo,
    href: !isVideo && guide.slug ? `/panduan-praktis/artikel/${guide.slug}` : undefined,
    youtubeId: isVideo ? (guide.youtube_id ?? undefined) : undefined,
  };
}

/**
 * Panduan praktis terbaru untuk homepage: 3 artikel + 3 video, bergantian (diurutkan oleh backend).
 * Kalau API gagal, kembalikan [] supaya halaman tetap render.
 */
export async function getLatestGuides(locale: Locale = "id"): Promise<ArticleCard[]> {
  try {
    const { data } = await apiFetch<ApiCollection<LatestGuideResponse>>(API_ENDPOINTS.latestGuides, {
      revalidate: 60,
      tags: ["guides"],
    });

    return data.map((guide) => toArticleCard(guide, locale));
  } catch (error) {
    console.error("[getLatestGuides]", error);
    return [];
  }
}
