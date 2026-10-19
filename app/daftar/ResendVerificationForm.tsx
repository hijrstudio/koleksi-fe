"use client";

import { useActionState } from "react";
import Field from "@/components/auth/FormField";
import {
  authErrorClass,
  authInputClass,
  authOutlineClass,
} from "@/components/auth/authStyles";
import { type ResendState, resendVerification } from "@/app/actions/register";

/**
 * Kirim ulang link verifikasi e-mail. `askEmail` = tampilkan input e-mail (halaman link kedaluwarsa);
 * tanpa itu, e-mail diambil server dari cookie pendaftaran (halaman "Terima kasih").
 */
export default function ResendVerificationForm({ askEmail = false }: { askEmail?: boolean }) {
  const [state, formAction, pending] = useActionState<ResendState, FormData>(
    resendVerification,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col items-start gap-4">
      {askEmail && (
        <Field id="verifikasi-email" label="Alamat e-mail pendaftaran" required>
          <input
            id="verifikasi-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alamat@e-mail.com"
            required
            maxLength={255}
            className={authInputClass}
          />
        </Field>
      )}

      <button type="submit" disabled={pending} className={authOutlineClass}>
        {pending ? "Mengirim..." : "Kirim ulang link verifikasi"}
      </button>

      {state.message && (
        <p role="status" className="text-sm text-koleksi-green">
          {state.message}
        </p>
      )}
      {state.error && (
        <p role="alert" className={authErrorClass}>
          {state.error}
        </p>
      )}
    </form>
  );
}
