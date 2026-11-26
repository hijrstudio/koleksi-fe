import { format } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import type { ForumPoll } from "@/types";

export const FILTER_VOTING = "Voting";
export const FILTER_POLLING = "Polling";

/**
 * Status di bawah polling: "Hasil akhir" (selesai), sisa waktu ("23 jam lagi"), atau "Berlangsung" (tanpa batas).
 * `now` dikirim dari server saat halaman dirender supaya teks server & browser sama (tidak hydration mismatch).
 */
export function pollStatus(poll: ForumPoll, now: number, t: Dictionary): string {
  if (poll.phase === "ended") return t.forum.finalResult;
  if (!poll.ends_at) return t.forum.ongoing;

  const minutes = Math.max(1, Math.ceil((new Date(poll.ends_at).getTime() - now) / 60_000));
  if (minutes < 60) return format(t.forum.endsInMinutes, { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return format(t.forum.endsInHours, { count: hours });
  return format(t.forum.endsInDays, { count: Math.floor(hours / 24) });
}
