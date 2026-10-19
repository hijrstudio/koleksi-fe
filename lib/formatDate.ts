import type { Locale } from "@/types";

/**
 * ISO datetime dari API -> tanggal WIB.
 *   month "short": "15 Sep 2026"   month "long": "15 September 2026"
 */
export default function formatDate(
  iso: string | null,
  locale: Locale = "id",
  month: "short" | "long" = "short",
): string {
  if (!iso) return "";

  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", {
    day: "numeric",
    month,
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

/** Tanggal murni "Y-m-d" (tanpa jam) -> "17 Agustus 2026", tanpa bergeser karena zona waktu. */
export function formatPlainDate(
  ymd: string | null,
  locale: Locale = "id",
  month: "short" | "long" = "long",
): string {
  if (!ymd) return "";

  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", {
    day: "numeric",
    month,
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${ymd}T00:00:00Z`));
}
