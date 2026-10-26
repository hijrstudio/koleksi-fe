"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { useI18n } from "@/components/i18n/I18nProvider";
import { MAP_BRANDS, MAP_CITIES, MEMBER_COUNTS } from "./data";

// Leaflet butuh `window` -- render di client saja.
const MemberMapLeaflet = dynamic(() => import("./MemberMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-muted-light dark:bg-muted-dark" />
  ),
});

export interface MapPoint {
  name: string;
  lat: number;
  lng: number;
  count: number;
}

export default function MemberMap() {
  const { t } = useI18n();
  const m = t.dashboard.map;
  const ALL_AREA = m.allAreas;
  const ALL_BRAND = m.allBrands;
  const [area, setArea] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);

  // Di-memo: referensi array stabil supaya peta cuma "terbang" saat filter
  // benar-benar berubah, bukan tiap render.
  const points: MapPoint[] = useMemo(
    () =>
      MAP_CITIES.filter((c) => !area || c.name === area)
        .map((c) => ({
          ...c,
          count: brand
            ? MEMBER_COUNTS[c.name][brand]
            : Object.values(MEMBER_COUNTS[c.name]).reduce((a, b) => a + b, 0),
        }))
        .filter((p) => p.count > 0),
    [area, brand],
  );

  const total = points.reduce((sum, p) => sum + p.count, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5">
        <FilterDropdown
          label={m.area}
          options={[ALL_AREA, ...MAP_CITIES.map((c) => c.name)]}
          value={area}
          onChange={(v) => setArea(v === ALL_AREA ? null : v)}
        />
        <FilterDropdown
          label={m.brand}
          options={[ALL_BRAND, ...MAP_BRANDS]}
          value={brand}
          onChange={(v) => setBrand(v === ALL_BRAND ? null : v)}
        />
        <p
          aria-live="polite"
          className="ml-auto text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/60"
        >
          <span className="font-bold text-koleksi-navy-dark dark:text-ink-dark">
            {total}
          </span>{" "}
          {m.members}
          {area ? m.inArea.replace("{area}", area) : ""}
          {brand ? ` · ${brand}` : ""}
        </p>
      </div>

      {/* isolate: z-index pane Leaflet (400+) gak boleh nembus Header sticky. */}
      <div className="isolate mt-4 h-80 overflow-hidden rounded-xl">
        <MemberMapLeaflet points={points} focusArea={area} />
      </div>
    </div>
  );
}
