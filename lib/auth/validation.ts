/**
 * Validasi form login — dipakai di client (umpan balik instan) DAN di Server Action
 * (sumber kebenaran; validasi client bisa dilewati). Backend tetap memvalidasi ulang.
 */

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

export function validateLogin({ identifier, password }: LoginInput): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  const id = identifier.trim();

  if (!id) {
    errors.identifier = "E-mail atau No. HP wajib diisi.";
  } else if (id.length > 255) {
    errors.identifier = "E-mail atau No. HP terlalu panjang.";
  } else if (id.includes("@")) {
    if (!EMAIL_PATTERN.test(id)) errors.identifier = "Format e-mail tidak valid.";
  } else if (!PHONE_PATTERN.test(id.replace(/[\s-]/g, ""))) {
    errors.identifier = "Format No. HP tidak valid (contoh: 081234567890).";
  }

  if (!password) {
    errors.password = "Password wajib diisi.";
  } else if (password.length > 255) {
    errors.password = "Password terlalu panjang.";
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
