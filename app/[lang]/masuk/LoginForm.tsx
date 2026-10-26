"use client";

import { type FormEvent, useActionState, useState } from "react";
import Link from "@/components/i18n/Link";
import clsx from "@/lib/clsx";
import PasswordInput from "@/components/auth/PasswordInput";
import {
  authErrorClass,
  authInputClass,
  authLabelClass,
  authOutlineClass,
  authSubmitClass,
} from "@/components/auth/authStyles";
import { login, type LoginState } from "@/app/actions/auth";
import { type LoginFieldErrors, validateLogin } from "@/lib/auth/validation";
import { useI18n } from "@/components/i18n/I18nProvider";

const subLinkClass =
  "text-sm font-bold text-koleksi-navy-dark/60 underline underline-offset-2 transition hover:text-koleksi-green dark:text-ink-dark/60";

type Field = keyof LoginFieldErrors;

/**
 * `next` = halaman tujuan setelah login (divalidasi ulang di Server Action).
 * `notice` = pesan sukses dari halaman sebelumnya (mis. kata sandi berhasil diatur ulang).
 */
export default function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const { locale, t } = useI18n();
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Error validasi client; error dari server disembunyikan per field begitu field itu diubah.
  const [clientErrors, setClientErrors] = useState<LoginFieldErrors>({});
  const [edited, setEdited] = useState<Partial<Record<Field, boolean>>>({});

  const errorFor = (field: Field) =>
    clientErrors[field] ?? (edited[field] ? undefined : state.errors?.[field]);

  function change(field: Field, value: string) {
    (field === "identifier" ? setIdentifier : setPassword)(value);
    setClientErrors((prev) => ({ ...prev, [field]: undefined }));
    setEdited((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const errors = validateLogin({ identifier, password }, t.validation);
    if (errors.identifier || errors.password) {
      e.preventDefault(); // tidak perlu ke server kalau format sudah salah
      setClientErrors(errors);
      return;
    }

    setClientErrors({});
    setEdited({});
  }

  const identifierError = errorFor("identifier");
  const passwordError = errorFor("password");

  return (
    <>
      <form action={formAction} onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="lang" value={locale} />
        {next && <input type="hidden" name="next" value={next} />}

        {notice && !state.message && !state.errors && (
          <p role="status" className="mb-5 rounded-lg bg-koleksi-green/10 px-4 py-3 text-sm text-koleksi-green">
            {notice}
          </p>
        )}

        {state.message && (
          <p
            role="alert"
            className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {state.message}
          </p>
        )}

        <label htmlFor="masuk-identifier" className={authLabelClass}>
          {t.auth.login.identifierLabel}
        </label>
        <input
          id="masuk-identifier"
          name="identifier"
          type="text"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder={t.auth.login.identifierPlaceholder}
          required
          maxLength={255}
          value={identifier}
          onChange={(e) => change("identifier", e.target.value)}
          aria-invalid={identifierError ? true : undefined}
          aria-describedby={identifierError ? "masuk-identifier-error" : undefined}
          className={authInputClass}
        />
        {identifierError && (
          <p id="masuk-identifier-error" role="alert" className={authErrorClass}>
            {identifierError}
          </p>
        )}

        <label
          htmlFor="masuk-password"
          className={clsx(authLabelClass, "mt-5")}
        >
          {t.auth.login.password}
        </label>
        <PasswordInput
          id="masuk-password"
          name="password"
          autoComplete="current-password"
          placeholder={t.auth.login.password}
          required
          maxLength={255}
          value={password}
          onChange={(e) => change("password", e.target.value)}
          aria-invalid={passwordError ? true : undefined}
          aria-describedby={passwordError ? "masuk-password-error" : undefined}
        />
        {passwordError && (
          <p id="masuk-password-error" role="alert" className={authErrorClass}>
            {passwordError}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className={clsx(authSubmitClass, "mt-8")}
        >
          {pending ? t.auth.processing : t.common.login}
        </button>
      </form>

      <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
        <Link href="/lupa-password" className={subLinkClass}>
          {t.auth.login.forgot}
        </Link>
      </div>

      <hr className="mt-12 border-border-light md:mt-16 dark:border-border-dark" />

      <div className="mt-12 flex flex-wrap items-center gap-5 md:mt-15">
        <p className="text-base text-koleksi-navy-dark dark:text-ink-dark">
          {t.auth.login.notRegistered}
        </p>
        <Link href="/daftar" className={authOutlineClass}>
          {t.common.register}
        </Link>
      </div>
    </>
  );
}
