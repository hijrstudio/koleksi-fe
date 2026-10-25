import "server-only";

import { ApiError, apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ResetPasswordInput } from "@/lib/auth/password";

/**
 * Lupa kata sandi member (belum login → pakai BACKEND_API_TOKEN). `clientIp` diteruskan sebagai
 * X-Forwarded-For supaya rate limit backend dihitung per pengunjung, bukan per server Next.js.
 */
function headers(clientIp: string | null): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
  };
}

/**
 * Minta link atur ulang. Backend selalu menjawab pesan yang sama (tidak membocorkan e-mail terdaftar).
 * Melempar ApiError 422 (format e-mail) atau 429 (terlalu sering).
 */
export async function requestPasswordReset(email: string, clientIp: string | null): Promise<string> {
  const { message } = await apiFetch<{ message: string }>(API_ENDPOINTS.memberPasswordForgot, {
    method: "POST",
    headers: headers(clientIp),
    body: JSON.stringify({ email }),
    revalidate: false,
  });

  return message;
}

/** false = link tidak valid / kedaluwarsa / sudah dipakai. */
export async function isPasswordResetLinkValid(email: string, token: string, clientIp: string | null): Promise<boolean> {
  try {
    await apiFetch(API_ENDPOINTS.memberPasswordResetCheck, {
      method: "POST",
      headers: headers(clientIp),
      body: JSON.stringify({ email, token }),
      revalidate: false,
    });

    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) return false;
    throw error;
  }
}

/**
 * Simpan kata sandi baru. Backend mencabut semua sesi login & mengirim notifikasi.
 * Melempar ApiError 422 (kata sandi tidak memenuhi syarat / link tidak valid) atau 429.
 */
export async function resetPassword(
  input: ResetPasswordInput & { email: string; token: string },
  clientIp: string | null,
): Promise<{ message: string; revoked_sessions: number }> {
  return apiFetch(API_ENDPOINTS.memberPasswordReset, {
    method: "POST",
    headers: headers(clientIp),
    body: JSON.stringify(input),
    revalidate: false,
  });
}
