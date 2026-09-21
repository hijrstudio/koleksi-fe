import type { ReactNode } from "react";
import { Search } from "lucide-react";
import clsx from "@/lib/clsx";

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  /** Posisi ikon cari di dalam input. Default "left". */
  iconPosition?: "left" | "right";
  /** Input cari sendirian melebar penuh (default dibatasi max-w-sm di >= 768px). */
  fullWidth?: boolean;
  /** Filter dropdown (0, 1, atau lebih). Kosongkan kalau page hanya butuh input cari. */
  children?: ReactNode;
  className?: string;
}

/**
 * Input cari + slot filter dropdown.
 * - >= 768px : satu baris. Input melebar (flex-1) kalau ada filter, atau
 *   dibatasi max-w-sm kalau input cari sendirian (kecuali `fullWidth`).
 * - <  768px : input cari full width, filter turun ke baris di bawahnya.
 */
export default function SearchFilterBar({
  search,
  onSearchChange,
  placeholder = "Cari",
  iconPosition = "left",
  fullWidth = false,
  children,
  className,
}: SearchFilterBarProps) {
  const hasFilters = Boolean(children);
  // Tinggi 46px (py-3) -- sama dengan tombol FilterDropdown; di desain input
  // dengan ikon di kanan selalu setinggi itu, dengan atau tanpa filter.
  const tall = hasFilters || iconPosition === "right";

  return (
    <div
      className={clsx(
        "flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center",
        className,
      )}
    >
      <div
        className={clsx(
          "relative w-full min-w-40",
          hasFilters
            ? "md:w-auto md:flex-1"
            : !fullWidth && "md:max-w-sm",
        )}
      >
        <Search
          size={16}
          className={clsx(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-koleksi-navy-dark/40",
            iconPosition === "right" ? "right-6" : "left-3.5",
          )}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className={clsx(
            "w-full rounded-full border border-border-light bg-transparent text-sm text-koleksi-navy-dark placeholder:text-koleksi-navy-dark/40 transition focus:border-koleksi-navy-deep focus:outline-none dark:border-border-dark dark:text-ink-dark",
            tall ? "py-3" : "py-2.5",
            iconPosition === "right" ? "pl-5 pr-14" : "pl-10 pr-4",
          )}
        />
      </div>

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-3 md:contents">
          {children}
        </div>
      )}
    </div>
  );
}
