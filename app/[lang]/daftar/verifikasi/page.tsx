import type { Metadata } from "next";
import Link from "@/components/i18n/Link";
import { CircleAlert, CircleCheck } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { authOutlineClass } from "@/components/auth/authStyles";
import { getDictionary } from "@/lib/i18n/server";
import ResendVerificationForm from "../ResendVerificationForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.auth.verify.metaTitle, robots: { index: false } };
}

/**
 * Tujuan redirect backend setelah link verifikasi di e-mail diklik, kalau tidak lanjut ke halaman bayar
 * (/daftar/bayar): /daftar/verifikasi?status=active|expired|invalid  (teks: t.auth.verify.results).
 * verified/already tetap dikenali untuk link lama — pendaftar diminta mengirim ulang link pembayaran.
 */
const RESULTS = {
  verified: { ok: true, resend: true },
  already: { ok: true, resend: true },
  active: { ok: true, resend: false },
  expired: { ok: false, resend: true },
  invalid: { ok: false, resend: true },
} as const;

type Status = keyof typeof RESULTS;

export default async function VerifikasiPage({
  searchParams,
}: PageProps<"/[lang]/daftar/verifikasi">) {
  const { status } = await searchParams;
  const key: Status =
    typeof status === "string" && status in RESULTS
      ? (status as Status)
      : "invalid";
  const t = await getDictionary();
  const result = { ...RESULTS[key], ...t.auth.verify.results[key] };
  const Icon = result.ok ? CircleCheck : CircleAlert;

  return (
    <AuthShell title={t.auth.verify.title} backHref="/" backLabel={t.common.backToHome}>
      <div className="max-w-140">
        <Icon
          size={48}
          strokeWidth={1.5}
          aria-hidden="true"
          className={result.ok ? "text-koleksi-green" : "text-red-600 dark:text-red-400"}
        />

        <h2 className="mt-6 text-xl leading-7 font-bold text-koleksi-navy-dark dark:text-ink-dark">
          {result.title}
        </h2>
        <p className="mt-3 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/80">
          {result.body}
        </p>

        <div className="mt-10">
          {result.resend ? (
            <ResendVerificationForm askEmail />
          ) : (
            <Link href="/masuk" className={authOutlineClass}>
              {t.auth.registerPayment.login}
            </Link>
          )}
        </div>
      </div>
    </AuthShell>
  );
}
