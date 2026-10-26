import type { Metadata } from "next";
import { MailCheck } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { getDictionary, localizedRedirect } from "@/lib/i18n/server";
import { getRegisteredEmail, maskEmail } from "@/lib/register/session";
import ResendVerificationForm from "../ResendVerificationForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.auth.thanks.metaTitle, robots: { index: false } };
}

export default async function TerimaKasihPage() {
  const email = await getRegisteredEmail();

  // Dibuka langsung tanpa mendaftar (cookie tidak ada / kedaluwarsa)
  if (!email) {
    await localizedRedirect("/daftar");
  }

  const t = await getDictionary();
  const STEPS = t.auth.thanks.steps;

  return (
    <AuthShell title={t.auth.thanks.title} backHref="/" backLabel={t.common.backToHome}>
      <div className="max-w-140">
        <MailCheck
          size={48}
          strokeWidth={1.5}
          aria-hidden="true"
          className="text-koleksi-green"
        />

        <h2 className="mt-6 text-xl leading-7 font-bold text-koleksi-navy-dark dark:text-ink-dark">
          {t.auth.thanks.heading}
        </h2>
        <p className="mt-3 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/80">
          {t.auth.thanks.sentTo}{" "}
          <strong className="text-koleksi-navy-dark dark:text-ink-dark">
            {maskEmail(email!)}
          </strong>
          {t.auth.thanks.checkInbox}
        </p>

        <ol className="mt-10 flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-koleksi-navy-dark text-sm font-bold text-white dark:bg-koleksi-green">
                {i + 1}
              </span>
              <span className="pt-0.5 text-base leading-6 text-koleksi-navy-dark dark:text-ink-dark">
                {step}
              </span>
            </li>
          ))}
        </ol>

        <hr className="my-10 border-border-light dark:border-border-dark" />

        <p className="mb-4 text-sm text-koleksi-navy-dark/70 dark:text-ink-dark/70">
          {t.auth.thanks.noEmail}
        </p>
        <ResendVerificationForm />
      </div>
    </AuthShell>
  );
}
