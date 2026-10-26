/**
 * Validasi form login — dipakai di client (umpan balik instan) DAN di Server Action
 * (sumber kebenaran; validasi client bisa dilewati). Backend tetap memvalidasi ulang.
 * Pesan dari dictionary bahasa aktif (t.validation).
 */

import type { Locale } from "@/types";
import { localizePath } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

export interface LoginFieldErrors {
  identifier?: string;
  password?: string;
}

export interface LoginInput {
  identifier: string;
  password: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** 08xx / 628xx / +62 8xx / 8xx, boleh pakai spasi atau "-" — sama dengan normalisasi di backend. */
const PHONE_PATTERN = /^(?:\+?62|0)?8\d{7,12}$/;

export function validateLogin({ identifier, password }: LoginInput, m: Dictionary["validation"]): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  const id = identifier.trim();

  if (!id) {
    errors.identifier = m.identifierRequired;
  } else if (id.length > 255) {
    errors.identifier = m.identifierTooLong;
  } else if (id.includes("@")) {
    if (!EMAIL_PATTERN.test(id)) errors.identifier = m.emailInvalid;
  } else if (!PHONE_PATTERN.test(id.replace(/[\s-]/g, ""))) {
    errors.identifier = m.phoneInvalid;
  }

  if (!password) {
    errors.password = m.loginPasswordRequired;
  } else if (password.length > 255) {
    errors.password = m.loginPasswordTooLong;
  }

  return errors;
}

/**
 * Tujuan redirect setelah login (?next=). Hanya path internal — tolak "//evil.com",
 * "/\evil.com", atau URL absolut supaya tidak bisa dipakai untuk open redirect.
 */
export function safeRedirectPath(next: unknown, fallback = "/dasbor"): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }

  return next;
}

/**
 * Sesi kedaluwarsa: /api/auth/expired menghapus cookie lalu ke halaman Masuk dalam bahasa yang sama.
 * `next` = path tanpa prefix bahasa (mis. "/dasbor/profile").
 */
export function expiredPath(next: string, locale: Locale): string {
  const params = new URLSearchParams({ next });
  if (locale !== "id") params.set("lang", locale);

  return `/api/auth/expired?${params}`;
}

/** Tujuan setelah login (path tanpa prefix bahasa, sudah lolos safeRedirectPath) dalam bahasa `locale`. */
export function localizedRedirectPath(next: unknown, locale: Locale, fallback = "/dasbor"): string {
  return localizePath(safeRedirectPath(next, fallback), locale);
}
