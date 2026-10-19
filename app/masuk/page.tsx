import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { safeRedirectPath } from "@/lib/auth/validation";
import { getCurrentMember } from "@/services/memberAuth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Masuk - KOLEKSI",
  description:
    "Masuk ke akun KOLEKSI untuk mengikuti forum, kegiatan, dan komunitas mobil elektrik Indonesia.",
};

export default async function MasukPage({ searchParams }: PageProps<"/masuk">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? safeRedirectPath(next) : undefined;

  // Sudah login (token masih berlaku) → langsung ke tujuan.
  if (await getCurrentMember()) {
    redirect(nextPath ?? "/dasbor");
  }

  return (
    <AuthShell title="Masuk" backHref="/" backLabel="Kembali ke Beranda">
      <LoginForm next={nextPath} />
    </AuthShell>
  );
}
