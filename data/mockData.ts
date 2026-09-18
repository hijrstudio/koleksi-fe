import {
  ArticleCard,
  NavItem,
  NewsCard,
  ActivityCard,
  PlaybookCard,
  PartnerLogo,
  SocialPost,
  StatItem,
} from "@/types";

export const navItems: NavItem[] = [
  { label: "Tentang Kami", href: "/tentang-kami" },
  {
    label: "Komunitas",
    href: "/komunitas",
    children: [
      { label: "Panduan Praktis", href: "/panduan-praktis" },
      { label: "Forum", href: "/komunitas/forum" },
    ],
  },
  {
    label: "Kegiatan",
    href: "/kegiatan",
    children: [
      { label: "Kegiatan", href: "/kegiatan/kegiatan" },
      { label: "Galeri", href: "/kegiatan/galeri" },
      { label: "Video", href: "/kegiatan/video" },
    ],
  },
  {
    label: "Berita",
    href: "/berita",
    children: [
      { label: "News Release", href: "/berita/news-release" },
      { label: "Berita EV", href: "/berita/berita-ev" },
      { label: "Liputan", href: "/berita/liputan" },
    ],
  },
  { label: "Produk", href: "/produk" },
  { label: "EV Garage", href: "/ev-garage" },
];

export const communityStats: StatItem[] = [
  { icon: "users", value: ">1000", label: "Anggota" },
  { icon: "map-pin", value: "26", label: "Kota" },
  { icon: "calendar", value: "123", label: "Kegiatan" },
  { icon: "car", value: "20", label: "Brand" },
];

export const panduanPraktisItems: ArticleCard[] = [
  {
    id: "artikel-1",
    tag: "Artikel",
    tagColor: "artikel",
    title: "Apakah EV Pilihan Tepat Sebagai Mobil Pertama?",
    author: "Luki Cahyadi (KOLEKSI 104)",
    image: "/images/sample-image1.png",
  },
  {
    id: "video-1",
    tag: "Video Edukasi",
    tagColor: "video",
    title:
      'Membongkar Fakta Hemat "Bedah Dompet" 5 Tahun: TCO BYD Atto 1 vs Honda Brio Satya',
    author: "Carlos Christian Lie (KOLEKSI 110)",
    image: "/images/sample-image2.png",
    isVideo: true,
  },
  {
    id: "artikel-2",
    tag: "Artikel",
    tagColor: "artikel",
    title: "5 Tips Merawat Baterai Mobil Listrik Supaya Awet",
    author: "Tim KOLEKSI",
    image: "/images/sample-image3.png",
  },
];

export const beritaItems: NewsCard[] = [
  {
    id: "berita-1",
    tag: "Liputan",
    title: "KOLEKSI: Akselerasi Ekosistem Kendaraan Listrik Indonesia Me...",
    date: "15 Sep 2026",
  },
  {
    id: "berita-2",
    tag: "News Release",
    title: "Tingkatkan Literasi Kendaraan Listrik, KOLEKSI Bekali Anggota...",
    date: "15 Sep 2026",
  },
  {
    id: "berita-3",
    tag: "News Release",
    title: "KOLEKSI: Akselerasi Ekosistem Kendaraan Listrik Indonesia Me...",
    date: "15 Sep 2026",
  },
];

export const kegiatanTerbaru: ActivityCard[] = [
  {
    id: "kegiatan-1",
    title: "Turing Siaga Kesiapan SPKLU PLN",
    date: "3 September 2026",
    image: "/images/kegiatan-1.png",
  },
  {
    id: "kegiatan-2",
    title: "Komunitas & Media Gathering",
    date: "2 September 2026",
    image: "/images/kegiatan-2.png",
  },
  {
    id: "kegiatan-3",
    title: "Turing Siaga Kesiapan SPKLU PLN",
    date: "1 September 2026",
    image: "/images/kegiatan-3.png",
  },
  {
    id: "kegiatan-4",
    title: "Komunitas & Media Gathering",
    date: "1 September 2026",
    image: "/images/kegiatan-4.png",
  },
];

export const playbookItems: PlaybookCard[] = [
  {
    id: "playbook-1",
    title: "Panduan Memilih EV yang Tepat",
    image: "/images/playbook.png",
    href: "/playbook/panduan-memilih-ev",
  },
  {
    id: "playbook-2",
    title: "Charging 101: Cara Charging di Rumah & Publik",
    image: "/images/playbook.png",
    href: "/playbook/charging-101",
  },
  {
    id: "playbook-3",
    title: "Biaya & Insentif: Hitung Biaya Kepemilikan EV",
    image: "/images/playbook.png",
    href: "/playbook/biaya-insentif",
  },
  {
    id: "playbook-4",
    title: "Perawatan EV",
    image: "/images/playbook.png",
    href: "/playbook/perawatan-ev",
  },
];

export const partnerLogos: PartnerLogo[] = [
  {
    id: "pln",
    name: "PLN",
    logo: "/images/partner-1.png",
    width: 254,
    height: 81,
  },
  {
    id: "pln-electricity",
    name: "PLN Electricity Services",
    logo: "/images/partner-2.png",
    width: 388,
    height: 81,
  },
  {
    id: "pln-icon-plus",
    name: "PLN Icon Plus",
    logo: "/images/partner-3.png",
    width: 241,
    height: 89,
  },
  {
    id: "pln-mobile",
    name: "PLN Mobile",
    logo: "/images/partner-4.png",
    width: 106,
    height: 111,
  },
  {
    id: "teb",
    name: "Tri Energi Berkarya",
    logo: "/images/partner-5.png",
    width: 157,
    height: 69,
  },
  {
    id: "ancora",
    name: "Ancora",
    logo: "/images/partner-6.png",
    width: 356,
    height: 81,
  },
  {
    id: "hwt-recharge",
    name: "HWT Recharge",
    logo: "/images/partner-7.png",
    width: 377,
    height: 81,
  },
];

export const instagramPosts: SocialPost[] = [
  {
    id: "ig-1",
    image: "/images/instagram-1.jpg",
    caption: "Tips Aman Menggunakan Portable Charger EV",
    href: "https://instagram.com",
  },
  {
    id: "ig-2",
    image: "/images/instagram-2.jpg",
    caption: "Kenapa Harus Join KOLEKSI EV Club?",
    href: "https://instagram.com",
  },
  {
    id: "ig-3",
    image: "/images/instagram-3.jpg",
    caption: "Top 10 Penjualan Mobil Listrik / Elektrifikasi di GIIAS 2026",
    href: "https://instagram.com",
  },
];

export const tiktokPosts: SocialPost[] = [
  {
    id: "tt-1",
    image: "/images/tiktok-1.jpg",
    caption: "Ternyata Rem di EV Bisa Diatur?",
    href: "https://tiktok.com",
  },
  {
    id: "tt-2",
    image: "/images/tiktok-2.jpg",
    href: "https://tiktok.com",
  },
  {
    id: "tt-3",
    image: "/images/tiktok-3.jpg",
    caption: "KOLEKSI Touring",
    href: "https://tiktok.com",
  },
  {
    id: "tt-4",
    image: "/images/tiktok-4.jpg",
    caption: "Selamat Hari Bumi",
    href: "https://tiktok.com",
  },
];
