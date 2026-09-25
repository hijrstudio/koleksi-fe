export const STATUS_OPTIONS = ["On Going", "On Plan", "Done"] as const;
export type KegiatanStatus = (typeof STATUS_OPTIONS)[number];

export const CATEGORY_ALL = "Semua";
export const CATEGORY_OPTIONS = [
  CATEGORY_ALL,
  "Touring",
  "Gathering",
  "Test Drive",
  "Edukasi",
  "Komunitas",
];

export interface KegiatanItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  image: string;
  status: KegiatanStatus;
  category: string;
  /** Field detail (halaman /kegiatan/[slug]) -- opsional, kosong = pakai default di bawah. */
  timeRange?: string;
  location?: string;
  /** "lat,lng" dummy untuk embed Google Maps. */
  mapQuery?: string;
  content?: string[];
  registrationNotes?: string[];
  registrationHref?: string;
}

export const KEGIATAN_PER_PAGE = 8;

// Dummy -- titik koordinat sekretariat KOLEKSI di Jakarta Timur.
export const DEFAULT_MAP_QUERY = "-6.2245,106.8983";

export const defaultKegiatanContent = [
  "Ayo bergabung bersama KOLEKSI dalam kegiatan ini! Informasi lengkap seputar rangkaian acara akan terus kami perbarui di halaman ini.",
  "Pantau terus kanal resmi KOLEKSI untuk detail jadwal, lokasi berkumpul, dan cara pendaftaran.",
];

export const defaultRegistrationNotes = [
  "Pendaftaran akan dibuka menjelang tanggal pelaksanaan.",
  "Kuota terbatas -- pastikan kamu mendaftar lebih awal begitu formulir dibuka.",
];

