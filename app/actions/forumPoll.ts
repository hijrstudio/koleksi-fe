"use server";

import { getSessionToken } from "@/lib/auth/session";
import { type ForumResult, forumError } from "@/lib/forum/errors";
import { voteForumPoll } from "@/services/forumPoll";
import type { ForumPoll } from "@/types";

/**
 * Pilih / ganti pilihan polling. Server Action → Next.js memeriksa asal request (CSRF); token dari cookie httpOnly.
 * Backend yang menentukan boleh tidaknya (berjalan, opsi milik polling ini, voting hanya sekali).
 */
export async function votePollAction(pollId: number, optionId: number): Promise<ForumResult<ForumPoll>> {
  const token = await getSessionToken();
  if (!token) return { ok: false, status: 401, message: "Sesi Anda berakhir. Silakan masuk lagi." };
  if (!Number.isSafeInteger(pollId) || pollId < 1 || !Number.isSafeInteger(optionId) || optionId < 1) {
    return { ok: false, status: 422, message: "Pilihan tidak valid." };
  }

  try {
    return { ok: true, data: await voteForumPoll(token, pollId, optionId) };
  } catch (error) {
    const result = forumError(error, "Gagal menyimpan pilihan. Coba lagi.");
    // forumError menyebut "Diskusi" untuk 404; di sini yang tidak ada adalah polling-nya
    return !result.ok && result.status === 404 ? { ...result, message: "Polling tidak ditemukan atau sudah dihapus." } : result;
  }
}
