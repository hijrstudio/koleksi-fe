"use client";

import { type FormEvent, startTransition, useActionState, useState } from "react";
import Link from "next/link";
import Field from "@/components/auth/FormField";
import PasswordInput from "@/components/auth/PasswordInput";
import PasswordRulesChecklist from "@/components/auth/PasswordRulesChecklist";
import { authSubmitClass } from "@/components/auth/authStyles";
import { type ChangePasswordState, changePassword } from "@/app/actions/password";
import {
  type ChangePasswordErrors,
  type ChangePasswordInput,
  PASSWORD_MAX,
  validateChangePassword,
} from "@/lib/auth/password";

const cancelClass =
  "inline-flex min-w-35.75 items-center justify-center rounded-full border border-koleksi-navy-dark px-8 py-2.5 text-xl leading-8 font-bold text-koleksi-navy-dark transition hover:border-koleksi-green hover:text-koleksi-green dark:border-ink-dark/40 dark:text-ink-dark";

const EMPTY: ChangePasswordInput = { current_password: "", password: "", password_confirmation: "" };

/** `username` = e-mail/No. HP akun, untuk password manager (field tersembunyi). */
export default function ChangePasswordForm({ username }: { username: string }) {
  const [state, formAction, pending] = useActionState<ChangePasswordState, FormData>(changePassword, {});

  // Remount setelah berhasil → semua field kata sandi dikosongkan
  return <Fields key={state.savedAt ?? 0} username={username} state={state} formAction={formAction} pending={pending} />;
}

function Fields({
  username,
  state,
  formAction,
  pending,
}: {
  username: string;
  state: ChangePasswordState;
  formAction: (payload: FormData) => void;
  pending: boolean;
}) {
  const [values, setValues] = useState<ChangePasswordInput>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [edited, setEdited] = useState<Partial<Record<keyof ChangePasswordInput, boolean>>>({});

  const clientErrors: ChangePasswordErrors = submitted ? validateChangePassword(values) : {};
  const errorFor = (key: keyof ChangePasswordInput) =>
    clientErrors[key] ?? (edited[key] ? undefined : state.errors?.[key]);

  function set(key: keyof ChangePasswordInput, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setEdited((e) => ({ ...e, [key]: true }));
  }

  function aria(key: keyof ChangePasswordInput, id: string, extra?: string) {
    const error = errorFor(key);
    const describedBy = [error ? `${id}-error` : null, extra].filter(Boolean).join(" ");
    return {
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy || undefined,
    } as const;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    if (Object.keys(validateChangePassword(values)).length > 0) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    const fd = new FormData();
    Object.entries(values).forEach(([key, value]) => fd.append(key, value));
    setEdited({});
    startTransition(() => formAction(fd));
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={pending} className="max-w-121">
      {state.success && (
        <div role="status" className="mb-10 rounded-lg bg-koleksi-green/10 px-4 py-3 text-sm text-koleksi-green">
          <p className="font-semibold">Kata sandi berhasil diubah.</p>
          {!!state.revokedSessions && (
            <p className="mt-1 text-koleksi-navy-dark/70 dark:text-ink-dark/70">
              {state.revokedSessions} sesi login di perangkat lain telah dikeluarkan.
            </p>
          )}
        </div>
      )}
      {state.message && (
        <p role="alert" className="mb-10 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.message}
        </p>
      )}

      {/* Untuk password manager: tahu kata sandi baru ini milik akun yang mana */}
      <input type="text" name="username" autoComplete="username" value={username} readOnly hidden />

      <fieldset disabled={pending} className="flex flex-col gap-5">
        <Field id="sandi-lama" label="Kata sandi saat ini" required error={errorFor("current_password")}>
          <PasswordInput
            id="sandi-lama"
            autoComplete="current-password"
            placeholder="Kata sandi saat ini"
            required
            maxLength={255}
            value={values.current_password}
            onChange={(e) => set("current_password", e.target.value)}
            {...aria("current_password", "sandi-lama")}
          />
        </Field>

        <Field id="sandi-baru" label="Kata sandi baru" required error={errorFor("password")}>
          <PasswordInput
            id="sandi-baru"
            autoComplete="new-password"
            placeholder="Kata sandi baru"
            required
            maxLength={PASSWORD_MAX}
            value={values.password}
            onChange={(e) => set("password", e.target.value)}
            {...aria("password", "sandi-baru", "sandi-syarat")}
          />
        </Field>

        <div className="-mt-1">
          <PasswordRulesChecklist id="sandi-syarat" password={values.password} />
        </div>

        <Field id="sandi-konfirmasi" label="Konfirmasi kata sandi baru" required error={errorFor("password_confirmation")}>
          <PasswordInput
            id="sandi-konfirmasi"
            autoComplete="new-password"
            placeholder="Ulangi kata sandi baru"
            required
            maxLength={PASSWORD_MAX}
            value={values.password_confirmation}
            onChange={(e) => set("password_confirmation", e.target.value)}
            {...aria("password_confirmation", "sandi-konfirmasi")}
          />
        </Field>

        <p className="text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">
          Hindari kata sandi yang mudah ditebak atau yang dipakai di situs lain. Setelah diubah, semua sesi login di
          perangkat lain akan dikeluarkan.
        </p>
      </fieldset>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={authSubmitClass}>
          {pending ? "Menyimpan..." : "Simpan"}
        </button>
        <Link href="/dasbor/profile" className={cancelClass}>
          Batal
        </Link>
      </div>
    </form>
  );
}
