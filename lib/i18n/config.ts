import type { Locale } from "@/types";

/**
 * Website dua bahasa. Indonesia = default TANPA prefix (koleksi.club/kegiatan), English di bawah /en
 * (koleksi.club/en/kegiatan). Slug tetap bahasa Indonesia di kedua bahasa.
 *
 * Halaman ada di app/[lang]/…; rewrites() di next.config.ts menulis ulang URL tanpa prefix ke /id/… (tidak
 * terlihat di browser), proxy.ts mengarahkan /id/… ke versi tanpa prefix.
 * File ini dipakai server & client.
 */
export const LOCALES = ["id", "en"] as const satisfies readonly Locale[];

export const DEFAULT_LOCALE: Locale = "id";

/** Locale yang URL-nya diberi prefix (selain default). */
export const PREFIXED_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Path internal yang tidak boleh diberi prefix bahasa (API, aset). */
function isUnlocalizedPath(path: string): boolean {
  return /^\/(api|_next|images|videos|fonts)(\/|$)/.test(path) || /\.[a-z0-9]{2,5}($|\?)/i.test(path);
}

/**
 * "/kegiatan?x=1" → "/en/kegiatan?x=1" untuk English; Indonesia tidak diubah.
 * Hanya path internal absolut ("/…"); URL eksternal, "#anchor", mailto:, dll. dikembalikan apa adanya.
 */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//") || isUnlocalizedPath(path)) return path;

  const { path: bare } = splitLocale(path);
  if (locale === DEFAULT_LOCALE) return bare;

  return bare === "/" ? `/${locale}` : bare.startsWith("/?") || bare.startsWith("/#") ? `/${locale}${bare.slice(1)}` : `/${locale}${bare}`;
}

/** "/en/kegiatan" → { locale: "en", path: "/kegiatan" }; "/kegiatan" → { locale: "id", path: "/kegiatan" }. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return { locale, path: "/" };
    if (pathname.startsWith(`/${locale}/`) || pathname.startsWith(`/${locale}?`) || pathname.startsWith(`/${locale}#`)) {
      const rest = pathname.slice(locale.length + 1);
      return { locale, path: rest.startsWith("/") ? rest : `/${rest}` };
    }
  }

  return { locale: DEFAULT_LOCALE, path: pathname };
}

/** Isi placeholder {nama} di teks dictionary: format("Halo {name}", { name: "Budi" }). */
export function format(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Tag bahasa untuk <html lang> & Intl. */
export const HTML_LANG: Record<Locale, string> = { id: "id", en: "en" };
