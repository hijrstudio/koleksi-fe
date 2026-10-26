"use client";

import { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "@/lib/clsx";
import { authInputClass } from "@/components/auth/authStyles";
import { useI18n } from "@/components/i18n/I18nProvider";

/** String = value & label sama. `group` = dikelompokkan dalam <optgroup> (urutan mengikuti data). */
export type SelectOption =
  | string
  | { value: string; label: string; group?: string };

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly SelectOption[];
  placeholder?: string;
}

function normalize(opt: SelectOption) {
  return typeof opt === "string" ? { value: opt, label: opt, group: undefined } : opt;
}

function renderOption(opt: { value: string; label: string }) {
  return (
    <option key={opt.value} value={opt.value} className="text-koleksi-navy-dark">
      {opt.label}
    </option>
  );
}

/** <select> native bergaya input auth + chevron. Native supaya picker HP
 *  dan keyboard tetap jalan tanpa kerja ekstra. */
export default function SelectInput({
  options,
  placeholder,
  value,
  className,
  ...rest
}: SelectInputProps) {
  const { t } = useI18n();
  placeholder ??= t.form.select;
  const items = options.map(normalize);
  const groups = new Map<string, typeof items>();
  for (const item of items) {
    if (item.group) groups.set(item.group, [...(groups.get(item.group) ?? []), item]);
  }

  return (
    <div className="relative">
      <select
        value={value}
        className={clsx(
          authInputClass,
          "cursor-pointer appearance-none pr-12",
          // Placeholder ("Pilih") pakai warna placeholder input lain.
          !value && "text-koleksi-navy-dark/30! dark:text-ink-dark/30!",
          className,
        )}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {items.filter((item) => !item.group).map(renderOption)}
        {[...groups].map(([group, groupItems]) => (
          <optgroup key={group} label={group} className="text-koleksi-navy-dark">
            {groupItems.map(renderOption)}
          </optgroup>
        ))}
      </select>
      <ChevronDown
        size={18}
        strokeWidth={2.25}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-6 -translate-y-1/2 text-koleksi-navy-dark dark:text-ink-dark"
      />
    </div>
  );
}
