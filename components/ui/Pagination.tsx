"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "@/lib/clsx";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

type PageItem = number | "...";

function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, "...", total];
  }
  if (current >= total - 2) {
    return [1, "...", total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPageItems(currentPage, totalPages);

  return (
    <nav
      aria-label="Navigasi halaman"
      className={clsx("flex items-center justify-start gap-2", className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Halaman sebelumnya"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-koleksi-navy-deep text-koleksi-navy-deep transition hover:bg-koleksi-navy-deep/5 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronLeft size={18} />
      </button>

      {items.map((item, i) =>
        item === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-10 w-10 items-center justify-center text-base font-bold leading-6 text-koleksi-navy-deep"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-full text-base font-bold leading-6 transition",
              item === currentPage
                ? "bg-koleksi-navy-deep text-white"
                : "border border-koleksi-navy-deep text-koleksi-navy-deep hover:bg-koleksi-navy-deep/5",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Halaman berikutnya"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-koleksi-navy-deep text-koleksi-navy-deep transition hover:bg-koleksi-navy-deep/5 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
