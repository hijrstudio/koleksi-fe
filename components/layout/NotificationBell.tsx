"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "@/components/i18n/Link";
import { AnimatePresence, motion } from "framer-motion";
import { TbBellFilled } from "react-icons/tb";
import {
  BadgeCheck,
  Bell,
  CalendarClock,
  CircleAlert,
  KeyRound,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import clsx from "@/lib/clsx";
import formatRupiah from "@/lib/formatRupiah";
import { type PayableState, billingCopy } from "@/lib/billingCopy";
import { markNotificationsRead } from "@/app/actions/notifications";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import type { Locale, MemberNotification, NotificationAlert, NotificationFeed } from "@/types";
import useDismiss from "./useDismiss";
import { format, useI18n } from "@/components/i18n/I18nProvider";

interface Row {
  key: string;
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  /** Hanya notifikasi tersimpan yang punya status dibaca; "perlu tindakan" selalu tampil menonjol. */
  unread: boolean;
  time?: string;
  notificationId?: string;
}

function alertRow(alert: NotificationAlert, t: Dictionary, locale: Locale): Row {
  switch (alert.kind) {
    case "change_password":
      return {
        key: "alert-password",
        icon: KeyRound,
        ...t.notifications.alerts.changePassword,
        href: "/dasbor/profile/ubah-kata-sandi",
        unread: true,
      };
    case "complete_profile":
      return {
        key: "alert-profile",
        icon: UserRound,
        ...t.notifications.alerts.completeProfile,
        href: "/dasbor/profile",
        unread: true,
      };
    case "billing": {
      // Alert iuran hanya dibuat kalau state ≠ "ok" (services/memberNotification.ts)
      const state = alert.billing.state as PayableState;
      const copy = billingCopy(alert.billing, state, t.payment, locale);
      return {
        key: "alert-billing",
        icon: state === "due_soon" ? CalendarClock : CircleAlert,
        title: copy.title,
        body: copy.description,
        href: "/dasbor",
        unread: true,
      };
    }
  }
}

/** "2 jam lalu" / "2 hours ago" */
function relativeTime(iso: string | null, locale: Locale): string | undefined {
  if (!iso) return undefined;

  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.trunc(seconds / size), unit);
  }

  return rtf.format(0, "minute");
}

function notificationRow(n: MemberNotification, t: Dictionary, locale: Locale): Row {
  const known = (t.notifications.types as Record<string, { title: string; body: string } | undefined>)[n.type];
  const changedAt = typeof n.params.changed_at === "string" ? n.params.changed_at : null;
  const values = {
    date: changedAt
      ? new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", {
          dateStyle: "long",
          timeStyle: "short",
          timeZone: "Asia/Jakarta",
        }).format(new Date(changedAt)) + " WIB"
      : "",
    amount: typeof n.params.amount === "number" ? formatRupiah(n.params.amount) : "",
    number: typeof n.params.no_lambung === "number" ? `#${String(n.params.no_lambung).padStart(3, "0")}` : "",
  };

  return {
    key: n.id,
    icon: n.type === "account.password_changed" ? ShieldCheck : n.type.startsWith("membership.") ? BadgeCheck : Bell,
    // Tipe yang belum dikenal website: teks (bahasa Indonesia) dari backend
    title: known?.title ?? n.title,
    body: known ? format(known.body, values) : n.message,
    href: n.type === "account.password_changed" ? "/dasbor/profile/ubah-kata-sandi" : "/dasbor",
    unread: !n.read,
    time: relativeTime(n.created_at, locale),
    notificationId: n.id,
  };
}

