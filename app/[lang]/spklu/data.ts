import type { SpkluSort } from "@/types";

// Data operator diambil dari API (services/spklu.ts); file ini hanya konstanta tampilan.

/** Harus sama dengan default per_page di backend (SpkluOperatorIndexRequest). */
export const SPKLU_PER_PAGE = 10;

export const SORT_OPTIONS: { label: string; value: SpkluSort }[] = [
  { label: "A–Z", value: "asc" },
  { label: "Z–A", value: "desc" },
];
