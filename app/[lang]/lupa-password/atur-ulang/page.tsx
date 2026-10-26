import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import { getDictionary } from "@/lib/i18n/server";
import { clientIp } from "@/lib/auth/clientIp";
import { isPasswordResetLinkValid } from "@/services/memberPasswordReset";
import ResetPasswordForm, { InvalidLink } from "./ResetPasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();

  return {
    title: t.auth.reset.metaTitle,
    robots: { index: false, follow: false },
    // URL halaman ini berisi token: jangan ikut terkirim sebagai Referer ke situs lain.
    // Bahasa untuk Server Action dikirim lewat field `lang` (bukan dari Referer).
    referrer: "no-referrer",
  };
}

/**
 * Tujuan tombol di e-mail lupa kata sandi: /lupa-password/atur-ulang?token=…&email=…
 * Link dicek dulu di server, supaya member tidak mengetik kata sandi untuk link yang sudah mati.
 */
export default async function AturUlangPasswordPage({ searchParams }: PageProps<"/[lang]/lupa-password/atur-ulang">) {
  const { token, email } = await searchParams;
  const valid =
    typeof token === "string" &&
    typeof email === "string" &&
    token.length > 0 &&
    email.length > 0 &&
    (await isPasswordResetLinkValid(email, token, await clientIp()));
  const t = await getDictionary();

  return (
    <AuthShell title={t.auth.reset.title} backHref="/masuk" backLabel={t.common.back}>
      {valid ? <ResetPasswordForm email={email} token={token} /> : <InvalidLink />}
    </AuthShell>
  );
}