/**
 * Lonceng notifikasi (klik → panel). Isi dari /api/member/notifications: "perlu tindakan" (dihitung dari status
 * akun, hilang sendiri setelah diselesaikan) di atas, lalu notifikasi tersimpan dengan status dibaca.
 * Dimuat saat Header tampil (untuk angka badge) dan dimuat ulang setiap panel dibuka.
 */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [feed, setFeed] = useState<NotificationFeed | null>(null);
  const [error, setError] = useState(false);
  const { locale, t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/member/notifications", { cache: "no-store", signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setFeed(await res.json());
      setError(false);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError(true);
    }
  }, []);

  useEffect(() => {
    // Setelah render pertama (bukan di render): tidak ada setState sinkron di dalam effect
    const timer = setTimeout(() => void load(), 0);
    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [load]);

  function toggle() {
    if (!open) void load();
    setOpen((v) => !v);
  }

  /** Optimistis: tampilan langsung berubah; angka dari backend menimpa kalau berhasil. */
  function markRead(id?: string) {
    setFeed((f) =>
      f && {
        ...f,
        items: f.items.map((n) => (!id || n.id === id ? { ...n, read: true } : n)),
        unreadCount: id ? Math.max(0, f.unreadCount - (f.items.some((n) => n.id === id && !n.read) ? 1 : 0)) : 0,
      },
    );
    void markNotificationsRead(id).then((count) => {
      if (count !== null) setFeed((f) => f && { ...f, unreadCount: count });
    });
  }

  const alerts = feed?.alerts.map((a) => alertRow(a, t, locale)) ?? [];
  const items = feed?.items.map((n) => notificationRow(n, t, locale)) ?? [];
  const unreadCount = feed?.unreadCount ?? 0;
  const badge = alerts.length + unreadCount;

  function renderRow(row: Row) {
    const Icon = row.icon;
    const isAlert = !row.notificationId;

    return (
      <li key={row.key}>
        <Link
          href={row.href}
          onClick={() => {
            if (row.notificationId && row.unread) markRead(row.notificationId);
            close();
          }}
          className={clsx(
            "flex gap-3 px-4 py-3 transition hover:bg-muted-light dark:hover:bg-muted-dark",
            row.unread && !isAlert && "bg-koleksi-green/5",
          )}
        >
          <span
            className={clsx(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              isAlert
                ? "bg-koleksi-orange/10 text-koleksi-orange"
                : "bg-muted-light text-koleksi-navy dark:bg-muted-dark dark:text-ink-dark",
            )}
          >
            <Icon size={16} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={clsx(
                "block text-sm leading-5 text-koleksi-navy-dark dark:text-ink-dark",
                row.unread && "font-semibold",
              )}
            >
              {row.title}
            </span>
            <span className="mt-0.5 block text-xs leading-4 text-koleksi-navy-dark/70 dark:text-ink-dark/70">
              {row.body}
            </span>
            {row.time && (
              <span className="mt-1 block text-xs text-koleksi-navy-dark/50 dark:text-ink-dark/50">{row.time}</span>
            )}
          </span>
          {row.unread && !isAlert && (
            <span aria-label={t.notifications.unreadDot} className="mt-1.5 size-2 shrink-0 rounded-full bg-koleksi-green" />
          )}
        </Link>
      </li>
    );
  }

  const sectionLabelClass =
    "px-4 pt-3 pb-1 text-[11px] font-bold tracking-wide text-koleksi-navy-dark/50 uppercase dark:text-ink-dark/50";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={badge > 0 ? format(t.notifications.unread, { count: badge }) : t.notifications.title}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={toggle}
        className="relative flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
      >
        <TbBellFilled size={24} />
        {badge > 0 && (
          <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-koleksi-orange px-1 text-[10px] leading-4 font-bold text-white ring-2 ring-koleksi-green">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t.notifications.title}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[calc(100%+12px)] -right-14 z-50 w-90 max-w-[calc(100vw-32px)] origin-top-right overflow-hidden rounded-2xl border border-border-light bg-surface-light shadow-lg sm:right-0 dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border-light px-4 py-3 dark:border-border-dark">
              <p className="text-base font-bold text-koleksi-navy-dark dark:text-ink-dark">{t.notifications.title}</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markRead()}
                  className="text-xs font-bold text-koleksi-navy-dark/60 underline underline-offset-2 transition hover:text-koleksi-green dark:text-ink-dark/60"
                >
                  {t.notifications.markAllRead}
                </button>
              )}
            </div>

            {!feed ? (
              <p className="px-4 py-8 text-center text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                {error ? t.notifications.loadError : t.common.loading}
              </p>
            ) : alerts.length === 0 && items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                {t.notifications.empty}
              </p>
            ) : (
              <div className="max-h-96 overflow-y-auto pb-1">
                {alerts.length > 0 && (
                  <>
                    <p className={sectionLabelClass}>{t.notifications.needsAction}</p>
                    <ul>{alerts.map(renderRow)}</ul>
                  </>
                )}
                {items.length > 0 && (
                  <>
                    {alerts.length > 0 && <p className={sectionLabelClass}>{t.notifications.recent}</p>}
                    <ul>{items.map(renderRow)}</ul>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
