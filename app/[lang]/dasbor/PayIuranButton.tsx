"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { CheckCircle2, Download, Loader2, RefreshCw, X } from "lucide-react";
import formatRupiah from "@/lib/formatRupiah";
import { formatPlainDate } from "@/lib/formatDate";
import { refreshDashboard, startIuranPayment } from "@/app/actions/payment";
import { format, useI18n } from "@/components/i18n/I18nProvider";
import { expiredPath } from "@/lib/auth/validation";
import type { IuranPayment } from "@/types";

const POLL_MS = 4000;

const primaryClass =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-koleksi-navy-dark px-6 text-sm font-bold text-white transition hover:bg-koleksi-navy focus-visible:ring-2 focus-visible:ring-koleksi-green focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60 dark:bg-koleksi-green dark:hover:bg-koleksi-green-dark";
const outlineClass =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-koleksi-navy-dark/20 text-sm font-bold text-koleksi-navy-dark transition hover:border-koleksi-green hover:text-koleksi-green focus-visible:ring-2 focus-visible:ring-koleksi-green focus-visible:outline-none dark:border-ink-dark/30 dark:text-ink-dark";

/**
 * Tombol "Bayar Iuran" / "Daftar Ulang" → dialog QRIS.
 * Nominal & QR dari backend (Server Action); status dipantau lewat polling /api/member/payments/{ref}.
 * Sukses hanya dari status pembayaran = success (bukan dari status member).
 */
