"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Loader2, Rss, Search } from "lucide-react";
import clsx from "@/lib/clsx";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PAGE_SIZE = 5;

const articles = [
  {
    id: "art-1",
    category: "Kendaraan",
    title: "Apakah EV Pilihan Tepat Sebagai Mobil Pertama?",
    author: "Luki Cahyadi (KOLEKSI 104)",
    image: "/images/sample-image1.png",
  },
  {
    id: "art-2",
    category: "Bisnis",
    title:
      'Membongkar Fakta Hemat "Bedah Dompet" 5 Tahun: TCO BYD ATTO 1 vs HONDA BRIO SATYA',
    author: "Carlos Christian Lie (KOLEKSI 110)",
    image: "/images/sample-image2.png",
  },
  {
    id: "art-3",
    category: "Infrastruktur",
    title: "Baterai EV dan Ketakutan Publik",
    author: "KOLEKSI",
    image: "/images/sample-image3.png",
  },
  {
    id: "art-4",
    category: "Kendaraan",
    title: "Panduan Praktis Seputar Kendaraan Listrik",
    author: "Hendro Sutiono (Pengamat dan Pengguna EV)",
    image: "/images/sample-image1.png",
  },
  {
    id: "art-5",
    category: "Bisnis",
    title:
      'Membongkar Fakta Hemat "Bedah Dompet" 5 Tahun: TCO BYD ATTO 1 vs HONDA BRIO SATYA',
    author: "Carlos Christian Lie (KOLEKSI 110)",
    image: "/images/sample-image1.png",
  },
  {
    id: "art-6",
    category: "Infrastruktur",
    title: "Peta Sebaran SPKLU di Jabodetabek Terbaru",
    author: "KOLEKSI",
    image: "/images/sample-image2.png",
  },
  {
    id: "art-7",
    category: "Kendaraan",
    title: "Tips Merawat Baterai EV Supaya Awet",
    author: "Luki Cahyadi (KOLEKSI 104)",
    image: "/images/sample-image3.png",
  },
  {
    id: "art-8",
    category: "Bisnis",
    title: "Insentif Pajak Kendaraan Listrik 2026, Apa Saja yang Berubah?",
    author: "Carlos Christian Lie (KOLEKSI 110)",
    image: "/images/sample-image1.png",
  },
  {
    id: "art-9",
    category: "Infrastruktur",
    title: "Charging di Rumah vs Charging Publik, Mana yang Lebih Hemat?",
    author: "Hendro Sutiono (Pengamat dan Pengguna EV)",
    image: "/images/sample-image2.png",
  },
  {
    id: "art-10",
    category: "Kendaraan",
    title: "Panduan Memilih EV Bekas untuk Pemula",
    author: "KOLEKSI",
    image: "/images/sample-image3.png",
  },
];

const categoryColor: Record<string, string> = {
  Kendaraan: "bg-badge-artikel",
  Bisnis: "bg-fuchsia-500",
  Infrastruktur: "bg-sky-500",
};

const popularArticles = Array.from({ length: 5 }, (_, i) => ({
  id: `popular-${i}`,
  title: "Panduan Praktis Seputar Kendaraan Listrik",
  date: "31 Agustus 2026",
}));

