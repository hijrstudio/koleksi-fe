import { ReactNode } from "react";
import clsx from "@/lib/clsx";
import { authErrorClass, authLabelClass } from "@/components/auth/authStyles";

/** Label (+ tanda wajib & teks kecil di kanan) di atas input, pesan error di bawahnya.
 *  Error diberi id `${id}-error` untuk aria-describedby input-nya. */
export default function FormField({
  id,
  label,
  required,
  aside,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  /** Teks kecil di kanan label (mis. counter "0/17 karakter"). */
  aside?: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label
          id={`${id}-label`}
          htmlFor={id}
          className={clsx(authLabelClass, "mb-0")}
        >
          {label}
          {required && " *"}
        </label>
        {aside && (
          <span className="shrink-0 text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">
            {aside}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className={authErrorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

