"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import Dot from "@/components/ui/Dot";
import RoleBadge from "@/components/ui/RoleBadge";
import {
  activeMembers,
  diskusiItems,
  formatTanggal,
  TAG_OPTIONS,
  trendingTopics,
} from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const PAGE_SIZE = 10;
const SORT_OPTIONS = ["Terbaru", "Terlama"] as const;

export default function DiskusiPage() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] =
    useState<(typeof SORT_OPTIONS)[number]>("Terbaru");
  const [category, setCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);

  // Client-side filter/sort over the local mock array (./data). Swap this
  // block for an API call (passing search/category/sortOrder as query
  // params) once a real backend is wired up -- the state shape here is
  // already what that request would need.
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = diskusiItems.filter((item) => {
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query);
      const matchesCategory = !category || item.tag === category;
      return matchesQuery && matchesCategory;
    });

    result.sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortOrder === "Terbaru" ? -diff : diff;
    });

    return result;
  }, [search, category, sortOrder]);

  // Reset pagination whenever the filters change so "Muat lebih banyak"
  // always starts from the first page of the new result set. Adjusting
  // state during render (React's recommended pattern) instead of an
  // effect avoids an extra render pass.
  const filterKey = `${search}|${category}|${sortOrder}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  const hasMore = visibleCount < filteredItems.length;

  function handleLoadMore() {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredItems.length));
      setIsLoading(false);
    }, 600);
  }

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
        <div>
          <h1 className="font-display text-[32px] font-bold leading-10 text-koleksi-navy dark:text-ink-dark">
            Forum KOLEKSI
          </h1>
          <p className="mt-6 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/60">
            Ruang diskusi untuk berbagi ide, pengetahuan dan pengalaman seputar
            kendaraan listrik.
          </p>
        </div>
        {/* Empty spacer matching the right widget column below, so the
            1fr track here computes to the exact same width as the
            discussion-list column. */}
        <div aria-hidden="true" className="hidden xl:block" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 md:mt-16 xl:grid-cols-[1fr_270px]">
        {/* Discussion list */}
        <div>
          <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
            Diskusi
          </h2>

          <SearchFilterBar
            className="mt-4"
            iconPosition="right"
            search={search}
            onSearchChange={setSearch}
          >
            <FilterDropdown
              label="Terbaru"
              options={[...SORT_OPTIONS]}
              value={sortOrder}
              onChange={(v) => setSortOrder(v as (typeof SORT_OPTIONS)[number])}
            />
            <FilterDropdown
              label="Kategori / Tag"
              options={TAG_OPTIONS}
              value={category}
              onChange={setCategory}
            />
          </SearchFilterBar>

          {filteredItems.length === 0 && (
            <p className="mt-6 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
              Tidak ada diskusi yang cocok dengan pencarian/filter ini.
            </p>
          )}

          <div className="mt-6 divide-y divide-border-light dark:divide-border-dark">
            {filteredItems.slice(0, visibleCount).map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: EASE_OUT,
                  delay: (index % PAGE_SIZE) * 0.08,
                }}
                className="py-5 first:pt-0"
              >
                <Link
                  href={`/forum/diskusi/${item.slug}`}
                  className="group flex gap-4"
                >
                  <div className="relative aspect-270/183 w-[160px] shrink-0 overflow-hidden rounded-xl sm:w-[200px] lg:w-[270px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="270px"
                    />
                  </div>
                  <div className="min-w-0">
                    {/* User · Tanggal · Badge tag */}
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                      <span>{item.author}</span>
                      <Dot />
                      <span>{formatTanggal(item.date)}</span>
                      <Dot />
                      <span className="inline-flex w-fit items-center rounded-full bg-koleksi-green px-3 py-1 text-[12px] leading-3 font-semibold text-white">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                      {item.title}
                    </h3>
                    {/* Komentar · Dilihat · Bagikan */}
                    <p className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                      <span>{item.comments} Komentar</span>
                      <Dot />
                      <span>Dilihat: {item.views}</span>
                      <Dot />
                      <span>Bagikan</span>
                    </p>
                  </div>
                </Link>
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
              Topik Trending
            </h3>
            <ul className="mt-8 divide-y divide-border-light dark:divide-border-dark">
              {trendingTopics.map((item) => (
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

          <div>
            <h3 className="text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
              Anggota Teraktif
            </h3>
            <ul className="mt-8 flex flex-col gap-7">
              {activeMembers.map((member) => (
                <li key={member.id} className="flex items-center gap-3">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <RoleBadge role={member.role} />
                    <p className="mt-1 truncate text-sm font-bold text-koleksi-navy-dark dark:text-ink-dark">
                      {member.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
