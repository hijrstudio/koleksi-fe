import { Bookmark, Share2 } from "lucide-react";
import clsx from "@/lib/clsx";

/**
 * Tombol Simpan + Bagikan di halaman detail (artikel & berita).
 * Halaman detail merendernya dua kali: di atas "... Terkait" untuk layar
 * < 768px, dan di <aside> kanan/bawah untuk layar >= 768px.
 */
export default function ContentActions({ className }: { className?: string }) {
  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-koleksi-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-koleksi-green-dark"
      >
        <Bookmark size={16} />
        Simpan
      </button>
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-full border border-border-light px-5 py-2.5 text-sm font-bold text-koleksi-navy-dark transition hover:border-koleksi-navy-deep dark:border-border-dark dark:text-ink-dark"
      >
        <Share2 size={16} />
        Bagikan
      </button>
    </div>
  );
}
