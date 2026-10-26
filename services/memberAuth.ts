import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getSessionToken } from "@/lib/auth/session";
import { expiredPath } from "@/lib/auth/validation";
import { getLocale } from "@/lib/i18n/server";
import type { MemberLoginResponse, MemberProfile } from "@/types";

/** Header untuk request atas nama member: token member menggantikan BACKEND_API_TOKEN. */
function memberHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Login ke backend. `clientIp` diteruskan sebagai X-Forwarded-For supaya rate limit login di backend
 * dihitung per pengunjung, bukan per server Next.js.
 */
export async function loginMember(
  identifier: string,
  password: string,
  clientIp: string | null,
): Promise<MemberLoginResponse> {
  return apiFetch<MemberLoginResponse>(API_ENDPOINTS.memberLogin, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
    },
    body: JSON.stringify({ identifier, password, device_name: "web" }),
    revalidate: false,
  });
}

/**
 * Member yang sedang login (Data Access Layer). null = belum login / token tidak berlaku lagi.
 * Dibungkus `cache` → Header & halaman yang sama-sama butuh data member cukup 1 request per render.
 */
export const getCurrentMember = cache(async (): Promise<MemberProfile | null> => {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const { data } = await apiFetch<{ data: MemberProfile }>(API_ENDPOINTS.memberMe, {
      headers: memberHeaders(token),
      revalidate: false,
    });

    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});

/**
 * Untuk halaman yang wajib login. Token tidak berlaku → hapus cookie & ke /masuk (lewat /api/auth/expired,
 * karena Server Component tidak boleh mengubah cookie). `path` = halaman yang dibuka setelah login ulang.
 */
export async function requireMember(path: string): Promise<MemberProfile> {
  const member = await getCurrentMember();
  if (!member) {
    redirect(expiredPath(path, await getLocale()));
  }

  return member;
}

/** Cabut token di backend. Gagal (mis. token sudah kadaluarsa) tidak masalah — cookie tetap dihapus. */
export async function logoutMember(token: string): Promise<void> {
  try {
    await apiFetch(API_ENDPOINTS.memberLogout, {
      method: "POST",
      headers: memberHeaders(token),
      revalidate: false,
    });
  } catch (error) {
    if (!(error instanceof ApiError && error.status === 401)) {
      console.error("[logoutMember]", error);
    }
  }
}
