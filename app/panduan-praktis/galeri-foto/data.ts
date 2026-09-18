export interface GaleriAlbum {
  id: string;
  title: string;
  date: string;
  photos: string[];
}

const albumTemplates: { title: string; photos: string[] }[] = [
  {
    title: "Komunitas & Media Gathering",
    photos: [
      "/images/kegiatan-2.png",
      "/images/kegiatan-1.png",
      "/images/kegiatan-3.png",
      "/images/kegiatan-4.png",
    ],
  },
  {
    title: "Turing Siaga Kesiapan SPKLU PLN",
    photos: [
      "/images/kegiatan-1.png",
      "/images/kegiatan-3.png",
      "/images/kegiatan-2.png",
    ],
  },
  {
    title: "KOLEKSI Goes to IIMS 2026",
    photos: [
      "/images/kegiatan-3.png",
      "/images/kegiatan-4.png",
      "/images/kegiatan-1.png",
      "/images/kegiatan-2.png",
      "/images/kegiatan-3.png",
    ],
  },
  {
    title: "Mini Touring Jakarta-Bogor",
    photos: [
      "/images/kegiatan-4.png",
      "/images/kegiatan-2.png",
      "/images/kegiatan-1.png",
    ],
  },
];

export const GALERI_PER_PAGE = 6;
const TOTAL_ALBUMS = 24;

/** Newer items first -- day offset shrinks as index grows. */
function dateFor(index: number): string {
  const date = new Date(2026, 7, 31 - index);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const galeriAlbums: GaleriAlbum[] = Array.from(
  { length: TOTAL_ALBUMS },
  (_, i) => {
    const base = albumTemplates[i % albumTemplates.length];
    return {
      ...base,
      id: `galeri-${i + 1}`,
      date: dateFor(i),
    };
  },
);