// Mock -- ganti dengan data dari API saat backend kegiatan sudah ada.
// 8 item pertama (status "On Going") sengaja disamakan persis dengan
// desain, termasuk urutannya, supaya halaman 1 (tab default) identik.
export const kegiatanList: KegiatanItem[] = [
  {
    id: "keg-1",
    slug: "touring-kemerdekaan-jakarta-lampung",
    title: "Touring Kemerdekaan: Jakarta–Lampung",
    date: "31 Agustus 2026",
    image: "/images/koleksi-goes-iims.png",
    status: "On Going",
    category: "Touring",
    timeRange: "14 Ags 2026, 19:00 – 17 Ags 2026, 11:50",
    location: "Pulau Pahawang, Lampung",
    mapQuery: "-5.7167,105.2167",
    registrationHref: "https://forms.gle/u2xV9Zmy2NQDEwR99",
    registrationNotes: [
      "Pendaftaran ditutup pada 6 Agustus 2026 atau lebih cepat apabila kuota telah terpenuhi.",
      "Kuota terbatas hanya untuk 25 kendaraan dan maksimal 60 peserta.",
    ],
    content: [
      "Dear KOLEKSIER 🇮🇩✨",
      "Kabar gembira!",
      "Dalam rangka memperingati HUT Kemerdekaan RI ke-81 sekaligus 5th Anniversary KOLEKSI, berkat dukungan para sponsor, kami dapat memberikan potongan spesial untuk kegiatan:",
      "🇮🇩 Touring Kemerdekaan Jakarta – Lampung · 🗓️ 14 (malam) – 17 Agustus 2026 (3 Hari 3 Malam)",
      "Sebagai bentuk apresiasi kepada seluruh KOLEKSIER, berikut biaya partisipasi yang telah mendapatkan potongan khusus.",
      "Biaya Partisipasi:",
      "🏨 Penginapan 2 malam: Rp1.400.000 → GRATIS",
      "👤 Akomodasi Dewasa: Rp1.150.000 → Rp900.000/orang",
      "🧒 Akomodasi Anak (6–12 tahun): Rp600.000, wisata Pahawang Rp50.000 → Rp450.000/anak",
      "Ilustrasi biaya: 1 Dewasa Rp2.550.000 → Rp900.000 · 2 Dewasa Rp3.700.000 → Rp1.800.000 · 2 Dewasa + 1 Anak Rp4.300.000 → Rp2.450.000.",
      "Biaya partisipasi sudah termasuk: penginapan 2 malam, makan selama kegiatan, Gala Dinner 5th Anniversary KOLEKSI, kaos anniversary, dan wisata Pulau Pahawang dan sekitarnya.",
      "Belum termasuk: biaya tol, pengisian daya kendaraan (charging), dan penyeberangan ferry.",
      "💡 Bagi peserta yang telah melakukan pelunasan sebelumnya, selisih biaya (cashback) akan dikembalikan pada acara.",
      "Jangan lewatkan kesempatan untuk merayakan Hari Kemerdekaan bersama keluarga besar KOLEKSI dalam perjalanan yang seru, penuh kebersamaan, dan pengalaman tak terlupakan di Lampung.",
      "Yuk segera daftarkan diri dan amankan tempatmu! 🇮🇩✨",
      "Sampai bertemu di Touring Kemerdekaan – 5th Anniversary KOLEKSI!",
    ],
  },
  {
    id: "keg-2",
    slug: "komunitas-mobil-elektrik-indonesia-tesla",
    title: "Komunitas Mobil Elektrik Indonesia (Tesla)",
    date: "31 Agustus 2026",
    image: "/images/sample-image1.png",
    status: "On Going",
    category: "Komunitas",
  },
  {
    id: "keg-3",
    slug: "komunitas-media-gathering-2026",
    title: "Komunitas & Media Gathering 2026",
    date: "31 Agustus 2026",
    image: "/images/kegiatan-2.png",
    status: "On Going",
    category: "Gathering",
  },
  {
    id: "keg-4",
    slug: "komunitas-mobil-elektrik-indonesia-hyundai-02",
    title: "Komunitas Mobil Elektrik Indonesia (Hyundai) 02",
    date: "31 Agustus 2026",
    image: "/images/sample-image2.png",
    status: "On Going",
    category: "Komunitas",
  },
  {
    id: "keg-5",
    slug: "koleksi-volkswagen-id-buzz",
    title: "KOLEKSI: Volkswagen ID. Buzz",
    date: "31 Agustus 2026",
    image: "/images/kegiatan-3.png",
    status: "On Going",
    category: "Test Drive",
  },
  {
    id: "keg-6",
    slug: "komunitas-mobil-elektrik-indonesia-hyundai-01",
    title: "Komunitas Mobil Elektrik Indonesia (Hyundai) 01",
    date: "31 Agustus 2026",
    image: "/images/sample-image3.png",
    status: "On Going",
    category: "Komunitas",
  },
  {
    id: "keg-7",
    slug: "koleksi-tesla",
    title: "KOLEKSI: Tesla",
    date: "31 Agustus 2026",
    image: "/images/kegiatan-4.png",
    status: "On Going",
    category: "Test Drive",
  },
  {
    id: "keg-8",
    slug: "koleksi-byd",
    title: "KOLEKSI: BYD",
    date: "31 Agustus 2026",
    image: "/images/koleksi-goes-iims.png",
    status: "On Going",
    category: "Test Drive",
  },
  {
    id: "keg-9",
    slug: "koleksi-goes-to-iims-2026",
    title: "KOLEKSI Goes to IIMS 2026",
    date: "24 Agustus 2026",
    image: "/images/kegiatan-1.png",
    status: "On Going",
    category: "Gathering",
  },
  {
    id: "keg-10",
    slug: "turing-siaga-kesiapan-spklu-pln",
    title: "Turing Siaga Kesiapan SPKLU PLN",
    date: "20 Agustus 2026",
    image: "/images/kegiatan-2.png",
    status: "On Going",
    category: "Touring",
  },
  {
    id: "keg-11",
    slug: "gathering-akhir-tahun-koleksi-2026",
    title: "Gathering Akhir Tahun KOLEKSI 2026",
    date: "15 Desember 2026",
    image: "/images/kegiatan-2.png",
    status: "On Plan",
    category: "Gathering",
  },
  {
    id: "keg-12",
    slug: "workshop-perawatan-baterai-ev",
    title: "Workshop Perawatan Baterai EV",
    date: "5 November 2026",
    image: "/images/sample-image1.png",
    status: "On Plan",
    category: "Edukasi",
  },
  {
    id: "keg-13",
    slug: "touring-bandung-lembang",
    title: "Touring Bandung–Lembang",
    date: "20 Oktober 2026",
    image: "/images/kegiatan-3.png",
    status: "On Plan",
    category: "Touring",
  },
  {
    id: "keg-14",
    slug: "test-drive-day-byd-seal",
    title: "Test Drive Day: BYD Seal",
    date: "12 Oktober 2026",
    image: "/images/sample-image2.png",
    status: "On Plan",
    category: "Test Drive",
  },
  {
    id: "keg-15",
    slug: "seminar-infrastruktur-charging-nasional",
    title: "Seminar Infrastruktur Charging Nasional",
    date: "3 Oktober 2026",
    image: "/images/kegiatan-4.png",
    status: "On Plan",
    category: "Edukasi",
  },
  {
    id: "keg-16",
    slug: "kopdar-regional-jabodetabek",
    title: "Kopdar Regional Jabodetabek",
    date: "28 September 2026",
    image: "/images/sample-image3.png",
    status: "On Plan",
    category: "Komunitas",
  },
  {
    id: "keg-17",
    slug: "koleksi-5th-anniversary-celebration",
    title: "KOLEKSI 5th Anniversary Celebration",
    date: "23 Mei 2026",
    image: "/images/koleksi-goes-iims.png",
    status: "Done",
    category: "Gathering",
  },
  {
    id: "keg-18",
    slug: "booth-koleksi-di-iims-2026",
    title: "Booth KOLEKSI di IIMS 2026",
    date: "18 Februari 2026",
    image: "/images/kegiatan-1.png",
    status: "Done",
    category: "Gathering",
  },
  {
    id: "keg-19",
    slug: "webinar-insentif-pajak-kendaraan-listrik",
    title: "Webinar Insentif Pajak Kendaraan Listrik",
    date: "10 Februari 2026",
    image: "/images/sample-image1.png",
    status: "Done",
    category: "Edukasi",
  },
  {
    id: "keg-20",
    slug: "touring-anniversary-ke-4-koleksi",
    title: "Touring Anniversary ke-4 KOLEKSI",
    date: "23 Mei 2025",
    image: "/images/kegiatan-2.png",
    status: "Done",
    category: "Touring",
  },
  {
    id: "keg-21",
    slug: "media-gathering-koleksi-2025",
    title: "Media Gathering KOLEKSI 2025",
    date: "15 Januari 2025",
    image: "/images/sample-image2.png",
    status: "Done",
    category: "Gathering",
  },
  {
    id: "keg-22",
    slug: "survei-charging-station-jabodetabek",
    title: "Survei Charging Station Jabodetabek",
    date: "5 Desember 2024",
    image: "/images/kegiatan-3.png",
    status: "Done",
    category: "Edukasi",
  },
  {
    id: "keg-23",
    slug: "kelas-perdana-komunitas-ev",
    title: "Kelas Perdana Komunitas EV",
    date: "20 November 2024",
    image: "/images/sample-image3.png",
    status: "Done",
    category: "Edukasi",
  },
  {
    id: "keg-24",
    slug: "deklarasi-pembentukan-koleksi",
    title: "Deklarasi Pembentukan KOLEKSI",
    date: "23 Mei 2021",
    image: "/images/kegiatan-4.png",
    status: "Done",
    category: "Komunitas",
  },
  {
    id: "keg-25",
    slug: "touring-komunitas-jakarta-bogor",
    title: "Touring Komunitas: Jakarta–Bogor",
    date: "1 September 2026",
    image: "/images/sample-image1.png",
    status: "On Going",
    category: "Touring",
  },
  {
    id: "keg-26",
    slug: "touring-komunitas-jakarta-tangerang",
    title: "Touring Komunitas: Jakarta–Tangerang",
    date: "1 September 2026",
    image: "/images/sample-image1.png",
    status: "On Going",
    category: "Touring",
  },
];
