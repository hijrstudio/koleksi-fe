export interface VideoItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  youtubeId: string;
}

/** Dummy placeholder -- swap with real automotive YouTube video IDs. */
const DUMMY_YOUTUBE_ID = "dQw4w9WgXcQ";

const baseVideos: Omit<VideoItem, "id" | "youtubeId">[] = [
  {
    title: "Apakah EV Pilihan Tepat Sebagai Mobil Pertama?",
    category: "Kendaraan",
    date: "20 Agustus 2026",
    image: "/images/sample-image1.png",
  },
  {
    title:
      'Membongkar Fakta Hemat "Bedah Dompet" 5 Tahun: TCO BYD ATTO 1 vs HONDA BRIO SATYA',
    category: "Bisnis",
    date: "20 Agustus 2026",
    image: "/images/sample-image2.png",
  },
  {
    title: "Baterai EV dan Ketakutan Publik",
    category: "Teknologi",
    date: "20 Agustus 2026",
    image: "/images/sample-image3.png",
  },
  {
    title: "Peta Sebaran SPKLU di Jabodetabek Terbaru",
    category: "Infrastruktur",
    date: "20 Agustus 2026",
    image: "/images/sample-image1.png",
  },
];

export const VIDEOS_PER_PAGE = 4;
const TOTAL_VIDEOS = 40;

export const videos: VideoItem[] = Array.from(
  { length: TOTAL_VIDEOS },
  (_, i) => {
    const base = baseVideos[i % baseVideos.length];
    return {
      ...base,
      id: `video-${i + 1}`,
      youtubeId: DUMMY_YOUTUBE_ID,
    };
  },
);
