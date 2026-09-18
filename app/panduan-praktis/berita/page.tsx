"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Pagination from "@/components/ui/Pagination";
import NewsTag from "@/components/ui/NewsTag";
import { BERITA_PER_PAGE, beritaItems } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SORT_OPTIONS = ["Terbaru", "Terlama"] as const;
const CATEGORY_OPTIONS = ["Semua", "News Release", "Liputan", "Berita EV"];

const TAG_SLUG_MAP: Record<string, string> = {
  "news-release": "News Release",
  "berita-ev": "Berita EV",
  liputan: "Liputan",
};

function BeritaPageContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] =
    useState<(typeof SORT_OPTIONS)[number]>("Terbaru");
  const [category, setCategory] = useState<string | null>(() => {
    const tagSlug = searchParams.get("tags");
    return tagSlug ? (TAG_SLUG_MAP[tagSlug] ?? null) : null;
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const tagSlug = searchParams.get("tags");
    setCategory(tagSlug ? (TAG_SLUG_MAP[tagSlug] ?? null) : null);
  }, [searchParams]);

  const query = search.trim().toLowerCase();
  const filteredBerita = beritaItems
    .filter((item) => {
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query);
      const matchesCategory =
        !category || category === "Semua" || item.tag === category;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => {
      const diff =
        new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime();
      return sortOrder === "Terbaru" ? -diff : diff;
    });

  const filterKey = `${search}|${category}|${sortOrder}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBerita.length / BERITA_PER_PAGE),
  );
  const pageItems = filteredBerita.slice(
    (page - 1) * BERITA_PER_PAGE,
    page * BERITA_PER_PAGE,
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10 ">
      <div>
        <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
          Berita
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
            label="Terbaru"
            options={[...SORT_OPTIONS]}
            value={sortOrder}
            onChange={(v) => setSortOrder(v as (typeof SORT_OPTIONS)[number])}
          />
          <FilterDropdown
            label="Kategori/Tag"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={setCategory}
          />
        </div>

        {pageItems.length === 0 && (
          <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
            Tidak ada berita yang cocok dengan pencarian/filter ini.
          </p>
        )}

        <div className="mt-6 divide-y divide-border-light dark:divide-border-dark">
          {pageItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: EASE_OUT,
                delay: (index % BERITA_PER_PAGE) * 0.08,
              }}
              className="py-5 first:pt-0"
            >
              <Link
                href={`/panduan-praktis/berita/${item.slug}`}
                className="group flex gap-4"
              >
                <div className="relative aspect-270/183 w-[130px] shrink-0 overflow-hidden rounded-xl sm:w-[200px] lg:w-[270px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="270px"
                  />
                </div>
                <div className="min-w-0">
                  <NewsTag tag={item.tag} />
                  <h3 className="mt-2 text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[14px] text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                    Oleh: {item.author}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-10"
        />
      </div>

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}

export default function BeritaPage() {
  return (
    <Suspense fallback={null}>
      <BeritaPageContent />
    </Suspense>
  );
}
