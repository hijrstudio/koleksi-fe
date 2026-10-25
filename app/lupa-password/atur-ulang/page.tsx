import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import { clientIp } from "@/lib/auth/clientIp";
import { isPasswordResetLinkValid } from "@/services/memberPasswordReset";
import ResetPasswordForm, { InvalidLink } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Atur Ulang Kata Sandi - KOLEKSI",
  robots: { index: false, follow: false },
  // URL halaman ini berisi token: jangan ikut terkirim sebagai Referer ke situs lain
  referrer: "no-referrer",
};

/**
 * Tujuan tombol di e-mail lupa kata sandi: /lupa-password/atur-ulang?token=…&email=…
 * Link dicek dulu di server, supaya member tidak mengetik kata sandi untuk link yang sudah mati.
 */
export default async function AturUlangPasswordPage({ searchParams }: PageProps<"/lupa-password/atur-ulang">) {
  const { token, email } = await searchParams;
  const valid =
    typeof token === "string" &&
    typeof email === "string" &&
    token.length > 0 &&
    email.length > 0 &&
    (await isPasswordResetLinkValid(email, token, await clientIp()));

  return (
    <AuthShell title="Atur Ulang Kata Sandi" backHref="/masuk" backLabel="Kembali">
      {valid ? <ResetPasswordForm email={email} token={token} /> : <InvalidLink />}
    </AuthShell>
  );
}
