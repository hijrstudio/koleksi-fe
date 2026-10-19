import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiCollection, Region, Regency } from "@/types";

/** Master wilayah jarang berubah (per Kepmendagri) → cache 1 hari. */
const REVALIDATE = 86400;

export const REGENCY_CODE = /^\d{2}\.\d{2}$/;
export const DISTRICT_CODE = /^\d{2}\.\d{2}\.\d{2}$/;

export async function getRegencies(): Promise<Regency[]> {
  const { data } = await apiFetch<ApiCollection<Regency>>(API_ENDPOINTS.regencies, {
    revalidate: REVALIDATE,
    tags: ["regions"],
  });

  return data;
}

/** Kecamatan di kab/kota tsb. Kode tidak valid → [] tanpa memanggil backend. */
export async function getDistricts(regency: string): Promise<Region[]> {
  if (!REGENCY_CODE.test(regency)) return [];

  const { data } = await apiFetch<ApiCollection<Region>>(API_ENDPOINTS.districts(regency), {
    revalidate: REVALIDATE,
    tags: ["regions"],
  });

  return data;
}

/** Desa/kelurahan di kecamatan tsb. Kode tidak valid → [] tanpa memanggil backend. */
export async function getVillages(district: string): Promise<Region[]> {
  if (!DISTRICT_CODE.test(district)) return [];

  const { data } = await apiFetch<ApiCollection<Region>>(API_ENDPOINTS.villages(district), {
    revalidate: REVALIDATE,
    tags: ["regions"],
  });

  return data;
}
