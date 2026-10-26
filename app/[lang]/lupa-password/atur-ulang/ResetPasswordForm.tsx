"use client";

import { type FormEvent, startTransition, useActionState, useState } from "react";
import Link from "@/components/i18n/Link";
import clsx from "@/lib/clsx";
import PasswordInput from "@/components/auth/PasswordInput";
import PasswordRulesChecklist from "@/components/auth/PasswordRulesChecklist";
import { authErrorClass, authLabelClass, authOutlineClass, authSubmitClass } from "@/components/auth/authStyles";
import { type ResetPasswordState, submitReset } from "@/app/actions/passwordReset";
import {
  PASSWORD_MAX,
  type ResetPasswordErrors,
  type ResetPasswordInput,
  validateResetPassword,
} from "@/lib/auth/password";
import { useI18n } from "@/components/i18n/I18nProvider";

const EMPTY: ResetPasswordInput = { password: "", password_confirmation: "" };

/** Langkah 2 lupa kata sandi: kata sandi baru. `email` & `token` dari link e-mail (sudah dicek di server). */
export default function ResetPasswordForm({ email, token }: { email: string; token: string }) {
  const { locale, t } = useI18n();
  const [state, formAction, pending] = useActionState<ResetPasswordState, FormData>(submitReset, {});
  const [values, setValues] = useState<ResetPasswordInput>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [edited, setEdited] = useState<Partial<Record<keyof ResetPasswordInput, boolean>>>({});

  // Error baru ditampilkan setelah submit pertama, lalu ikut live saat diketik.
  const clientErrors: ResetPasswordErrors = submitted ? validateResetPassword(values, t.validation) : {};
  const errorFor = (key: keyof ResetPasswordInput) =>
    clientErrors[key] ?? (edited[key] ? undefined : state.errors?.[key]);

  function set(key: keyof ResetPasswordInput, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setEdited((e) => ({ ...e, [key]: true }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    if (Object.keys(validateResetPassword(values, t.validation)).length > 0) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    const fd = new FormData();
    fd.append("email", email);
    fd.append("token", token);
    fd.append("lang", locale);
    Object.entries(values).forEach(([key, value]) => fd.append(key, value));
    setEdited({});
    startTransition(() => formAction(fd));
  }

  // Link mati di tengah jalan (mis. sudah dipakai di tab lain / lewat 60 menit saat mengetik)
  if (state.linkInvalid) {
    return <InvalidLink />;
  }

  const passwordError = errorFor("password");
  const confirmError = errorFor("password_confirmation");

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={pending} className="max-w-121">
      {state.message && (
        <p role="alert" className="mb-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.message}
        </p>
      )}

      {/* Untuk password manager: tahu kata sandi baru ini milik akun yang mana */}
      <input type="text" name="username" autoComplete="username" value={email} readOnly hidden />

      <fieldset disabled={pending}>
        <label htmlFor="reset-password" className={authLabelClass}>
          {t.auth.reset.newPasswordLabel}
        </label>
        <PasswordInput
          id="reset-password"
          name="password"
          autoComplete="new-password"
          placeholder={t.auth.reset.newPasswordPlaceholder}
          required
          maxLength={PASSWORD_MAX}
          value={values.password}
          onChange={(e) => set("password", e.target.value)}
          aria-invalid={passwordError ? true : undefined}
          aria-describedby={clsx(passwordError && "reset-password-error", "reset-password-syarat")}
        />
        {passwordError && (
          <p id="reset-password-error" role="alert" className={authErrorClass}>
            {passwordError}
          </p>
        )}
        <div className="mt-3">
          <PasswordRulesChecklist id="reset-password-syarat" password={values.password} />
        </div>

        <label htmlFor="reset-password-confirm" className={clsx(authLabelClass, "mt-5")}>
          {t.auth.reset.confirmLabel}
        </label>
        <PasswordInput
          id="reset-password-confirm"
          name="password_confirmation"
          autoComplete="new-password"
          placeholder={t.auth.reset.confirmPlaceholder}
          required
          maxLength={PASSWORD_MAX}
          value={values.password_confirmation}
          onChange={(e) => set("password_confirmation", e.target.value)}
          aria-invalid={confirmError ? true : undefined}
          aria-describedby={confirmError ? "reset-password-confirm-error" : undefined}
        />
        {confirmError && (
          <p id="reset-password-confirm-error" role="alert" className={authErrorClass}>
            {confirmError}
          </p>
        )}

        <p className="mt-5 text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">
          {t.auth.reset.sessionsNote}
        </p>
      </fieldset>

      <button type="submit" disabled={pending} className={clsx(authSubmitClass, "mt-10")}>
        {pending ? t.auth.saving : t.auth.reset.submit}
      </button>
    </form>
  );
}

export function InvalidLink() {
  const { t } = useI18n();

  return (
    <div role="alert" className="max-w-140">
      <h2 className="text-xl leading-7 font-bold text-koleksi-navy-dark dark:text-ink-dark">
        {t.auth.reset.invalidTitle}
      </h2>
      <p className="mt-3 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/80">
        {t.auth.reset.invalidBody}
      </p>
      <Link href="/lupa-password" className={clsx(authOutlineClass, "mt-10")}>
        {t.auth.reset.requestNew}
      </Link>
    </div>
  );
}
