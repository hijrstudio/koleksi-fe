export interface VotingOption {
  id: string;
  label: string;
}

/** Voting yang masih berlangsung -- user memilih satu opsi lalu menekan Vote. */
export interface Voting {
  id: string;
  author: string;
  /** ISO (YYYY-MM-DD); tampilkan lewat formatTanggal(). */
  date: string;
  title: string;
  options: VotingOption[];
  votes: number;
  /** Sisa waktu, mis. "23 jam lagi". */
  endsIn: string;
}

export interface PollingOption {
  id: string;
  label: string;
  /** 0-100 */
  percent: number;
}

/** Polling yang sudah selesai -- menampilkan hasil per opsi. */
export interface Polling {
  id: string;
  author: string;
  date: string;
  title: string;
  options: PollingOption[];
  votes: number;
  /** Mis. "Hasil akhir". */
  status: string;
}

export const POLLING_PER_PAGE = 2;

export const FILTER_ALL = "Semua";
export const FILTER_OPTIONS = [FILTER_ALL, "Voting", "Polling"];

// Mock -- ganti dengan data dari API saat backend forum sudah ada.
export const votingList: Voting[] = [
  {
    id: "vote-1",
    author: "User",
    date: "2026-08-01",
    title: "Apakah EV Pilihan Tepat Sebagai Mobil Pertama?",
    options: [
      { id: "ya", label: "Ya" },
      { id: "tidak", label: "Tidak" },
    ],
    votes: 10,
    endsIn: "23 jam lagi",
  },
  {
    id: "vote-2",
    author: "User",
    date: "2026-08-01",
    title: "Di mana Anda paling sering melakukan charging?",
    options: [
      { id: "rumah", label: "Di rumah" },
      { id: "spklu", label: "SPKLU umum" },
      { id: "keduanya", label: "Keduanya sama sering" },
    ],
    votes: 34,
    endsIn: "2 hari lagi",
  },
];

export const pollingList: Polling[] = [
  {
    id: "poll-1",
    author: "User",
    date: "2026-08-01",
    title: "Polling: Apakah EV Pilihan Tepat Sebagai Mobil Pertama?",
    options: [
      { id: "ya", label: "Ya", percent: 80 },
      { id: "tidak", label: "Tidak", percent: 20 },
    ],
    votes: 128,
    status: "Hasil akhir",
  },
  {
    id: "poll-2",
    author: "User",
    date: "2026-08-01",
    title: "Polling: Apakah EV Pilihan Tepat Sebagai Mobil Pertama?",
    options: [
      { id: "ya", label: "Ya", percent: 80 },
      { id: "tidak", label: "Tidak", percent: 20 },
    ],
    votes: 128,
    status: "Hasil akhir",
  },
  {
    id: "poll-3",
    author: "User",
    date: "2026-07-28",
    title: "Polling: Merek EV Favorit di Indonesia",
    options: [
      { id: "hyundai", label: "Hyundai", percent: 45 },
      { id: "byd", label: "BYD", percent: 35 },
      { id: "wuling", label: "Wuling", percent: 20 },
    ],
    votes: 214,
    status: "Hasil akhir",
  },
  {
    id: "poll-4",
    author: "User",
    date: "2026-07-25",
    title: "Polling: Apakah Insentif Pajak EV Sudah Cukup?",
    options: [
      { id: "ya", label: "Ya", percent: 30 },
      { id: "tidak", label: "Tidak", percent: 70 },
    ],
    votes: 96,
    status: "Hasil akhir",
  },
  {
    id: "poll-5",
    author: "User",
    date: "2026-07-20",
    title: "Polling: Berapa Kali Charging Publik dalam Seminggu?",
    options: [
      { id: "1-2", label: "1-2 kali", percent: 55 },
      { id: "3-5", label: "3-5 kali", percent: 30 },
      { id: "5+", label: "Lebih dari 5 kali", percent: 15 },
    ],
    votes: 152,
    status: "Hasil akhir",
  },
  {
    id: "poll-6",
    author: "User",
    date: "2026-07-15",
    title: "Polling: Perlukah Home Charging Wajib untuk Pembeli EV?",
    options: [
      { id: "setuju", label: "Setuju", percent: 62 },
      { id: "tidak", label: "Tidak setuju", percent: 38 },
    ],
    votes: 87,
    status: "Hasil akhir",
  },
];
