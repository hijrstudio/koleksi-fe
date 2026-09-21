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
  /** Rating rata-rata 0-5 (boleh pecahan) dan jumlah pemberi rating. */
  rating?: number;
  ratingCount?: number;
  /** Paragraf isi diskusi; default ke defaultContent. */
  content?: string[];
}

export interface DiskusiComment {
  id: string;
  author: string;
  /** "Member" | "Moderator" | "n00b" | ... -- lihat RoleBadge. */
  role: string;
  avatar: string;
  text: string;
  replies: DiskusiComment[];
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

const rawDiskusiItems: Omit<DiskusiItem, "comments">[] = [
  {
    id: "dsk-1",
    slug: "apakah-ev-pilihan-tepat-sebagai-mobil-pertama",
    author: "User",
    date: "2026-08-01",
    tag: "Kendaraan",
    title: "Apakah EV Pilihan Tepat Sebagai Mobil Pertama?",
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
    views: 640,
    image: IMAGE,
  },
];

export const defaultContent = [
  "Komunitas Mobil Elektrik Indonesia (KOLEKSI), merupakan perkumpulan otomotif, wadah silaturahmi dan komunikasi pemilik, pengguna dan pemerhati/pecinta mobil listrik di Indonesia.",
  "KOLEKSI memposisikan diri sebagai mitra produsen dan pemerintah dalam edukasi, literasi, dan sosialisasi Mobil Listrik. Bagi anggota, KOLEKSI menjadi sumber informasi dalam penggunaan dan perawatan mobil listrik.",
];

// Rating per diskusi (mock). Diskusi tanpa entri = belum ada yang memberi rating.
const ratingsBySlug: Record<string, { rating: number; count: number }> = {
  "apakah-ev-pilihan-tepat-sebagai-mobil-pertama": { rating: 4.5, count: 128 },
  "charging-101-cara-charging-di-rumah-dan-publik": { rating: 4, count: 86 },
  "biaya-dan-insentif-hitung-biaya-kepemilikan-ev": { rating: 5, count: 42 },
  "perawatan-ev": { rating: 3.5, count: 27 },
  "panduan-praktis-seputar-kendaraan-listrik": { rating: 4.2, count: 64 },
  "polling-apakah-ev-pilihan-tepat-sebagai-mobil-pertama": {
    rating: 3,
    count: 19,
  },
  "charging-101-cara-charging-di-rumah-dan-publik-infra": {
    rating: 4.8,
    count: 210,
  },
  "biaya-dan-insentif-hitung-biaya-kepemilikan-ev-bisnis": {
    rating: 2.5,
    count: 11,
  },
  "perawatan-ev-kendaraan": { rating: 4, count: 57 },
  "panduan-praktis-seputar-kendaraan-listrik-kendaraan": {
    rating: 4,
    count: 100,
  },
};

const AVATAR_1 = "/images/profil-1.jpg";
const AVATAR_2 = "/images/profil-2.jpg";

// Komentar awal per diskusi (mock). Diskusi tanpa entri di sini = belum ada
// komentar. Jumlah `comments` di diskusiItems dihitung dari sini (termasuk
// semua balasan), jadi tidak perlu diisi manual.
export const commentsBySlug: Record<string, DiskusiComment[]> = {
  "apakah-ev-pilihan-tepat-sebagai-mobil-pertama": [
    {
      id: "c1-1",
      author: "Nikola Tesla",
      role: "Member",
      avatar: AVATAR_1,
      text: "Menurut saya EV cocok jadi mobil pertama kalau Anda punya tempat charging di rumah. Biaya per kilometernya jauh lebih murah dibanding BBM.",
      replies: [
        {
          id: "c1-2",
          author: "Tesla",
          role: "Moderator",
          avatar: AVATAR_1,
          text: "Setuju. Pastikan juga daya listrik rumah cukup, minimal 4.400 VA untuk home charger 3,7 kW.",
          replies: [
            {
              id: "c1-3",
              author: "Nikola Tesla",
              role: "Member",
              avatar: AVATAR_1,
              text: "Terima kasih infonya, saya cek dulu daya listrik di rumah.",
              replies: [],
            },
          ],
        },
        {
          id: "c1-4",
          author: "Elon Musk",
          role: "Member",
          avatar: AVATAR_1,
          text: "Untuk pemakaian dalam kota sangat nyaman, tapi kalau sering ke luar kota perlu cek lokasi SPKLU dulu.",
          replies: [],
        },
      ],
    },
    {
      id: "c1-5",
      author: "Thomas Edison",
      role: "n00b",
      avatar: AVATAR_2,
      text: "Kalau budget di bawah 300 juta, ada rekomendasi EV yang bagus?",
      replies: [
        {
          id: "c1-6",
          author: "Tesla",
          role: "Moderator",
          avatar: AVATAR_1,
          text: "Coba lihat thread Biaya & Insentif, di sana ada perbandingan beberapa model beserta insentifnya.",
          replies: [],
        },
      ],
    },
  ],
  "charging-101-cara-charging-di-rumah-dan-publik": [
    {
      id: "c2-1",
      author: "Elon Musk",
      role: "Member",
      avatar: AVATAR_1,
      text: "Home charging paling praktis, tinggal colok malam hari. Untuk charging publik saya pakai PLN Mobile buat cek ketersediaan.",
      replies: [
        {
          id: "c2-2",
          author: "Tesla",
          role: "Moderator",
          avatar: AVATAR_1,
          text: "Betul, jangan lupa cek juga jenis konektornya (CCS2 atau Type 2) sebelum berangkat.",
          replies: [],
        },
      ],
    },
  ],
  "biaya-dan-insentif-hitung-biaya-kepemilikan-ev": [
    {
      id: "c3-1",
      author: "Nikola Tesla",
      role: "Member",
      avatar: AVATAR_1,
      text: "Hitungan saya, biaya listrik sekitar Rp 400 ribu untuk 1.000 km, jauh lebih hemat dari bensin.",
      replies: [],
    },
    {
      id: "c3-2",
      author: "Thomas Edison",
      role: "n00b",
      avatar: AVATAR_2,
      text: "Bagaimana dengan biaya penggantian baterai di kemudian hari?",
      replies: [
        {
          id: "c3-3",
          author: "Elon Musk",
          role: "Member",
          avatar: AVATAR_1,
          text: "Rata-rata garansi baterai 8 tahun atau 160.000 km, jadi aman untuk jangka menengah.",
          replies: [],
        },
      ],
    },
    {
      id: "c3-4",
      author: "Edison",
      role: "n00b",
      avatar: AVATAR_2,
      text: "👍Terima kasih, sangat membantu!",
      replies: [],
    },
  ],
  "panduan-praktis-seputar-kendaraan-listrik": [
    {
      id: "c5-1",
      author: "Tesla",
      role: "Moderator",
      avatar: AVATAR_1,
      text: "Thread ini kami pin sebagai panduan awal untuk anggota baru. Silakan bertanya di kolom komentar.",
      replies: [
        {
          id: "c5-2",
          author: "Edison",
          role: "n00b",
          avatar: AVATAR_2,
          text: "Siap, terima kasih Kak Moderator!",
          replies: [],
        },
      ],
    },
  ],
  "polling-apakah-ev-pilihan-tepat-sebagai-mobil-pertama": [
    {
      id: "c6-1",
      author: "Elon M.",
      role: "Member",
      avatar: AVATAR_2,
      text: "Voting: ya, tapi dengan catatan punya tempat charging di rumah.",
      replies: [],
    },
    {
      id: "c6-2",
      author: "Thomas A.E.",
      role: "Member",
      avatar: AVATAR_1,
      text: "Saya pilih tidak dulu, masih menunggu infrastruktur di daerah saya.",
      replies: [
        {
          id: "c6-3",
          author: "Nikola T.",
          role: "Member",
          avatar: AVATAR_2,
          text: "Di daerah mana, Kak? Mungkin ada SPKLU terdekat yang belum terdata.",
          replies: [],
        },
      ],
    },
    {
      id: "c6-4",
      author: "Tesla",
      role: "Moderator",
      avatar: AVATAR_1,
      text: "Hasil polling akan kami rangkum minggu depan. Terima kasih atas partisipasinya.",
      replies: [],
    },
  ],
  "charging-101-cara-charging-di-rumah-dan-publik-infra": [
    {
      id: "c7-1",
      author: "Nikola T.",
      role: "Member",
      avatar: AVATAR_2,
      text: "Ada yang tahu lokasi SPKLU fast charging di sekitar Cikarang?",
      replies: [
        {
          id: "c7-2",
          author: "Elon Musk",
          role: "Member",
          avatar: AVATAR_1,
          text: "Ada di rest area KM 39 dan beberapa mal di Lippo Cikarang, cek di PLN Mobile.",
          replies: [],
        },
      ],
    },
  ],
  "panduan-praktis-seputar-kendaraan-listrik-kendaraan": [
    {
      id: "c10-1",
      author: "Edison",
      role: "n00b",
      avatar: AVATAR_2,
      text: "Hello World!",
      replies: [
        {
          id: "c10-2",
          author: "Tesla",
          role: "Moderator",
          avatar: AVATAR_1,
          text: "Ruang diskusi untuk berbagi ide, pengetahuan seputar kendaraan listrik.",
          replies: [],
        },
      ],
    },
    {
      id: "c10-3",
      author: "Edison",
      role: "n00b",
      avatar: AVATAR_2,
      text: "👍Terima Kasih",
      replies: [],
    },
  ],
};

export function countComments(list: DiskusiComment[]): number {
  return list.reduce((sum, c) => sum + 1 + countComments(c.replies), 0);
}

export const diskusiItems: DiskusiItem[] = rawDiskusiItems.map((item) => ({
  ...item,
  comments: countComments(commentsBySlug[item.slug] ?? []),
  rating: ratingsBySlug[item.slug]?.rating,
  ratingCount: ratingsBySlug[item.slug]?.count,
}));

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
