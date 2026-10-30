"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "@/components/i18n/Link";
import { QRCodeCanvas } from "qrcode.react";
import { CheckCircle2, Download, Loader2, RefreshCw } from "lucide-react";
import { authSubmitClass } from "@/components/auth/authStyles";
import formatRupiah from "@/lib/formatRupiah";
import { format, useI18n } from "@/components/i18n/I18nProvider";
import type { IuranPayment, RegistrationPaymentSummary } from "@/types";

const POLL_MS = 4000;

const outlineClass =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-koleksi-navy-dark/20 text-sm font-bold text-koleksi-navy-dark transition hover:border-koleksi-green hover:text-koleksi-green focus-visible:ring-2 focus-visible:ring-koleksi-green focus-visible:outline-none dark:border-ink-dark/30 dark:text-ink-dark";

/**
 * QRIS iuran pendaftaran (belum login): token dari link e-mail dikirim ke /api/registrations/payment/*.
 * Alur sama dengan dialog "Bayar Iuran" di dasbor — QR, hitung mundur, polling, simpan QR. Sukses hanya dari
 * status pembayaran = success; No. lambung ditampilkan dari status pendaftar yang dikembalikan backend.
 */
export default function RegistrationPayment({ token, summary }: { token: string; summary: RegistrationPaymentSummary }) {
  const { locale, t } = useI18n();
  const m = t.payment;
  const r = t.auth.registerPayment;
  const ENDED_MESSAGE: Record<string, string> = m.ended;
  const [payment, setPayment] = useState<IuranPayment | null>(summary.payment);
  const [noLambung, setNoLambung] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [now, setNow] = useState(() => (summary.payment ? Date.now() : 0));
  const qrWrapRef = useRef<HTMLDivElement>(null);

  const expiresAt = payment?.expired_at ? new Date(payment.expired_at).getTime() : 0;
  const secondsLeft = payment?.status === "pending" && now ? Math.max(0, Math.floor((expiresAt - now) / 1000)) : 0;
  const waiting = payment?.status === "pending" && secondsLeft > 0;
  const succeeded = payment?.status === "success";
  const ended = !!payment && !waiting && !succeeded;

  const post = useCallback(
    async (path: string, body: Record<string, string>) => {
      const res = await fetch(`/api/registrations/payment/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...body }),
        cache: "no-store",
      });
      const json = (await res.json().catch(() => ({}))) as { data?: IuranPayment; message?: string };
      return { ok: res.ok, status: res.status, data: json.data, message: json.message };
    },
    [token],
  );

  // 1) Buat / ambil QRIS — idempoten di backend (klik ulang = QR yang sama)
  const start = useCallback(async () => {
    setStarting(true);
    setError(null);
    try {
      const res = await post("checkout", {});
      if (!res.ok || !res.data) {
        // 409 = sudah dibayar (mis. dari tab lain) → muat ulang halaman untuk menampilkan status aktif
        if (res.status === 409) window.location.reload();
        setError(res.status === 429 ? m.tooOften : (res.message ?? m.createFailed));
        return;
      }
      setNow(Date.now());
      setPayment(res.data);
    } catch {
      setError(m.createFailed);
    } finally {
      setStarting(false);
    }
  }, [post, m.tooOften, m.createFailed]);

  // 2) Cek status ke backend
  const check = useCallback(async () => {
    if (!payment) return;
    setChecking(true);
    try {
      const res = await post("status", { merchant_ref: payment.merchant_ref });
      if (res.ok && res.data) {
        setPayment(res.data);
        if (res.data.registration?.no_lambung) setNoLambung(res.data.registration.no_lambung);
      }
    } catch {
      /* jaringan putus sesaat — dicoba lagi di putaran berikutnya */
    } finally {
      setChecking(false);
      setNow(Date.now());
    }
  }, [payment, post]);

  // 3) Polling tiap 4 detik selama QR berlaku & tab aktif
  useEffect(() => {
    if (!waiting) return;
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
  }, [waiting, check]);

  // 4) Hitung mundur (detik)
  useEffect(() => {
    if (payment?.status !== "pending") return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [payment?.status]);

  // 5) Waktu habis → cek sekali lagi (jaga-jaga dibayar di detik terakhir)
  const lastCheckedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!payment || payment.status !== "pending" || secondsLeft > 0 || !now) return;
    if (lastCheckedRef.current === payment.merchant_ref) return;
    lastCheckedRef.current = payment.merchant_ref;
    void check();
  }, [payment, secondsLeft, now, check]);

  // 6) Sukses tapi No. lambung belum terbaca (respons pertama) → ambil status sekali lagi
  useEffect(() => {
    if (succeeded && !noLambung) {
      const timer = setTimeout(() => void check(), 1500);
      return () => clearTimeout(timer);
    }
  }, [succeeded, noLambung, check]);

  // Pendaftar yang membuka dari HP yang sama dengan e-wallet tidak bisa scan layar sendiri
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
  const deadline = summary.payment_due_at
    ? new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Asia/Jakarta",
      }).format(new Date(summary.payment_due_at)) + " WIB"
    : null;

  if (succeeded) {
    return (
      <div role="status" className="mt-8 flex flex-col items-start">
        <CheckCircle2 size={48} className="text-koleksi-green" aria-hidden="true" />
        <p className="mt-4 text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">{r.successTitle}</p>
        <p className="mt-2 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/80">{r.successBody}</p>
        {noLambung ? (
          <p className="mt-4 text-sm text-koleksi-navy-dark/70 dark:text-ink-dark/70">
            {r.memberNumber}: <strong className="text-2xl text-koleksi-navy-dark dark:text-ink-dark">{noLambung}</strong>
          </p>
        ) : (
          <p className="mt-4 flex items-center gap-1.5 text-sm text-koleksi-navy-dark/70 dark:text-ink-dark/70">
            <Loader2 size={14} className="animate-spin" aria-hidden="true" /> {r.activating}
          </p>
        )}
        <Link href="/masuk" className={`${authSubmitClass} mt-8`}>
          {r.login}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="rounded-2xl border border-border-light p-5 dark:border-border-dark">
        {summary.periods.length > 0 && (
          <ul className="space-y-1 text-sm text-koleksi-navy-dark/70 dark:text-ink-dark/70">
            {summary.periods.map((period) => (
              <li key={period}>{format(m.fee, { period })}</li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-sm text-koleksi-navy-dark/70 dark:text-ink-dark/70">{r.total}</p>
        <p className="text-3xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
          {formatRupiah(payment?.amount ?? summary.amount ?? 0)}
        </p>
        {deadline && (
          <p className="mt-2 text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">{format(r.deadline, { date: deadline })}</p>
        )}
      </div>

      {!payment && !error && (
        <button type="button" onClick={() => void start()} disabled={starting} className={`${authSubmitClass} mt-8`}>
          {starting ? m.creating : r.showQr}
        </button>
      )}

      {error && (
        <div role="alert" className="mt-8">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button type="button" onClick={() => void start()} disabled={starting} className={`${outlineClass} mt-4 px-6`}>
            {m.retry}
          </button>
        </div>
      )}

      {waiting && payment?.qr_string && (
        <div className="mt-8 max-w-sm">
          <div ref={qrWrapRef} className="mx-auto w-fit rounded-xl bg-white p-3">
            <QRCodeCanvas value={payment.qr_string} size={232} level="M" marginSize={2} title={m.qrTitle} />
          </div>
          <p className="mt-3 text-center text-sm text-koleksi-navy-dark dark:text-ink-dark" aria-live="off">
            {m.validFor} <span className="font-mono font-bold">{mm}:{ss}</span>
          </p>
          <p className="mt-2 text-center text-xs leading-4 text-koleksi-navy-dark/70 dark:text-ink-dark/70">{m.scanHint}</p>
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
        </div>
      )}

      {!error && ended && (
        <div className="mt-8">
          <p role="status" className="text-sm text-koleksi-navy-dark/70 dark:text-ink-dark/70">
            {checking ? m.checkingLast : ENDED_MESSAGE[payment!.status === "pending" ? "expired" : payment!.status]}
          </p>
          {!checking && payment?.status !== "refunded" && (
            <button type="button" onClick={() => void start()} disabled={starting} className={`${authSubmitClass} mt-4`}>
              {starting ? m.creating : m.newQr}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
