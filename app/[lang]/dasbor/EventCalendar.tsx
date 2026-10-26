"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "@/components/i18n/Link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import clsx from "@/lib/clsx";
import { format, useI18n } from "@/components/i18n/I18nProvider";

export interface CalendarEvent {
  /** ISO "YYYY-MM-DD". */
  date: string;
  slug: string;
  title: string;
}

// Label hari mengikuti desain (S M T W T F S, mulai Minggu); nama lengkap
// untuk screen reader.
const WEEKDAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

function toIso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatLong(iso: string, monthsShort: readonly string[]) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${monthsShort[m - 1]} ${y}`;
}

// "Hari ini" cuma dibaca di client: server render (build) gak tahu tanggal
// pengunjung, jadi server snapshot = null supaya gak hydration mismatch.
const noopSubscribe = () => () => {};
function useTodayIso() {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      const t = new Date();
      return toIso(t.getFullYear(), t.getMonth(), t.getDate());
    },
    () => null,
  );
}

export default function EventCalendar({ events }: { events: CalendarEvent[] }) {
  const today = useTodayIso();
  const { t } = useI18n();
  const MONTHS_SHORT = t.calendar.monthsShort;
  const WEEKDAYS = t.calendar.weekdays.map((full, i) => ({ full, short: WEEKDAY_LETTERS[i] }));
  const labels = t.dashboard.calendar;
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Bulan tampil: pilihan user, atau bulan "hari ini" begitu diketahui.
  const current =
    view ??
    (today
      ? { y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) - 1 }
      : null);

  const byDate = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const list = byDate.get(ev.date) ?? [];
    list.push(ev);
    byDate.set(ev.date, list);
  }

  // Tutup popover (lebih dari 1 kegiatan di 1 hari) saat klik di luar / Esc.
  useEffect(() => {
    if (!selected) return;
    function onDown(e: MouseEvent) {
      if (!popoverRef.current?.contains(e.target as Node)) setSelected(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  function shiftMonth(delta: number) {
    if (!current) return;
    const d = new Date(current.y, current.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
    setSelected(null);
  }

  // 6 baris x 7 kolom (42 sel), mulai Minggu -- sama dengan desain.
  const cells: { iso: string; day: number; inMonth: boolean }[] = [];
  if (current) {
    const first = new Date(current.y, current.m, 1);
    const start = new Date(current.y, current.m, 1 - first.getDay());
    for (let i = 0; i < 42; i++) {
      const d = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + i,
      );
      cells.push({
        iso: toIso(d.getFullYear(), d.getMonth(), d.getDate()),
        day: d.getDate(),
        inMonth: d.getMonth() === current.m,
      });
    }
  }

  const selectedEvents = selected ? (byDate.get(selected) ?? []) : [];

  return (
    <div className="relative">
      <div className="rounded-lg bg-muted-light px-2.5 pt-2.5 pb-3 dark:bg-muted-dark">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label={t.calendar.previousMonth}
            onClick={() => shiftMonth(-1)}
            className="flex size-6 items-center justify-center rounded-full text-koleksi-navy-dark/40 transition hover:bg-koleksi-navy-dark/5 hover:text-koleksi-navy-dark dark:text-ink-dark/40"
          >
            <ChevronLeft size={14} />
          </button>
          <p
            aria-live="polite"
            className="text-xs font-bold text-koleksi-navy-dark dark:text-ink-dark"
          >
            {current ? `${MONTHS_SHORT[current.m]} ${current.y}` : " "}
          </p>
          <button
            type="button"
            aria-label={t.calendar.nextMonth}
            onClick={() => shiftMonth(1)}
            className="flex size-6 items-center justify-center rounded-full text-koleksi-navy-dark/40 transition hover:bg-koleksi-navy-dark/5 hover:text-koleksi-navy-dark dark:text-ink-dark/40"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="mt-2 grid grid-cols-7 gap-y-1 text-center">
          {WEEKDAYS.map((w) => (
            <abbr
              key={w.full}
              title={w.full}

              className="flex h-6 items-center justify-center text-[10px] font-bold text-koleksi-navy-dark no-underline dark:text-ink-dark"
            >
              {w.short}
            </abbr>
          ))}

          {current
            ? cells.map((c) => {
                const dayEvents = c.inMonth ? byDate.get(c.iso) : undefined;
                const isToday = c.iso === today;
                const base = clsx(
                  "mx-auto flex size-6 items-center justify-center rounded-full text-[10px] transition",
                  !c.inMonth &&
                    "text-koleksi-navy-dark/30 dark:text-ink-dark/30",
                  c.inMonth &&
                    !isToday &&
                    "text-koleksi-navy-dark dark:text-ink-dark",
                  isToday && "bg-koleksi-green font-bold text-white",
                  dayEvents &&
                    !isToday &&
                    "bg-[#f3e5c9] font-bold text-koleksi-navy-dark! dark:bg-koleksi-amber/40",
                );

                if (!dayEvents) {
                  return (
                    <span key={c.iso} className={base}>
                      {c.day}
                    </span>
                  );
                }

                const label = `${formatLong(c.iso, MONTHS_SHORT)}: ${dayEvents.map((e) => e.title).join(", ")}`;
                return dayEvents.length === 1 ? (
                  <Link
                    key={c.iso}

                    href={`/kegiatan/${dayEvents[0].slug}`}
                    title={dayEvents[0].title}
                    aria-label={label}
                    className={clsx(
                      base,
                      "hover:ring-2 hover:ring-koleksi-amber",
                    )}
                  >
                    {c.day}
                  </Link>
                ) : (
                  <button
                    key={c.iso}

                    type="button"
                    aria-label={label}
                    aria-haspopup="dialog"
                    aria-expanded={selected === c.iso}
                    onClick={() =>
                      setSelected(selected === c.iso ? null : c.iso)
                    }
                    className={clsx(
                      base,
                      "cursor-pointer hover:ring-2 hover:ring-koleksi-amber",
                      selected === c.iso && "ring-2 ring-koleksi-amber",
                    )}
                  >
                    {c.day}
                  </button>
                );
              })
            : // Placeholder sebelum tanggal client diketahui (hindari mismatch).
              Array.from({ length: 42 }, (_, i) => (
                <span key={i} className="mx-auto size-6" />
              ))}
        </div>
      </div>

      {/* Keterangan warna */}
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-koleksi-navy-dark/60 dark:text-ink-dark/60">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#f3e5c9] dark:bg-koleksi-amber/40" />
          {labels.events}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-koleksi-green" />
          {labels.today}
        </span>
      </div>

      {/* Popover: lebih dari 1 kegiatan di tanggal yang dipilih */}
      <AnimatePresence>
        {selected && selectedEvents.length > 1 && (
          <motion.div
            ref={popoverRef}
            role="dialog"
            aria-label={format(labels.dayEvents, { date: formatLong(selected, MONTHS_SHORT) })}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[calc(100%+8px)] right-0 z-30 w-full min-w-64 rounded-2xl border border-border-light bg-surface-light p-2 shadow-lg dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-xs font-bold text-koleksi-navy-dark dark:text-ink-dark">
                {formatLong(selected, MONTHS_SHORT)} · {format(labels.eventCount, { count: selectedEvents.length })}
              </p>
              <button
                type="button"
                aria-label={t.common.close}
                onClick={() => setSelected(null)}
                className="rounded-full p-1 text-koleksi-navy-dark/50 transition hover:text-koleksi-navy-dark dark:text-ink-dark/50"
              >
                <X size={14} />
              </button>
            </div>
            <ul>
              {selectedEvents.map((ev) => (
                <li key={ev.slug}>
                  <Link
                    href={`/kegiatan/${ev.slug}`}
                    className="block rounded-lg px-2 py-2 text-sm text-koleksi-navy-dark/70 transition hover:bg-muted-light hover:text-koleksi-green dark:text-ink-dark/70 dark:hover:bg-muted-dark"
                  >
                    {ev.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
