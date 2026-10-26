import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { MarqueeLogo } from "@/components/ui/LogoMarquee";
import type { ApiCollection, PartnerResponse } from "@/types";

/**
 * Sponsor published (urutan sort CMS). Skema API sama dengan partner.
 * Kalau API gagal, kembalikan [] supaya halaman tetap render.
 */
export async function getSponsors(): Promise<MarqueeLogo[]> {
  try {
    const { data } = await apiFetch<ApiCollection<PartnerResponse>>(API_ENDPOINTS.sponsors, {
      revalidate: 300,
      tags: ["sponsors"],
    });

    return data
      .filter((sponsor) => sponsor.logo)
      .map((sponsor) => ({
        id: `sponsor-${sponsor.id}`,
        name: sponsor.name,
        logo: sponsor.logo!,
        url: sponsor.url,
      }));
  } catch (error) {
    console.error("[getSponsors]", error);
    return [];
  }
}
