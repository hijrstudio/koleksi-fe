"use client";

import { ReactNode } from "react";
import { Search } from "lucide-react";
import clsx from "@/lib/clsx";
import FilterButton from "@/components/ui/FilterButton";

interface CatalogToolbarProps<T extends string> {
  /** Tab kategori/status -- satu aktif sekaligus. */
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  search: string;
  onSearchChange: (value: string) => void;
  /** Dropdown di kanan (Filter / Sort). */
  dropdown: {
    label?: string;
    icon?: ReactNode;
    options: string[];
    value: string | null;
    onChange: (value: string) => void;
    showActiveDot?: boolean;
  };
  className?: string;
}

/**
 * Toolbar katalog: tab pill di kiri, pencarian + dropdown di kanan.
 * Dipakai di /kegiatan dan /produk. Tab memakai gaya yang sama dengan tab
 * level di web-playbook (aktif muted-steel, tidak aktif navy-deep/10).
 */
export default function CatalogToolbar<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  dropdown,
  className,
}: CatalogToolbarProps<T>) {
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center justify-between gap-4",
        className,
      )}
    >
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              aria-pressed={isActive}
              onClick={() => onTabChange(tab)}
              className={clsx(
                "cursor-pointer rounded-full px-5 py-2.5 text-base leading-6 font-bold transition",
                isActive
                  ? "bg-muted-steel text-white"
                  : "bg-koleksi-navy-deep/10 text-koleksi-navy-deep hover:bg-koleksi-navy-deep/15 dark:bg-white/10 dark:text-ink-dark dark:hover:bg-white/15",
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {/* Tampil seperti tombol "Cari", tapi input sungguhan (langsung bisa diketik). */}
        <div className="relative">
          <Search
            size={20}
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-koleksi-navy-dark dark:text-ink-dark"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari"
            aria-label="Cari"
            className="w-28 rounded-full border border-border-light bg-transparent py-2.5 pr-5 pl-13 text-base leading-6 font-bold text-koleksi-navy-dark transition-[width,border-color] duration-300 placeholder:font-bold placeholder:text-koleksi-navy-dark hover:border-koleksi-navy-deep focus:w-44 focus:border-koleksi-navy-deep focus:outline-none dark:border-border-dark dark:text-ink-dark dark:placeholder:text-ink-dark"
          />
        </div>

        <FilterButton {...dropdown} />
      </div>
    </div>
  );
}
