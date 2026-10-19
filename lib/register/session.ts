import "server-only";

import { cookies } from "next/headers";

/**
 * E-mail pendaftar terakhir, untuk halaman "Terima kasih" (tampil & kirim ulang verifikasi) tanpa
 * menaruh e-mail di URL (riwayat browser / log server). httpOnly, hanya untuk path /daftar, 1 hari.
 */
const REGISTRATION_COOKIE = "koleksi_registration";

/** Hanya bisa dipanggil dari Server Action / Route Handler. */
export async function setRegisteredEmail(email: string): Promise<void> {
  (await cookies()).set(REGISTRATION_COOKIE, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/daftar",
    maxAge: 60 * 60 * 24,
  });
}

export async function getRegisteredEmail(): Promise<string | null> {
  return (await cookies()).get(REGISTRATION_COOKIE)?.value ?? null;
}

/** "budi.santoso@gmail.com" → "bu••••••••@gmail.com" */
export function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!domain) return email;

  return `${name.slice(0, 2)}${"•".repeat(Math.max(name.length - 2, 3))}@${domain}`;
}
