import { Bookmark, Share2 } from "lucide-react";
import clsx from "@/lib/clsx";

/**
 * Tombol Simpan + Bagikan di halaman detail (artikel, berita, diskusi).
 * Halaman detail merendernya dua kali: di atas bagian bawah konten untuk
 * layar < 768px, dan di <aside> kanan/bawah untuk layar >= 768px.
 *
 * variant "green" (default): Simpan hijau -- artikel & berita.
 * variant "navy": Simpan navy + Bagikan border navy -- diskusi forum.
 */
export default function ContentActions({
  className,
  variant = "green",
}: {
  className?: string;
  variant?: "green" | "navy";
}) {
  const isNavy = variant === "navy";

  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      <button
        type="button"
        className={clsx(
          "flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition",
          isNavy
            ? "bg-koleksi-navy-deep hover:bg-koleksi-navy"
            : "bg-koleksi-green hover:bg-koleksi-green-dark",
        )}
      >
        <Bookmark size={16} />
        Simpan
      </button>
      <button
        type="button"
        className={clsx(
          "flex w-full items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold text-koleksi-navy-dark transition dark:text-ink-dark",
          isNavy
            ? "border-koleksi-navy-deep hover:border-koleksi-navy-deep/60 dark:border-ink-dark"
            : "border-border-light hover:border-koleksi-navy-deep dark:border-border-dark",
        )}
      >
        <Share2 size={16} />
        Bagikan
      </button>
    </div>
  );
}
