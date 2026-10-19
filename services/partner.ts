import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiCollection, PartnerLogo, PartnerResponse } from "@/types";

/**
 * Ukuran logo tidak disimpan di backend. Nilai ini hanya petunjuk untuk next/image (resolusi srcset);
 * tampilan memakai `h-12 w-auto` sehingga browser tetap mengikuti rasio asli logo setelah dimuat.
 */
const LOGO_HINT = { width: 400, height: 120 };

/**
 * Partner published (urutan sort CMS).
 * Kalau API gagal, kembalikan [] supaya halaman tetap render.
 */
export async function getPartners(): Promise<PartnerLogo[]> {
  try {
    const { data } = await apiFetch<ApiCollection<PartnerResponse>>(API_ENDPOINTS.partners, {
      revalidate: 300,
      tags: ["partners"],
    });

    return data
      .filter((partner) => partner.logo)
      .map((partner) => ({
        id: `partner-${partner.id}`,
        name: partner.name,
        logo: partner.logo!,
        url: partner.url,
        ...LOGO_HINT,
      }));
  } catch (error) {
    console.error("[getPartners]", error);
    return [];
  }
}
