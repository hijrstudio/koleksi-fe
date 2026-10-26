export interface Peringkat {
  id: string;
  name: string;
  city: string;
  xp: number;
  avatar: string;
}

// Mock -- ganti dengan data dari API saat backend forum sudah ada.
// Urutan array = urutan peringkat (indeks 0 = #1).
const A1 = "/images/profil-1.jpg";
const A2 = "/images/profil-2.jpg";

export const peringkatList: Peringkat[] = [
  { id: "rank-1", name: "Edison", city: "Jakarta", xp: 1000, avatar: A2 },
  { id: "rank-2", name: "Tesla", city: "Bogor", xp: 960, avatar: A1 },
  { id: "rank-3", name: "Musk", city: "Tangerang", xp: 800, avatar: A1 },
  { id: "rank-4", name: "Edison", city: "Jakarta", xp: 720, avatar: A2 },
  { id: "rank-5", name: "Tesla", city: "Jakarta", xp: 640, avatar: A1 },
  { id: "rank-6", name: "Musk", city: "Jakarta", xp: 560, avatar: A1 },
  { id: "rank-7", name: "Edison", city: "Jakarta", xp: 480, avatar: A2 },
  { id: "rank-8", name: "Tesla", city: "Jakarta", xp: 360, avatar: A1 },
  { id: "rank-9", name: "Musk", city: "Jakarta", xp: 240, avatar: A1 },
  { id: "rank-10", name: "Edison", city: "Jakarta", xp: 160, avatar: A2 },
];
