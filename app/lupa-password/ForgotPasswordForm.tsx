"use client";

import { useActionState } from "react";
import { MailCheck } from "lucide-react";
import clsx from "@/lib/clsx";
import { authErrorClass, authInputClass, authLabelClass, authSubmitClass } from "@/components/auth/authStyles";
import { type ForgotPasswordState, requestReset } from "@/app/actions/passwordReset";

/** Langkah 1 lupa kata sandi: masukkan e-mail → link atur ulang dikirim ke kotak masuk. */
export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<ForgotPasswordState, FormData>(requestReset, {});

  return (
    <form action={formAction} noValidate aria-busy={pending} className="max-w-121">
      {state.message ? (
        <div role="status" className="mb-8 flex gap-3 rounded-lg bg-koleksi-green/10 px-4 py-3 text-sm">
          <MailCheck size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-koleksi-green" />
          <div>
            <p className="font-semibold text-koleksi-green">{state.message}</p>
            <p className="mt-1 text-koleksi-navy-dark/70 dark:text-ink-dark/70">
              Cek kotak masuk (termasuk folder Spam / Promosi / Pembaruan). Link berlaku 60 menit dan hanya bisa dipakai
              sekali.
            </p>
          </div>
        </div>
      ) : (
        <p className="mb-8 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/80">
          Masukkan alamat e-mail akun KOLEKSI Anda. Kami akan mengirim link untuk membuat kata sandi baru.
        </p>
      )}

      <label htmlFor="lupa-email" className={authLabelClass}>
        Alamat e-mail
      </label>
      <input
        // Remount setelah dikirim → nilai terakhir tetap tampil (defaultValue hanya dibaca saat mount)
        key={state.email ?? ""}
        id="lupa-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="alamat@e-mail.com"
        required
        maxLength={255}
        defaultValue={state.email}
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "lupa-email-error" : undefined}
        className={authInputClass}
      />
      {state.error && (
        <p id="lupa-email-error" role="alert" className={authErrorClass}>
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={clsx(authSubmitClass, "mt-10")}>
        {pending ? "Mengirim..." : state.message ? "Kirim Ulang" : "Kirim Link"}
      </button>
    </form>
  );
}
