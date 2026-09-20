"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
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

        <SearchFilterBar
          className="mt-6"
          search={search}
          onSearchChange={setSearch}
        />

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
