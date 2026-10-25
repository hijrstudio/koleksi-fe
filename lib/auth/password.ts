/**
 * Aturan kata sandi baru — sama dengan backend (UpdateMemberPasswordRequest). Dipakai untuk checklist
 * di form (client) dan validasi Server Action. Backend juga menolak kata sandi yang pernah bocor
 * (Have I Been Pwned) dan yang sama dengan kata sandi lama; dua cek itu hanya bisa di server.
 */

export const PASSWORD_MIN = 8;
/** bcrypt hanya memakai 72 byte pertama. */
export const PASSWORD_MAX = 72;

export const PASSWORD_RULES = [
  {
    id: "length",
    label: `Minimal ${PASSWORD_MIN} karakter`,
    error: `Kata sandi minimal ${PASSWORD_MIN} karakter.`,
    test: (p: string) => p.length >= PASSWORD_MIN,
  },
  { id: "lower", label: "Huruf kecil (a–z)", error: "Kata sandi harus mengandung huruf kecil.", test: (p: string) => /[a-z]/.test(p) },
  { id: "upper", label: "Huruf besar (A–Z)", error: "Kata sandi harus mengandung huruf besar.", test: (p: string) => /[A-Z]/.test(p) },
  { id: "number", label: "Angka (0–9)", error: "Kata sandi harus mengandung angka.", test: (p: string) => /\d/.test(p) },
] as const;

/** Error kata sandi baru (panjang + PASSWORD_RULES) — sama untuk ganti & atur ulang kata sandi. */
function newPasswordError(password: string): string | undefined {
  if (!password) return "Kata sandi baru wajib diisi.";
  if (new TextEncoder().encode(password).length > PASSWORD_MAX) return `Kata sandi maksimal ${PASSWORD_MAX} karakter.`;

  return PASSWORD_RULES.find((rule) => !rule.test(password))?.error;
}

export interface ResetPasswordInput {
  password: string;
  password_confirmation: string;
}

export type ResetPasswordErrors = Partial<Record<keyof ResetPasswordInput, string>>;

/** Atur ulang kata sandi dari link e-mail (lupa kata sandi). */
export function validateResetPassword(v: ResetPasswordInput): ResetPasswordErrors {
  const e: ResetPasswordErrors = {};

  const passwordError = newPasswordError(v.password);
  if (passwordError) e.password = passwordError;

  if (!v.password_confirmation) e.password_confirmation = "Ulangi kata sandi baru.";
  else if (v.password_confirmation !== v.password) e.password_confirmation = "Konfirmasi kata sandi tidak sama.";

  return e;
}

export interface ChangePasswordInput {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export type ChangePasswordErrors = Partial<Record<keyof ChangePasswordInput, string>>;

export function validateChangePassword(v: ChangePasswordInput): ChangePasswordErrors {
  const e: ChangePasswordErrors = {};

  if (!v.current_password) e.current_password = "Kata sandi saat ini wajib diisi.";

  const passwordError = newPasswordError(v.password);
  if (passwordError) e.password = passwordError;
  else if (v.password === v.current_password) e.password = "Kata sandi baru harus berbeda dari kata sandi saat ini.";

  if (!v.password_confirmation) e.password_confirmation = "Ulangi kata sandi baru.";
  else if (v.password_confirmation !== v.password) e.password_confirmation = "Konfirmasi kata sandi tidak sama.";

  return e;
}
