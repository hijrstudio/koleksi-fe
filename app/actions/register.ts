"use server";

import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { clientIp } from "@/lib/auth/clientIp";
import { toApiDate } from "@/lib/profile/validation";
import {
  REGISTER_FIELDS,
  type RegisterErrors,
  type RegisterFormValues,
  registerErrorKeyFor,
  validateRegister,
} from "@/lib/register/validation";
import { getRegisteredEmail, setRegisteredEmail } from "@/lib/register/session";
import { localizePath } from "@/lib/i18n/config";
import { requestI18n } from "@/lib/i18n/request";
import { registerMember, resendRegistrationVerification } from "@/services/memberRegistration";

export interface RegisterState {
  errors?: RegisterErrors;
  message?: string;
}

export interface ResendState {
  message?: string;
  error?: string;
}

function readValues(formData: FormData): RegisterFormValues {
  const values = Object.fromEntries(
    REGISTER_FIELDS.map((key) => {
      const raw = String(formData.get(key) ?? "");
      // Kata sandi tidak di-trim: spasi adalah karakter yang sah.
      return [key, key === "password" || key === "password_confirmation" ? raw : raw.trim()];
    }),
  );

  return values as unknown as RegisterFormValues;
}

/** Hanya field yang dikenal yang diteruskan ke backend (whitelist), dalam format API. */
function toBackendBody(v: RegisterFormValues, documents: File[]): FormData {
  const body = new FormData();
  const hasVehicle = v.has_vehicle === "ya";

  const fields: Record<string, string> = {
    email: v.email,
    password: v.password,
    password_confirmation: v.password_confirmation,
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
    heard_from: v.heard_from,
  };

  if (hasVehicle) {
    Object.assign(fields, {
      vin: v.vin,
      plat_kode: v.plat_kode,
      plat_nomor: v.plat_nomor,
      plat_seri: v.plat_seri,
      plat_status: v.plat_status,
      vehicle_brand_id: v.vehicle_brand_id,
      vehicle_model_id: v.vehicle_brand_id ? v.vehicle_model_id : "",
      tahun: v.tahun,
    });
    documents.forEach((file) => body.append("documents[]", file, file.name));
  }

  Object.entries(fields).forEach(([k, value]) => body.append(k, value));

  return body;
}

function backendErrors(body: unknown): RegisterErrors {
  const raw = (body as { errors?: Record<string, string[]> } | undefined)?.errors ?? {};
  const errors: RegisterErrors = {};

  for (const [field, messages] of Object.entries(raw)) {
    const key = registerErrorKeyFor(field);
    if (key && !errors[key]) errors[key] = messages[0];
  }

  return errors;
}

/**
 * Server Action pendaftaran. Kata sandi & dokumen hanya lewat server Next.js → backend, tidak pernah
 * dikembalikan ke client. Berhasil → halaman "Terima kasih" (cek e-mail untuk verifikasi).
 */
export async function register(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const values = readValues(formData);
  const documents = formData
    .getAll("documents")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const { locale, t } = await requestI18n(formData.get("lang"));
  const errors = validateRegister(
    values,
    {
      count: documents.length,
      bytes: documents.reduce((sum, f) => sum + f.size, 0),
    },
    t.validation,
  );
  if (Object.keys(errors).length > 0) {
    return { errors, message: t.auth.checkFields };
  }

  let email: string;
  try {
    ({ email } = await registerMember(toBackendBody(values, documents), await clientIp()));
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      return { errors: backendErrors(error.body), message: t.auth.checkFields };
    }
    if (error instanceof ApiError && error.status === 429) {
      return { message: t.auth.register.tooMany };
    }

    console.error("[register]", error instanceof ApiError ? error.status : error);
    return { message: t.auth.register.failed };
  }

  await setRegisteredEmail(email);

  // redirect() di luar try: ia bekerja dengan melempar error khusus.
  redirect(localizePath("/daftar/terima-kasih", locale));
}

/** Kirim ulang link verifikasi: e-mail dari form (halaman link kedaluwarsa) atau dari cookie pendaftaran. */
export async function resendVerification(_prev: ResendState, formData: FormData): Promise<ResendState> {
  const email = String(formData.get("email") ?? "").trim() || (await getRegisteredEmail()) || "";
  const { t } = await requestI18n(formData.get("lang"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: t.auth.invalidEmail };
  }

  try {
    // Pesan sukses dari dictionary (sama untuk e-mail terdaftar maupun tidak)
    await resendRegistrationVerification(email, await clientIp());
    return { message: t.auth.verify.resent };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 422 || error.status === 429)) {
      const errors = (error.body as { errors?: Record<string, string[]> } | undefined)?.errors;
      return { error: errors?.email?.[0] ?? t.auth.tooOften };
    }

    console.error("[resendVerification]", error instanceof ApiError ? error.status : error);
    return { error: t.auth.verify.resendFailed };
  }
}
