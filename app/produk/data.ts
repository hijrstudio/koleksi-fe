export const TAB_ALL = "Semua";
export const TAB_EV = "EV (Mobil Listrik)";
export const TAB_AKSESORIS = "Aksesoris & Charger";
export const TAB_OPTIONS = [TAB_ALL, TAB_EV, TAB_AKSESORIS] as const;
export type ProdukTab = (typeof TAB_OPTIONS)[number];

export const SORT_OPTIONS = ["Terbaru", "Terlama", "Terpopuler"] as const;
export type ProdukSort = (typeof SORT_OPTIONS)[number];

export const PRODUK_PER_PAGE = 6;

export interface Produk {
  id: string;
  /** Dipakai di URL /produk/[slug]. */
  slug: string;
  name: string;
  /** Rupiah -- harga terendah (atau harga tunggal). */
  price: number;
  /** Harga tertinggi kalau produk punya rentang harga (varian). */
  priceMax?: number;
  category: typeof TAB_EV | typeof TAB_AKSESORIS;
  /** Gambar utama (kartu di katalog). */
  image: string;
  /** Gambar detail (halaman /produk/[slug]); kosong = pakai `image` saja. */
  images?: string[];
  /** Paragraf ringkasan; kosong = defaultProdukSummary. */
  summary?: string[];
  /** Link marketplace; kosong = halaman utama marketplace (dummy). */
  shopeeUrl?: string;
  tokopediaUrl?: string;
  /** Slug produk untuk "Produk Lainnya"; kosong = otomatis (kategori sama dulu). */
  relatedSlugs?: string[];
  /** true = tampil "Stok Habis" menggantikan harga. */
  soldOut: boolean;
  /** ISO (YYYY-MM-DD) -- dasar urutan Terbaru/Terlama. */
  createdAt: string;
  /** Skor popularitas (mis. jumlah terjual) -- dasar urutan Terpopuler. */
  popularity: number;
}

export const DEFAULT_SHOPEE_URL = "https://shopee.co.id";
export const DEFAULT_TOKOPEDIA_URL = "https://www.tokopedia.com";

export const defaultProdukSummary = [
  "Komunitas Mobil Elektrik Indonesia (KOLEKSI), merupakan perkumpulan otomotif, wadah silaturahmi dan komunikasi pemilik, pengguna dan pemerhati/pecinta mobil listrik di Indonesia.",
  "KOLEKSI memposisikan diri sebagai mitra produsen dan pemerintah dalam edukasi, literasi, dan sosialisasi Mobil Listrik. Bagi anggota, KOLEKSI menjadi sumber informasi dalam penggunaan dan perawatan mobil listrik.",
];

// Mock -- ganti dengan data dari API saat backend produk sudah ada.
const PHOTOS = [
  "/images/sample-image1.png",
  "/images/sample-image2.png",
  "/images/sample-image3.png",
];

// EV 001 paling baru (& habis) supaya halaman 1 tab "Semua" urutan
// "Terbaru" sama dengan desain: EV 001 - EV 006.
const evPrices = [
  428_000_000, 385_000_000, 429_000_000, 512_000_000, 649_000_000,
  719_000_000, 100_000_000, 355_000_000, 468_000_000, 579_000_000,
  689_000_000, 795_000_000,
];

const evList: Produk[] = evPrices.map((price, i) => {
  const n = String(i + 1).padStart(3, "0");
  return {
    id: `ev-${n}`,
    slug: `ev-${n}`,
    name: `EV ${n}`,
    price,
    // EV 007 punya rentang harga (varian) -- sesuai halaman detail di desain.
    priceMax: i === 6 ? 123_000_000 : undefined,
    category: TAB_EV,
    image: PHOTOS[0],
    // Jumlah gambar detail bervariasi: 3, 2, 1, 3, 2, 1, ...
    images: PHOTOS.slice(0, 3 - (i % 3)),
    // EV 007 (desain): produk lainnya = tiga charger.
    relatedSlugs:
      i === 6
        ? ["charger-ev-10kw-promo", "ev-charger-1mw", "ev-charger-1gw"]
        : undefined,
    soldOut: i === 0,
    createdAt: `2026-09-${String(20 - i).padStart(2, "0")}`,
    popularity: [42, 58, 31, 77, 25, 64, 90, 18, 53, 36, 71, 47][i],
  };
});

const aksesorisSeed = [
  ["Wall Charger 7 kW", 6_500_000, 88, false],
  ["Kabel Charging Type 2 (5 m)", 1_250_000, 120, false],
  ["Portable Charger 3,5 kW", 4_850_000, 66, false],
  ["Adapter CCS2", 2_100_000, 39, false],
  ["Tas Kabel Charging", 285_000, 74, false],
  ["Cover Mobil EV", 750_000, 28, false],
  ["Kaos KOLEKSI", 150_000, 210, false],
  ["Topi KOLEKSI", 95_000, 133, false],
  ["Tumbler KOLEKSI", 125_000, 97, false],
  ["Stiker Pack KOLEKSI", 35_000, 185, true],
  ["Lanyard KOLEKSI", 45_000, 61, false],
  ["Gantungan Kunci KOLEKSI", 40_000, 79, false],
  // Tiga produk di bawah = "Produk Lainnya" pada halaman detail di desain.
  ["Charger EV - 10KW (Promo)", 10_000_000, 55, false],
  ["EV Charger - 1MW", 100_000_000, 22, false],
  ["EV Charger - 1GW", 1_000_000_000, 9, false],
] as const;

const aksesorisList: Produk[] = aksesorisSeed.map(
  ([name, price, popularity, soldOut], i) => ({
    id: `aks-${String(i + 1).padStart(3, "0")}`,
    slug: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    name,
    price,
    category: TAB_AKSESORIS,
    image: PHOTOS[1 + (i % 2)],
    images: PHOTOS.slice(1, 1 + (i % 2 === 0 ? 2 : 1)),
    soldOut,
    createdAt: `2026-08-${String(30 - i).padStart(2, "0")}`,
    popularity,
  }),
);

export const produkList: Produk[] = [...evList, ...aksesorisList];
