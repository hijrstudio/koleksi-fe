"use client";

import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "@/lib/clsx";
import { useI18n } from "@/components/i18n/I18nProvider";
import { authInputClass } from "@/components/auth/authStyles";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

/** Input password dengan tombol tampilkan/sembunyikan di sisi kanan. */
export default function PasswordInput({
  className,
  ...rest
}: PasswordInputProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        className={clsx(authInputClass, "pr-14", className)}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t.auth.hidePassword : t.auth.showPassword}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-14 items-center justify-center rounded-r-lg text-koleksi-navy-dark/40 transition hover:text-koleksi-navy-dark focus-visible:text-koleksi-navy-dark focus-visible:outline-none dark:text-ink-dark/40 dark:hover:text-ink-dark"
      >
        {visible ? (
          <Eye size={20} aria-hidden="true" />
        ) : (
          <EyeOff size={20} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
