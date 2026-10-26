"use server";

import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { clientIp } from "@/lib/auth/clientIp";
import { type ResetPasswordErrors, type ResetPasswordInput, validateResetPassword } from "@/lib/auth/password";
import { localizePath } from "@/lib/i18n/config";
import { requestI18n } from "@/lib/i18n/request";
import { requestPasswordReset, resetPassword } from "@/services/memberPasswordReset";

export interface ForgotPasswordState {
  /** Pesan sukses (sama untuk e-mail terdaftar maupun tidak). */
  message?: string;
  error?: string;
  /** E-mail yang terakhir dikirim — supaya input tetap terisi setelah submit. */
  email?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Langkah 1: kirim link atur ulang ke e-mail. */
export async function requestReset(_prev: ForgotPasswordState, formData: FormData): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim();
  const { t } = await requestI18n(formData.get("lang"));
  if (!EMAIL_PATTERN.test(email)) {
    return { email, error: t.auth.invalidEmail };
  }

  try {
    // Pesan sukses dari dictionary (sama persis untuk e-mail terdaftar maupun tidak)
    await requestPasswordReset(email, await clientIp());
    return { email, message: t.auth.forgot.sent };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 422 || error.status === 429)) {
      const errors = (error.body as { errors?: Record<string, string[]> } | undefined)?.errors;
      return { email, error: errors?.email?.[0] ?? t.auth.tooOften };
    }

    console.error("[requestReset]", error instanceof ApiError ? error.status : error);
    return { email, error: t.auth.forgot.sendFailed };
  }
}

export interface ResetPasswordState {
  errors?: ResetPasswordErrors;
  message?: string;
  /** Link tidak valid / kedaluwarsa / sudah dipakai — tampilkan ajakan minta link baru. */
  linkInvalid?: boolean;
}

/**
 * Langkah 2: simpan kata sandi baru. Kata sandi tidak dikembalikan ke client & tidak di-log.
 * Berhasil → ke /masuk dengan pesan sukses (semua sesi login sudah dicabut backend).
 */
export async function submitReset(_prev: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const email = String(formData.get("email") ?? "");
  const token = String(formData.get("token") ?? "");
  // Kata sandi tidak di-trim: spasi adalah karakter yang sah.
  const input: ResetPasswordInput = {
    password: String(formData.get("password") ?? ""),
    password_confirmation: String(formData.get("password_confirmation") ?? ""),
  };

  if (!email || !token) return { linkInvalid: true };

  const { locale, t } = await requestI18n(formData.get("lang"));
  const errors = validateResetPassword(input, t.validation);
  if (Object.keys(errors).length > 0) return { errors };

  try {
    await resetPassword({ ...input, email, token }, await clientIp());
  } catch (error) {
    if (error instanceof ApiError && (error.status === 422 || error.status === 429)) {
      const raw = (error.body as { errors?: Record<string, string[]> } | undefined)?.errors ?? {};
      if (raw.token || raw.email) return { linkInvalid: true };

      return {
        errors: { password: raw.password?.[0], password_confirmation: raw.password_confirmation?.[0] },
        message: error.status === 429 ? t.auth.tooManyAttempts : undefined,
      };
    }

    console.error("[submitReset]", error instanceof ApiError ? error.status : error);
    return { message: t.auth.reset.saveFailed };
  }

  // redirect() di luar try: ia bekerja dengan melempar error khusus.
  redirect(localizePath("/masuk?reset=berhasil", locale));
}
