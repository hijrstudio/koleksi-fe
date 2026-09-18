export const LEVELS = ["Beginner", "Intermediate", "Advance"] as const;
export type Level = (typeof LEVELS)[number];

export interface PlaybookItem {
  id: string;
  title: string;
  image: string;
  level: Level;
  locked?: boolean;
  lockLevel?: number;
}

export const playbookItems: PlaybookItem[] = [
  {
    id: "playbook-1",
    title: "Panduan Memilih EV yang Tepat",
    image: "/images/playbook.png",
    level: "Beginner",
  },
  {
    id: "playbook-2",
    title: "Charging 101: Cara Charging di Rumah & Publik",
    image: "/images/playbook.png",
    level: "Beginner",
  },
  {
    id: "playbook-3",
    title: "Biaya & Insentif: Hitung Biaya Kepemilikan EV",
    image: "/images/playbook.png",
    level: "Beginner",
  },
  {
    id: "playbook-4",
    title: "Perawatan EV (Part 1)",
    image: "/images/playbook.png",
    level: "Beginner",
    locked: true,
    lockLevel: 3,
  },
  {
    id: "playbook-5",
    title: "Perawatan EV (Part 2)",
    image: "/images/playbook.png",
    level: "Beginner",
    locked: true,
    lockLevel: 3,
  },
  {
    id: "playbook-6",
    title: "Analisis TCO Kendaraan Listrik",
    image: "/images/playbook.png",
    level: "Intermediate",
  },
  {
    id: "playbook-7",
    title: "Membangun Home Charging Station",
    image: "/images/playbook.png",
    level: "Intermediate",
  },
  {
    id: "playbook-8",
    title: "Strategi Investasi Infrastruktur EV",
    image: "/images/playbook.png",
    level: "Intermediate",
    locked: true,
    lockLevel: 4,
  },
  {
    id: "playbook-9",
    title: "Studi Kasus Fleet Elektrifikasi",
    image: "/images/playbook.png",
    level: "Intermediate",
    locked: true,
    lockLevel: 4,
  },
  {
    id: "playbook-10",
    title: "Integrasi Smart Grid dan EV",
    image: "/images/playbook.png",
    level: "Advance",
  },
  {
    id: "playbook-11",
    title: "Riset Teknologi Baterai Generasi Baru",
    image: "/images/playbook.png",
    level: "Advance",
    locked: true,
    lockLevel: 5,
  },
  {
    id: "playbook-12",
    title: "Kebijakan Elektrifikasi Nasional Mendalam",
    image: "/images/playbook.png",
    level: "Advance",
    locked: true,
    lockLevel: 5,
  },
];
