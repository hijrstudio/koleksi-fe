import type { GarageSort } from "@/types";

// Data merek & kendaraan diambil dari API (services/evGarage.ts, dikelola di CMS
// EV Garage); file ini hanya konstanta tampilan.

/** Harus sama dengan default per_page di backend (EvGarageIndexRequest). */
export const GARAGE_PER_PAGE = 18;

export const SORT_OPTIONS: { label: string; value: GarageSort }[] = [
  { label: "A–Z", value: "asc" },
  { label: "Z–A", value: "desc" },
];
