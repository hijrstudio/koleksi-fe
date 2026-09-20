export interface DiskusiItem {
  id: string;
  slug: string;
  author: string;
  /** ISO (YYYY-MM-DD) supaya bisa diurutkan; tampilkan lewat formatTanggal(). */
  date: string;
  tag: string;
  title: string;
  comments: number;
  views: number;
  image: string;
}

export interface TrendingTopic {
  id: string;
  title: string;
  date: string;
}

export interface ActiveMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const BULAN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

/** "2026-08-01" -> "1 Agu 2026" */
export function formatTanggal(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${BULAN[m - 1]} ${y}`;
}

// Mock -- ganti dengan data dari API saat backend forum sudah ada.
const IMAGE = "/images/sample-image1.png";

export const diskusiItems: DiskusiItem[] = [
  {
    id: "dsk-1",
    slug: "apakah-ev-pilihan-tepat-sebagai-mobil-pertama",
    author: "User",
    date: "2026-08-01",
    tag: "Kendaraan",
    title: "Apakah EV Pilihan Tepat Sebagai Mobil Pertama?",
    comments: 0,
    views: 1000,
    image: IMAGE,
  },
  {
    id: "dsk-2",
    slug: "charging-101-cara-charging-di-rumah-dan-publik",
    author: "User",
    date: "2026-08-01",
    tag: "Infrastruktur",
    title: "Charging 101: Cara Charging di Rumah & Publik",
    comments: 0,
    views: 1000,
    image: IMAGE,
  },
  {
    id: "dsk-3",
    slug: "biaya-dan-insentif-hitung-biaya-kepemilikan-ev",
    author: "User",
    date: "2026-08-01",
    tag: "Kendaraan",
    title: "Biaya & Insentif: Hitung Biaya Kepemilikan EV",
    comments: 0,
    views: 1000,
    image: IMAGE,
  },
  {
    id: "dsk-4",
    slug: "perawatan-ev",
    author: "User",
    date: "2026-08-01",
    tag: "Teknologi",
    title: "Perawatan EV",
    comments: 0,
    views: 1000,
    image: IMAGE,
  },
  {
    id: "dsk-5",
    slug: "panduan-praktis-seputar-kendaraan-listrik",
    author: "User",
    date: "2026-08-01",
    tag: "Kendaraan",
    title: "Panduan Praktis Seputar Kendaraan Listrik",
    comments: 0,
    views: 1000,
    image: IMAGE,
  },
  {
    id: "dsk-6",
    slug: "polling-apakah-ev-pilihan-tepat-sebagai-mobil-pertama",
    author: "User",
    date: "2026-08-01",
    tag: "OOT",
    title: "Polling: Apakah EV Pilihan Tepat Sebagai Mobil Pertama?",
    comments: 0,
    views: 1000,
    image: IMAGE,
  },
  {
    id: "dsk-7",
    slug: "charging-101-cara-charging-di-rumah-dan-publik-infra",
    author: "User",
    date: "2026-08-01",
    tag: "Infra",
    title: "Charging 101: Cara Charging di Rumah & Publik",
    comments: 0,
    views: 1000,
    image: IMAGE,
  },
  {
    id: "dsk-8",
    slug: "biaya-dan-insentif-hitung-biaya-kepemilikan-ev-bisnis",
    author: "User",
    date: "2026-08-01",
    tag: "Bisnis",
    title: "Biaya & Insentif: Hitung Biaya Kepemilikan EV",
    comments: 0,
    views: 1000,
    image: IMAGE,
  },
  {
    id: "dsk-9",
    slug: "perawatan-ev-kendaraan",
    author: "User",
    date: "2026-08-01",
    tag: "Kendaraan",
    title: "Perawatan EV",
    comments: 0,
    views: 1000,
    image: IMAGE,
  },
  {
    id: "dsk-10",
    slug: "panduan-praktis-seputar-kendaraan-listrik-kendaraan",
    author: "User",
    date: "2026-08-01",
    tag: "Kendaraan",
    title: "Panduan Praktis Seputar Kendaraan Listrik",
    comments: 3,
    views: 1000,
    image: IMAGE,
  },
  // Dua item di bawah cuma supaya tombol "Muat lebih banyak" muncul.
  {
    id: "dsk-11",
    slug: "cara-membaca-spesifikasi-baterai-ev",
    author: "User",
    date: "2026-07-30",
    tag: "Teknologi",
    title: "Cara Membaca Spesifikasi Baterai EV",
    comments: 1,
    views: 820,
    image: IMAGE,
  },
  {
    id: "dsk-12",
    slug: "rekomendasi-lokasi-charging-station-jabodetabek",
    author: "User",
    date: "2026-07-28",
    tag: "Infrastruktur",
    title: "Rekomendasi Lokasi Charging Station di Jabodetabek",
    comments: 5,
    views: 640,
    image: IMAGE,
  },
];

export const TAG_OPTIONS = [
  "Kendaraan",
  "Infrastruktur",
  "Infra",
  "Teknologi",
  "Bisnis",
  "OOT",
];

export const trendingTopics: TrendingTopic[] = [
  {
    id: "trend-1",
    title: "Apakah EV Pilihan Tepat Sebagai Mobil Pertama?",
    date: "31 Agustus 2026",
  },
  {
    id: "trend-2",
    title: "Charging 101: Cara Charging di Rumah & Publik",
    date: "31 Agustus 2026",
  },
  {
    id: "trend-3",
    title: "Biaya & Insentif: Hitung Biaya Kepemilikan EV",
    date: "31 Agustus 2026",
  },
  { id: "trend-4", title: "Perawatan EV", date: "31 Agustus 2026" },
  {
    id: "trend-5",
    title: "Panduan Praktis Seputar Kendaraan Listrik",
    date: "31 Agustus 2026",
  },
];

export const activeMembers: ActiveMember[] = [
  { id: "mem-1", name: "Nikola Tesla", role: "Member", avatar: "/images/profil-1.jpg" },
  { id: "mem-2", name: "Thomas Edison", role: "Member", avatar: "/images/profil-2.jpg" },
  { id: "mem-3", name: "Elon Musk", role: "Member", avatar: "/images/profil-1.jpg" },
  { id: "mem-4", name: "Nikola T.", role: "Member", avatar: "/images/profil-2.jpg" },
  { id: "mem-5", name: "Thomas A.E.", role: "Member", avatar: "/images/profil-1.jpg" },
  { id: "mem-6", name: "Elon M.", role: "Member", avatar: "/images/profil-2.jpg" },
  { id: "mem-7", name: "Tesla", role: "Member", avatar: "/images/profil-1.jpg" },
  { id: "mem-8", name: "Edison", role: "Member", avatar: "/images/profil-2.jpg" },
];
