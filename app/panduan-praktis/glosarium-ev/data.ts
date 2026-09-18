export interface GlossaryTerm {
  id: string;
  letter: string;
  title: string;
  summary: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "ev",
    letter: "E",
    title: "EV (Electric Vehicle)",
    summary: "Istilah umum untuk kendaraan yang digerakkan oleh motor listrik.",
  },
  {
    id: "koleksi",
    letter: "K",
    title: "KOLEKSI",
    summary:
      "Komunitas Mobil Elektrik Indonesia (KOLEKSI), merupakan perkumpulan otomotif, wadah silaturahmi dan komunikasi pemilik, pengguna dan pemerhati/pencinta mobil listrik di Indonesia.",
  },
  {
    id: "kw",
    letter: "K",
    title: "kW (Kilowatt)",
    summary: "Satuan daya listrik yang mengukur seberapa cepat energi digunakan atau dihasilkan.",
  },
  {
    id: "level-1-charging",
    letter: "L",
    title: "Level 1 Charging",
    summary: "Pengisian lambat menggunakan colokan rumah standar (110V).",
  },
  {
    id: "soc",
    letter: "S",
    title: "SOC (State of Charge)",
    summary:
      "Indikator tingkat pengisian baterai saat ini, biasanya ditampilkan dalam persentase.",
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
