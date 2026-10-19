interface RadioGroupProps<T extends string> {
  name: string;
  /** Label grup untuk screen reader (label visual-nya di luar). */
  ariaLabelledBy: string;
  options: readonly { value: T; label: string }[];
  value: T | "";
  onChange: (value: T) => void;
  required?: boolean;
}

/** Radio bulat custom setinggi baris input (44px) supaya sejajar dengan
 *  kolom sebelahnya. */
export default function RadioGroup<T extends string>({
  name,
  ariaLabelledBy,
  options,
  value,
  onChange,
  required,
}: RadioGroupProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
      className="flex h-11 items-center gap-6 pl-1.5"
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex cursor-pointer items-center gap-3 text-sm text-koleksi-navy-dark dark:text-ink-dark"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            required={required}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="relative size-3.5 rounded-full border-2 border-koleksi-navy-dark transition peer-focus-visible:ring-2 peer-focus-visible:ring-koleksi-green peer-focus-visible:ring-offset-2 after:absolute after:inset-0.5 after:scale-0 after:rounded-full after:bg-koleksi-navy-dark after:transition-transform peer-checked:after:scale-100 dark:border-ink-dark dark:after:bg-ink-dark"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
