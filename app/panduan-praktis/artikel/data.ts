export interface Article {
  id: string;
  slug: string;
  category: string;
  title: string;
  author: string;
  image: string;
  date: string;
  content: string[];
}

export const categoryColor: Record<string, string> = {
  Kendaraan: "bg-badge-artikel",
  Bisnis: "bg-fuchsia-500",
  Infrastruktur: "bg-sky-500",
};

const placeholderContent = [
  `Kendaraan bermotor listrik berbasis baterai (khususnya mobil listrik) merupakan moda transportasi yang paling menjadi andalan masyarakat di masa depan. Kehadiran moda transportasi ini merupakan jawaban atas tantangan berat lingkungan hidup yang semakin mengkhawatirkan, dari masalah krisis energi global, polusi udara dan kebisingan, serta persoalan pemanasan global. Berdasarkan kondisi lingkungan yang cukup memprihatinkan tersebut, banyak pihak yang mencoba menumbuhkan kesadaran tinggi untuk mengurangi polusi udara dan menyelamatkan bumi dengan menciptakan dan mendirikan komunitas mobil listrik.`,
  `Tak heran bila produsen mobil ternama berlomba-lomba mengembangkan teknologi mobil listrik agar dapat memenuhi permintaan konsumen di masa depan. Sebagai antisipasi terhadap disrupsi teknologi listrik dalam wahana transportasi, Pemerintah Indonesia menetapkan berbagai regulasi dan kebijakan terkait percepatan elektrifikasi kendaraan bermotor dengan segala insentif yang diberikan.`,
  `Terbitnya berbagai kebijakan di atas, adalah bukti niat politik yang kuat dari pihak pemerintah, sehingga yang saat ini diperlukan adalah dukungan dari masyarakat dan para pengguna untuk mengawal kebijakan-kebijakan tersebut sehingga pelaksanaannya berlangsung dengan cepat dan tepat sasaran.`,
  `Untuk mengawal kebijakan pemerintah di atas, para pemilik dan pengguna mobil listrik sepakat membentuk sebuah wadah komunikasi yang bernama Komunitas Mobil Elektrik Indonesia, disingkat KOLEKSI.`,
  `Kesepakatan untuk membentuk KOLEKSI dicetuskan pada saat pertemuan dengan Zoom antar sesama pemilik dan pengguna mobil listrik pada 17 Mei 2021, dan dideklarasikan pada saat kopi darat pemilik dan pengguna mobil listrik di Pavillion Bliss Alam Sutera, tanggal 23 Mei 2021. Kesepakatan tersebut tertuang dalam deklarasi pembentukan KOLEKSI yang ditandatangani oleh: Arwan Hidayat, Abdul Rahman Elly, Agus Purnomo, Aditya Prasetya Mulya, Singgih Sunoto, Ricky Febrian, M. Ihsan Sandy Toisuta, Wicaksono Indarto, Melissa, Lihua Soedarmo, Deky Adrian Raharjo, dan Mohamad Yogi Alamsyah.`,
  `Dalam pembentukan KOLEKSI tersebut sekaligus ditetapkan Ketua Umum yaitu Arwan Hidayat dan Wakil Ketua Perhimpunan Abdul Rahman Elly untuk periode 2021-2024, sekaligus menetapkan ketua dan anggota bidang serta koordinator wilayah. Rapat pembentukan klub tanggal 23 Mei 2021 ditetapkan sebagai tanggal lahir KOLEKSI. Selain itu, pada saat pembentukan klub juga telah ditetapkan nama klub, pengurus pendiri klub, visi dan misi KOLEKSI serta hal lain yang dianggap perlu untuk pembangunan KOLEKSI. Kemudian pembentukannya juga telah didaftarkan sebagai badan hukum di Direktorat Jenderal Administrasi Hukum Umum, Kementerian Hukum dan Hak Asasi Manusia Republik Indonesia, serta telah menjadi bagian dari keluarga besar IMI.`,
];

