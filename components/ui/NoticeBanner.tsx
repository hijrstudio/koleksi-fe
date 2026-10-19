"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface NoticeBannerProps {
  message: string;
  actionLabel: string;
  /** Ada href = aksi jadi link (mis. "Cek" ke profil); tanpa href = tombol
   *  yang menutup banner (mis. "Mengerti"). */
  href?: string;
}

const actionClass =
  "shrink-0 font-bold underline underline-offset-2 transition hover:text-koleksi-green";

/** Banner krem kecil di atas konten (mis. "*Wajib diisi" di Daftar,
 *  "Silakan melengkapi data profil Anda" di Dasbor). */
export default function NoticeBanner({
  message,
  actionLabel,
  href,
}: NoticeBannerProps) {
  const [open, setOpen] = useState(true);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex min-h-9.25 w-full max-w-142.5 items-center justify-between gap-4 rounded-lg bg-[#f3e5c9] px-5 py-2 text-xs text-koleksi-navy-dark shadow-sm"
        >
          <span>{message}</span>
          {href ? (
            <Link href={href} className={actionClass}>
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={actionClass}
            >
              {actionLabel}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
