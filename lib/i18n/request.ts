import "server-only";

import { headers } from "next/headers";
import type { Locale } from "@/types";
import { DEFAULT_LOCALE, isLocale, splitLocale } from "./config";
import { loadDictionary } from "./dictionaries";
import type { Dictionary } from "./dictionaries/types";

/**
 * Bahasa untuk Server Action & Route Handler (next/root-params tidak tersedia di sana).
 * Urutan: nilai eksplisit (mis. field form `lang` / query `?lang=`) → halaman asal (Referer, same-origin) →
 * default Indonesia.
 */
export async function requestLocale(explicit?: unknown): Promise<Locale> {
  if (isLocale(explicit)) return explicit;

  const referer = (await headers()).get("referer");
  if (referer) {
    try {
      return splitLocale(new URL(referer).pathname).locale;
    } catch {
      // Referer tidak valid: pakai default
    }
  }

  return DEFAULT_LOCALE;
}

/** requestLocale() + dictionary-nya sekaligus. */
export async function requestI18n(explicit?: unknown): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await requestLocale(explicit);
  return { locale, t: await loadDictionary(locale) };
}
