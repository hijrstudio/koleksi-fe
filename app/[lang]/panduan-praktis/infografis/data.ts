export interface InfografisItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

const baseInfografis: Omit<InfografisItem, "id">[] = [
  {
    title: "Komunitas Mobil Listrik",
    category: "Kendaraan",
    image: "/images/infografis-1.jpg",
  },
  {
    title: "KOLEKSI",
    category: "Teknologi",
    image: "/images/infografis-2.jpg",
  },
  {
    title: "Komunitas Mobil Listrik",
    category: "Kendaraan",
    image: "/images/infografis-3.jpg",
  },
  {
    title: "KOLEKSI",
    category: "Teknologi",
    image: "/images/infografis-4.jpg",
  },
  {
    title: "Komunitas Mobil Listrik",
    category: "Kendaraan",
    image: "/images/infografis-5.jpg",
  },
  {
    title: "KOLEKSI",
    category: "Teknologi",
    image: "/images/infografis-6.jpg",
  },
];

export const INFOGRAFIS_PER_PAGE = 6;
const TOTAL_INFOGRAFIS = 60;

export const infografisItems: InfografisItem[] = Array.from(
  { length: TOTAL_INFOGRAFIS },
  (_, i) => {
    const base = baseInfografis[i % baseInfografis.length];
    return {
      ...base,
      id: `infografis-${i + 1}`,
    };
  },
);
