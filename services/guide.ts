import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiCollection, ArticleCard, LatestGuideResponse, Locale } from "@/types";

const TAG_LABEL: Record<Locale, Record<LatestGuideResponse["type"], string>> = {
  id: { playbook: "Web Playbook", video: "Video Edukasi", article: "Artikel" },
  en: { playbook: "Web Playbook", video: "Educational Video", article: "Article" },
};

const TAG_COLOR: Record<LatestGuideResponse["type"], ArticleCard["tagColor"]> = {
  playbook: "playbook",
  video: "video",
  article: "artikel",
};

function toArticleCard(guide: LatestGuideResponse, locale: Locale): ArticleCard {
  const isVideo = guide.type === "video";
  const title = guide.title[locale] || guide.title.id;

  return {
    id: `${guide.type}-${guide.id}`,
    tag: TAG_LABEL[locale][guide.type],
    tagColor: TAG_COLOR[guide.type],
    title,
    author: guide.author,
    image: guide.image,
    isVideo,
    href: guide.type === "article" && guide.slug ? `/panduan-praktis/artikel/${guide.slug}` : undefined,
    youtubeId: isVideo ? (guide.youtube_id ?? undefined) : undefined,
    playbook: guide.type === "playbook" ? { id: guide.id, title, cover: guide.image } : undefined,
  };
}

/**
 * Panduan praktis untuk homepage: Web Playbook, Video Edukasi & Artikel terbaru (maks. 3, urutan dari backend).
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
