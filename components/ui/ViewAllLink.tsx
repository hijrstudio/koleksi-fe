"use client";

import Link from "@/components/i18n/Link";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function ViewAllLink({ href }: { href: string }) {
  const { t } = useI18n();

  return (
    <Link
      href={href}
      className="mt-8 inline-flex items-center underline underline-offset-4 leading-6 text-base font-bold text-koleksi-navy-dark/60 transition hover:text-koleksi-green dark:text-ink-dark/80"
    >
      {t.common.viewAll}
    </Link>
  );
}
