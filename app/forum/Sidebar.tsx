import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import SectionSidebar from "@/components/layout/SectionSidebar";

const navItems = [
  { label: "Diskusi", href: "/forum/diskusi" },
  { label: "Kategori & Room", href: "/forum/kategori-room" },
  { label: "Direktori Anggota", href: "/forum/direktori-anggota" },
  { label: "Polling & Voting", href: "/forum/polling-voting" },
  { label: "Papan Peringkat", href: "/forum/papan-peringkat" },
  { label: "Panduan Komunitas", href: "/forum/panduan-komunitas" },
];

// Mock -- ganti dengan data dari API saat backend forum sudah ada.
const forumStats = [
  { label: "Diskusi", value: "100" },
  { label: "Pesan", value: "12.3K" },
  { label: "Online", value: "26" },
];

export default function Sidebar() {
  return (
    <SectionSidebar items={navItems}>
      {/* Sejajar dengan menu: md:px-4 sama seperti padding <nav> */}
      <div className="md:px-4">
        <Link
          href="/forum/diskusi/buat"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-koleksi-amber px-6 py-2 text-base leading-6 font-bold text-koleksi-navy-deep transition hover:opacity-90"
        >
          <FaPlus size={16} />
          Buat Diskusi
        </Link>

        <div className="mt-9 h-px w-full bg-koleksi-navy-dark/10 dark:bg-white/10" />

        <h3 className="mt-8 text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
          Statistik
        </h3>
        <dl className="mt-4 grid grid-cols-3 gap-4">
          {forumStats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-sm leading-5 text-koleksi-navy-dark/80 dark:text-ink-dark/60">
                {stat.label}:
              </dt>
              <dd className="mt-0.5 text-sm leading-5 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <Link
          href="/forum/lapor-pelanggaran"
          className="mt-8 inline-block text-xs text-koleksi-navy-dark/60 underline transition hover:text-koleksi-navy-dark dark:text-ink-dark/60"
        >
          Lapor Pelanggaran
        </Link>
      </div>
    </SectionSidebar>
  );
}
