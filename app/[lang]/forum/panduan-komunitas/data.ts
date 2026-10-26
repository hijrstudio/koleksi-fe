export interface Panduan {
  id: string;
  slug: string;
  title: string;
  category: string;
}

export const KATEGORI_ALL = "Semua";
export const KATEGORI_OPTIONS = [KATEGORI_ALL, "Umum", "Pembayaran", "Glosarium"];

// Mock -- ganti dengan data dari API saat backend forum sudah ada.
export const panduanList: Panduan[] = [
  {
    id: "pnd-1",
    slug: "panduan-komunitas-koleksi-2026",
    title: "Panduan Komunitas KOLEKSI 2026",
    category: "Umum",
  },
  {
    id: "pnd-2",
    slug: "panduan-pembayaran",
    title: "Panduan Pembayaran",
    category: "Pembayaran",
  },
  {
    id: "pnd-3",
    slug: "ev-glossary",
    title: "EV Glossary",
    category: "Glosarium",
  },
];
