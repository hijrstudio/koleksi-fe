/**
 * Kategori berita (enum App\Enums\NewsCategory di backend).
 * `slug` dipakai di URL website: /berita?tags=berita-ev
 */
export type NewsCategoryValue = "news_release" | "ev_news" | "coverage";

/** `labelKey` = kunci label di dictionary (t.nav.*). */
export const NEWS_CATEGORIES: { value: NewsCategoryValue; slug: string; labelKey: "newsRelease" | "coverage" | "evNews" }[] = [
  { value: "news_release", slug: "news-release", labelKey: "newsRelease" },
  { value: "coverage", slug: "liputan", labelKey: "coverage" },
  { value: "ev_news", slug: "berita-ev", labelKey: "evNews" },
];

/** "berita-ev" -> "ev_news"; slug tidak dikenal -> null (semua kategori). */
export function newsCategoryFromSlug(slug: string | null | undefined): NewsCategoryValue | null {
  return NEWS_CATEGORIES.find((c) => c.slug === slug)?.value ?? null;
}

/** Urutan kategori di sidebar /berita & menu Header. */
export const NEWS_SIDEBAR_ORDER: NewsCategoryValue[] = ["news_release", "ev_news", "coverage"];

/** News Release tampil sebagai teks hijau, kategori lain sebagai badge kuning. */
export function isNewsBadge(value: NewsCategoryValue): boolean {
  return value !== "news_release";
}
