"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import Pagination from "@/components/ui/Pagination";
import clsx from "@/lib/clsx";
import { format, useI18n } from "@/components/i18n/I18nProvider";
import type { GalleryAlbum, GalleryAlbumPage } from "@/types";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const GALERI_PER_PAGE = 6;
const SEARCH_DEBOUNCE_MS = 400;

/**
 * Album galeri foto: pencarian, paginasi bernomor (6 per halaman), klik album membuka
 * lightbox berisi foto-foto album. Halaman pertama dirender server (initialPage);
 * perubahan berikutnya diambil lewat /api/gallery-albums.
 */
export default function GalleryList({ initialPage }: { initialPage: GalleryAlbumPage }) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [data, setData] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lightbox, setLightbox] = useState<{ album: GalleryAlbum; index: number } | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const listTopRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      abortRef.current?.abort();
    },
    [],
  );

  // Lightbox: Esc untuk tutup, panah kiri/kanan untuk ganti foto
  useEffect(() => {
    if (!lightbox) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") goToPhoto(-1);
      if (e.key === "ArrowRight") goToPhoto(1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

  async function load(nextSearch: string, page: number) {
    // Batalkan request sebelumnya supaya hasil lama tidak menimpa hasil terbaru
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(false);

    const params = new URLSearchParams({ page: String(page) });
    if (nextSearch.trim()) params.set("search", nextSearch.trim());

    try {
      const res = await fetch(`/api/gallery-albums?${params}`, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(true);
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => void load(value, 1), SEARCH_DEBOUNCE_MS);
  }

  function handlePageChange(page: number) {
    void load(search, page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToPhoto(delta: number) {
    setLightbox((current) => {
      if (!current) return current;
      const total = current.album.photos.length;
      const nextIndex = (current.index + delta + total) % total;
      return { ...current, index: nextIndex };
    });
  }

  return (
    <div>
      <h2
        ref={listTopRef}
        className="scroll-mt-28 text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark"
      >
        {t.guide.gallery.title}
      </h2>

      <SearchFilterBar
        className="mt-6"
        search={search}
        onSearchChange={handleSearchChange}
      />

      {error && (
        <p className="mt-6 text-sm text-red-500">
          {t.guide.gallery.error}
        </p>
      )}

      {!error && !loading && data.items.length === 0 && (
        <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          {t.guide.gallery.empty}
        </p>
      )}

      <div
        className={clsx(
          "mt-6 grid grid-cols-2 gap-x-4 gap-y-8 transition-opacity sm:gap-x-6 sm:gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
          loading && "opacity-50",
        )}
      >
        {data.items.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => item.photos.length > 0 && setLightbox({ album: item, index: 0 })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: EASE_OUT,
              delay: (index % GALERI_PER_PAGE) * 0.08,
            }}
            className="group text-left cursor-pointer"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-[10px] border border-border-light bg-koleksi-navy-dark/5 dark:border-border-dark">
              {(item.cover ?? item.photos[0]) && (
                <Image
                  src={(item.cover ?? item.photos[0])!}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              )}
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

      {data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
          className="mt-18"
        />
      )}

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
                  aria-label={t.common.close}
                  className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                >
                  <X size={18} />
                </button>

                {lightbox.album.photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => goToPhoto(-1)}
                      aria-label={t.guide.gallery.previousPhoto}
                      className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToPhoto(1)}
                      aria-label={t.guide.gallery.nextPhoto}
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
                      key={photo}
                      type="button"
                      onClick={() =>
                        setLightbox((current) =>
                          current ? { ...current, index: i } : current,
                        )
                      }
                      aria-label={format(t.guide.gallery.photo, { number: i + 1 })}
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
