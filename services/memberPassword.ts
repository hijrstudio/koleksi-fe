import "server-only";

import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ChangePasswordInput } from "@/lib/auth/password";

/**
 * Ganti kata sandi member pemilik token. Backend mencabut sesi di perangkat lain & mengirim notifikasi.
 * Melempar ApiError 422 (validasi / kata sandi saat ini salah) atau 429 (terlalu banyak percobaan).
 */
export async function updateMemberPassword(
  token: string,
  input: ChangePasswordInput,
  clientIp: string | null,
): Promise<{ message: string; revoked_sessions: number }> {
  return apiFetch(API_ENDPOINTS.memberPassword, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
    },
    body: JSON.stringify(input),
    revalidate: false,
  });
}
