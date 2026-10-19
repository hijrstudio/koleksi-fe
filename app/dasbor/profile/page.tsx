import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { getMemberProfile } from "@/services/memberProfile";
import { getDistricts, getRegencies, getVillages } from "@/services/region";
import { getVehicleBrands } from "@/services/vehicleBrand";
import ProfileForm from "./ProfileForm";

export const metadata: Metadata = {
  title: "Ubah Profil - KOLEKSI",
  description: "Lihat dan ubah data profil anggota KOLEKSI.",
};

const EXPIRED = "/api/auth/expired?next=%2Fdasbor%2Fprofile";

export default async function ProfilePage() {
  const token = await getSessionToken();
  if (!token) redirect(EXPIRED);

  const [profile, regencies, brands] = await Promise.all([
    getMemberProfile(token).catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 401) redirect(EXPIRED);
      throw error;
    }),
    getRegencies(),
    getVehicleBrands(),
  ]);

  // Opsi kecamatan/kelurahan untuk wilayah yang tersimpan, supaya dropdown langsung terisi
  const cityCode = profile.city?.code ?? "";
  const districtCode = profile.district?.code ?? "";
  const [districts, villages] = await Promise.all([
    cityCode ? getDistricts(cityCode) : [],
    districtCode ? getVillages(districtCode) : [],
  ]);

  return (
    <AuthShell title="Ubah" backHref="/dasbor" backLabel="Kembali">
      <ProfileForm
        profile={profile}
        regencies={regencies}
        brands={brands}
        regionLists={{ cityCode, districts, districtCode, villages }}
      />
    </AuthShell>
  );
}
