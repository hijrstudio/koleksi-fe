import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert, CircleCheck } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { authOutlineClass } from "@/components/auth/authStyles";
import ResendVerificationForm from "../ResendVerificationForm";

export const metadata: Metadata = {
  title: "Verifikasi E-mail - KOLEKSI",
  robots: { index: false },
};

/**
 * Tujuan redirect backend setelah link verifikasi di e-mail diklik:
 * /daftar/verifikasi?status=verified|already|expired|invalid
 */
const RESULTS = {
  verified: {
    ok: true,
    title: "E-mail berhasil diverifikasi.",
    body: "Terima kasih! Pendaftaran Anda kini direview oleh pengurus KOLEKSI. Kami akan mengirim e-mail setelah pendaftaran disetujui, berisi informasi aktivasi keanggotaan dengan membayar iuran tahunan.",
  },
  already: {
    ok: true,
    title: "E-mail Anda sudah terverifikasi.",
    body: "Pendaftaran Anda sedang atau sudah direview pengurus KOLEKSI. Pantau kotak masuk e-mail Anda untuk informasi selanjutnya.",
  },
  expired: {
    ok: false,
    title: "Link verifikasi sudah kedaluwarsa.",
    body: "Masukkan e-mail yang Anda pakai saat mendaftar untuk menerima link verifikasi baru.",
  },
  invalid: {
    ok: false,
    title: "Link verifikasi tidak valid.",
    body: "Pastikan Anda membuka link terbaru dari e-mail KOLEKSI, atau minta link verifikasi baru di bawah.",
  },
} as const;

type Status = keyof typeof RESULTS;

export default async function VerifikasiPage({
  searchParams,
}: PageProps<"/daftar/verifikasi">) {
  const { status } = await searchParams;
  const key: Status =
    typeof status === "string" && status in RESULTS
      ? (status as Status)
      : "invalid";
  const result = RESULTS[key];
  const Icon = result.ok ? CircleCheck : CircleAlert;

  return (
    <AuthShell title="Verifikasi E-mail" backHref="/" backLabel="Kembali ke Beranda">
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
          {result.ok ? (
            <Link href="/" className={authOutlineClass}>
              Kembali ke Beranda
            </Link>
          ) : (
            <ResendVerificationForm askEmail />
          )}
        </div>
      </div>
    </AuthShell>
  );
}
