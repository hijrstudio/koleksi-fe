import Image from "next/image";
import { Info } from "lucide-react";
import clsx from "@/lib/clsx";
import type { DashboardProfile } from "./data";

export default function ProfileCard({ user }: { user: DashboardProfile }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-border-light p-4 text-center sm:flex-row sm:items-center sm:text-left dark:border-border-dark">
      <Image
        src={user.avatar}
        alt={user.name}
        width={136}
        height={136}
        className="size-28 shrink-0 rounded-full object-cover sm:size-34"
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start">
          <span className="rounded-md bg-muted-light px-1.5 py-0.5 text-[10px] leading-3 text-koleksi-navy-dark dark:bg-muted-dark dark:text-ink-dark">
            Level {user.level}
          </span>
          <span className="text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/60">
            {user.xp} XP · {user.points} Poin
          </span>

          {/* Keterangan XP & Poin -- muncul saat hover/focus. */}
          <span className="group relative inline-flex">
            <button
              type="button"
              aria-label="Apa itu XP dan Poin?"
              aria-describedby="xp-poin-info"
              className="rounded-full text-koleksi-navy-dark/30 transition hover:text-koleksi-navy-dark/60 focus-visible:text-koleksi-navy-dark/60 focus-visible:outline-none dark:text-ink-dark/30"
            >
              <Info size={16} fill="currentColor" stroke="white" />
            </button>
            <span
              id="xp-poin-info"
              role="tooltip"
              className="pointer-events-none invisible absolute top-[calc(100%+8px)] left-1/2 z-20 w-60 -translate-x-1/2 rounded-xl bg-koleksi-navy-dark px-3.5 py-3 text-left text-xs leading-4 text-white opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
            >
              <b>XP</b> bertambah dari aktivitas Anda di forum, kegiatan, dan
              konten KOLEKSI -- makin banyak XP, makin tinggi Level. <b>Poin</b>{" "}
              bisa ditukar dengan benefit & merchandise anggota.
            </span>
          </span>
        </div>

        <p className="mt-1.5 text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
          {user.name}
        </p>
        <p className="mt-1 text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/60">
          No. Lambung {user.noLambung}
        </p>

        <dl className="mt-3 space-y-1 text-xs text-koleksi-navy-dark dark:text-ink-dark">
          <div className="flex flex-wrap justify-center gap-x-1.5 sm:justify-start">
            <dt className="text-koleksi-navy-dark/60 dark:text-ink-dark/60">
              Lokasi:
            </dt>
            <dd>{user.location}</dd>
          </div>
          <div className="flex flex-wrap justify-center gap-x-1.5 sm:justify-start">
            <dt className="text-koleksi-navy-dark/60 dark:text-ink-dark/60">
              Status:
            </dt>
            <dd
              className={clsx(
                "font-bold",
                user.isActive ? "text-koleksi-green" : "text-red-600 dark:text-red-400",
              )}
            >
              {user.status}
            </dd>
            <dd className="text-koleksi-navy-dark/60 dark:text-ink-dark/60">
              (Berlaku: {user.validFrom} - {user.validUntil})
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
