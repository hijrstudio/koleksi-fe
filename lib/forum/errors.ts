import "server-only";

import { ApiError } from "@/lib/api/client";

/** Hasil aksi forum untuk Client Component: sukses + data, atau pesan error (per field kalau validasi). */
export type ForumResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string; errors?: Record<string, string> };

/** ApiError backend → ForumResult gagal. 401 = sesi habis (client mengarahkan ke login). */
export function forumError(error: unknown, fallback: string): ForumResult<never> {
  if (!(error instanceof ApiError)) {
    console.error("[forum]", error);
    return { ok: false, status: 502, message: fallback };
  }

  const body = error.body as { message?: string; errors?: Record<string, string[]> } | undefined;
  const errors = Object.fromEntries(Object.entries(body?.errors ?? {}).map(([field, messages]) => [field, messages[0]]));
  const message =
    error.status === 429
      ? "Terlalu banyak percobaan. Coba lagi sebentar lagi."
      : error.status === 422
        ? (Object.values(errors)[0] ?? body?.message ?? fallback)
        : error.status === 404
          ? "Diskusi tidak ditemukan."
          : fallback;

  if (error.status >= 500) console.error("[forum]", error.status, error.endpoint);

  return { ok: false, status: error.status, message, errors };
}
