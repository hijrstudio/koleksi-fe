"use client";

import { type FormEvent, useActionState, useState } from "react";
import Link from "next/link";
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

const subLinkClass =
  "text-sm font-bold text-koleksi-navy-dark/60 underline underline-offset-2 transition hover:text-koleksi-green dark:text-ink-dark/60";

type Field = keyof LoginFieldErrors;

/** `next` = halaman tujuan setelah login (divalidasi ulang di Server Action). */
export default function LoginForm({ next }: { next?: string }) {
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
    const errors = validateLogin({ identifier, password });
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
        {next && <input type="hidden" name="next" value={next} />}

        {state.message && (
          <p
            role="alert"
            className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {state.message}
          </p>
        )}

        <label htmlFor="masuk-identifier" className={authLabelClass}>
          Masukkan alamat e-mail atau nomor HP
        </label>
        <input
          id="masuk-identifier"
          name="identifier"
          type="text"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="E-mail / No. HP"
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
          Password
        </label>
        <PasswordInput
          id="masuk-password"
          name="password"
          autoComplete="current-password"
          placeholder="Password"
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
          {pending ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
        <Link href="/lupa-password" className={subLinkClass}>
          Lupa Password?
        </Link>
      </div>

      <hr className="mt-12 border-border-light md:mt-16 dark:border-border-dark" />

      <div className="mt-12 flex flex-wrap items-center gap-5 md:mt-15">
        <p className="text-base text-koleksi-navy-dark dark:text-ink-dark">
          Saya belum terdaftar.
        </p>
        <Link href="/daftar" className={authOutlineClass}>
          Daftar
        </Link>
      </div>
    </>
  );
}
