"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import Dot from "@/components/ui/Dot";
import RoleBadge from "@/components/ui/RoleBadge";
import clsx from "@/lib/clsx";
import { format, useI18n } from "@/components/i18n/I18nProvider";
import { votePollAction } from "@/app/actions/forumPoll";
import { expiredPath } from "@/lib/auth/validation";
import type { ForumPoll } from "@/types";
import { formatTanggal } from "../diskusi/data";
import { pollStatus } from "./data";

/**
 * Hasil per opsi (persen + bar), opsi tertinggi disorot oranye, pilihan member diberi centang.
 * `interactive`: polling yang berjalan -- klik opsi = pilih / ganti pilihan (disimpan ke server).
 * Dipakai juga untuk hasil akhir voting (tidak interaktif).
 */
export function PollResults({
  poll,
  interactive,
  pendingId,
  onPick,
}: {
  poll: ForumPoll;
  interactive: boolean;
  pendingId?: number | null;
  onPick?: (optionId: number) => void;
}) {
  const { t } = useI18n();
  const top = Math.max(0, ...poll.options.map((o) => o.votes ?? 0));

  return (
    <ul
      role={interactive ? "radiogroup" : "list"}
      aria-labelledby={`poll-${poll.id}-title`}
      className="mt-4 flex flex-col gap-3"
    >
      {poll.options.map((option) => {
        const votes = option.votes ?? 0;
        const isTop = top > 0 && votes === top;
        const isSelected = option.id === poll.my_option_id;
        const bar = (
          <>
            <span
              className={clsx(
                "w-14 shrink-0 text-sm leading-5 font-bold sm:w-25",
                isTop ? "text-koleksi-orange" : "text-koleksi-navy-dark/60 dark:text-ink-dark/50",
              )}
            >
              {option.percent ?? 0}%
            </span>
            <span
              className={clsx(
                "flex h-8.5 min-w-0 flex-1 items-center gap-2 rounded-lg px-2.5 text-sm leading-5 transition",
                isTop
                  ? "bg-koleksi-orange font-bold text-white"
                  : "bg-koleksi-navy-dark/[0.0333] font-medium text-koleksi-navy-dark/60 dark:bg-white/5 dark:text-ink-dark/60",
                interactive &&
                  (isTop ? "group-hover:brightness-95" : "group-hover:bg-koleksi-navy-dark/[0.0667] dark:group-hover:bg-white/10"),
                isSelected &&
                  !isTop &&
                  "font-bold text-koleksi-navy-dark ring-1 ring-koleksi-navy-deep ring-inset dark:text-ink-dark dark:ring-ink-dark",
              )}
            >
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
              {pendingId === option.id ? (
                <Loader2 size={16} className="shrink-0 animate-spin" aria-hidden="true" />
              ) : (
                isSelected && <Check size={16} strokeWidth={3} aria-label={t.forum.yourChoice} className="shrink-0" />
              )}
            </span>
          </>
        );

        return (
          <li key={option.id}>
            {interactive ? (
              <label className="group flex cursor-pointer items-center rounded-lg has-focus-visible:ring-2 has-focus-visible:ring-koleksi-blue has-focus-visible:ring-offset-2 has-disabled:cursor-wait">
                <input
                  type="radio"
                  name={`poll-${poll.id}`}
                  value={option.id}
                  checked={isSelected}
                  disabled={pendingId != null}
                  onChange={() => onPick?.(option.id)}
                  className="sr-only"
                />
                {bar}
              </label>
            ) : (
              <div className="flex items-center">{bar}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Satu polling di daftar: hasil langsung terlihat, member boleh mengganti pilihan selama berjalan. */
export default function PollingItem({
  poll,
  now,
  onChange,
}: {
  poll: ForumPoll;
  now: number;
  onChange: (poll: ForumPoll) => void;
}) {
  const { locale, t } = useI18n();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const open = poll.phase === "open";

  function pick(optionId: number) {
    if (!open || optionId === poll.my_option_id) return;
    setPendingId(optionId);
    setError(null);
    startTransition(async () => {
      const result = await votePollAction(poll.id, optionId);
      setPendingId(null);
      if (result.ok) return onChange(result.data);
      if (result.status === 401) return window.location.assign(expiredPath("/forum/polling-voting", locale));
      setError(result.message);
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
        <span>{poll.author.name}</span>
        <RoleBadge role={poll.author.role} />
        <Dot />
        <span>{formatTanggal(poll.starts_at, locale)}</span>
      </div>

      <h3 id={`poll-${poll.id}-title`} className="mt-5 text-base leading-6 font-bold wrap-break-word text-koleksi-navy-dark dark:text-ink-dark">
        {poll.title}
      </h3>

      <PollResults poll={poll} interactive={open} pendingId={pendingId} onPick={pick} />

      {error && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {/* Vote · Status */}
      <div className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
        <span>{format(t.forum.votes, { count: poll.votes_count })}</span>
        <Dot />
        <span className={clsx(open && "font-bold text-koleksi-navy-dark dark:text-ink-dark")}>{pollStatus(poll, now, t)}</span>
        {open && (
          <>
            <Dot />
            <span>{t.forum.changeHint}</span>
          </>
        )}
      </div>
    </>
  );
}
