import "server-only";

import { cookies } from "next/headers";

/**
 * Sesi member = token Sanctum dari backend, disimpan di cookie httpOnly.
 *
 * Kenapa bukan localStorage: localStorage bisa dibaca JavaScript mana pun di halaman, jadi satu celah XSS
 * (script pihak ketiga, dependency bermasalah) cukup untuk mencuri token. Cookie httpOnly tidak bisa dibaca
 * JavaScript; token hanya dipakai server Next.js saat memanggil API backend.
 *
 *   - httpOnly : tidak bisa diakses document.cookie
 *   - secure   : hanya lewat HTTPS (production)
 *   - sameSite : lax → tidak ikut terkirim pada POST lintas situs (CSRF)
 *   - expires  : sama dengan masa berlaku token di backend
 *
 * Token-nya sendiri opaque (bukan JWT) dan tersimpan ter-hash di DB backend, jadi bisa dicabut kapan saja
 * (logout, ganti password, admin menonaktifkan akun).
 */
export const SESSION_COOKIE = "koleksi_session";

export async function getSessionToken(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

/** Hanya bisa dipanggil dari Server Action / Route Handler. */
export async function setSessionToken(token: string, expiresAt: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

/** Hanya bisa dipanggil dari Server Action / Route Handler. */
export async function clearSessionToken(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
