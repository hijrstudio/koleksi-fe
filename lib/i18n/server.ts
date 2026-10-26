import { lang } from "next/root-params";
import { notFound, redirect } from "next/navigation";
import type { Locale } from "@/types";
import { isLocale, localizePath } from "./config";
import { loadDictionary } from "./dictionaries";
import type { Dictionary } from "./dictionaries/types";

/**
 * Bahasa halaman yang sedang dirender (segmen app/[lang]). Hanya untuk Server Component — Client Component
 * memakai useI18n(); Server Action & Route Handler memakai requestLocale() (lib/i18n/request.ts).
 */
export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  return loadDictionary(locale ?? (await getLocale()));
}

/** redirect() ke path internal dalam bahasa halaman saat ini ("/masuk" → "/en/masuk" untuk English). */
export async function localizedRedirect(path: string): Promise<never> {
  redirect(localizePath(path, await getLocale()));
}
