"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Dot from "@/components/ui/Dot";
import clsx from "@/lib/clsx";
import { formatTanggal } from "../diskusi/data";
import type { Polling } from "./data";

/**
 * Polling: satu baris (persen + bar) per opsi, opsi tertinggi disorot
 * oranye. Opsi bisa dipilih (radio): pilihan menambah 1 suara ke opsi itu,
 * dan memindahkan pilihan memindahkan suaranya. State lokal, belum ada backend.
 */
export default function PollingItem({ polling }: { polling: Polling }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Suara awal per opsi diturunkan dari persen x total vote.
  const counts = Object.fromEntries(
    polling.options.map((option) => [
      option.id,
      Math.round((option.percent / 100) * polling.votes) +
        (option.id === selectedId ? 1 : 0),
    ]),
  );
  const sumCounts = Object.values(counts).reduce((a, b) => a + b, 0);

  // Sebelum ada pilihan, tampilkan persen dari data apa adanya.
  const percentOf = (id: string, original: number) =>
    selectedId === null
      ? original
      : Math.round((counts[id] / Math.max(1, sumCounts)) * 100);

  const percents = polling.options.map((o) => percentOf(o.id, o.percent));
  const top = Math.max(...percents);
  const totalVotes = polling.votes + (selectedId ? 1 : 0);

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
        <span>{polling.author}</span>
        <Dot />
        <span>{formatTanggal(polling.date)}</span>
      </div>

      <h3
        id={`${polling.id}-title`}
        className="mt-5 text-base leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark"
      >
        {polling.title}
      </h3>

      <ul
        role="radiogroup"
        aria-labelledby={`${polling.id}-title`}
        className="mt-4 flex flex-col gap-3"
      >
        {polling.options.map((option, index) => {
          const percent = percents[index];
          const isTop = percent === top;
          const isSelected = option.id === selectedId;

          return (
            <li key={option.id}>
              <label className="group flex cursor-pointer items-center rounded-lg has-focus-visible:ring-2 has-focus-visible:ring-koleksi-blue has-focus-visible:ring-offset-2">
                <input
                  type="radio"
                  name={`polling-${polling.id}`}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => setSelectedId(option.id)}
                  className="sr-only"
                />
                <span
                  className={clsx(
                    "w-14 shrink-0 text-sm leading-5 font-bold sm:w-25",
                    isTop
                      ? "text-koleksi-orange"
                      : "text-koleksi-navy-dark/60 dark:text-ink-dark/50",
                  )}
                >
                  {percent}%
                </span>
                <span
                  className={clsx(
                    "flex h-8.5 min-w-0 flex-1 items-center gap-2 rounded-lg px-2.5 text-sm leading-5 transition",
                    isTop
                      ? "bg-koleksi-orange font-bold text-white group-hover:brightness-95"
                      : "bg-koleksi-navy-dark/[0.0333] font-medium text-koleksi-navy-dark/60 group-hover:bg-koleksi-navy-dark/[0.0667] dark:bg-white/5 dark:text-ink-dark/60 dark:group-hover:bg-white/10",
                    // Pilihan user: garis tepi + ikon centang
                    isSelected &&
                      !isTop &&
                      "font-bold text-koleksi-navy-dark ring-1 ring-koleksi-navy-deep ring-inset dark:text-ink-dark dark:ring-ink-dark",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {isSelected && (
                    <Check
                      size={16}
                      strokeWidth={3}
                      aria-label="Pilihan Anda"
                      className="shrink-0"
                    />
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {/* Vote · Status */}
      <div className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
        <span>{totalVotes} Vote</span>
        <Dot />
        <span>{polling.status}</span>
      </div>
    </>
  );
}
