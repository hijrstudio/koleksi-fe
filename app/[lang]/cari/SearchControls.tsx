"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { useI18n } from "@/components/i18n/I18nProvider";
import { searchHref } from "@/components/layout/HeaderSearch";

/** Kotak pencarian di halaman /cari (terisi kata kunci saat ini). */
export function SearchForm({ initial }: { initial: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [value, setValue] = useState(initial);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const href = searchHref(value, locale);
        if (href) router.push(href);
      }}
      className="flex items-center gap-2 rounded-full border border-border-light bg-surface-light p-1.5 pl-5 transition focus-within:border-koleksi-navy-deep dark:border-border-dark dark:bg-surface-dark dark:focus-within:border-ink-dark"
    >
      <Search size={20} aria-hidden="true" className="shrink-0 text-koleksi-navy-dark/40 dark:text-ink-dark/40" />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={100}
        placeholder={t.searchPage.placeholder}
        aria-label={t.searchPage.title}
        autoComplete="off"
        enterKeyHint="search"
        className="h-11 min-w-0 flex-1 bg-transparent text-base text-koleksi-navy-dark outline-none placeholder:text-koleksi-navy-dark/40 dark:text-ink-dark dark:placeholder:text-ink-dark/40"
      />
      <button
        type="submit"
        className="h-11 shrink-0 rounded-full bg-koleksi-navy-deep px-6 text-sm font-bold text-white transition hover:bg-koleksi-navy dark:bg-koleksi-green dark:hover:bg-koleksi-green-dark"
      >
        {t.searchPage.submit}
      </button>
    </form>
  );
}

/** Paginasi hasil satu jenis: pindah halaman = URL baru (?page=), dirender di server. */
export function SearchPagination({ base, page, lastPage }: { base: string; page: number; lastPage: number }) {
  const router = useRouter();
  return (
    <Pagination
      currentPage={page}
      totalPages={lastPage}
      onPageChange={(p) => router.push(`${base}&page=${p}`)}
      className="mt-12"
    />
  );
}
