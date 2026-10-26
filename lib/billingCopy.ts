import { formatPlainDate } from "@/lib/formatDate";
import { format } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import type { BillingState, Locale, MemberBilling } from "@/types";

export type PayableState = Exclude<BillingState, "ok">;

/** Badge, judul & keterangan status iuran — kartu iuran Dasbor & lonceng notifikasi. */
export function billingCopy(
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
