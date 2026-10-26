"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types";
import { localizePath, splitLocale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

interface I18nValue {
  locale: Locale;
  t: Dictionary;
}

const I18nContext = createContext<I18nValue | null>(null);

/** Dipasang di app/[lang]/layout.tsx: bahasa aktif + dictionary-nya untuk Client Component. */
export default function I18nProvider({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: dictionary }}>{children}</I18nContext.Provider>;
}

/** `t` = dictionary bahasa aktif, `locale` = "id" | "en". */
export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n() harus dipakai di dalam <I18nProvider>");
  return value;
}

/** Fungsi pembuat path internal sesuai bahasa aktif: localize("/kegiatan") → "/en/kegiatan" (English). */
export function useLocalizePath(): (path: string) => string {
  const { locale } = useI18n();
  return useCallback((path: string) => localizePath(path, locale), [locale]);
}

/** Path halaman saat ini tanpa prefix bahasa ("/en/forum/diskusi" → "/forum/diskusi"), untuk menandai menu aktif. */
export function useBarePathname(): string {
  return splitLocale(usePathname()).path;
}

// Server Component: impor `format` langsung dari "@/lib/i18n/config" (file ini "use client").
export { format } from "@/lib/i18n/config";
