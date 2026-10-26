import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import NoticeBanner from "@/components/ui/NoticeBanner";
import { getDictionary, localizedRedirect } from "@/lib/i18n/server";
import { getCurrentMember } from "@/services/memberAuth";
import { getRegencies } from "@/services/region";
import { getVehicleBrands } from "@/services/vehicleBrand";
import RegisterForm from "./RegisterForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.auth.register.metaTitle, description: t.auth.register.metaDescription };
}

export default async function DaftarPage() {
  // Sudah login → sudah anggota, tidak perlu daftar lagi.
  if (await getCurrentMember()) {
    await localizedRedirect("/dasbor");
  }

  const [regencies, brands, t] = await Promise.all([
    getRegencies(),
    getVehicleBrands(),
    getDictionary(),
  ]);

  return (
    <AuthShell
      title={t.auth.register.title}
      backHref="/"
      backLabel={t.common.backToHome}
      notice={<NoticeBanner message={t.auth.register.requiredNotice} actionLabel={t.auth.register.gotIt} />}
    >
      <RegisterForm regencies={regencies} brands={brands} />
    </AuthShell>
  );
}
