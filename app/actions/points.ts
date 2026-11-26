"use server";

import { getSessionToken } from "@/lib/auth/session";
import { type ReadTarget, postReadClaim, postReadStart, postVisit } from "@/services/points";

/**
 * Sinyal poin dari browser (Server Action → dicek asal request / CSRF; token dari cookie httpOnly).
 * Server backend yang menentukan poin & batasnya; di sini hanya meneruskan. Gagal = diam (poin bukan fitur utama).
 */

const SLUG = /^[a-z0-9-]{1,255}$/;

function validTarget(target: ReadTarget): boolean {
  return (target?.type === "news" || target?.type === "article") && typeof target.slug === "string" && SLUG.test(target.slug);
}

/** Halaman dibuka: kunjungan harian + menu. */
export async function trackVisitAction(path: string): Promise<{ ok: boolean; earned: number }> {
  const token = await getSessionToken();
  if (!token || typeof path !== "string" || !path.startsWith("/") || path.length > 300) return { ok: false, earned: 0 };

  try {
    return { ok: true, earned: await postVisit(token, path) };
  } catch {
    return { ok: false, earned: 0 };
  }
}

/** Artikel / berita dibuka: server mencatat waktu mulai. Mengembalikan detik yang dibutuhkan (null = tamu / gagal). */
export async function startReadAction(target: ReadTarget): Promise<number | null> {
  const token = await getSessionToken();
  if (!token || !validTarget(target)) return null;

  try {
    return await postReadStart(token, { type: target.type, slug: target.slug });
  } catch {
    return null;
  }
}

export async function claimReadAction(target: ReadTarget): Promise<number> {
  const token = await getSessionToken();
  if (!token || !validTarget(target)) return 0;

  try {
    return await postReadClaim(token, { type: target.type, slug: target.slug });
  } catch {
    return 0;
  }
}
