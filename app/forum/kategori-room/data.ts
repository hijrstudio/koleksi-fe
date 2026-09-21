export interface RoomGroup {
  id: string;
  title: string;
  rooms: string[];
}

// Mock -- ganti dengan data dari API saat backend forum sudah ada.
export const kategoriList = [
  "Bisnis",
  "Infrastruktur",
  "Kendaraan",
  "OOT",
  "Teknologi",
];

export const roomGroups: RoomGroup[] = [
  {
    id: "terbaru",
    title: "Terbaru",
    rooms: [
      "secret-room",
      "EVent2027",
      "group123",
      "knightrider",
      "vrooom",
      "batmobile",
      "EV_privsec",
      "KOLEKSI2026",
      // Di desain chip ini berlabel "selected" (contoh state terpilih);
      // dipertahankan sebagai nama room mock.
      "selected",
    ],
  },
  {
    id: "teraktif",
    title: "Teraktif",
    rooms: ["koleksi"],
  },
];

/** Room yang terpilih di awal (sesuai desain). */
export const DEFAULT_ROOM = "selected";
