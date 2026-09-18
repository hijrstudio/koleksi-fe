import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ViewAllLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="mt-8 inline-flex items-center underline underline-offset-4 leading-6 text-base font-bold text-koleksi-navy-dark/60 transition hover:text-koleksi-green dark:text-ink-dark/80"
    >
      Lihat Semua
    </Link>
  );
}
