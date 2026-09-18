"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Search, X } from "lucide-react";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import { VIDEOS_PER_PAGE, VideoItem, videos } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CATEGORY_OPTIONS = [
  "Semua",
  "Kendaraan",
  "Bisnis",
  "Teknologi",
  "Infrastruktur",
];

export default function VideoEdukasiPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const query = search.trim().toLowerCase();
  const filteredVideos = videos.filter((item) => {
    const matchesQuery = !query || item.title.toLowerCase().includes(query);
    const matchesCategory =
      !category || category === "Semua" || item.category === category;
    return matchesQuery && matchesCategory;
  });

  const filterKey = `${search}|${category}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE),
  );
  const pageItems = filteredVideos.slice(
    (page - 1) * VIDEOS_PER_PAGE,
    page * VIDEOS_PER_PAGE,
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10 ">
      <div>
        <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
          Video Edukasi
        </h2>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[160px] flex-1">
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
          <FilterDropdown
            label="Kategori/Tag"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={setCategory}
          />
        </div>

        {pageItems.length === 0 && (
          <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            Tidak ada video yang cocok dengan pencarian/filter ini.
          </p>
        )}

        <div className="mt-6 divide-y divide-border-light dark:divide-border-dark">
          {pageItems.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActiveVideo(item)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: EASE_OUT,
                delay: (index % VIDEOS_PER_PAGE) * 0.08,
              }}
              className="group flex w-full gap-4 py-5 text-left first:pt-0 cursor-pointer"
            >
              <div className="relative aspect-270/183 w-[130px] shrink-0 overflow-hidden rounded-xl sm:w-[200px] lg:w-[270px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="270px"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-koleksi-navy-deep transition group-hover:bg-white">
                    <Play size={18} className="ml-0.5 fill-current" />
                  </span>
                </div>
              </div>
              <div className="min-w-0">
                <span className="inline-flex w-fit items-center rounded-full bg-badge-video px-3 py-1 text-[12px] leading-3 font-semibold text-white">
                  {item.category}
                </span>
                <h3 className="mt-2 text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[14px] text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                  {item.date}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-10"
        />

        <AnimatePresence>
          {activeVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
              onClick={() => setActiveVideo(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-black"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  aria-label="Tutup"
                  className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                >
                  <X size={18} />
                </button>
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
