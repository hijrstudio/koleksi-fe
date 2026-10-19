/**
 * Form "Daftar" — tipe & validasi yang dipakai bersama oleh Client Component (umpan balik instan) dan
 * Server Action (sebelum diteruskan ke backend). Data pribadi & kendaraan memakai aturan form "Ubah profil";
 * backend tetap memvalidasi ulang (keunikan e-mail/No. HP/VIN/plat, kata sandi bocor, wilayah, merek/tipe).
 */

import { PASSWORD_MAX, PASSWORD_RULES } from "@/lib/auth/password";
import {
  PROFILE_FIELDS,
  type ProfileErrorKey,
  type ProfileFormValues,
  errorKeyFor,
  validateProfile,
} from "@/lib/profile/validation";

export interface RegisterFormValues extends ProfileFormValues {
  email: string;
  password: string;
  password_confirmation: string;
  heard_from: string;
}

export const REGISTER_FIELDS = [
  "email",
  "password",
  "password_confirmation",
  ...PROFILE_FIELDS,
  "heard_from",
] as const satisfies readonly (keyof RegisterFormValues)[];

export type RegisterErrorKey =
  | ProfileErrorKey
  | "email"
  | "password"
  | "password_confirmation"
  | "heard_from";

export type RegisterErrors = Partial<Record<RegisterErrorKey, string>>;

export const EMPTY_REGISTER_VALUES: RegisterFormValues = {
  email: "",
  password: "",
  password_confirmation: "",
  nama_lengkap: "",
  nama_panggilan: "",
  tgl_lahir: "",
  jenis_kelamin: "",
  no_hp: "",
  alamat: "",
  city_code: "",
  district_code: "",
  village_code: "",
  has_vehicle: "ya",
  vin: "",
  plat_kode: "",
  plat_nomor: "",
  plat_seri: "",
  plat_status: "permanen",
  vehicle_brand_id: "",
  vehicle_model_id: "",
  tahun: "",
  heard_from: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(
  v: RegisterFormValues,
  docs: { count: number; bytes: number },
): RegisterErrors {
  const e: RegisterErrors = validateProfile(v, {
    count: docs.count,
    newCount: docs.count,
    newBytes: docs.bytes,
  });

  const email = v.email.trim();
  if (!email) e.email = "Alamat e-mail wajib diisi.";
  else if (email.length > 255 || !EMAIL_PATTERN.test(email)) e.email = "Format e-mail tidak valid.";

  if (!v.password) {
    e.password = "Kata sandi wajib diisi.";
  } else if (new TextEncoder().encode(v.password).length > PASSWORD_MAX) {
    e.password = `Kata sandi maksimal ${PASSWORD_MAX} karakter.`;
  } else {
    const failed = PASSWORD_RULES.find((rule) => !rule.test(v.password));
    if (failed) e.password = failed.error;
  }

  if (!v.password_confirmation) e.password_confirmation = "Ulangi kata sandi.";
  else if (v.password_confirmation !== v.password) e.password_confirmation = "Konfirmasi kata sandi tidak sama.";

  if (v.heard_from.length > 60) e.heard_from = "Pilihan tidak valid.";

  return e;
}

/** Field API backend → kunci error di form. */
export function registerErrorKeyFor(apiField: string): RegisterErrorKey | null {
  if (apiField === "email" || apiField === "password" || apiField === "heard_from") return apiField;
  if (apiField === "password_confirmation") return "password_confirmation";

  return errorKeyFor(apiField);
}
