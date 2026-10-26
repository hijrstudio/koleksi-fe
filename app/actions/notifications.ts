"use server";

import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { markMemberNotificationsRead } from "@/services/memberNotification";

/**
 * Tandai notifikasi dibaca (satu `id`, atau semua). Server Action → Next.js memvalidasi Origin (CSRF).
 * Mengembalikan sisa jumlah belum dibaca, atau null kalau gagal (lonceng tetap memakai perubahan lokal).
 */
export async function markNotificationsRead(id?: string): Promise<number | null> {
  const token = await getSessionToken();
  if (!token) return null;

  // id = UUID notifikasi Laravel; selain itu diabaikan (jangan sampai jadi "tandai semua")
  if (id !== undefined && !/^[0-9a-f-]{36}$/i.test(id)) return null;

  try {
    return await markMemberNotificationsRead(token, id);
  } catch (error) {
    console.error("[markNotificationsRead]", error instanceof ApiError ? error.status : error);
    return null;
  }
}
