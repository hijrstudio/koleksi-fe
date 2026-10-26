"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/i18n/Link";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import useDismiss from "./useDismiss";
import { useI18n } from "@/components/i18n/I18nProvider";

export interface HeaderUser {
  name: string;
  avatar: string;
}

const itemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold text-ink-light/60 transition hover:bg-muted-light hover:text-koleksi-green dark:text-ink-dark dark:hover:bg-muted-dark";

/** Avatar di Header -- hover (desktop) atau klik (touch/keyboard) membuka
 *  dropdown Dasbor & Keluar. */
export default function UserMenu({ user }: { user: HeaderUser }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`${t.header.accountMenu} ${user.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="block rounded-full ring-2 ring-white/0 transition hover:ring-white/40 focus-visible:ring-white/60 focus-visible:outline-none"
      >
        <Image
          src={user.avatar}
          alt=""
          width={44}
          height={44}
          className="size-11 rounded-full object-cover"
        />
      </button>

      <AnimatePresence>
        {open && (
          // pt-3 = "jembatan" hover antara avatar & panel supaya dropdown
          // gak ketutup saat kursor turun.
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 z-50 origin-top-right pt-3"
          >
            <div
              role="menu"
              aria-label={t.header.accountMenu}
              className="min-w-50 rounded-xl border border-border-light bg-surface-light p-2 shadow-lg dark:border-border-dark dark:bg-surface-dark"
            >
              <p className="truncate px-3 pt-1 pb-2 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                <b className="text-koleksi-navy-dark dark:text-ink-dark">
                  {user.name}
                </b>
              </p>
              <Link
                role="menuitem"
                href="/dasbor"
                onClick={close}
                className={itemClass}
              >
                <LayoutDashboard size={16} aria-hidden="true" />
                {t.common.dashboard}
              </Link>
              {/* Server Action: cabut token di backend, hapus cookie sesi, lalu ke /masuk. */}
              <form action={logout}>
                <button role="menuitem" type="submit" className={itemClass}>
                  <LogOut size={16} aria-hidden="true" />
                  {t.common.logout}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