export default function ArtikelPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const hasMore = visibleCount < articles.length;

  function handleLoadMore() {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + PAGE_SIZE, articles.length));
      setIsLoading(false);
    }, 600);
  }

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="lg:max-w-[80%] font-display text-[32px] font-bold leading-10 text-koleksi-navy dark:text-ink-dark">
              Panduan Praktis dan Pengetahuan tentang EV
            </h1>
            <p className="mt-6 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/60">
              Informasi seputar kendaraan listrik dan infrastrukturnya.
            </p>
          </div>
          <a
            href="#"
            className="flex w-fit items-center gap-1.5 rounded-full bg-koleksi-navy-deep/[0.0333] px-4 py-2 text-sm font-medium text-koleksi-navy-dark/50 transition hover:text-koleksi-green dark:text-ink-dark/50"
          >
            <Rss size={14} />
            RSS
          </a>
        </div>
        {/* Empty spacer matching the right widget column below, so the
            1fr track here computes to the exact same width as the
            article-list column. */}
        <div aria-hidden="true" className="hidden xl:block" />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 xl:grid-cols-[1fr_270px]">
        {/* Article list */}
        <div>
          <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
            Artikel
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[160px] flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-koleksi-navy-dark/40"
              />
              <input
                type="text"
                placeholder="Cari"
                className="w-full rounded-full border border-border-light bg-transparent py-2 pl-10 pr-4 text-sm text-koleksi-navy-dark placeholder:text-koleksi-navy-dark/40 transition focus:border-koleksi-navy-deep focus:outline-none dark:border-border-dark dark:text-ink-dark"
              />
            </div>
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-border-light px-4 py-2 text-sm text-koleksi-navy-dark transition hover:border-koleksi-navy-deep dark:border-border-dark dark:text-ink-dark"
            >
              Terbaru
              <ChevronDown size={14} />
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-border-light px-4 py-2 text-sm text-koleksi-navy-dark transition hover:border-koleksi-navy-deep dark:border-border-dark dark:text-ink-dark"
            >
              Kategori/Tag
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="mt-6 divide-y divide-border-light dark:divide-border-dark">
            {articles.slice(0, visibleCount).map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: EASE_OUT,
                  delay: (index % PAGE_SIZE) * 0.08,
                }}
                className="flex gap-4 py-5 first:pt-0"
              >
                <div className="relative aspect-270/183 w-[130px] shrink-0 overflow-hidden rounded-xl sm:w-[200px] lg:w-[270px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="270px"
                  />
                </div>
                <div className="min-w-0">
                  <span
                    className={clsx(
                      "inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] leading-3 font-semibold text-white",
                      categoryColor[item.category],
                    )}
                  >
                    {item.category}
                  </span>
                  <h3 className="mt-2 text-[20px] font-bold leading-6 text-koleksi-navy-dark dark:text-ink-dark">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[14px] text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                    Oleh: {item.author}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          {hasMore && (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoading}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-koleksi-navy-deep px-6 py-2.5 text-sm font-bold text-koleksi-navy-deep transition hover:border-koleksi-navy-deep/60 disabled:opacity-60"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Memuat..." : "Muat lebih banyak"}
            </button>
          )}
        </div>

        {/* Right widgets */}
        <aside className="flex flex-col gap-12">
          <div className="relative flex aspect-270/320 w-full flex-col overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#F1F5F9_50%,#3B82F6_75%,#1A3A6B_100%)] p-5">
            <span className="absolute right-4 top-4 rounded-full bg-koleksi-amber px-2.5 py-1 text-[12px] font-bold uppercase text-koleksi-navy-deep">
              NEW
            </span>
            <p className="mt-8 text-[24px] font-bold leading-8 text-koleksi-navy-dark">
              Mini Touring: Jakarta–Bogor
            </p>
            <Link
              href="#"
              className="mt-auto inline-flex w-fit items-center self-end rounded-full bg-koleksi-navy-deep px-5 py-2 text-base font-bold leading-6 text-white transition hover:bg-koleksi-navy"
            >
              Lihat
            </Link>
          </div>

          <div>
            <h3 className="text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
              Terpopuler
            </h3>
            <ul className="mt-8 divide-y divide-border-light dark:divide-border-dark">
              {popularArticles.map((item) => (
                <li key={item.id} className="py-3 first:pt-0">
                  <p className="text-sm font-semibold leading-[21px] text-koleksi-navy-dark dark:text-ink-dark">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                    {item.date}
                  </p>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="mt-3 inline-block text-sm font-medium text-koleksi-navy-dark/60 underline transition hover:text-koleksi-green dark:text-ink-dark/60"
            >
              Lihat Semua
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
