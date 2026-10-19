/**
 * Kategori berita (enum App\Enums\NewsCategory di backend).
 * `slug` dipakai di URL website: /panduan-praktis/berita?tags=berita-ev
 */
export type NewsCategoryValue = "news_release" | "ev_news" | "coverage";

export const NEWS_CATEGORIES: { value: NewsCategoryValue; slug: string; label: string }[] = [
  { value: "news_release", slug: "news-release", label: "News Release" },
  { value: "coverage", slug: "liputan", label: "Liputan" },
  { value: "ev_news", slug: "berita-ev", label: "Berita EV" },
];

/** "berita-ev" -> "ev_news"; slug tidak dikenal -> null (semua kategori). */
export function newsCategoryFromSlug(slug: string | null | undefined): NewsCategoryValue | null {
  return NEWS_CATEGORIES.find((c) => c.slug === slug)?.value ?? null;
}

/** News Release tampil sebagai teks hijau, kategori lain sebagai badge kuning. */
export function isNewsBadge(value: NewsCategoryValue): boolean {
  return value !== "news_release";
}
