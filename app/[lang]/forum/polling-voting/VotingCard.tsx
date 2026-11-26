"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import Dot from "@/components/ui/Dot";
import RoleBadge from "@/components/ui/RoleBadge";
import clsx from "@/lib/clsx";
import { format, useI18n } from "@/components/i18n/I18nProvider";
import { votePollAction } from "@/app/actions/forumPoll";
import { expiredPath } from "@/lib/auth/validation";
import type { ForumPoll } from "@/types";
import { formatTanggal } from "../diskusi/data";
import { pollStatus } from "./data";
import { PollResults } from "./PollingItem";

/**
 * Kartu voting. Berjalan: pilih satu opsi lalu Vote -- sekali saja, hasil disembunyikan (server tidak mengirim
 * angkanya). Sudah memilih: pilihan dikunci. Selesai: hasil akhir per opsi.
 */
export default function VotingCard({
  voting,
  now,
  onChange,
}: {
  voting: ForumPoll;
  now: number;
  onChange: (poll: ForumPoll) => void;
}) {
  const { locale, t } = useI18n();
  const [selected, setSelected] = useState<number | null>(voting.my_option_id);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const open = voting.phase === "open";
  const voted = voting.my_option_id !== null;
  const locked = !open || voted || pending;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (locked) return;
    if (selected === null) return setError(t.forum.pickOption);

    setError(null);
    startTransition(async () => {
      const result = await votePollAction(voting.id, selected);
      if (result.ok) return onChange(result.data);
      if (result.status === 401) return window.location.assign(expiredPath("/forum/polling-voting", locale));
      setError(result.message);
    });
  }

  return (
    <form onSubmit={submit} className="rounded-[10px] bg-koleksi-navy-dark/[0.0333] p-5 dark:bg-white/5">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
        <span>{voting.author.name}</span>
        <RoleBadge role={voting.author.role} />
        <Dot />
        <span>{formatTanggal(voting.starts_at, locale)}</span>
      </div>

      <h3 id={`poll-${voting.id}-title`} className="mt-5 text-[20px] leading-6 font-bold wrap-break-word text-koleksi-navy-dark dark:text-ink-dark">
        {voting.title}
      </h3>

      {voting.results_visible ? (
        <PollResults poll={voting} interactive={false} />
      ) : (
        <>
          <fieldset className="mt-5 flex flex-col gap-5" disabled={locked}>
            <legend className="sr-only">{t.forum.votingOptions}</legend>
            {voting.options.map((option) => (
              <label
                key={option.id}
                className={clsx(
                  "flex min-h-6 w-fit items-center gap-3 text-sm text-koleksi-navy-dark dark:text-ink-dark",
                  locked ? "cursor-default" : "cursor-pointer",
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
                <span className={clsx("wrap-break-word transition-[font-weight]", selected === option.id ? "font-bold" : "font-normal")}>
                  {option.label}
                </span>
              </label>
            ))}
          </fieldset>

          <button
            type="submit"
            disabled={locked}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-koleksi-navy-deep px-6 text-sm font-bold text-koleksi-navy-dark transition hover:bg-koleksi-navy-deep hover:text-white disabled:pointer-events-none disabled:opacity-60 dark:border-ink-dark dark:text-ink-dark dark:hover:bg-ink-dark dark:hover:text-koleksi-navy-dark"
          >
            {pending && <Loader2 size={16} className="animate-spin" />}
            {voted ? t.forum.voted : t.forum.vote}
          </button>
          {voted && <p className="mt-3 text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/50">{t.forum.resultsHidden}</p>}
        </>
      )}

      {error && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {/* Vote · Sisa waktu / Hasil akhir */}
      <div className="mt-10 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
        <span>{format(t.forum.votes, { count: voting.votes_count })}</span>
        <Dot />
        <span className={clsx(open && "font-bold text-koleksi-navy-dark dark:text-ink-dark")}>{pollStatus(voting, now, t)}</span>
      </div>
    </form>
  );
}
