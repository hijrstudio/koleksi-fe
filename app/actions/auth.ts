"use server";

import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { clientIp } from "@/lib/auth/clientIp";
import { clearSessionToken, getSessionToken, setSessionToken } from "@/lib/auth/session";
import { type LoginFieldErrors, safeRedirectPath, validateLogin } from "@/lib/auth/validation";
import { loginMember, logoutMember } from "@/services/memberAuth";

export interface LoginState {
  errors?: LoginFieldErrors;
  /** Pesan umum di atas form (mis. server tidak bisa dihubungi). */
  message?: string;
}

/** Pesan pertama per field dari response 422/429 Laravel. */
function backendErrors(body: unknown): LoginFieldErrors {
  const errors = (body as { errors?: Record<string, string[]> } | undefined)?.errors ?? {};

  return {
    identifier: errors.identifier?.[0],
    password: errors.password?.[0],
  };
}

/**
 * Server Action login. Berjalan di server, jadi token tidak pernah lewat JavaScript browser:
 * backend → server Next.js → cookie httpOnly. Next.js juga memvalidasi Origin request Server Action (CSRF).
 */
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "");
  const password = String(formData.get("password") ?? "");

  const errors = validateLogin({ identifier, password });
  if (errors.identifier || errors.password) {
    return { errors };
  }

  try {
    const result = await loginMember(identifier.trim(), password, await clientIp());
    await setSessionToken(result.token, result.expires_at);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 422 || error.status === 429)) {
      return { errors: backendErrors(error.body) };
    }

    console.error("[login]", error);
    return { message: "Tidak dapat terhubung ke server. Silakan coba lagi beberapa saat lagi." };
  }

  // redirect() di luar try: ia bekerja dengan melempar error khusus.
  redirect(safeRedirectPath(formData.get("next")));
}

export async function logout(): Promise<void> {
  const token = await getSessionToken();
  if (token) {
    await logoutMember(token);
  }

  await clearSessionToken();
  redirect("/masuk");
}
