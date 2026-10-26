import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { localizedRedirectPath, safeRedirectPath } from "@/lib/auth/validation";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getCurrentMember } from "@/services/memberAuth";
import LoginForm from "./LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.auth.login.metaTitle, description: t.auth.login.metaDescription };
}

export default async function MasukPage({ searchParams }: PageProps<"/[lang]/masuk">) {
  const { next, reset } = await searchParams;
  const locale = await getLocale();
  const t = await getDictionary(locale);
  // `next` = path tanpa prefix bahasa; prefix ditambahkan saat redirect
  const nextPath = typeof next === "string" ? safeRedirectPath(next) : undefined;
  // Dari /lupa-password/atur-ulang setelah kata sandi berhasil diatur ulang
  const notice = reset === "berhasil" ? t.auth.login.resetSuccess : undefined;

  // Sudah login (token masih berlaku) → langsung ke tujuan.
  if (await getCurrentMember()) {
    redirect(localizedRedirectPath(nextPath, locale));
  }

  return (
    <AuthShell title={t.auth.login.title} backHref="/" backLabel={t.common.backToHome}>
      <LoginForm next={nextPath} notice={notice} />
    </AuthShell>
  );
}
