export interface BeritaItem {
  id: string;
  slug: string;
  tag: string;
  title: string;
  author: string;
  /** Display string, e.g. "31 Agustus 2026". */
  date: string;
  /** ISO date used for sorting -- Indonesian month names in `date`
   * aren't reliably parsed back by `new Date()`. */
  dateISO: string;
  image: string;
  content: string[];
}

const placeholderContent = [
  `Kendaraan bermotor listrik berbasis baterai (khususnya mobil listrik) merupakan moda transportasi yang paling menjadi andalan masyarakat di masa depan. Kehadiran moda transportasi ini merupakan jawaban atas tantangan berat lingkungan hidup yang semakin mengkhawatirkan, dari masalah krisis energi global, polusi udara dan kebisingan, serta persoalan pemanasan global. Berdasarkan kondisi lingkungan yang cukup memprihatinkan tersebut, banyak pihak yang mencoba menumbuhkan kesadaran tinggi untuk mengurangi polusi udara dan menyelamatkan bumi dengan menciptakan dan mendirikan komunitas mobil listrik.`,
  `Tak heran bila produsen mobil ternama berlomba-lomba mengembangkan teknologi mobil listrik agar dapat memenuhi permintaan konsumen di masa depan. Sebagai antisipasi terhadap disrupsi teknologi listrik dalam wahana transportasi, Pemerintah Indonesia menetapkan berbagai regulasi dan kebijakan terkait percepatan elektrifikasi kendaraan bermotor dengan segala insentif yang diberikan.`,
  `Terbitnya berbagai kebijakan di atas, adalah bukti niat politik yang kuat dari pihak pemerintah, sehingga yang saat ini diperlukan adalah dukungan dari masyarakat dan para pengguna untuk mengawal kebijakan-kebijakan tersebut sehingga pelaksanaannya berlangsung dengan cepat dan tepat sasaran.`,
  `Untuk mengawal kebijakan pemerintah di atas, para pemilik dan pengguna mobil listrik sepakat membentuk sebuah wadah komunikasi yang bernama Komunitas Mobil Elektrik Indonesia, disingkat KOLEKSI.`,
];

const baseBerita: Omit<
  BeritaItem,
  "id" | "slug" | "date" | "dateISO" | "content"
>[] = [
  {
    tag: "News Release",
    title: "KOLEKSI: Akselerasi Ekosistem Kendaraan Listrik Indonesia",
    author: "KOLEKSI",
    image: "/images/sample-image1.png",
  },
  {
    tag: "Liputan",
    title: "Tingkatkan Literasi Kendaraan Listrik",
    author: "KOLEKSI",
    image: "/images/sample-image2.png",
  },
  {
    tag: "Berita EV",
    title: "KOLEKSI: Akselerasi Ekosistem Kendaraan Listrik Indonesia",
    author: "KOLEKSI",
    image: "/images/sample-image3.png",
  },
];

export const BERITA_PER_PAGE = 5;
const TOTAL_BERITA = 30;

/** Newer items first -- day offset shrinks as index grows. */
function dateFor(index: number): { date: string; dateISO: string } {
  const date = new Date(2026, 7, 31 - index);
  return {
    date: date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    dateISO: date.toISOString(),
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const beritaItems: BeritaItem[] = Array.from(
  { length: TOTAL_BERITA },
  (_, i) => {
    const base = baseBerita[i % baseBerita.length];
    return {
      ...base,
      id: `berita-${i + 1}`,
      slug: `${slugify(base.title)}-${i + 1}`,
      content: placeholderContent,
      ...dateFor(i),
    };
  },
);
