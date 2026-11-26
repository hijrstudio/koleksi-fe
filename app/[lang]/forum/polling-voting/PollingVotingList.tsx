"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import { useI18n } from "@/components/i18n/I18nProvider";
import { expiredPath } from "@/lib/auth/validation";
import type { ForumPoll, ForumPollType, NumberedPage } from "@/types";
import PollingItem from "./PollingItem";
import VotingCard from "./VotingCard";
import { FILTER_POLLING, FILTER_VOTING } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SEARCH_DELAY_MS = 350;

type Section = NumberedPage<ForumPoll> & { loading: boolean };

/**
 * Voting & polling (data dari server). Halaman pertama dirender di server; cari & pindah halaman lewat
 * /api/forum/polls. Setelah memilih, item diganti dengan data terbaru dari server (jumlah & persen).
 */
export default function PollingVotingList({
  initialVoting,
  initialPolling,
  now,
}: {
  initialVoting: NumberedPage<ForumPoll>;
  initialPolling: NumberedPage<ForumPoll>;
  now: number;
}) {
  const { locale, t } = useI18n();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>(t.common.all);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<Record<ForumPollType, Section>>({
    voting: { ...initialVoting, loading: false },
    polling: { ...initialPolling, loading: false },
  });
  const requestIds = useRef<Record<ForumPollType, number>>({ voting: 0, polling: 0 });
  const firstRender = useRef(true);
  const listTop = useRef<HTMLDivElement>(null);

  const showVoting = filter !== FILTER_POLLING;
  const showPolling = filter !== FILTER_VOTING;

  async function load(type: ForumPollType, page: number) {
    const id = ++requestIds.current[type];
    setSections((s) => ({ ...s, [type]: { ...s[type], loading: true } }));
    setError(null);

    const params = new URLSearchParams({ type, page: String(page) });
    if (search.trim()) params.set("search", search.trim());

    try {
      const res = await fetch(`/api/forum/polls?${params}`, { cache: "no-store" });
      if (res.status === 401) return window.location.assign(expiredPath("/forum/polling-voting", locale));
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as NumberedPage<ForumPoll>;
      if (id !== requestIds.current[type]) return; // hasil request lama
      setSections((s) => ({ ...s, [type]: { ...data, loading: false } }));
    } catch {
      if (id !== requestIds.current[type]) return;
      setError(t.forum.loadError);
      setSections((s) => ({ ...s, [type]: { ...s[type], loading: false } }));
    }
  }

  // Pencarian berubah → muat ulang halaman 1 kedua bagian (ditunda sedikit supaya tidak request tiap ketukan)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      load("voting", 1);
      load("polling", 1);
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function goTo(type: ForumPollType, page: number) {
    load(type, page);
    listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function replace(poll: ForumPoll) {
    setSections((s) => ({
      ...s,
      [poll.type]: { ...s[poll.type], items: s[poll.type].items.map((p) => (p.id === poll.id ? poll : p)) },
    }));
  }

  const voting = sections.voting;
  const polling = sections.polling;
  const isEmpty =
    (!showVoting || voting.items.length === 0) && (!showPolling || polling.items.length === 0) && !voting.loading && !polling.loading;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <div ref={listTop} className="scroll-mt-28">
        <SearchFilterBar iconPosition="right" search={search} onSearchChange={setSearch}>
          <FilterDropdown
            label={t.common.all}
            options={[t.common.all, FILTER_VOTING, FILTER_POLLING]}
            value={filter}
            onChange={setFilter}
          />
        </SearchFilterBar>

        {error && <p role="alert" className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {isEmpty && <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">{t.forum.noPolls}</p>}

        <div className="mt-14 flex flex-col gap-20">
          {showVoting && voting.items.length > 0 && (
            <section aria-busy={voting.loading}>
              <h2 className="flex items-center gap-2 text-xl font-bold text-koleksi-navy-dark dark:text-badge-liputan">
                Voting
                {voting.loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
              </h2>
              <div className="mt-9 flex flex-col gap-5">
                {voting.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: index * 0.08 }}
                  >
                    <VotingCard key={`${item.id}-${item.my_option_id}`} voting={item} now={now} onChange={replace} />
                  </motion.div>
                ))}
              </div>
              {voting.lastPage > 1 && (
                <Pagination currentPage={voting.page} totalPages={voting.lastPage} onPageChange={(p) => goTo("voting", p)} className="mt-10" />
              )}
            </section>
          )}

          {showPolling && polling.items.length > 0 && (
            <section aria-busy={polling.loading}>
              <h2 className="flex items-center gap-2 text-xl font-bold text-koleksi-navy-dark dark:text-badge-liputan">
                Polling
                {polling.loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
              </h2>
              <div className="divide-y divide-border-light dark:divide-border-dark">
                {polling.items.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: index * 0.08 }}
                    className="py-10 last:pb-0"
                  >
                    <PollingItem poll={item} now={now} onChange={replace} />
                  </motion.article>
                ))}
              </div>
              {polling.lastPage > 1 && (
                <Pagination currentPage={polling.page} totalPages={polling.lastPage} onPageChange={(p) => goTo("polling", p)} className="mt-16" />
              )}
            </section>
          )}
        </div>
      </div>

      {/* Spacer selebar kolom widget kanan, supaya lebar kolom isi sama dengan halaman forum lain */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
