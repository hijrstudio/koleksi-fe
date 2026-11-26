"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import clsx from "@/lib/clsx";
import { useI18n } from "@/components/i18n/I18nProvider";
import { format, localizePath, splitLocale } from "@/lib/i18n/config";
import useDismiss from "./useDismiss";

export const SEARCH_PATH = "/cari";
const MIN = 2;
const MAX = 100;

/** "/cari?q=..." dalam bahasa aktif. Kata kunci terlalu pendek → null (tidak dikirim). */
export function searchHref(raw: string, locale: "id" | "en"): string | null {
  const q = raw.trim().replace(/\s+/g, " ").slice(0, MAX);
  if (q.length < MIN) return null;
  return `${localizePath(SEARCH_PATH, locale)}?${new URLSearchParams({ q })}`;
}

/**
 * Tombol cari di header (desktop). Klik → panel input turun halus di bawah header; Enter → halaman /cari.
 * Tutup: tombol X, Escape, atau klik di luar. Di halaman /cari, kata kunci yang sedang dicari ikut terisi.
 */
export default function HeaderSearch() {
  const { locale, t } = useI18n();
  const s = t.searchPage;
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const onSearchPage = splitLocale(pathname).path === SEARCH_PATH;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [tooShort, setTooShort] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setTooShort(false);
  }, []);
  useDismiss(wrapper, open, close);

  // Fokus ke input setelah panel mulai muncul
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => input.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [open]);

  function toggle() {
    // Dibaca saat diklik (bukan useSearchParams) supaya Header tidak memaksa Suspense di halaman statis
    if (!open) setValue(onSearchPage ? (new URLSearchParams(window.location.search).get("q") ?? "") : "");
    setOpen((v) => !v);
    setTooShort(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const href = searchHref(value, locale);
    if (!href) return setTooShort(true);
    close();
    router.push(href);
  }

  return (
    <div ref={wrapper}>
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? s.close : s.open}
        aria-expanded={open}
        aria-controls="header-search"
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10",
          open && "bg-white/15",
        )}
      >
        <span className="relative block size-[18px]">
          <Search size={18} className={clsx("absolute inset-0 transition duration-200", open ? "scale-50 rotate-90 opacity-0" : "opacity-100")} />
          <X size={18} className={clsx("absolute inset-0 transition duration-200", open ? "opacity-100" : "scale-50 -rotate-90 opacity-0")} />
        </span>
      </button>

      {/* Panel di bawah header, rata kanan; selalu ter-mount supaya transisi buka/tutup halus */}
      <div
        id="header-search"
        role="search"
        aria-hidden={!open}
        className={clsx(
          "absolute top-full right-4 mt-3 w-[min(560px,calc(100vw-2rem))] origin-top-right rounded-2xl border border-border-light bg-surface-light p-2 shadow-[0_12px_40px_rgba(10,22,40,0.18)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:right-10 dark:border-border-dark dark:bg-surface-dark",
          open ? "visible translate-y-0 scale-100 opacity-100" : "pointer-events-none invisible -translate-y-2 scale-[0.98] opacity-0",
        )}
      >
        <form onSubmit={submit} className="flex items-center gap-2">
          <Search size={20} aria-hidden="true" className="ml-3 shrink-0 text-koleksi-navy-dark/40 dark:text-ink-dark/40" />
          <input
            ref={input}
            type="search"
            name="q"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setTooShort(false);
            }}
            maxLength={MAX}
            tabIndex={open ? 0 : -1}
            placeholder={s.placeholder}
            aria-label={s.title}
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 min-w-0 flex-1 bg-transparent text-base text-koleksi-navy-dark outline-none placeholder:text-koleksi-navy-dark/40 dark:text-ink-dark dark:placeholder:text-ink-dark/40 [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="submit"
            tabIndex={open ? 0 : -1}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-koleksi-green px-4 text-sm font-bold text-white transition hover:bg-koleksi-green-dark"
          >
            <span className="hidden sm:inline">{s.submit}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </form>
        {tooShort && (
          <p role="alert" className="px-3 pt-2 pb-1 text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">
            {format(s.hint, { min: MIN })}
          </p>
        )}
      </div>
    </div>
  );
}
