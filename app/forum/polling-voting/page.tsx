"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import PollingItem from "./PollingItem";
import VotingCard from "./VotingCard";
import {
  FILTER_ALL,
  FILTER_OPTIONS,
  POLLING_PER_PAGE,
  pollingList,
  votingList,
} from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function PollingVotingPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(FILTER_ALL);
  const [page, setPage] = useState(1);

  const query = search.trim().toLowerCase();
  const matches = (title: string) => !query || title.toLowerCase().includes(query);

  const showVoting = filter === FILTER_ALL || filter === "Voting";
  const showPolling = filter === FILTER_ALL || filter === "Polling";

  const filteredVoting = showVoting
    ? votingList.filter((item) => matches(item.title))
    : [];
  const filteredPolling = showPolling
    ? pollingList.filter((item) => matches(item.title))
    : [];

  // Reset ke halaman 1 saat pencarian/filter berubah (adjust state saat
  // render, sama seperti page lain, tanpa effect).
  const filterKey = `${search}|${filter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPolling.length / POLLING_PER_PAGE),
  );
  const pollingPage = filteredPolling.slice(
    (page - 1) * POLLING_PER_PAGE,
    page * POLLING_PER_PAGE,
  );

  const isEmpty = filteredVoting.length === 0 && filteredPolling.length === 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <div>
        <SearchFilterBar
          iconPosition="right"
          search={search}
          onSearchChange={setSearch}
        >
          <FilterDropdown
            label="Semua"
            options={FILTER_OPTIONS}
            value={filter}
            onChange={setFilter}
          />
        </SearchFilterBar>

        {isEmpty && (
          <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            Tidak ada voting/polling yang cocok dengan pencarian/filter ini.
          </p>
        )}

        <div className="mt-14 flex flex-col gap-20">
          {filteredVoting.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
                Voting
              </h2>
              <div className="mt-9 flex flex-col gap-5">
                {filteredVoting.map((voting, index) => (
                  <motion.div
                    key={voting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: EASE_OUT,
                      delay: index * 0.08,
                    }}
                  >
                    <VotingCard voting={voting} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {filteredPolling.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
                Polling
              </h2>
              <div className="divide-y divide-border-light dark:divide-border-dark">
                {pollingPage.map((polling, index) => (
                  <motion.article
                    key={polling.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: EASE_OUT,
                      delay: (index % POLLING_PER_PAGE) * 0.08,
                    }}
                    className="py-10 last:pb-0"
                  >
                    <PollingItem polling={polling} />
                  </motion.article>
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                className="mt-16"
              />
            </section>
          )}
        </div>
      </div>

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