export const articles: Article[] = [
  {
    id: "art-1",
    slug: "apakah-ev-pilihan-tepat-sebagai-mobil-pertama",
    category: "Kendaraan",
    title: "Apakah EV Pilihan Tepat Sebagai Mobil Pertama?",
    author: "Luki Cahyadi (KOLEKSI 104)",
    image: "/images/sample-image1.png",
    date: "1 Sep 2026",
    content: placeholderContent,
  },
  {
    id: "art-2",
    slug: "membongkar-fakta-hemat-bedah-dompet-5-tahun-tco-byd-atto-1-vs-honda-brio-satya",
    category: "Bisnis",
    title:
      'Membongkar Fakta Hemat "Bedah Dompet" 5 Tahun: TCO BYD ATTO 1 vs HONDA BRIO SATYA',
    author: "Carlos Christian Lie (KOLEKSI 110)",
    image: "/images/sample-image2.png",
    date: "1 Sep 2026",
    content: placeholderContent,
  },
  {
    id: "art-3",
    slug: "baterai-ev-dan-ketakutan-publik",
    category: "Infrastruktur",
    title: "Baterai EV dan Ketakutan Publik",
    author: "KOLEKSI",
    image: "/images/sample-image3.png",
    date: "1 Sep 2026",
    content: placeholderContent,
  },
  {
    id: "art-4",
    slug: "panduan-praktis-seputar-kendaraan-listrik",
    category: "Kendaraan",
    title: "Panduan Praktis Seputar Kendaraan Listrik",
    author: "Hendro Sutiono (Pengamat dan Pengguna EV)",
    image: "/images/sample-image1.png",
    date: "1 Sep 2026",
    content: placeholderContent,
  },
  {
    id: "art-5",
    slug: "membongkar-fakta-hemat-bedah-dompet-5-tahun-tco-byd-atto-1-vs-honda-brio-satya-2",
    category: "Bisnis",
    title:
      'Membongkar Fakta Hemat "Bedah Dompet" 5 Tahun: TCO BYD ATTO 1 vs HONDA BRIO SATYA',
    author: "Carlos Christian Lie (KOLEKSI 110)",
    image: "/images/sample-image1.png",
    date: "1 Sep 2026",
    content: placeholderContent,
  },
  {
    id: "art-6",
    slug: "peta-sebaran-spklu-di-jabodetabek-terbaru",
    category: "Infrastruktur",
    title: "Peta Sebaran SPKLU di Jabodetabek Terbaru",
    author: "KOLEKSI",
    image: "/images/sample-image2.png",
    date: "1 Sep 2026",
    content: placeholderContent,
  },
  {
    id: "art-7",
    slug: "tips-merawat-baterai-ev-supaya-awet",
    category: "Kendaraan",
    title: "Tips Merawat Baterai EV Supaya Awet",
    author: "Luki Cahyadi (KOLEKSI 104)",
    image: "/images/sample-image3.png",
    date: "1 Sep 2026",
    content: placeholderContent,
  },
  {
    id: "art-8",
    slug: "insentif-pajak-kendaraan-listrik-2026-apa-saja-yang-berubah",
    category: "Bisnis",
    title: "Insentif Pajak Kendaraan Listrik 2026, Apa Saja yang Berubah?",
    author: "Carlos Christian Lie (KOLEKSI 110)",
    image: "/images/sample-image1.png",
    date: "1 Sep 2026",
    content: placeholderContent,
  },
  {
    id: "art-9",
    slug: "charging-di-rumah-vs-charging-publik-mana-yang-lebih-hemat",
    category: "Infrastruktur",
    title: "Charging di Rumah vs Charging Publik, Mana yang Lebih Hemat?",
    author: "Hendro Sutiono (Pengamat dan Pengguna EV)",
    image: "/images/sample-image2.png",
    date: "1 Sep 2026",
    content: placeholderContent,
  },
  {
    id: "art-10",
    slug: "panduan-memilih-ev-bekas-untuk-pemula",
    category: "Kendaraan",
    title: "Panduan Memilih EV Bekas untuk Pemula",
    author: "KOLEKSI",
    image: "/images/sample-image3.png",
    date: "1 Sep 2026",
    content: placeholderContent,
  },
];
