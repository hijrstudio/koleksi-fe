export interface DokumenRegulasiItem {
  id: string;
  title: string;
  url: string;
}

const baseDokumen: Omit<DokumenRegulasiItem, "id">[] = [
  {
    title: "Kepmen esdm 182k_TL04_MEM_S_2023",
    url: "#",
  },
  {
    title: "PERATURAN MENHUB NO PM 13 TAHUN 2024 Kewajiban Kelengkapan APAR",
    url: "#",
  },
  {
    title: "PERDA NO.1 TAHUN 2024 PDRB",
    url: "#",
  },
  {
    title: "PERGUB NO. 41 TAHUN 2021 (NJKB)",
    url: "#",
  },
  {
    title: "PERGUB_NO._3_TAHUN_2021-Insentif Pajak Zero BBNKB",
    url: "#",
  },
  {
    title: "PERMENPERIN NO. 6 TAHUN 2022 Kendaraan Bermotor Listrik",
    url: "#",
  },
  {
    title: "PERPRES NO. 55 TAHUN 2019 Percepatan Program KBLBB",
    url: "#",
  },
  {
    title: "PERMENHUB NO. 21 TAHUN 2020 Konversi Sepeda Motor Listrik",
    url: "#",
  },
];

export const DOKUMEN_REGULASI_PER_PAGE = 5;
const TOTAL_DOKUMEN = 24;

export const dokumenRegulasiItems: DokumenRegulasiItem[] = Array.from(
  { length: TOTAL_DOKUMEN },
  (_, i) => {
    const base = baseDokumen[i % baseDokumen.length];
    return {
      ...base,
      id: `dokumen-regulasi-${i + 1}`,
    };
  },
);
