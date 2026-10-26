import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CalendarClock, CircleAlert } from "lucide-react";
import clsx from "@/lib/clsx";
import formatRupiah from "@/lib/formatRupiah";
import { formatPlainDate } from "@/lib/formatDate";
import { format } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import type { BillingState, Locale, MemberBilling } from "@/types";
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

function copy(
  b: MemberBilling,
  state: PayableState,
  m: Dictionary["payment"],
  locale: Locale,
): { badge: string; title: string; description: string } {
  const days = Math.abs(b.days_left ?? 0);
  const date = (ymd: string | null) => formatPlainDate(ymd, locale, "short") || "-";

  switch (state) {
    case "due_soon":
      return {
        badge: m.dueSoonBadge,
        title: days === 0 ? m.dueToday : format(m.dueInDays, { days }),
        description: format(m.dueSoonBody, { date: date(b.renewal_date) }),
      };
    case "grace":
      return {
        badge: m.graceBadge,
        title: days === 0 ? m.graceLastDay : format(m.graceDaysLeft, { days }),
        description: format(m.graceBody, { due: date(b.renewal_date), until: date(b.grace_until) }),
      };
    case "expired":
      return {
        badge: m.expiredBadge,
        title: m.expiredTitle,
        description: format(m.expiredBody, { date: date(b.grace_until) }),
      };
    case "unpaid":
      return {
        badge: m.unpaidBadge,
        title: m.unpaidTitle,
        description: m.unpaidBody,
      };
  }
}

/** Info iuran di bawah kartu profil. Tidak tampil kalau iuran lunas & jatuh tempo masih jauh. */
export default async function PaymentCard({ billing }: { billing: MemberBilling }) {
  if (billing.state === "ok") return null;

  const locale = await getLocale();
  const m = (await getDictionary(locale)).payment;
  const state = billing.state;
  const tone = TONES[state];
  const text = copy(billing, state, m, locale);
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
              <dt className="text-koleksi-navy-dark/60 dark:text-ink-dark/60">{format(m.fee, { period: item.period_label })}</dt>
              <dd>{item.amount > 0 ? formatRupiah(item.amount) : "-"}</dd>
            </div>
          ))}
          {billing.total > 0 && (
            <div className="flex justify-between gap-3 pt-1 text-sm font-bold">
              <dt>{m.total}</dt>
              <dd>{formatRupiah(billing.total)}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-auto pt-5">
        <PayIuranButton
          label={state === "due_soon" ? m.renew : m.pay}
          className="inline-flex h-10 items-center justify-center rounded-full bg-koleksi-navy-dark px-6 text-sm font-bold text-white transition hover:bg-koleksi-navy focus-visible:ring-2 focus-visible:ring-koleksi-green focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60 dark:bg-koleksi-green dark:hover:bg-koleksi-green-dark"
        />
      </div>
    </section>
  );
}
