"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { TbBellFilled } from "react-icons/tb";
import {
  BadgeCheck,
  CalendarDays,
  MessageSquare,
  Star,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import clsx from "@/lib/clsx";
import { notificationItems } from "@/data/mockData";
import type { NotificationItem } from "@/types";
import useDismiss from "./useDismiss";

const TYPE_ICON: Record<NotificationItem["type"], LucideIcon> = {
  kegiatan: CalendarDays,
  forum: MessageSquare,
  profil: UserRound,
  poin: Star,
  keanggotaan: BadgeCheck,
};

/** Lonceng notifikasi (klik -> panel daftar notifikasi). */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notificationItems);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const unread = items.filter((n) => !n.read).length;

  function markRead(id?: string) {
    setItems((list) =>
      list.map((n) => (!id || n.id === id ? { ...n, read: true } : n)),
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={
          unread > 0 ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="relative flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
      >
        <TbBellFilled size={24} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-koleksi-orange px-1 text-[10px] leading-4 font-bold text-white ring-2 ring-koleksi-green">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Notifikasi"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[calc(100%+12px)] -right-14 z-50 w-90 max-w-[calc(100vw-32px)] origin-top-right overflow-hidden rounded-2xl border border-border-light bg-surface-light shadow-lg sm:right-0 dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border-light px-4 py-3 dark:border-border-dark">
              <p className="text-base font-bold text-koleksi-navy-dark dark:text-ink-dark">
                Notifikasi
              </p>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={() => markRead()}
                  className="text-xs font-bold text-koleksi-navy-dark/60 underline underline-offset-2 transition hover:text-koleksi-green dark:text-ink-dark/60"
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                Belum ada notifikasi.
              </p>
            ) : (
              <ul className="max-h-96 overflow-y-auto py-1">
                {items.map((n) => {
                  const Icon = TYPE_ICON[n.type];
                  return (
                    <li key={n.id}>
                      <Link
                        href={n.href}
                        onClick={() => {
                          markRead(n.id);
                          close();
                        }}
                        className={clsx(
                          "flex gap-3 px-4 py-3 transition hover:bg-muted-light dark:hover:bg-muted-dark",
                          !n.read && "bg-koleksi-green/5",
                        )}
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted-light text-koleksi-navy dark:bg-muted-dark dark:text-ink-dark">
                          <Icon size={16} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={clsx(
                              "block text-sm leading-5 text-koleksi-navy-dark dark:text-ink-dark",
                              !n.read && "font-semibold",
                            )}
                          >
                            {n.title}
                          </span>
                          <span className="mt-1 block text-xs text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                            {n.time}
                          </span>
                        </span>
                        {!n.read && (
                          <span
                            aria-label="Belum dibaca"
                            className="mt-1.5 size-2 shrink-0 rounded-full bg-koleksi-green"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
