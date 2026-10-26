"use client";

import {
  type InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "@/lib/clsx";
import { authInputClass } from "@/components/auth/authStyles";
import useDismiss from "@/components/layout/useDismiss";
import { useI18n } from "@/components/i18n/I18nProvider";

interface Ymd {
  y: number;
  m: number; // 0-11
  d: number;
}

const pad = (n: number) => String(n).padStart(2, "0");
const toDisplay = ({ y, m, d }: Ymd) => `${pad(d)} / ${pad(m + 1)} / ${y}`;
const toKey = ({ y, m, d }: Ymd) => y * 10000 + m * 100 + d;

/** "10 / 05 / 1973" → {y, m, d}; null kalau belum lengkap / tanggal tidak ada. */
function parseDisplay(value: string): Ymd | null {
  const match = value.match(/^(\d{2}) \/ (\d{2}) \/ (\d{4})$/);
  if (!match) return null;

  const [d, m, y] = [Number(match[1]), Number(match[2]) - 1, Number(match[3])];
  const date = new Date(y, m, d);

  return date.getFullYear() === y && date.getMonth() === m && date.getDate() === d ? { y, m, d } : null;
}

/** "01011990" → "01 / 01 / 1990" sambil diketik. */
function maskDisplay(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join(" / ");
}

type DatePickerInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "min" | "max"> & {
  /** Format tampilan "DD / MM / YYYY" (string kosong = belum diisi). */
  value: string;
  onChange: (value: string) => void;
  /** Tahun paling awal di pilihan tahun. */
  minYear?: number;
  /** Tanggal terakhir yang boleh dipilih; default hari ini (cocok untuk tanggal lahir). */
  max?: Date;
  /** Bulan yang dibuka pertama kali kalau belum ada nilai. */
  defaultView?: { y: number; m: number };
};

/**
 * Input tanggal "DD / MM / YYYY": bisa diketik langsung, atau dipilih dari kalender (ikon di kanan).
 * Kalender punya pilihan bulan & tahun supaya cepat untuk tanggal jauh ke belakang (tanggal lahir).
 */
export default function DatePickerInput({
  value,
  onChange,
  minYear = 1900,
  max,
  defaultView,
  id,
  className,
  disabled,
  ...rest
}: DatePickerInputProps) {
  const { t } = useI18n();
  const MONTHS = t.calendar.months;
  // Mulai Minggu
  const WEEKDAYS = t.calendar.weekdays.map((full, i) => ({ full, short: t.calendar.weekdaysShort[i] }));
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<{ y: number; m: number }>({ y: 1990, m: 0 });
  const [maxYmd, setMaxYmd] = useState<Ymd | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const selected = parseDisplay(value);

  function openPicker() {
    // "Hari ini" dihitung saat dibuka (client), bukan saat render server → tidak ada hydration mismatch.
    const limit = max ?? new Date();
    const limitYmd = { y: limit.getFullYear(), m: limit.getMonth(), d: limit.getDate() };
    setMaxYmd(limitYmd);
    setView(
      selected
        ? { y: selected.y, m: selected.m }
        : (defaultView ?? { y: limitYmd.y - 30, m: limitYmd.m }),
    );
    setOpen(true);
  }

  // Fokus ke tanggal terpilih (atau tanggal pertama yang bisa dipilih) saat kalender dibuka
  useEffect(() => {
    if (!open) return;
    const target =
      gridRef.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]') ??
      gridRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)");
    target?.focus();
  }, [open]);

  function choose(day: Ymd) {
    onChange(toDisplay(day));
    setOpen(false);
    toggleRef.current?.focus();
  }

  function shiftMonth(delta: number) {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  }

  const lastYear = maxYmd?.y ?? new Date().getFullYear();
  const years = Array.from({ length: lastYear - minYear + 1 }, (_, i) => lastYear - i);
  const canPrev = view.y > minYear || view.m > 0;
  const canNext = !maxYmd || view.y < maxYmd.y || (view.y === maxYmd.y && view.m < maxYmd.m);

  // 6 baris x 7 kolom, mulai Minggu (sama dengan kalender kegiatan di Dasbor)
  const first = new Date(view.y, view.m, 1);
  const cells = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(view.y, view.m, 1 - first.getDay() + i);
    const ymd = { y: date.getFullYear(), m: date.getMonth(), d: date.getDate() };
    return {
      ...ymd,
      inMonth: ymd.m === view.m,
      disabled: (maxYmd !== null && toKey(ymd) > toKey(maxYmd)) || ymd.y < minYear,
      isSelected: selected !== null && toKey(ymd) === toKey(selected),
      isToday: maxYmd !== null && !max && toKey(ymd) === toKey(maxYmd),
    };
  });

  const navButtonClass =
    "flex size-8 items-center justify-center rounded-full text-koleksi-navy-dark/50 transition hover:bg-koleksi-navy-dark/5 hover:text-koleksi-navy-dark disabled:pointer-events-none disabled:opacity-30 dark:text-ink-dark/50 dark:hover:bg-white/5 dark:hover:text-ink-dark";
  const headerSelectClass =
    "cursor-pointer rounded-md bg-transparent px-1 py-1 text-sm font-bold text-koleksi-navy-dark transition hover:bg-koleksi-navy-dark/5 focus-visible:ring-2 focus-visible:ring-koleksi-green focus-visible:outline-none dark:text-ink-dark dark:hover:bg-white/5";

  return (
    <div ref={ref} className="relative">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder="DD / MM / YYYY"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(maskDisplay(e.target.value))}
        className={clsx(authInputClass, "pr-14", className)}
        {...rest}
      />
      <button
        ref={toggleRef}
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPicker())}
        aria-label={open ? t.calendar.closeCalendar : t.calendar.openCalendar}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id ? `${id}-calendar` : undefined}
        className="absolute inset-y-0 right-0 flex w-14 items-center justify-center rounded-r-lg text-koleksi-navy-dark/40 transition hover:text-koleksi-navy-dark focus-visible:text-koleksi-navy-dark focus-visible:outline-none disabled:cursor-not-allowed dark:text-ink-dark/40 dark:hover:text-ink-dark"
      >
        <CalendarDays size={20} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={id ? `${id}-calendar` : undefined}
            role="dialog"
            aria-label={t.calendar.chooseDate}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 z-40 mt-2 w-full max-w-80 origin-top-left rounded-xl border border-border-light bg-surface-light p-3 shadow-lg dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="flex items-center justify-between gap-1">
              <button type="button" aria-label={t.calendar.previousMonth} disabled={!canPrev} onClick={() => shiftMonth(-1)} className={navButtonClass}>
                <ChevronLeft size={16} aria-hidden="true" />
              </button>

              <div className="flex items-center">
                <select
                  aria-label={t.calendar.month}
                  value={view.m}
                  onChange={(e) => setView((v) => ({ ...v, m: Number(e.target.value) }))}
                  className={headerSelectClass}
                >
                  {MONTHS.map((name, m) => (
                    <option
                      key={name}
                      value={m}
                      disabled={!!maxYmd && view.y === maxYmd.y && m > maxYmd.m}
                      className="text-koleksi-navy-dark"
                    >
                      {name}
                    </option>
                  ))}
                </select>
                <select
                  aria-label={t.calendar.year}
                  value={view.y}
                  onChange={(e) => {
                    const y = Number(e.target.value);
                    // Bulan di tahun berjalan yang belum lewat → mundur ke bulan terakhir yang boleh
                    setView((v) => ({ y, m: maxYmd && y === maxYmd.y ? Math.min(v.m, maxYmd.m) : v.m }));
                  }}
                  className={headerSelectClass}
                >
                  {years.map((y) => (
                    <option key={y} value={y} className="text-koleksi-navy-dark">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button type="button" aria-label={t.calendar.nextMonth} disabled={!canNext} onClick={() => shiftMonth(1)} className={navButtonClass}>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>

            <div ref={gridRef} className="mt-2 grid grid-cols-7 gap-y-1 text-center">
              {WEEKDAYS.map((w) => (
                <abbr
                  key={w.full}
                  title={w.full}
                  className="flex h-8 items-center justify-center text-[11px] font-bold text-koleksi-navy-dark/60 no-underline dark:text-ink-dark/60"
                >
                  {w.short}
                </abbr>
              ))}

              {cells.map((c) => (
                <button
                  key={`${c.y}-${c.m}-${c.d}`}
                  type="button"
                  disabled={c.disabled}
                  aria-pressed={c.isSelected}
                  aria-label={`${c.d} ${MONTHS[c.m]} ${c.y}`}
                  onClick={() => choose(c)}
                  className={clsx(
                    "mx-auto flex size-8 items-center justify-center rounded-full text-xs transition focus-visible:ring-2 focus-visible:ring-koleksi-green focus-visible:outline-none disabled:pointer-events-none disabled:opacity-25",
                    c.isSelected
                      ? "bg-koleksi-navy-dark font-bold text-white dark:bg-koleksi-green"
                      : c.inMonth
                        ? "text-koleksi-navy-dark hover:bg-koleksi-navy-dark/5 dark:text-ink-dark dark:hover:bg-white/5"
                        : "text-koleksi-navy-dark/30 hover:bg-koleksi-navy-dark/5 dark:text-ink-dark/30",
                    c.isToday && !c.isSelected && "ring-1 ring-koleksi-green",
                  )}
                >
                  {c.d}
                </button>
              ))}
            </div>

            {value && (
              <div className="mt-2 flex justify-end border-t border-border-light pt-2 dark:border-border-dark">
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                    toggleRef.current?.focus();
                  }}
                  className="rounded-md px-2 py-1 text-xs font-bold text-koleksi-navy-dark/60 underline underline-offset-2 transition hover:text-koleksi-green dark:text-ink-dark/60"
                >
                  {t.calendar.clear}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
