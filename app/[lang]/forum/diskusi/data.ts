import { formatPlainDate } from "@/lib/formatDate";
import type { ForumComment, Locale } from "@/types";

/** Gambar daftar/detail untuk diskusi tanpa gambar sampul. */
export const DEFAULT_DISCUSSION_IMAGE = "/images/sample-image1.png";

/**
 * "2026-08-01" / ISO lengkap -> "1 Agu 2026" (English: "1 Aug 2026"). ISO dengan jam (UTC dari API) dihitung di
 * WIB, supaya diskusi malam hari tidak tampil di tanggal berikutnya/sebelumnya.
 */
export function formatTanggal(iso: string, locale: Locale = "id") {
  const ymd = iso.length > 10 ? new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }) : iso;
  return formatPlainDate(ymd, locale, "short");
}

/** Jumlah komentar + semua balasannya. */
export function countComments(list: ForumComment[]): number {
  return list.reduce((sum, c) => sum + 1 + countComments(c.replies), 0);
}