export default function PayIuranButton({ label, className }: { label: string; className?: string }) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const m = t.payment;
  const ENDED_MESSAGE: Record<string, string> = m.ended;
  const expiredUrl = expiredPath("/dasbor", locale);
  const [open, setOpen] = useState(false);
  const [payment, setPayment] = useState<IuranPayment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(0);
  const [checking, setChecking] = useState(false);
  const [starting, startTransition] = useTransition();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const qrWrapRef = useRef<HTMLDivElement>(null);

  const expiresAt = payment?.expired_at ? new Date(payment.expired_at).getTime() : 0;
  const secondsLeft = payment?.status === "pending" && now ? Math.max(0, Math.floor((expiresAt - now) / 1000)) : 0;
  const waiting = payment?.status === "pending" && secondsLeft > 0;
  const succeeded = payment?.status === "success";
  const ended = !!payment && !waiting && !succeeded;

  // 1) Buat / ambil QRIS — idempoten di backend (klik ulang = QR yang sama)
  const start = useCallback(() => {
    setOpen(true);
    setError(null);
    startTransition(async () => {
      const result = await startIuranPayment(locale);
      if (!result.ok) {
        if (result.expired) router.push(expiredUrl);
        setPayment(null);
        setError(result.message);
        return;
      }
      setNow(Date.now());
      setPayment(result.payment);
    });
  }, [router, locale, expiredUrl]);

  // 2) Cek status ke backend
  const check = useCallback(async () => {
    if (!payment) return;
    setChecking(true);
    try {
      const res = await fetch(`/api/member/payments/${encodeURIComponent(payment.merchant_ref)}`, { cache: "no-store" });
      if (res.status === 401) {
        router.push(expiredUrl);
        return;
      }
      if (res.ok) {
        const { data } = (await res.json()) as { data: IuranPayment };
        setPayment(data);
      }
    } catch {
      /* jaringan putus sesaat — dicoba lagi di putaran berikutnya */
    } finally {
      setChecking(false);
      setNow(Date.now());
    }
  }, [payment, router, expiredUrl]);

  // 3) Polling tiap 4 detik selama dialog terbuka & tab aktif
  useEffect(() => {
    if (!open || !waiting) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const startTimer = () => {
      timer ??= setInterval(check, POLL_MS);
    };
    const stopTimer = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    const onVisibility = () => {
      if (document.hidden) stopTimer();
      else {
        void check();
        startTimer();
      }
    };

    startTimer();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [open, waiting, check]);

  // 4) Hitung mundur (detik)
  useEffect(() => {
    if (!open || payment?.status !== "pending") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [open, payment?.status]);

  // 5) Waktu habis → cek sekali lagi (jaga-jaga dibayar di detik terakhir)
  const lastCheckedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!payment || payment.status !== "pending" || secondsLeft > 0 || !now) return;
    if (lastCheckedRef.current === payment.merchant_ref) return;
    lastCheckedRef.current = payment.merchant_ref;
    void check();
  }, [payment, secondsLeft, now, check]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
    if (succeeded) {
      // Kartu iuran, status & masa berlaku di Dasbor dimuat ulang (kartu hilang kalau sudah lunas)
      void refreshDashboard().then(() => router.refresh());
    }
  }, [succeeded, router]);

  // Dialog: fokus masuk, Esc menutup, scroll halaman dikunci
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Member yang membuka web di HP yang sama dengan e-wallet tidak bisa scan layar sendiri
  function downloadQr() {
    const canvas = qrWrapRef.current?.querySelector("canvas");
    if (!canvas || !payment) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `QRIS-KOLEKSI-${payment.merchant_ref}.png`;
    a.click();
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const activeUntil = payment?.membership?.active_until;

  return (
    <>
      <button ref={triggerRef} type="button" onClick={start} disabled={starting} aria-haspopup="dialog" className={className}>
        {starting && !open ? t.auth.processing : label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="qris-title"
            tabIndex={-1}
            className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-t-2xl bg-surface-light p-5 text-koleksi-navy-dark shadow-xl outline-none sm:rounded-2xl dark:bg-surface-dark dark:text-ink-dark"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="qris-title" className="text-base font-bold">
                {m.dialogTitle}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label={t.common.close}
                className="rounded-full p-1 text-koleksi-navy-dark/60 transition hover:bg-muted-light hover:text-koleksi-navy-dark dark:text-ink-dark/60 dark:hover:bg-muted-dark"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {payment && payment.items.length > 0 && (
              <dl className="mt-4 space-y-1 border-b border-border-light pb-3 text-xs dark:border-border-dark">
                {payment.items.map((item) => (
                  <div key={item.period_label} className="flex justify-between gap-3">
                    <dt className="text-koleksi-navy-dark/60 dark:text-ink-dark/60">{format(m.fee, { period: item.period_label })}</dt>
                    <dd>{formatRupiah(item.amount)}</dd>
                  </div>
                ))}
              </dl>
            )}
            {payment && <p className="mt-3 text-2xl font-bold">{formatRupiah(payment.amount)}</p>}

            {starting && (
              <p role="status" className="flex flex-col items-center gap-2 py-12 text-sm text-koleksi-navy-dark/70 dark:text-ink-dark/70">
                <Loader2 className="animate-spin" aria-hidden="true" /> {m.creating}
              </p>
            )}

            {!starting && error && (
              <div role="alert" className="py-8 text-center">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                <button type="button" onClick={start} className={`${outlineClass} mt-4 px-6`}>
                  {m.retry}
                </button>
              </div>
            )}

            {!starting && waiting && payment?.qr_string && (
              <>
                <div ref={qrWrapRef} className="mx-auto mt-4 w-fit rounded-xl bg-white p-3">
                  <QRCodeCanvas value={payment.qr_string} size={232} level="M" marginSize={2} title={m.qrTitle} />
                </div>
                <p className="mt-3 text-center text-sm" aria-live="off">
                  {m.validFor} <span className="font-mono font-bold">{mm}:{ss}</span>
                </p>
                <p className="mt-2 text-center text-xs leading-4 text-koleksi-navy-dark/70 dark:text-ink-dark/70">
                  {m.scanHint}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={downloadQr} className={outlineClass}>
                    <Download size={16} aria-hidden="true" /> {m.saveQr}
                  </button>
                  <button type="button" onClick={() => void check()} disabled={checking} className={outlineClass}>
                    <RefreshCw size={16} aria-hidden="true" className={checking ? "animate-spin" : undefined} /> {m.checkStatus}
                  </button>
                </div>
                <p role="status" className="mt-3 flex items-center justify-center gap-1.5 text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">
                  <Loader2 size={12} className="animate-spin" aria-hidden="true" /> {m.waiting}
                </p>
              </>
            )}

            {!starting && succeeded && (
              <div role="status" className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 size={48} className="text-koleksi-green" aria-hidden="true" />
                <p className="mt-3 text-lg font-bold">{m.success}</p>
                <p className="mt-1 text-sm text-koleksi-navy-dark/70 dark:text-ink-dark/70">
                  {m.thanks}
                  {payment?.payment_channel ? format(m.via, { channel: payment.payment_channel }) : ""}
                  {m.activeNow}
                  {activeUntil ? format(m.activeUntil, { date: formatPlainDate(activeUntil, locale, "long") }) : ""}.
                </p>
                <button type="button" onClick={close} className={`${primaryClass} mt-5`}>
                  {m.done}
                </button>
              </div>
            )}

            {!starting && !error && ended && (
              <div className="py-8 text-center">
                <p role="status" className="text-sm text-koleksi-navy-dark/70 dark:text-ink-dark/70">
                  {checking
                    ? m.checkingLast
                    : ENDED_MESSAGE[payment!.status === "pending" ? "expired" : payment!.status]}
                </p>
                {!checking && payment?.status !== "refunded" && (
                  <button type="button" onClick={start} className={`${primaryClass} mt-4`}>
                    {m.newQr}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
