/** 1500000 -> "Rp1.500.000" (pemisah ribuan titik, tanpa spasi -- sesuai desain). */
export default function formatRupiah(amount: number): string {
  return `Rp${Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** Harga tunggal atau rentang: "Rp100.000.000 – Rp123.000.000". */
export function formatRupiahRange(min: number, max?: number): string {
  if (max === undefined || max === min) return formatRupiah(min);
  return `${formatRupiah(min)} – ${formatRupiah(max)}`;
}
