import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MailCheck } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { getRegisteredEmail, maskEmail } from "@/lib/register/session";
import ResendVerificationForm from "../ResendVerificationForm";

export const metadata: Metadata = {
  title: "Terima Kasih Sudah Mendaftar - KOLEKSI",
  robots: { index: false },
};

const STEPS = [
  "Buka e-mail dari KOLEKSI dan klik tombol Verifikasi E-mail.",
  "Pengurus KOLEKSI mereview data & dokumen pendaftaran Anda.",
  "Setelah disetujui, Anda menerima e-mail untuk aktivasi keanggotaan dengan membayar iuran tahunan.",
];

export default async function TerimaKasihPage() {
  const email = await getRegisteredEmail();

  // Dibuka langsung tanpa mendaftar (cookie tidak ada / kedaluwarsa)
  if (!email) {
    redirect("/daftar");
  }

  return (
    <AuthShell title="Terima Kasih" backHref="/" backLabel="Kembali ke Beranda">
      <div className="max-w-140">
        <MailCheck
          size={48}
          strokeWidth={1.5}
          aria-hidden="true"
          className="text-koleksi-green"
        />

        <h2 className="mt-6 text-xl leading-7 font-bold text-koleksi-navy-dark dark:text-ink-dark">
          Pendaftaran Anda sudah kami terima.
        </h2>
        <p className="mt-3 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/80">
          Kami telah mengirim link verifikasi ke{" "}
          <strong className="text-koleksi-navy-dark dark:text-ink-dark">
            {maskEmail(email)}
          </strong>
          . Silakan cek kotak masuk (atau folder spam) dan klik link tersebut
          dalam 24 jam.
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
          Tidak menerima e-mail?
        </p>
        <ResendVerificationForm />
      </div>
    </AuthShell>
  );
}
