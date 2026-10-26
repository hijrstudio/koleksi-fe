import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import { getDictionary } from "@/lib/i18n/server";
import { requireMember } from "@/services/memberAuth";
import ChangePasswordForm from "./ChangePasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.auth.changePassword.metaTitle, description: t.auth.changePassword.metaDescription };
}

export default async function ChangePasswordPage() {
  const member = await requireMember("/dasbor/profile/ubah-kata-sandi");
  const t = await getDictionary();

  return (
    <AuthShell title={t.auth.changePassword.title} backHref="/dasbor/profile" backLabel={t.common.back}>
      <ChangePasswordForm username={member.email ?? member.no_hp ?? ""} />
    </AuthShell>
  );
}
