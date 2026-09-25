"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter } from "lucide-react";
import clsx from "@/lib/clsx";

/**
 * Tombol "Filter" (ikon corong + label tetap, tidak berubah jadi nilai
 * terpilih -- beda dari FilterDropdown biasa). Titik hijau muncul saat ada
 * filter aktif. Panel & animasinya sama dengan FilterDropdown supaya
 * konsisten dengan dropdown lain di situs.
 */
export default function FilterButton({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="relative flex items-center gap-2 rounded-full border border-border-light px-4 py-2 text-sm font-bold text-koleksi-navy-dark transition hover:border-koleksi-navy-deep dark:border-border-dark dark:text-ink-dark"
      >
        <Filter size={16} />
        Filter
        {value && (
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-koleksi-green"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+8px)] z-10 min-w-40 overflow-hidden rounded-2xl border border-border-light bg-surface-light py-2 shadow-lg dark:border-border-dark dark:bg-surface-dark"
          >
            {options.map((opt) => {
              const isActive = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={clsx(
                    "block w-full px-4 py-2.5 text-left text-sm transition",
                    isActive
                      ? "font-bold text-koleksi-navy-dark dark:text-ink-dark"
                      : "font-normal text-koleksi-navy-dark/50 hover:text-koleksi-navy-dark dark:text-ink-dark/50",
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
