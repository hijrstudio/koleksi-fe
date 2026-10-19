import "server-only";

import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { MemberEditProfile } from "@/types";

/** Data form "Ubah profil" milik member pemilik token. */
export async function getMemberProfile(token: string): Promise<MemberEditProfile> {
  const { data } = await apiFetch<{ data: MemberEditProfile }>(API_ENDPOINTS.memberProfile, {
    headers: { Authorization: `Bearer ${token}` },
    revalidate: false,
  });

  return data;
}

/** Simpan profil (multipart: data + dokumen kendaraan). Melempar ApiError 422 kalau validasi gagal. */
export async function updateMemberProfile(token: string, body: FormData): Promise<MemberEditProfile> {
  const { data } = await apiFetch<{ data: MemberEditProfile }>(API_ENDPOINTS.memberProfile, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
    revalidate: false,
  });

  return data;
}
