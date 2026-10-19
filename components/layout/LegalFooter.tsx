import Link from "next/link";

/** Footer mini (Syarat & Ketentuan, Kebijakan Privasi, copyright) -- dipakai
 *  di halaman auth & dasbor sebagai pengganti Footer besar. */
export default function LegalFooter({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex gap-4 text-xs font-bold text-koleksi-navy-dark dark:text-ink-dark">
        <Link
          href="/syarat-ketentuan"
          className="underline transition hover:text-koleksi-green"
        >
          Syarat &amp; Ketentuan
        </Link>
        <Link
          href="/kebijakan-privasi"
          className="underline transition hover:text-koleksi-green"
        >
          Kebijakan Privasi
        </Link>
      </div>
      <p className="mt-2 text-xs text-koleksi-navy-dark/50 dark:text-ink-dark/50">
        &copy; {new Date().getFullYear()} KOLEKSI CLUB. All Rights Reserved.
      </p>
    </div>
  );
}
