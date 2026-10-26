"use client";

import Link from "@/components/i18n/Link";
import { useI18n } from "@/components/i18n/I18nProvider";

/** Footer mini (Syarat & Ketentuan, Kebijakan Privasi, copyright) -- dipakai
 *  di halaman auth & dasbor sebagai pengganti Footer besar. */
export default function LegalFooter({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <div className={className}>
      <div className="flex gap-4 text-xs font-bold text-koleksi-navy-dark dark:text-ink-dark">
        <Link
          href="/syarat-ketentuan"
          className="underline transition hover:text-koleksi-green"
        >
          {t.footer.terms}
        </Link>
        <Link
          href="/kebijakan-privasi"
          className="underline transition hover:text-koleksi-green"
        >
          {t.footer.privacy}
        </Link>
      </div>
      <p className="mt-2 text-xs text-koleksi-navy-dark/50 dark:text-ink-dark/50">
        &copy; {new Date().getFullYear()} {t.footer.copyright}
      </p>
    </div>
  );
}
