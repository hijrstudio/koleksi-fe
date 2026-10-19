import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi - KOLEKSI",
  description: "Atur ulang kata sandi akun KOLEKSI Anda.",
};

export default function LupaPasswordPage() {
  return (
    <AuthShell title="Lupa Kata Sandi" backHref="/masuk" backLabel="Kembali">
      <ResetPasswordForm />
    </AuthShell>
  );
}
