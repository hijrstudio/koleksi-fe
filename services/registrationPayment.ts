import "server-only";

import { ApiError, apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { IuranPayment, RegistrationPaymentSummary } from "@/types";

/**
 * Halaman bayar iuran pendaftaran (/daftar/bayar). Pendaftar belum bisa login: aksesnya lewat token dari link
 * e-mail, dikirim di body (bukan URL) ke backend. IP pengunjung diteruskan untuk rate limit per pengunjung.
 */
function post<T>(endpoint: string, body: Record<string, string>, clientIp: string | null): Promise<{ data: T }> {
  return apiFetch<{ data: T }>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(clientIp ? { "X-Forwarded-For": clientIp } : {}) },
    body: JSON.stringify(body),
    revalidate: false,
  });
}

/** Ringkasan untuk halaman; null kalau token tidak valid / kedaluwarsa / pendaftaran sudah dihapus. */
export async function getRegistrationPayment(token: string, clientIp: string | null): Promise<RegistrationPaymentSummary | null> {
  try {
    return (await post<RegistrationPaymentSummary>(API_ENDPOINTS.registrationPayment, { token }, clientIp)).data;
  } catch (error) {
    if (error instanceof ApiError && [404, 422].includes(error.status)) return null;
    throw error;
  }
}

/** Buat / ambil QRIS iuran pertama. */
export async function startRegistrationPayment(token: string, clientIp: string | null): Promise<IuranPayment> {
  return (await post<IuranPayment>(API_ENDPOINTS.registrationPaymentCheckout, { token }, clientIp)).data;
}

/** Status pembayaran + status pendaftar (No. lambung setelah lunas). */
export async function getRegistrationPaymentStatus(token: string, merchantRef: string, clientIp: string | null): Promise<IuranPayment> {
  return (await post<IuranPayment>(API_ENDPOINTS.registrationPaymentStatus, { token, merchant_ref: merchantRef }, clientIp)).data;
}
