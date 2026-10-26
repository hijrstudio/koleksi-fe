import type { Locale } from "@/types";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  id: () => import("./id").then((m) => m.default),
  en: () => import("./en").then((m) => m.default),
};

/** Dictionary untuk bahasa tertentu — aman dipakai di mana saja di server (Server Action, Route Handler). */
export function loadDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
