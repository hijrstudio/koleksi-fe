"use server";

import { getSessionToken } from "@/lib/auth/session";
import { type ForumResult, forumError } from "@/lib/forum/errors";
import { createForumDiscussion, postForumComment, rateForumDiscussion } from "@/services/forum";
import type { ForumComment } from "@/types";

/**
 * Aksi forum dari Client Component. Server Action → Next.js memeriksa asal request (CSRF); token member dibaca
 * dari cookie httpOnly di server. Backend tetap memvalidasi ulang semua input & hak akses.
 */

const SLUG = /^[a-z0-9-]{1,190}$/;
const IMAGE_MAX_BYTES = 2 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function token(): Promise<string | null> {
  return getSessionToken();
}

const UNAUTHENTICATED = { ok: false, status: 401, message: "Sesi Anda berakhir. Silakan masuk lagi." } as const;

export async function createDiscussionAction(formData: FormData): Promise<ForumResult<{ slug: string }>> {
  const t = await token();
  if (!t) return UNAUTHENTICATED;

  // Hanya field yang dikenal diteruskan ke backend
  const body = new FormData();
  for (const field of ["category_id", "title", "body"]) body.append(field, String(formData.get(field) ?? ""));
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    if (image.size > IMAGE_MAX_BYTES || !IMAGE_TYPES.includes(image.type)) {
      return { ok: false, status: 422, message: "Gambar harus JPG, PNG, atau WEBP maks 2 MB.", errors: { image: "Gambar harus JPG, PNG, atau WEBP maks 2 MB." } };
    }
    body.append("image", image, image.name);
  }

  try {
    const discussion = await createForumDiscussion(t, body);
    return { ok: true, data: { slug: discussion.slug } };
  } catch (error) {
    return forumError(error, "Gagal membuat diskusi. Coba lagi.");
  }
}

export async function postCommentAction(slug: string, text: string, parentId?: number): Promise<ForumResult<ForumComment>> {
  const t = await token();
  if (!t) return UNAUTHENTICATED;
  if (!SLUG.test(slug) || (parentId !== undefined && !Number.isInteger(parentId))) {
    return { ok: false, status: 422, message: "Permintaan tidak valid." };
  }

  try {
    return { ok: true, data: await postForumComment(t, slug, String(text), parentId) };
  } catch (error) {
    return forumError(error, "Gagal mengirim komentar. Coba lagi.");
  }
}

export async function rateDiscussionAction(slug: string, rating: number): Promise<ForumResult<{ average: number; count: number; mine: number }>> {
  const t = await token();
  if (!t) return UNAUTHENTICATED;
  if (!SLUG.test(slug) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, status: 422, message: "Rating tidak valid." };
  }

  try {
    return { ok: true, data: await rateForumDiscussion(t, slug, rating) };
  } catch (error) {
    return forumError(error, "Gagal menyimpan rating. Coba lagi.");
  }
}
