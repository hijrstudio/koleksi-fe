"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import { FaLock } from "react-icons/fa";
import clsx from "@/lib/clsx";
import { LEVELS, Level, playbookItems } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function WebPlaybookPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<Level>("Beginner");

  const query = search.trim().toLowerCase();
  const filteredItems = playbookItems.filter((item) => {
    const matchesQuery = !query || item.title.toLowerCase().includes(query);
    return matchesQuery && item.level === level;
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <div>
        <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
          Web Playbook
        </h2>

        <SearchFilterBar
          className="mt-6"
          search={search}
          onSearchChange={setSearch}
        />

        <div className="mt-6 flex flex-wrap gap-1 sm:gap-3">
          {LEVELS.map((opt) => {
            const isActive = opt === level;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setLevel(opt)}
                className={clsx(
                  "rounded-full px-5 py-2.5 text-base font-bold leading-6 transition",
                  isActive
                    ? "bg-muted-steel text-white"
                    : "bg-koleksi-navy-deep/10 text-koleksi-navy-deep hover:bg-koleksi-navy-deep/15",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <p className="mt-10 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            Tidak ada playbook yang cocok dengan pencarian/filter ini.
          </p>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={level}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: EASE_OUT,
                  delay: (index % 6) * 0.08,
                }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-388/200 sm:aspect-270/320 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="absolute inset-x-0 top-0 p-4">
                  <p className="text-[20px] font-bold leading-6 text-white">
                    {item.title}
                  </p>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex justify-end p-4">
                  {item.locked ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-koleksi-navy-deep">
                      <FaLock size={16} className="text-muted-steel" />
                      Level {item.lockLevel}
                    </span>
                  ) : (
                    <span className="rounded-full bg-koleksi-amber px-5 py-2 text-base font-bold leading-6 text-koleksi-navy-deep">
                      Lihat
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
