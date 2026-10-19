"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { clientIp } from "@/lib/auth/clientIp";
import { type ChangePasswordErrors, validateChangePassword } from "@/lib/auth/password";
import { getSessionToken } from "@/lib/auth/session";
import { updateMemberPassword } from "@/services/memberPassword";

export interface ChangePasswordState {
  errors?: ChangePasswordErrors;
  message?: string;
  success?: boolean;
  /** Berubah setiap kali berhasil — form di-remount (dikosongkan). */
  savedAt?: number;
  revokedSessions?: number;
}

const EXPIRED = "/api/auth/expired?next=%2Fdasbor%2Fprofile%2Fubah-kata-sandi";

function backendErrors(body: unknown): ChangePasswordErrors {
  const raw = (body as { errors?: Record<string, string[]> } | undefined)?.errors ?? {};

  return {
    current_password: raw.current_password?.[0],
    password: raw.password?.[0],
    password_confirmation: raw.password_confirmation?.[0],
  };
}

/**
 * Kata sandi tidak pernah dikembalikan ke client (tidak ada di state), dan tidak di-log.
 * Sesi yang sedang dipakai tetap aktif; sesi di perangkat lain dicabut oleh backend.
 */
export async function changePassword(prev: ChangePasswordState, formData: FormData): Promise<ChangePasswordState> {
  const token = await getSessionToken();
  if (!token) redirect(EXPIRED);

  // Kata sandi tidak di-trim: spasi adalah karakter yang sah.
  const input = {
    current_password: String(formData.get("current_password") ?? ""),
    password: String(formData.get("password") ?? ""),
    password_confirmation: String(formData.get("password_confirmation") ?? ""),
  };

  const errors = validateChangePassword(input);
  if (Object.keys(errors).length > 0) {
    return { savedAt: prev.savedAt, errors };
  }

  try {
    const result = await updateMemberPassword(token, input, await clientIp());
    // Banner "ubah kata sandi awal" di Dasbor hilang
    revalidatePath("/dasbor");

    return { success: true, savedAt: Date.now(), revokedSessions: result.revoked_sessions };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(EXPIRED);
    if (error instanceof ApiError && (error.status === 422 || error.status === 429)) {
      return { savedAt: prev.savedAt, errors: backendErrors(error.body) };
    }

    console.error("[changePassword]", error instanceof ApiError ? error.status : error);
    return { savedAt: prev.savedAt, message: "Gagal mengubah kata sandi. Silakan coba lagi beberapa saat lagi." };
  }
}
