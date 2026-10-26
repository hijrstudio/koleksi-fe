/**
 * Aturan kata sandi baru — sama dengan backend (UpdateMemberPasswordRequest). Dipakai untuk checklist
 * di form (client) dan validasi Server Action. Backend juga menolak kata sandi yang pernah bocor
 * (Have I Been Pwned) dan yang sama dengan kata sandi lama; dua cek itu hanya bisa di server.
 */

import { format } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

export const PASSWORD_MIN = 8;
/** bcrypt hanya memakai 72 byte pertama. */
export const PASSWORD_MAX = 72;

/** Label & pesan error tiap aturan ada di dictionary: t.validation.passwordRules[id]. */
export const PASSWORD_RULES = [
  { id: "length", test: (p: string) => p.length >= PASSWORD_MIN },
  { id: "lower", test: (p: string) => /[a-z]/.test(p) },
  { id: "upper", test: (p: string) => /[A-Z]/.test(p) },
  { id: "number", test: (p: string) => /\d/.test(p) },
] as const;

export type PasswordRuleId = (typeof PASSWORD_RULES)[number]["id"];

/** Teks aturan kata sandi (label checklist / pesan error) sesuai bahasa. */
export function passwordRuleText(m: Dictionary["validation"], id: PasswordRuleId, kind: "label" | "error"): string {
  return format(m.passwordRules[id][kind], { min: PASSWORD_MIN });
}

/** Error panjang + PASSWORD_RULES (tanpa cek wajib diisi) — dipakai juga oleh form Daftar. */
export function passwordStrengthError(password: string, m: Dictionary["validation"]): string | undefined {
  if (new TextEncoder().encode(password).length > PASSWORD_MAX) return format(m.passwordMax, { max: PASSWORD_MAX });

  const failed = PASSWORD_RULES.find((rule) => !rule.test(password));
  return failed && passwordRuleText(m, failed.id, "error");
}

/** Error kata sandi baru — sama untuk ganti & atur ulang kata sandi. */
function newPasswordError(password: string, m: Dictionary["validation"]): string | undefined {
  if (!password) return m.newPasswordRequired;

  return passwordStrengthError(password, m);
}

export interface ResetPasswordInput {
  password: string;
  password_confirmation: string;
}

export type ResetPasswordErrors = Partial<Record<keyof ResetPasswordInput, string>>;

/** Atur ulang kata sandi dari link e-mail (lupa kata sandi). */
export function validateResetPassword(v: ResetPasswordInput, m: Dictionary["validation"]): ResetPasswordErrors {
  const e: ResetPasswordErrors = {};

  const passwordError = newPasswordError(v.password, m);
  if (passwordError) e.password = passwordError;

  if (!v.password_confirmation) e.password_confirmation = m.repeatNewPassword;
  else if (v.password_confirmation !== v.password) e.password_confirmation = m.passwordMismatch;

  return e;
}

export interface ChangePasswordInput {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export type ChangePasswordErrors = Partial<Record<keyof ChangePasswordInput, string>>;

export function validateChangePassword(v: ChangePasswordInput, m: Dictionary["validation"]): ChangePasswordErrors {
  const e: ChangePasswordErrors = {};

  if (!v.current_password) e.current_password = m.currentPasswordRequired;

  const passwordError = newPasswordError(v.password, m);
  if (passwordError) e.password = passwordError;
  else if (v.password === v.current_password) e.password = m.passwordSameAsCurrent;

  if (!v.password_confirmation) e.password_confirmation = m.repeatNewPassword;
  else if (v.password_confirmation !== v.password) e.password_confirmation = m.passwordMismatch;

  return e;
}
