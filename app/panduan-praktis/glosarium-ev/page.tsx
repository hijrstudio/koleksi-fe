"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { glossaryTerms, groupGlossaryTerms } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function GlosariumEvPage() {
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const filteredTerms = glossaryTerms.filter(
    (term) =>
      !query ||
      term.title.toLowerCase().includes(query) ||
      term.summary.toLowerCase().includes(query),
  );
  const groups = groupGlossaryTerms(filteredTerms);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <div>
        <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
          Glosarium EV
        </h2>

        <div className="mt-6 relative min-w-[160px] max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-koleksi-navy-dark/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari"
            className="w-full rounded-full border border-border-light bg-transparent py-2.5 pl-10 pr-4 text-sm text-koleksi-navy-dark placeholder:text-koleksi-navy-dark/40 transition focus:border-koleksi-navy-deep focus:outline-none dark:border-border-dark dark:text-ink-dark"
          />
        </div>

        {groups.length === 0 && (
          <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            Tidak ada istilah yang cocok dengan pencarian ini.
          </p>
        )}

        <div className="mt-10 divide-y divide-koleksi-navy-dark/10">
          {groups.map((group, groupIndex) => (
            <motion.div
              key={group.letter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: EASE_OUT,
                delay: (groupIndex % 8) * 0.08,
              }}
              className="py-12 first:pt-0 last:pb-0"
            >
              <p className="text-base font-bold leading-6 text-koleksi-green">
                {group.letter}
              </p>
              <div className="mt-4 space-y-10">
                {group.terms.map((term) => (
                  <div key={term.id}>
                    <h3 className="text-2xl font-bold leading-8 text-koleksi-navy-dark dark:text-ink-dark">
                      {term.title}
                    </h3>
                    <p className="mt-1 text-sm font-normal leading-[21px] text-koleksi-navy-dark dark:text-ink-dark/80">
                      {term.summary}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
