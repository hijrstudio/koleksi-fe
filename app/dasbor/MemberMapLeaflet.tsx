"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { Maximize, Minimize, Minus, Plus } from "lucide-react";
import clsx from "@/lib/clsx";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { MapPoint } from "./MemberMap";

// Basemap tanpa API key: Esri Gray Canvas (abu-abu, mirip desain) + layer
// label terpisah, dan Esri World Imagery untuk satelit. CARTO dulu dipakai,
// tapi sekarang wajib API key (tile-nya cuma tulisan "API KEY REQUIRED").
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const TILES = {
  map: {
    light: {
      base: `${ESRI}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
      labels: `${ESRI}/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
    },
    dark: {
      base: `${ESRI}/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
      labels: `${ESRI}/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
    },
    attribution:
      'Tiles &copy; <a href="https://www.esri.com">Esri</a> &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
    // Gray Canvas cuma punya tile sampai zoom 16; di atasnya di-scale.
    maxNativeZoom: 16,
  },
  satellite: {
    url: `${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
    attribution:
      'Tiles &copy; <a href="https://www.esri.com">Esri</a> &mdash; Esri, Maxar, Earthstar Geographics',
  },
};

// Pusat & zoom awal: seluruh Indonesia bagian barat-tengah (10 kota dummy).
const INDONESIA_CENTER: L.LatLngTuple = [-3.5, 110];

const PIN_SVG = `<svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 0C4.925 0 0 4.85 0 10.833 0 18.958 11 28 11 28s11-9.042 11-17.167C22 4.85 17.075 0 11 0Z" fill="#f5510b"/><circle cx="11" cy="10.5" r="4.25" fill="#fff"/></svg>`;

function pinIcon(count: number) {
  return L.divIcon({
    className: "member-pin",
    html: `<div class="member-pin__label"><b>${count}</b> anggota</div>${PIN_SVG}`,
    iconSize: [22, 28],
    iconAnchor: [11, 28],
  });
}

/** Geser kamera saat filter Area berubah. */
function FitToPoints({
  points,
  focusArea,
}: {
  points: MapPoint[];
  focusArea: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (focusArea && points.length === 1) {
      map.flyTo([points[0].lat, points[0].lng], 11, { duration: 0.8 });
    } else {
      map.flyToBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])), {
        padding: [48, 48],
        duration: 0.8,
      });
    }
  }, [map, points, focusArea]);
  return null;
}

/** Tombol zoom custom (kanan) -- ganti zoom control bawaan Leaflet. */
function ZoomButtons() {
  const map = useMap();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) L.DomEvent.disableClickPropagation(ref.current);
  }, []);
  return (
    <div
      ref={ref}
      className="absolute top-1/2 right-2.5 z-1000 flex -translate-y-1/2 flex-col overflow-hidden rounded-lg bg-white shadow-md"
    >
      <button
        type="button"
        aria-label="Perbesar peta"
        onClick={() => map.zoomIn()}
        className="flex size-9 items-center justify-center text-koleksi-navy-dark/70 transition hover:bg-muted-light hover:text-koleksi-navy-dark"
      >
        <Plus size={18} />
      </button>
      <span className="mx-2 h-px bg-border-light" />
      <button
        type="button"
        aria-label="Perkecil peta"
        onClick={() => map.zoomOut()}
        className="flex size-9 items-center justify-center text-koleksi-navy-dark/70 transition hover:bg-muted-light hover:text-koleksi-navy-dark"
      >
        <Minus size={18} />
      </button>
    </div>
  );
}

/** Ukuran container berubah (fullscreen) -> Leaflet perlu hitung ulang. */
function InvalidateOnResize({ trigger }: { trigger: boolean }) {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(t);
  }, [map, trigger]);
  return null;
}

export default function MemberMapLeaflet({
  points,
  focusArea,
}: {
  points: MapPoint[];
  focusArea: string | null;
}) {
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [layer, setLayer] = useState<"map" | "satellite">("map");
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () =>
      setFullscreen(document.fullscreenElement === wrapperRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapperRef.current?.requestFullscreen();
  }

  const controlBtn =
    "px-3.5 py-2 text-sm transition first:rounded-l-md last:rounded-r-md";

  return (
    <div ref={wrapperRef} className="relative h-full w-full bg-muted-light">
      <MapContainer
        center={INDONESIA_CENTER}
        zoom={5}
        minZoom={4}
        zoomControl={false}
        scrollWheelZoom={fullscreen}
        className="h-full w-full"
      >
        {layer === "map" ? (
          <>
            <TileLayer
              key={`map-${theme}`}
              url={TILES.map[theme === "dark" ? "dark" : "light"].base}
              attribution={TILES.map.attribution}
              maxNativeZoom={TILES.map.maxNativeZoom}
              maxZoom={18}
            />
            <TileLayer
              key={`labels-${theme}`}
              url={TILES.map[theme === "dark" ? "dark" : "light"].labels}
              maxNativeZoom={TILES.map.maxNativeZoom}
              maxZoom={18}
            />
          </>
        ) : (
          <TileLayer
            key="satellite"
            url={TILES.satellite.url}
            attribution={TILES.satellite.attribution}
            maxZoom={18}
          />
        )}

        {points.map((p) => (
          <Marker
            key={p.name}
            position={[p.lat, p.lng]}
            icon={pinIcon(p.count)}
            title={`${p.name}: ${p.count} anggota`}
            alt={`${p.name}: ${p.count} anggota`}
          />
        ))}

        <FitToPoints points={points} focusArea={focusArea} />
        <ZoomButtons />
        <InvalidateOnResize trigger={fullscreen} />
      </MapContainer>

      {/* Map / Satellite (kiri atas) */}
      <div
        role="group"
        aria-label="Jenis peta"
        className="absolute top-2.5 left-2.5 z-1000 flex rounded-md bg-white shadow-md"
      >
        {(["map", "satellite"] as const).map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={layer === l}
            onClick={() => setLayer(l)}
            className={clsx(
              controlBtn,
              layer === l
                ? "font-semibold text-koleksi-navy-dark"
                : "text-koleksi-navy-dark/60 hover:bg-muted-light",
            )}
          >
            {l === "map" ? "Map" : "Satellite"}
          </button>
        ))}
      </div>

      {/* Fullscreen (kanan atas) */}
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={fullscreen ? "Keluar layar penuh" : "Layar penuh"}
        className="absolute top-2.5 right-2.5 z-1000 flex size-9 items-center justify-center rounded-md bg-white text-koleksi-navy-dark/70 shadow-md transition hover:text-koleksi-navy-dark"
      >
        {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </button>
    </div>
  );
}
