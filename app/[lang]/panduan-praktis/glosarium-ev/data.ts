import type { LocalizedText } from "@/types";

export interface GlossaryTerm {
  id: string;
  letter: string;
  title: string;
  summary: LocalizedText;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "ev",
    letter: "E",
    title: "EV (Electric Vehicle)",
    summary: {
      id: "Istilah umum untuk kendaraan yang digerakkan oleh motor listrik.",
      en: "A general term for vehicles powered by an electric motor.",
    },
  },
  {
    id: "koleksi",
    letter: "K",
    title: "KOLEKSI",
    summary: {
      id: "Komunitas Mobil Elektrik Indonesia (KOLEKSI), merupakan perkumpulan otomotif, wadah silaturahmi dan komunikasi pemilik, pengguna dan pemerhati/pencinta mobil listrik di Indonesia.",
      en: "The Indonesian Electric Car Community (KOLEKSI) is an automotive association and a place for owners, users, and enthusiasts of electric cars in Indonesia to connect and communicate.",
    },
  },
  {
    id: "kw",
    letter: "K",
    title: "kW (Kilowatt)",
    summary: {
      id: "Satuan daya listrik yang mengukur seberapa cepat energi digunakan atau dihasilkan.",
      en: "A unit of electrical power that measures how quickly energy is used or produced.",
    },
  },
  {
    id: "level-1-charging",
    letter: "L",
    title: "Level 1 Charging",
    summary: {
      id: "Pengisian lambat menggunakan colokan rumah standar (110V).",
      en: "Slow charging using a standard household outlet (110V).",
    },
  },
  {
    id: "soc",
    letter: "S",
    title: "SOC (State of Charge)",
    summary: {
      id: "Indikator tingkat pengisian baterai saat ini, biasanya ditampilkan dalam persentase.",
      en: "An indicator of the battery's current charge level, usually shown as a percentage.",
    },
  },
];

export interface GlossaryGroup {
  letter: string;
  terms: GlossaryTerm[];
}

export function groupGlossaryTerms(terms: GlossaryTerm[]): GlossaryGroup[] {
  const groups: GlossaryGroup[] = [];
  for (const term of terms) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.letter === term.letter) {
      lastGroup.terms.push(term);
    } else {
      groups.push({ letter: term.letter, terms: [term] });
    }
  }
  return groups;
}
