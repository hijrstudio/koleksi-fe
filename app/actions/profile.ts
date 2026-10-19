"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import {
  PROFILE_FIELDS,
  type ProfileErrors,
  type ProfileFormValues,
  errorKeyFor,
  toApiDate,
  validateProfile,
} from "@/lib/profile/validation";
import { updateMemberProfile } from "@/services/memberProfile";
import type { MemberEditProfile } from "@/types";

export interface ProfileState {
  errors?: ProfileErrors;
  message?: string;
  /** Terisi setelah berhasil disimpan — form di-reset ke data terbaru ini. */
  profile?: MemberEditProfile;
  savedAt?: number;
}

const EXPIRED = "/api/auth/expired?next=%2Fdasbor%2Fprofile";

function readValues(formData: FormData): ProfileFormValues {
  const values = Object.fromEntries(
    PROFILE_FIELDS.map((key) => [key, String(formData.get(key) ?? "").trim()]),
  );

  return values as unknown as ProfileFormValues;
}

/** Hanya field yang dikenal yang diteruskan ke backend (whitelist), dalam format API. */
function toBackendBody(
  v: ProfileFormValues,
  documents: File[],
  removeIds: string[],
  photo: { file: File | null; remove: boolean },
): FormData {
  const body = new FormData();
  const hasVehicle = v.has_vehicle === "ya";

  const personal = {
    nama_lengkap: v.nama_lengkap,
    nama_panggilan: v.nama_panggilan,
    tgl_lahir: v.tgl_lahir ? (toApiDate(v.tgl_lahir) ?? "") : "",
    jenis_kelamin: v.jenis_kelamin,
    no_hp: v.no_hp,
    alamat: v.alamat,
    city_code: v.city_code,
    district_code: v.district_code,
    village_code: v.village_code,
    has_vehicle: hasVehicle ? "1" : "0",
  };
  Object.entries(personal).forEach(([k, value]) => body.append(k, value));

  if (photo.file) body.append("photo", photo.file, photo.file.name);
  else if (photo.remove) body.append("remove_photo", "1");

  if (hasVehicle) {
    const vehicle = {
      vin: v.vin,
      plat_kode: v.plat_kode,
      plat_nomor: v.plat_nomor,
      plat_seri: v.plat_seri,
      plat_status: v.plat_status,
      vehicle_brand_id: v.vehicle_brand_id,
      vehicle_model_id: v.vehicle_brand_id ? v.vehicle_model_id : "",
      tahun: v.tahun,
    };
    Object.entries(vehicle).forEach(([k, value]) => body.append(k, value));
    documents.forEach((file) => body.append("documents[]", file, file.name));
    removeIds.forEach((id) => body.append("remove_document_ids[]", id));
  }

  return body;
}

function backendErrors(body: unknown): ProfileErrors {
  const raw = (body as { errors?: Record<string, string[]> } | undefined)?.errors ?? {};
  const errors: ProfileErrors = {};

  for (const [field, messages] of Object.entries(raw)) {
    const key = errorKeyFor(field);
    if (key && !errors[key]) errors[key] = messages[0];
  }

  return errors;
}

export async function updateProfile(prev: ProfileState, formData: FormData): Promise<ProfileState> {
  // Saat gagal, profil & savedAt sebelumnya dipertahankan supaya form tidak di-remount (isian tidak hilang).
  const keep = { profile: prev.profile, savedAt: prev.savedAt };

  const token = await getSessionToken();
  if (!token) redirect(EXPIRED);

  const values = readValues(formData);
  const documents = formData
    .getAll("documents")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const photoEntry = formData.get("photo");
  const photo = photoEntry instanceof File && photoEntry.size > 0 ? photoEntry : null;
  const removePhoto = formData.get("remove_photo") === "1";
  const removeIds = formData
    .getAll("remove_document_ids")
    .map(String)
    .filter((id) => /^\d+$/.test(id));

  // Cek minimal 1 dokumen diserahkan ke backend (server tidak tahu jumlah dokumen lama di sini).
  const errors = validateProfile(values, {
    newCount: documents.length,
    newBytes: documents.reduce((sum, f) => sum + f.size, 0),
    photo,
  });
  if (Object.keys(errors).length > 0) {
    return { ...keep, errors, message: "Periksa kembali isian yang ditandai." };
  }

  let profile: MemberEditProfile;
  try {
    profile = await updateMemberProfile(token, toBackendBody(values, documents, removeIds, { file: photo, remove: removePhoto }));
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(EXPIRED);
    if (error instanceof ApiError && error.status === 422) {
      return { ...keep, errors: backendErrors(error.body), message: "Periksa kembali isian yang ditandai." };
    }

    console.error("[updateProfile]", error);
    return { ...keep, message: "Gagal menyimpan profil. Silakan coba lagi beberapa saat lagi." };
  }

  // Nama, foto, lokasi & banner "lengkapi profil" di Dasbor (dan avatar di Header) ikut berubah
  revalidatePath("/dasbor");

  return { profile, savedAt: Date.now() };
}
