export interface GarageBrand {
  /** Nama tampil di tabel (huruf besar). */
  name: string;
  logo: string;
}

/** Urutan = urutan di grid logo (6 x 3), sama dengan desain. */
export const garageBrands: GarageBrand[] = [
  { name: "AION", logo: "/images/garage/aion.png" },
  { name: "BMW", logo: "/images/garage/bmw.png" },
  { name: "BYD", logo: "/images/garage/byd.png" },
  { name: "CHERY", logo: "/images/garage/chery.png" },
  { name: "CITROEN", logo: "/images/garage/citroen.png" },
  { name: "DFSK", logo: "/images/garage/dfsk.png" },
  { name: "HYUNDAI", logo: "/images/garage/hyundai.png" },
  { name: "KIA", logo: "/images/garage/kia.png" },
  { name: "MAZDA", logo: "/images/garage/mazda.png" },
  { name: "MERCEDES", logo: "/images/garage/mercedes-benz.png" },
  { name: "MG", logo: "/images/garage/mg.png" },
  { name: "MINI", logo: "/images/garage/mini.png" },
  { name: "MITSUBISHI", logo: "/images/garage/mitsubishi.png" },
  // Logo Hozon = merek Neta.
  { name: "NETA", logo: "/images/garage/hozon.png" },
  { name: "NISSAN", logo: "/images/garage/nissan.png" },
  { name: "TOYOTA", logo: "/images/garage/toyota.png" },
  { name: "VOLVO", logo: "/images/garage/volvo.png" },
  { name: "WULING", logo: "/images/garage/wuling.png" },
];

export interface GarageVehicle {
  id: string;
  brand: string;
  /** Jenis / tipe kendaraan. */
  type: string;
  batteryKwh: number;
  acKw: number;
  /** null = tidak mendukung DC fast charging. */
  dcKw: number | null;
  rangeKm: number;
}

export const GARAGE_PER_PAGE = 18;

export const SORT_AZ = "A–Z";
export const SORT_ZA = "Z–A";
export const SORT_OPTIONS = [SORT_AZ, SORT_ZA];

// Mock -- angka spesifikasi hanya perkiraan untuk data contoh; ganti dengan
// data resmi dari API/backend EV Garage.
// [merek, tipe, baterai kWh, AC kW, DC kW (null = tidak ada), jangkauan km]
type Row = [string, string, number, number, number | null, number];

const rows: Row[] = [
  ["AION", "Y Plus", 63.2, 6.6, 80, 430],
  ["AION", "UT", 49, 6.6, 80, 330],
  ["AION", "V", 72, 11, 150, 550],
  ["BMW", "iX1 eDrive20", 66.5, 11, 130, 438],
  ["BMW", "i4 eDrive40", 83.9, 11, 205, 590],
  ["BMW", "iX xDrive50", 111.5, 11, 195, 620],
  ["BYD", "Dolphin", 44.9, 7, 60, 410],
  ["BYD", "Atto 3", 60.5, 7, 88, 480],
  ["BYD", "Seal", 82.5, 11, 150, 650],
  ["CHERY", "Omoda E5", 61, 6.6, 80, 430],
  ["CHERY", "eQ7", 55, 6.6, 80, 408],
  ["CHERY", "Tiggo 8 PHEV", 19.4, 6.6, null, 80],
  ["CITROEN", "ë-C3", 44, 7.4, 100, 320],
  ["CITROEN", "ë-C4", 50, 11, 100, 350],
  ["CITROEN", "ë-Berlingo", 50, 11, 100, 280],
  ["DFSK", "Gelora E", 41.4, 6.6, 40, 300],
  ["DFSK", "Seres 3", 53, 6.6, 80, 400],
  ["DFSK", "Seres E1", 31.9, 6.6, 40, 300],
  ["HYUNDAI", "Ioniq 5", 72.6, 11, 220, 451],
  ["HYUNDAI", "Ioniq 6", 77.4, 11, 240, 614],
  ["HYUNDAI", "Kona Electric", 64.8, 11, 100, 484],
  ["KIA", "EV6", 77.4, 11, 240, 528],
  ["KIA", "EV9", 99.8, 11, 210, 541],
  ["KIA", "Niro EV", 64.8, 11, 85, 460],
  ["MAZDA", "MX-30", 35.5, 6.6, 50, 224],
  ["MAZDA", "MX-30 R-EV", 17.8, 6.6, 36, 85],
  ["MAZDA", "CX-60 PHEV", 17.8, 7.4, null, 63],
  ["MERCEDES", "EQA 250", 66.5, 11, 100, 486],
  ["MERCEDES", "EQB 350", 66.5, 11, 100, 419],
  ["MERCEDES", "EQE 350+", 90.6, 11, 170, 654],
  ["MG", "MG4 EV", 64, 11, 135, 450],
  ["MG", "ZS EV", 51, 7, 76, 320],
  ["MG", "Cyberster", 77, 11, 144, 507],
  ["MINI", "Cooper SE", 32.6, 11, 50, 200],
  ["MINI", "Aceman", 42.5, 11, 95, 310],
  ["MINI", "Countryman SE ALL4", 64.6, 11, 130, 440],
  ["MITSUBISHI", "Outlander PHEV", 20, 3.7, 22, 87],
  ["MITSUBISHI", "eK X EV", 20, 2.6, 50, 180],
  ["MITSUBISHI", "Minicab-MiEV", 10.5, 3, 50, 100],
  ["NETA", "V", 38.5, 6.6, 40, 380],
  ["NETA", "X", 64, 6.6, 80, 480],
  ["NETA", "GT", 68, 6.6, 80, 500],
  ["NISSAN", "Leaf", 40, 6.6, 50, 270],
  ["NISSAN", "Leaf e+", 62, 6.6, 100, 385],
  ["NISSAN", "Ariya", 87, 7.4, 130, 500],
  ["TOYOTA", "bZ4X", 71.4, 6.6, 150, 500],
  ["TOYOTA", "bZ4X Touring", 74.7, 11, 150, 570],
  ["TOYOTA", "Prius Prime", 13.6, 3.3, null, 72],
  ["VOLVO", "EX30", 69, 11, 153, 476],
  ["VOLVO", "XC40 Recharge", 69, 11, 150, 418],
  ["VOLVO", "EX90", 111, 11, 250, 600],
  ["WULING", "Air ev", 26.7, 6.6, null, 300],
  ["WULING", "Binguo EV", 37.9, 6.6, 40, 333],
  ["WULING", "Cloud EV", 50.6, 6.6, 60, 460],
];

export const garageVehicles: GarageVehicle[] = rows.map(
  ([brand, type, batteryKwh, acKw, dcKw, rangeKm], i) => ({
    id: `garage-${i + 1}`,
    brand,
    type,
    batteryKwh,
    acKw,
    dcKw,
    rangeKm,
  }),
);
