export interface Anggota {
  id: string;
  name: string;
  /** "Member" | "Moderator" -- lihat RoleBadge. */
  role: string;
  avatar: string;
  level: number;
  ev: string;
  city: string;
}

export const ANGGOTA_PER_PAGE = 12;

export const CITIES = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Semarang",
  "Yogyakarta",
  "Medan",
  "Makassar",
  "Denpasar",
  "Malang",
  "Palembang",
];

/** Opsi dropdown Kota: "Semua" + 10 kota. */
export const CITY_ALL = "Semua";
export const CITY_OPTIONS = [CITY_ALL, ...CITIES];

// Mock -- ganti dengan data dari API saat backend forum sudah ada.
const A1 = "/images/profil-1.jpg";
const A2 = "/images/profil-2.jpg";

export const anggotaList: Anggota[] = [
  { id: "agt-1", name: "Nikola Tesla", role: "Moderator", avatar: A1, level: 3, ev: "Tesla Model Y", city: "Jakarta" },
  { id: "agt-2", name: "Thomas Edison", role: "Member", avatar: A2, level: 2, ev: "Hyundai Ioniq 5", city: "Bandung" },
  { id: "agt-3", name: "Elon Musk", role: "Member", avatar: A1, level: 4, ev: "Tesla Cybertruck", city: "Surabaya" },
  { id: "agt-4", name: "Thomas Edison", role: "Member", avatar: A2, level: 1, ev: "Wuling Air EV", city: "Semarang" },
  { id: "agt-5", name: "Elon Musk", role: "Member", avatar: A1, level: 5, ev: "BYD Atto 3", city: "Yogyakarta" },
  { id: "agt-6", name: "Nikola Tesla", role: "Member", avatar: A2, level: 2, ev: "Tesla Model 3", city: "Medan" },
  { id: "agt-7", name: "Elon Musk", role: "Member", avatar: A1, level: 3, ev: "Hyundai Kona Electric", city: "Makassar" },
  { id: "agt-8", name: "Nikola Tesla", role: "Member", avatar: A2, level: 1, ev: "MG 4 EV", city: "Denpasar" },
  { id: "agt-9", name: "Thomas Edison", role: "Member", avatar: A1, level: 4, ev: "Nissan Leaf", city: "Malang" },
  { id: "agt-10", name: "Nikola Tesla", role: "Member", avatar: A2, level: 3, ev: "Tesla Model Y", city: "Jakarta" },
  { id: "agt-11", name: "Thomas Edison", role: "Moderator", avatar: A1, level: 5, ev: "BYD Seal", city: "Palembang" },
  { id: "agt-12", name: "Elon Musk", role: "Member", avatar: A2, level: 2, ev: "Wuling BinguoEV", city: "Bandung" },
  { id: "agt-13", name: "Nikola Tesla", role: "Member", avatar: A1, level: 1, ev: "Hyundai Ioniq 6", city: "Surabaya" },
  { id: "agt-14", name: "Thomas Edison", role: "Member", avatar: A2, level: 3, ev: "Tesla Model S", city: "Jakarta" },
  { id: "agt-15", name: "Elon Musk", role: "Member", avatar: A1, level: 2, ev: "BYD Dolphin", city: "Semarang" },
  { id: "agt-16", name: "Nikola Tesla", role: "Member", avatar: A2, level: 4, ev: "Tesla Model X", city: "Yogyakarta" },
  { id: "agt-17", name: "Thomas Edison", role: "Member", avatar: A1, level: 1, ev: "MG ZS EV", city: "Medan" },
  { id: "agt-18", name: "Elon Musk", role: "Member", avatar: A2, level: 3, ev: "Hyundai Ioniq 5", city: "Makassar" },
  { id: "agt-19", name: "Nikola Tesla", role: "Member", avatar: A1, level: 2, ev: "Wuling Air EV", city: "Denpasar" },
  { id: "agt-20", name: "Thomas Edison", role: "Member", avatar: A2, level: 5, ev: "BYD Atto 3", city: "Malang" },
  { id: "agt-21", name: "Elon Musk", role: "Member", avatar: A1, level: 1, ev: "Nissan Leaf", city: "Palembang" },
];
