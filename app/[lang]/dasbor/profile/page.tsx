import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { expiredPath } from "@/lib/auth/validation";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getMemberProfile } from "@/services/memberProfile";
import { getDistricts, getRegencies, getVillages } from "@/services/region";
import { getVehicleBrands } from "@/services/vehicleBrand";
import ProfileForm from "./ProfileForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.profile.metaTitle, description: t.profile.metaDescription };
}

export default async function ProfilePage() {
  const locale = await getLocale();
  const expired = expiredPath("/dasbor/profile", locale);

  const token = await getSessionToken();
  if (!token) redirect(expired);

  const [profile, regencies, brands, t] = await Promise.all([
    getMemberProfile(token).catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 401) redirect(expired);
      throw error;
    }),
    getRegencies(),
    getVehicleBrands(),
    getDictionary(locale),
  ]);

  // Opsi kecamatan/kelurahan untuk wilayah yang tersimpan, supaya dropdown langsung terisi
  const cityCode = profile.city?.code ?? "";
  const districtCode = profile.district?.code ?? "";
  const [districts, villages] = await Promise.all([
    cityCode ? getDistricts(cityCode) : [],
    districtCode ? getVillages(districtCode) : [],
  ]);

  return (
    <AuthShell title={t.profile.title} backHref="/dasbor" backLabel={t.common.back}>
      <ProfileForm
        profile={profile}
        regencies={regencies}
        brands={brands}
        regionLists={{ cityCode, districts, districtCode, villages }}
      />
    </AuthShell>
  );
}
