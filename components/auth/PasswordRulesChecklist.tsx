"use client";

import { Check, Circle } from "lucide-react";
import clsx from "@/lib/clsx";
import { useI18n } from "@/components/i18n/I18nProvider";
import { PASSWORD_RULES, passwordRuleText } from "@/lib/auth/password";

/** Checklist syarat kata sandi baru — langsung berubah saat diketik. Dipakai daftar, ganti & atur ulang kata sandi. */
export default function PasswordRulesChecklist({
  id,
  password,
  className,
}: {
  id: string;
  password: string;
  className?: string;
}) {
  const { t } = useI18n();

  return (
    <ul id={id} aria-label={t.auth.passwordRules} className={clsx("grid grid-cols-2 gap-x-4 gap-y-1.5", className)}>
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
            {passwordRuleText(t.validation, rule.id, "label")}
            <span className="sr-only">{ok ? t.auth.ruleMet : t.auth.ruleUnmet}</span>
          </li>
        );
      })}
    </ul>
  );
}
