"use server";

import { getSessionToken } from "@/lib/auth/session";
import { isBookmarkTarget } from "@/lib/bookmark";
import { type ForumResult, forumError } from "@/lib/forum/errors";
import { setBookmark } from "@/services/bookmark";
import type { BookmarkTarget } from "@/types";

/** Simpan / hapus simpanan (Server Action: CSRF dicek Next.js, token dari cookie httpOnly). */
export async function setBookmarkAction(target: BookmarkTarget, saved: boolean): Promise<ForumResult<{ saved: boolean }>> {
  const token = await getSessionToken();
  if (!token) return { ok: false, status: 401, message: "Silakan masuk untuk menyimpan." };
  if (!isBookmarkTarget(target) || typeof saved !== "boolean") return { ok: false, status: 422, message: "Permintaan tidak valid." };

  try {
    return { ok: true, data: { saved: await setBookmark(token, { type: target.type, slug: target.slug }, saved) } };
  } catch (error) {
    return forumError(error, "Gagal menyimpan. Coba lagi.");
  }
}
