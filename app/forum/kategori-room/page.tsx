"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import clsx from "@/lib/clsx";
import { DEFAULT_ROOM, kategoriList, roomGroups } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function KategoriRoomPage() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState<string | null>(null);
  const [room, setRoom] = useState<string | null>(DEFAULT_ROOM);

  const query = search.trim().toLowerCase();
  const matches = (name: string) => !query || name.toLowerCase().includes(query);

  const filteredKategori = kategoriList.filter(matches);
  const filteredGroups = roomGroups
    .map((group) => ({ ...group, rooms: group.rooms.filter(matches) }))
    .filter((group) => group.rooms.length > 0);

  const hasKategori = filteredKategori.length > 0;
  const hasRoom = filteredGroups.length > 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <div>
        <SearchFilterBar
          iconPosition="right"
          fullWidth
          search={search}
          onSearchChange={setSearch}
        />

        {!hasKategori && !hasRoom && (
          <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            Tidak ada kategori/room yang cocok dengan pencarian ini.
          </p>
        )}

        {hasKategori && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="mt-16"
          >
            <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
              Kategori
            </h2>
            <div className="mt-9 flex flex-wrap gap-3">
              {filteredKategori.map((name) => {
                const selected = kategori === name;
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setKategori(selected ? null : name)}
                    className={clsx(
                      "cursor-pointer rounded-full px-5 py-1.5 text-base leading-6 font-bold transition",
                      selected
                        ? "bg-koleksi-navy-deep text-white dark:bg-ink-dark dark:text-koleksi-navy-dark"
                        : "bg-koleksi-navy-deep/10 text-koleksi-navy-deep hover:bg-koleksi-navy-deep/15 dark:bg-white/10 dark:text-ink-dark dark:hover:bg-white/15",
                    )}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {hasKategori && hasRoom && (
          <hr className="mt-20 border-border-light dark:border-border-dark" />
        )}

        {hasRoom && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.08 }}
            className="mt-16"
          >
            <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
              Room
            </h2>
            <div className="mt-9 flex flex-col gap-10">
              {filteredGroups.map((group) => (
                <div key={group.id}>
                  <h3 className="text-sm leading-5 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                    {group.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {group.rooms.map((name) => {
                      const selected = room === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setRoom(selected ? null : name)}
                          className={clsx(
                            "cursor-pointer rounded-full border border-muted-steel px-3 py-1.5 text-sm leading-[21px] font-bold transition",
                            selected
                              ? "bg-muted-steel text-white"
                              : "text-muted-steel hover:bg-muted-steel/10",
                          )}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
