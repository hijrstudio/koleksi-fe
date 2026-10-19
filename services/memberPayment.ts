import "server-only";

import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { IuranPayment } from "@/types";

/** merchant_ref dari backend: huruf, angka, "-" (maks 64). Dicek sebelum dipakai di URL. */
export const MERCHANT_REF = /^[A-Za-z0-9-]{1,64}$/;

/** Buat / ambil QRIS aktif untuk semua tagihan yang sedang ditagih (idempoten di backend). */
export async function createIuranPayment(token: string): Promise<IuranPayment> {
  const { data } = await apiFetch<{ data: IuranPayment }>(API_ENDPOINTS.memberIuranPayment, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    revalidate: false,
  });

  return data;
}

/** Status terkini (backend mengecek ke gateway maks. 1x / 5 detik per transaksi). */
export async function getIuranPayment(token: string, merchantRef: string): Promise<IuranPayment> {
  const { data } = await apiFetch<{ data: IuranPayment }>(API_ENDPOINTS.memberPayment(merchantRef), {
    headers: { Authorization: `Bearer ${token}` },
    revalidate: false,
  });

  return data;
}
