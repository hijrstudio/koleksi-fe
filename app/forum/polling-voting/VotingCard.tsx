"use client";

import { useState } from "react";
import Dot from "@/components/ui/Dot";
import clsx from "@/lib/clsx";
import { formatTanggal } from "../diskusi/data";
import type { Voting } from "./data";

/**
 * Kartu voting aktif: pilih satu opsi (radio) lalu Vote. Setelah vote,
 * opsi dikunci dan jumlah vote bertambah (state lokal, belum ada backend).
 */
export default function VotingCard({ voting }: { voting: Voting }) {
  // Sesuai desain, opsi pertama sudah terpilih di awal.
  const [selected, setSelected] = useState(voting.options[0]?.id ?? null);
  const [voted, setVoted] = useState(false);
  const votes = voting.votes + (voted ? 1 : 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (selected && !voted) setVoted(true);
      }}
      className="rounded-[10px] bg-koleksi-navy-dark/[0.0333] p-5 dark:bg-white/5"
    >
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
        <span>{voting.author}</span>
        <Dot />
        <span>{formatTanggal(voting.date)}</span>
      </div>

      <h3 className="mt-5 text-[20px] leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
        {voting.title}
      </h3>

      <fieldset className="mt-5 flex flex-col gap-5" disabled={voted}>
        <legend className="sr-only">Pilihan voting</legend>
        {voting.options.map((option) => (
          <label
            key={option.id}
            className={clsx(
              "flex h-6 w-fit items-center gap-3 text-sm text-koleksi-navy-dark dark:text-ink-dark",
              voted ? "cursor-default" : "cursor-pointer",
            )}
          >
            <input
              type="radio"
              name={`voting-${voting.id}`}
              value={option.id}
              checked={selected === option.id}
              onChange={() => setSelected(option.id)}
              className="peer sr-only"
            />
            {/* Radio: cincin 2px + titik di tengah saat terpilih */}
            <span
              aria-hidden="true"
              className="flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-koleksi-navy-dark transition peer-focus-visible:ring-2 peer-focus-visible:ring-koleksi-blue peer-focus-visible:ring-offset-2 peer-checked:[&>span]:scale-100 dark:border-ink-dark"
            >
              <span className="size-1.5 scale-0 rounded-full bg-koleksi-navy-dark transition-transform duration-200 dark:bg-ink-dark" />
            </span>
            <span
              className={clsx(
                "transition-[font-weight]",
                selected === option.id ? "font-bold" : "font-normal",
              )}
            >
              {option.label}
            </span>
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={voted}
        className="mt-5 h-11 rounded-full border border-koleksi-navy-deep px-6 text-sm font-bold text-koleksi-navy-dark transition hover:bg-koleksi-navy-deep hover:text-white disabled:pointer-events-none disabled:opacity-60 dark:border-ink-dark dark:text-ink-dark dark:hover:bg-ink-dark dark:hover:text-koleksi-navy-dark"
      >
        {voted ? "Sudah vote" : "Vote"}
      </button>

      {/* Vote · Sisa waktu · Bagikan */}
      <div className="mt-10 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
        <span>{votes} Vote</span>
        <Dot />
        <span className="font-bold text-koleksi-navy-dark dark:text-ink-dark">
          {voting.endsIn}
        </span>
        <Dot />
        <span>Bagikan</span>
      </div>
    </form>
  );
}
