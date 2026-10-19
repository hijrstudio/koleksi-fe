import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import NoticeBanner from "@/components/ui/NoticeBanner";
import { getCurrentMember } from "@/services/memberAuth";
import { getRegencies } from "@/services/region";
import { getVehicleBrands } from "@/services/vehicleBrand";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Daftar - KOLEKSI",
  description:
    "Daftar menjadi anggota KOLEKSI, komunitas mobil elektrik Indonesia.",
};

export default async function DaftarPage() {
  // Sudah login → sudah anggota, tidak perlu daftar lagi.
  if (await getCurrentMember()) {
    redirect("/dasbor");
  }

  const [regencies, brands] = await Promise.all([
    getRegencies(),
    getVehicleBrands(),
  ]);

  return (
    <AuthShell
      title="Daftar"
      backHref="/"
      backLabel="Kembali ke Beranda"
      notice={<NoticeBanner message="*Wajib diisi" actionLabel="Mengerti" />}
    >
      <RegisterForm regencies={regencies} brands={brands} />
    </AuthShell>
  );
}
