import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi - KOLEKSI",
  description: "Atur ulang kata sandi akun KOLEKSI Anda.",
};

/** Langkah 1: minta link. Langkah 2 (form kata sandi baru dari link e-mail): ./atur-ulang. */
export default function LupaPasswordPage() {
  return (
    <AuthShell title="Lupa Kata Sandi" backHref="/masuk" backLabel="Kembali">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
