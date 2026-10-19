import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiCollection, HeroBannerResponse, HeroSlide, Locale } from "@/types";

function toHeroSlide(banner: HeroBannerResponse, locale: Locale): HeroSlide {
  return {
    id: String(banner.id),
    type: banner.type,
    src: banner.url,
    mimeType: banner.mime_type,
    title: banner.title[locale] || banner.title.id,
  };
}

/**
 * Hero banner published untuk HeroSlider.
 * Kalau API gagal (backend down, token salah), kembalikan [] supaya halaman tetap render.
 */
export async function getHeroSlides(locale: Locale = "id"): Promise<HeroSlide[]> {
  try {
    const { data } = await apiFetch<ApiCollection<HeroBannerResponse>>(API_ENDPOINTS.heroBanners, {
      revalidate: 60,
      tags: ["hero-banners"],
    });

    return data.map((banner) => toHeroSlide(banner, locale));
  } catch (error) {
    console.error("[getHeroSlides]", error);
    return [];
  }
}
