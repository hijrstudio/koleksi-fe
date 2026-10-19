import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import { requireMember } from "@/services/memberAuth";
import ChangePasswordForm from "./ChangePasswordForm";

export const metadata: Metadata = {
  title: "Ubah Kata Sandi - KOLEKSI",
  description: "Ubah kata sandi akun anggota KOLEKSI.",
};

export default async function ChangePasswordPage() {
  const member = await requireMember("/dasbor/profile/ubah-kata-sandi");

  return (
    <AuthShell title="Ubah Kata Sandi" backHref="/dasbor/profile" backLabel="Kembali">
      <ChangePasswordForm username={member.email ?? member.no_hp ?? ""} />
    </AuthShell>
  );
}
