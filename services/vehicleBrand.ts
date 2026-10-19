import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiCollection, VehicleBrandOption } from "@/types";

/**
 * Merek + tipe kendaraan aktif (dropdown Merek / Tipe), dikelola di CMS EV Garage.
 * Cache 5 menit supaya merek/tipe baru dari CMS cepat muncul di form Daftar & Profil.
 */
export async function getVehicleBrands(): Promise<VehicleBrandOption[]> {
  const { data } = await apiFetch<ApiCollection<VehicleBrandOption>>(API_ENDPOINTS.vehicleBrands, {
    revalidate: 300,
    tags: ["vehicle-brands"],
  });

  return data;
}
