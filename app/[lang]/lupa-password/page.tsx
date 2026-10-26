import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import { getDictionary } from "@/lib/i18n/server";
import ForgotPasswordForm from "./ForgotPasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.auth.forgot.metaTitle, description: t.auth.forgot.metaDescription };
}

/** Langkah 1: minta link. Langkah 2 (form kata sandi baru dari link e-mail): ./atur-ulang. */
export default async function LupaPasswordPage() {
  const t = await getDictionary();

  return (
    <AuthShell title={t.auth.forgot.title} backHref="/masuk" backLabel={t.common.back}>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
