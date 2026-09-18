"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "@/lib/clsx";

interface SectionHeaderProps {
  title: string;
  onPrev?: () => void;
  onNext?: () => void;
  showArrows?: boolean;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}

export default function SectionHeader({
  title,
  onPrev,
  onNext,
  showArrows = false,
  prevDisabled = false,
  nextDisabled = false,
}: SectionHeaderProps) {
  return (
    <div className="mb-9 flex items-center justify-between">
      <h2 className="font-display text-2xl leading-8 font-bold tracking-[-3%] text-koleksi-navy sm:text-[32px] sm:leading-10 dark:text-ink-dark">
        {title}
      </h2>
      {showArrows && (
        <div className="hidden items-center  sm:flex">
          <button
            type="button"
            onClick={onPrev}
            disabled={prevDisabled}
            aria-label="Sebelumnya"
            className={clsx(
              "flex h-9 w-9 items-center justify-center transition",
              prevDisabled
                ? "cursor-not-allowed text-koleksi-navy-dark/25"
                : "text-koleksi-navy-dark hover:text-koleksi-green dark:text-ink-dark",
            )}
          >
            <ArrowLeft size={24} />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            aria-label="Berikutnya"
            className={clsx(
              "flex h-9 w-9 items-center justify-center transition",
              nextDisabled
                ? "cursor-not-allowed text-koleksi-navy-dark/25"
                : "text-koleksi-navy-dark hover:text-koleksi-green dark:text-ink-dark",
            )}
          >
            <ArrowRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
