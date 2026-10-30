import type { Metadata } from "next";
import Link from "@/components/i18n/Link";
import { CircleAlert, CircleCheck } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { authOutlineClass, authSubmitClass } from "@/components/auth/authStyles";
import { clientIp } from "@/lib/auth/clientIp";
import { format } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/server";
import { registrationToken } from "@/lib/register/payment";
import { getRegistrationPayment } from "@/services/registrationPayment";
import ResendVerificationForm from "../ResendVerificationForm";
import RegistrationPayment from "./RegistrationPayment";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  // Token di URL tidak boleh terbawa sebagai Referer ke situs lain
  return { title: t.auth.registerPayment.metaTitle, robots: { index: false }, referrer: "no-referrer" };
}

/**
 * Bayar iuran pendaftaran: tujuan link verifikasi e-mail (backend) dan link "kirim ulang".
 * /daftar/bayar?token=...  — token dari backend (RegistrationPaymentToken), hanya membuka pembayaran iuran pertama.
 */
export default async function BayarPendaftaranPage({ searchParams }: PageProps<"/[lang]/daftar/bayar">) {
  const { token: raw } = await searchParams;
  const token = registrationToken({ token: raw });
  const t = await getDictionary();
  const m = t.auth.registerPayment;
  const summary = token ? await getRegistrationPayment(token, await clientIp()) : null;

  return (
    <AuthShell title={m.title} backHref="/" backLabel={t.common.backToHome}>
      <div className="max-w-140">
        {!summary || !token ? (
          <>
            <CircleAlert size={48} strokeWidth={1.5} aria-hidden="true" className="text-red-600 dark:text-red-400" />
            <h2 className="mt-6 text-xl leading-7 font-bold text-koleksi-navy-dark dark:text-ink-dark">{m.invalidTitle}</h2>
            <p className="mt-3 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/80">{m.invalidBody}</p>
            <div className="mt-10 flex flex-col items-start gap-6">
              <ResendVerificationForm askEmail />
              <Link href="/daftar" className={authOutlineClass}>
                {m.registerAgain}
              </Link>
            </div>
          </>
        ) : summary.status === "active" ? (
          <>
            <CircleCheck size={48} strokeWidth={1.5} aria-hidden="true" className="text-koleksi-green" />
            <h2 className="mt-6 text-xl leading-7 font-bold text-koleksi-navy-dark dark:text-ink-dark">{m.successTitle}</h2>
            <p className="mt-3 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/80">{m.successBody}</p>
            {summary.no_lambung && (
              <p className="mt-4 text-sm text-koleksi-navy-dark/70 dark:text-ink-dark/70">
                {m.memberNumber}: <strong className="text-2xl text-koleksi-navy-dark dark:text-ink-dark">{summary.no_lambung}</strong>
              </p>
            )}
            <Link href="/masuk" className={`${authSubmitClass} mt-10 inline-flex`}>
              {m.login}
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-xl leading-7 font-bold text-koleksi-navy-dark dark:text-ink-dark">
              {format(m.greeting, { name: summary.name })}
            </h2>
            <p className="mt-3 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/80">{m.intro}</p>
            <RegistrationPayment token={token} summary={summary} />
          </>
        )}
      </div>
    </AuthShell>
  );
}
