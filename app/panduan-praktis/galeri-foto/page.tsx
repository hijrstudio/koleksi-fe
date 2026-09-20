"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import Pagination from "@/components/ui/Pagination";
import clsx from "@/lib/clsx";
import { GALERI_PER_PAGE, GaleriAlbum, galeriAlbums } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function GaleriFotoPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<{
    album: GaleriAlbum;
    index: number;
  } | null>(null);

  const query = search.trim().toLowerCase();
  const filteredAlbums = galeriAlbums.filter(
    (item) => !query || item.title.toLowerCase().includes(query),
  );

  const filterKey = search;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAlbums.length / GALERI_PER_PAGE),
  );
  const pageItems = filteredAlbums.slice(
    (page - 1) * GALERI_PER_PAGE,
    page * GALERI_PER_PAGE,
  );

  function goToPhoto(delta: number) {
    setLightbox((current) => {
      if (!current) return current;
      const total = current.album.photos.length;
      const nextIndex = (current.index + delta + total) % total;
      return { ...current, index: nextIndex };
    });
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <div>
        <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
          Galeri Foto
        </h2>

        <SearchFilterBar
          className="mt-6"
          search={search}
          onSearchChange={setSearch}
        />

        {pageItems.length === 0 && (
          <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            Tidak ada galeri yang cocok dengan pencarian ini.
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setLightbox({ album: item, index: 0 })}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: EASE_OUT,
                delay: (index % GALERI_PER_PAGE) * 0.08,
              }}
              className="group text-left cursor-pointer"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-[10px] border border-border-light dark:border-border-dark">
                <Image
                  src={item.photos[0]}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <h3 className="mt-4 text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                {item.title}
              </h3>
              <p className="mt-2 text-base font-normal leading-6 text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                {item.date}
              </p>
            </motion.button>
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-18"
        />
      </div>

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  aria-label="Tutup"
                  className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                >
                  <X size={18} />
                </button>

                {lightbox.album.photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => goToPhoto(-1)}
                      aria-label="Foto sebelumnya"
                      className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToPhoto(1)}
                      aria-label="Foto berikutnya"
                      className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                <Image
                  src={lightbox.album.photos[lightbox.index]}
                  alt={lightbox.album.title}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {lightbox.album.title}
                </p>
                <p className="mt-0.5 text-xs text-white/60">
                  {lightbox.index + 1} / {lightbox.album.photos.length}
                </p>
              </div>

              {lightbox.album.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {lightbox.album.photos.map((photo, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setLightbox((current) =>
                          current ? { ...current, index: i } : current,
                        )
                      }
                      className={clsx(
                        "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition",
                        i === lightbox.index
                          ? "border-koleksi-green"
                          : "border-transparent opacity-60 hover:opacity-100",
                      )}
                    >
                      <Image
                        src={photo}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
