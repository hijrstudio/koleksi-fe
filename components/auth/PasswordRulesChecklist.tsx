import { Check, Circle } from "lucide-react";
import clsx from "@/lib/clsx";
import { PASSWORD_RULES } from "@/lib/auth/password";

/** Checklist syarat kata sandi baru — langsung berubah saat diketik. Dipakai ganti & atur ulang kata sandi. */
export default function PasswordRulesChecklist({ id, password }: { id: string; password: string }) {
  return (
    <ul id={id} aria-label="Syarat kata sandi" className="grid grid-cols-2 gap-x-4 gap-y-1.5">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(password);
        return (
          <li
            key={rule.id}
            className={clsx(
              "flex items-center gap-2 text-xs transition-colors",
              ok ? "text-koleksi-green" : "text-koleksi-navy-dark/50 dark:text-ink-dark/50",
            )}
          >
            {ok ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : <Circle size={10} aria-hidden="true" className="mx-0.5" />}
            {rule.label}
            <span className="sr-only">{ok ? "(terpenuhi)" : "(belum)"}</span>
          </li>
        );
      })}
    </ul>
  );
}
