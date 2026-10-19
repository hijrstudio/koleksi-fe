import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CalendarClock, CircleAlert } from "lucide-react";
import clsx from "@/lib/clsx";
import formatRupiah from "@/lib/formatRupiah";
import { formatPlainDate } from "@/lib/formatDate";
import type { BillingState, MemberBilling } from "@/types";
import PayIuranButton from "./PayIuranButton";

type PayableState = Exclude<BillingState, "ok">;

/** Warna per tingkat urgensi: kuning (segera) → oranye (masa tenggang) → merah (tidak aktif). */
const TONES: Record<PayableState, { icon: LucideIcon; card: string; badge: string; accent: string }> = {
  due_soon: {
    icon: CalendarClock,
    card: "border-koleksi-amber/40 bg-[#fdf6e7] dark:border-koleksi-amber/30 dark:bg-koleksi-amber/10",
    badge: "bg-[#f3e5c9] text-koleksi-navy-dark",
    accent: "text-[#b45309] dark:text-koleksi-amber",
  },
  grace: {
    icon: AlertTriangle,
    card: "border-koleksi-orange/40 bg-[#fff1ea] dark:border-koleksi-orange/30 dark:bg-koleksi-orange/10",
    badge: "bg-koleksi-orange text-white",
    accent: "text-koleksi-orange",
  },
  expired: {
    icon: CircleAlert,
    card: "border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-950/30",
    badge: "bg-red-600 text-white",
    accent: "text-red-600 dark:text-red-400",
  },
  unpaid: {
    icon: CircleAlert,
    card: "border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-950/30",
    badge: "bg-red-600 text-white",
    accent: "text-red-600 dark:text-red-400",
  },
};

const date = (ymd: string | null) => formatPlainDate(ymd, "id", "short") || "-";

function copy(b: MemberBilling, state: PayableState): { badge: string; title: string; description: string } {
  const days = Math.abs(b.days_left ?? 0);

  switch (state) {
    case "due_soon":
      return {
        badge: "Segera jatuh tempo",
        title: days === 0 ? "Jatuh tempo hari ini" : `Jatuh tempo ${days} hari lagi`,
        description: `Lakukan daftar ulang sebelum ${date(b.renewal_date)} agar keanggotaan Anda tetap aktif.`,
      };
    case "grace":
      return {
        badge: "Masa tenggang",
        title: days === 0 ? "Hari terakhir masa tenggang" : `Masa tenggang tersisa ${days} hari`,
        description: `Iuran sudah jatuh tempo sejak ${date(b.renewal_date)}. Keanggotaan akan nonaktif setelah ${date(b.grace_until)}.`,
      };
    case "expired":
      return {
        badge: "Tidak aktif",
        title: "Keanggotaan tidak aktif",
        description: `Masa tenggang berakhir ${date(b.grace_until)}. Bayar iuran untuk mengaktifkan kembali keanggotaan Anda.`,
      };
    case "unpaid":
      return {
        badge: "Belum bayar",
        title: "Iuran belum dibayar",
        description: "Bayar iuran pertama Anda untuk mengaktifkan keanggotaan KOLEKSI.",
      };
  }
}

/** Info iuran di bawah kartu profil. Tidak tampil kalau iuran lunas & jatuh tempo masih jauh. */
export default function PaymentCard({ billing }: { billing: MemberBilling }) {
  if (billing.state === "ok") return null;

  const state = billing.state;
  const tone = TONES[state];
  const text = copy(billing, state);
  const Icon = tone.icon;

  return (
    <section
      aria-labelledby="iuran-title"
      className={clsx("flex h-full flex-col rounded-2xl border p-4 sm:p-5", tone.card)}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={clsx("rounded-md px-1.5 py-0.5 text-[10px] leading-3 font-bold", tone.badge)}>
          {text.badge}
        </span>
        <Icon size={20} aria-hidden="true" className={clsx("shrink-0", tone.accent)} />
      </div>

      <h2 id="iuran-title" className={clsx("mt-3 text-xl leading-6 font-bold", tone.accent)}>
        {text.title}
      </h2>
      <p className="mt-2 text-xs leading-4 text-koleksi-navy-dark/70 dark:text-ink-dark/70">
        {text.description}
      </p>

      {billing.items.length > 0 && (
        <dl className="mt-4 space-y-1 border-t border-koleksi-navy-dark/10 pt-3 text-xs text-koleksi-navy-dark dark:border-white/10 dark:text-ink-dark">
          {billing.items.map((item) => (
            <div key={item.period_label} className="flex justify-between gap-3">
              <dt className="text-koleksi-navy-dark/60 dark:text-ink-dark/60">Iuran {item.period_label}</dt>
              <dd>{item.amount > 0 ? formatRupiah(item.amount) : "-"}</dd>
            </div>
          ))}
          {billing.total > 0 && (
            <div className="flex justify-between gap-3 pt-1 text-sm font-bold">
              <dt>Total</dt>
              <dd>{formatRupiah(billing.total)}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-auto pt-5">
        <PayIuranButton
          label={state === "due_soon" ? "Daftar Ulang" : "Bayar Iuran"}
          className="inline-flex h-10 items-center justify-center rounded-full bg-koleksi-navy-dark px-6 text-sm font-bold text-white transition hover:bg-koleksi-navy focus-visible:ring-2 focus-visible:ring-koleksi-green focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60 dark:bg-koleksi-green dark:hover:bg-koleksi-green-dark"
        />
      </div>
    </section>
  );
}
