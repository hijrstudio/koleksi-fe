"use client";

import { FormEvent, useState } from "react";
import clsx from "@/lib/clsx";
import PasswordInput from "@/components/auth/PasswordInput";
import { authLabelClass, authSubmitClass } from "@/components/auth/authStyles";

const MIN_LENGTH = 8;

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Error baru ditampilkan setelah submit pertama, lalu ikut live saat diketik.
  const tooShort = submitted && password.length < MIN_LENGTH;
  const mismatch = submitted && !tooShort && confirm !== password;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    if (password.length < MIN_LENGTH || confirm !== password) return;
    // TODO: wire up to the real reset-password endpoint
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="reset-password" className={authLabelClass}>
        Masukkan kata sandi baru
      </label>
      <PasswordInput
        id="reset-password"
        name="password"
        autoComplete="new-password"
        placeholder={`Min. ${MIN_LENGTH} karakter`}
        minLength={MIN_LENGTH}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={tooShort}
        aria-describedby={tooShort ? "reset-password-error" : undefined}
      />
      {tooShort && (
        <p
          id="reset-password-error"
          className="mt-2 text-xs text-red-600 dark:text-red-400"
        >
          Kata sandi minimal {MIN_LENGTH} karakter.
        </p>
      )}

      <label
        htmlFor="reset-password-confirm"
        className={clsx(authLabelClass, "mt-5")}
      >
        Ulangi kata sandi
      </label>
      <PasswordInput
        id="reset-password-confirm"
        name="passwordConfirm"
        autoComplete="new-password"
        placeholder="Ulangi kata sandi"
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        aria-invalid={mismatch}
        aria-describedby={mismatch ? "reset-password-confirm-error" : undefined}
      />
      {mismatch && (
        <p
          id="reset-password-confirm-error"
          className="mt-2 text-xs text-red-600 dark:text-red-400"
        >
          Kata sandi tidak sama.
        </p>
      )}

      <button type="submit" className={clsx(authSubmitClass, "mt-10")}>
        Reset
      </button>
    </form>
  );
}
