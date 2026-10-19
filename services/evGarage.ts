import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ApiCollection,
  GarageBrand,
  GarageBrandResponse,
  GaragePage,
  GarageQuery,
  GarageVehicleListResponse,
  GarageVehicleResponse,
  GarageVehicle,
} from "@/types";

const REVALIDATE = 300;
const TAGS = ["ev-garage"];

function toVehicle(v: GarageVehicleResponse): GarageVehicle {
  return {
    id: `garage-${v.id}`,
    brand: v.brand.name,
    type: v.type,
    batteryKwh: v.battery_kwh,
    acKw: v.ac_kw,
    dcKw: v.dc_kw,
    rangeKm: v.range_km,
  };
}

/** Tabel spesifikasi EV Garage (18 per halaman, diatur backend) + filter merek, pencarian & urutan. */
export async function getGarageVehicles(query: GarageQuery = {}): Promise<GaragePage> {
  const res = await apiFetch<GarageVehicleListResponse>(API_ENDPOINTS.garageVehicles, {
    query: {
      brand: query.brand || undefined,
      search: query.search?.trim() || undefined,
      sort: query.sort ?? "asc",
      page: query.page ?? 1,
    },
    revalidate: REVALIDATE,
    tags: TAGS,
  });

  return {
    items: res.data.map(toVehicle),
    page: res.meta.current_page,
    totalPages: Math.max(1, res.meta.last_page),
    total: res.meta.total,
  };
}

/**
 * Merek yang punya kendaraan di EV Garage (urutan CMS) untuk grid logo.
 * Kalau API gagal, kembalikan [] supaya halaman tetap render (grid disembunyikan).
 */
export async function getGarageBrands(): Promise<GarageBrand[]> {
  try {
    const { data } = await apiFetch<ApiCollection<GarageBrandResponse>>(API_ENDPOINTS.garageBrands, {
      revalidate: REVALIDATE,
      tags: TAGS,
    });

    return data.map((b) => ({ slug: b.slug, name: b.name, logo: b.logo }));
  } catch (error) {
    console.error("[getGarageBrands]", error);
    return [];
  }
}
