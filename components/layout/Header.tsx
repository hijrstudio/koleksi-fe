"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "@/components/i18n/Link";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useI18n } from "@/components/i18n/I18nProvider";
import clsx from "@/lib/clsx";
import { localizePath, splitLocale } from "@/lib/i18n/config";
import { getNavItems } from "@/lib/navigation";
import type { Locale } from "@/types";
import { TbMoonFilled, TbSunHighFilled } from "react-icons/tb";
import { ID, GB } from "country-flag-icons/react/3x2";
import { logout } from "@/app/actions/auth";
import UserMenu, { type HeaderUser } from "./UserMenu";
import NotificationBell from "./NotificationBell";

export type { HeaderUser };

const LANGUAGES: { code: Locale; Flag: typeof ID }[] = [
  { code: "id", Flag: ID },
  { code: "en", Flag: GB },
];

/** Sudah login: tombol "Masuk" diganti lonceng notifikasi + avatar (dropdown Dasbor/Keluar) di paling kanan.
 *  `user` dari server (Dasbor) dipakai langsung; tanpa prop (halaman publik yang statis / ISR) status login
 *  ditanyakan ke /api/auth/me setelah halaman tampil. */
export default function Header({ user: serverUser }: { user?: HeaderUser }) {
  // undefined = belum diketahui (sedang dicek), null = tamu
  const [sessionUser, setSessionUser] = useState<HeaderUser | null | undefined>(serverUser);
  const user = sessionUser ?? undefined;
  const checkingSession = sessionUser === undefined;

  useEffect(() => {
    if (serverUser) return;

    const controller = new AbortController();
    fetch("/api/auth/me", { cache: "no-store", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data: { user: HeaderUser | null }) => setSessionUser(data.user))
      .catch((error: Error) => {
        if (error.name !== "AbortError") setSessionUser(null);
      });

    return () => controller.abort();
  }, [serverUser]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { locale, t } = useI18n();
  const router = useRouter();
  const lang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];
  const navItems = getNavItems(t);

  /** Halaman yang sama dalam bahasa lain: /kegiatan?x=1 ↔ /en/kegiatan?x=1 (query & anchor ikut). */
  function switchLanguage(next: Locale) {
    setLangOpen(false);
    if (next === locale) return;

    const { pathname, search, hash } = window.location;
    router.push(localizePath(splitLocale(pathname).path, next) + search + hash);
  }

  // openDropdown sengaja tidak di-reset di sini supaya accordion tidak
  // "melipat" di tengah animasi fade-out; direset saat menu dibuka lagi.
  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setLangOpen(false);
  }, []);

  const openMobileMenu = () => {
    setOpenDropdown(null);
    setMobileOpen(true);
  };

  // Kunci scroll body saat menu mobile terbuka, tutup dengan Escape, dan
  // tutup otomatis saat viewport melebar ke desktop.
  useEffect(() => {
    if (!mobileOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) closeMobileMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    mq.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onBreakpoint);
    };
  }, [mobileOpen, closeMobileMenu]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[linear-gradient(270deg,rgba(34,197,94,0.9)_0%,rgba(27,58,106,0.9)_100%)] backdrop-blur-sm">
        <div className="mx-auto max-w-[1680px] px-6 lg:px-10 flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/logo-koleksi.svg"
              alt={t.header.logoAlt}
              width={140}
              height={60}
              className="h-12 w-auto lg:h-15"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-4 lg:flex">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() =>
                  item.children && setOpenDropdown(item.label)
                }
                onMouseLeave={() => item.children && setOpenDropdown(null)}
              >
                {item.children ? (
                  <span className="flex cursor-default items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 hover:text-white/90">
                    {item.label}
                    <ChevronDown size={14} />
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 hover:text-white/90"
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && openDropdown === item.label && (
                  <div className="absolute left-0 top-full min-w-[200px] rounded-xl border border-border-light bg-surface-light p-2 shadow-lg dark:border-border-dark dark:bg-surface-dark">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-light/60 transition hover:bg-muted-light hover:text-koleksi-green dark:text-ink-dark dark:hover:bg-muted-dark"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            {/* Desktop only — di mobile semuanya pindah ke dalam menu */}
            <div className="hidden items-center gap-4 lg:flex">
              {!user && (
                <Link
                  href="/masuk"
                  // Selama status login dicek: tempatnya dipesan tapi tidak terlihat (tidak berkedip "Masuk"
                  // untuk member yang sudah login, dan tata letak tidak bergeser)
                  aria-hidden={checkingSession || undefined}
                  tabIndex={checkingSession ? -1 : undefined}
                  className={clsx(
                    "inline-flex rounded-full bg-[#0D1F3C] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-light",
                    checkingSession && "invisible",
                  )}
                >
                  {t.common.login}
                </Link>
              )}

              <button
                type="button"
                aria-label={t.common.search}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10"
              >
                <Search size={18} />
              </button>

              <button
                type="button"
                aria-label={t.header.toggleTheme}
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition bg-black/20"
              >
                {theme === "light" ? (
                  <TbSunHighFilled size={24} />
                ) : (
                  <TbMoonFilled size={24} />
                )}
              </button>

              <div className="relative">
                <button
                  type="button"
                  aria-label={t.header.chooseLanguage}
                  aria-expanded={langOpen}
                  onClick={() => setLangOpen((v) => !v)}
                  className="flex h-9 items-center gap-1 rounded-full px-2 text-sm text-white transition hover:bg-white/10"
                >
                  <lang.Flag className="h-4 w-6 rounded-sm object-cover" />
                  <ChevronDown size={12} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 min-w-[140px] rounded-xl border border-border-light bg-surface-light p-1 shadow-lg dark:border-border-dark dark:bg-surface-dark">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        lang={l.code}
                        aria-current={l.code === locale ? "true" : undefined}
                        onClick={() => switchLanguage(l.code)}
                        className={clsx(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-light hover:bg-muted-light dark:text-ink-dark dark:hover:bg-muted-dark",
                          l.code === locale && "font-bold",
                        )}
                      >
                        <l.Flag className="h-4 w-6 rounded-sm object-cover" />
                        {t.header.languages[l.code]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Login: lonceng (semua ukuran) + avatar (desktop; di mobile
                Dasbor/Keluar ada di dalam menu). */}
            {user && <NotificationBell />}
            {user && (
              <div className="hidden lg:block">
                <UserMenu user={user} />
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label={t.header.openMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={openMobileMenu}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 lg:hidden"
            >
              <Menu size={32} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — di luar <header> karena backdrop-blur membuat
          elemen `fixed` di dalamnya ter-clip ke tinggi header. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.header.navMenu}
        inert={!mobileOpen}
        className={clsx(
          "fixed inset-0 z-[60] overflow-y-auto bg-[#072B15] transition-[opacity,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden",
          mobileOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
      >
        <div
          className={clsx(
            "flex min-h-full flex-col px-6 pb-11.5 pt-6 transition-transform duration-300 ease-out motion-reduce:transition-none",
            mobileOpen ? "translate-y-0" : "-translate-y-4",
          )}
        >
          <button
            type="button"
            aria-label={t.header.closeMenu}
            onClick={closeMobileMenu}
            className="flex h-8 w-8 items-center justify-center text-white"
          >
            <X size={28} />
          </button>

          {/* Menu */}
          <nav className="mt-21 flex flex-col gap-11.5">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <button
                    type="button"
                    aria-expanded={openDropdown === item.label}
                    onClick={() =>
                      setOpenDropdown((prev) =>
                        prev === item.label ? null : item.label,
                      )
                    }
                    className="flex w-full items-center justify-between text-left text-2xl leading-none font-bold text-white"
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      strokeWidth={3}
                      className={clsx(
                        "transition-transform",
                        openDropdown === item.label && "rotate-180",
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block text-2xl leading-none font-bold text-white"
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && (
                  <div
                    inert={openDropdown !== item.label}
                    className={clsx(
                      "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
                      openDropdown === item.label
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-1 mt-5 flex flex-col gap-4 border-l-2 border-white/20 pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={closeMobileMenu}
                            className="text-lg leading-none font-semibold text-white/70"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Masuk + Cari */}
          <div className="mt-15.5 flex flex-col gap-5">
            <Link
              href={user ? "/dasbor" : "/masuk"}
              onClick={closeMobileMenu}
              className="flex h-15 items-center justify-center gap-3 rounded-full bg-koleksi-green text-lg font-bold text-white transition hover:bg-koleksi-green-dark"
            >
              {user && (
                <Image
                  src={user.avatar}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 rounded-full object-cover"
                />
              )}
              {user ? t.common.dashboard : t.common.login}
            </Link>

            {user && (
              <form action={logout}>
                <button
                  type="submit"
                  className="flex h-15 w-full items-center justify-center rounded-full border-2 border-white/20 text-lg font-bold text-white transition hover:border-white/40"
                >
                  {t.common.logout}
                </button>
              </form>
            )}

            <label className="flex h-15 items-center gap-5 rounded-full border-2 border-white/20 bg-transparent pl-7 pr-6 text-white focus-within:border-white/40">
              <Search size={22} className="shrink-0" />
              <input
                type="search"
                placeholder={t.common.search}
                aria-label={t.common.search}
                className="min-w-0 flex-1 bg-transparent text-lg text-white outline-none placeholder:text-white/40"
              />
            </label>
          </div>

          {/* Tema (kiri) & Bahasa (kanan) */}
          <div className="mt-auto flex items-center justify-between pt-10">
            <button
              type="button"
              aria-label={t.header.toggleTheme}
              onClick={toggleTheme}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
            >
              {theme === "light" ? (
                <TbSunHighFilled size={28} />
              ) : (
                <TbMoonFilled size={28} />
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                aria-label={t.header.chooseLanguage}
                aria-expanded={langOpen}
                onClick={() => setLangOpen((v) => !v)}
                className="block"
              >
                <lang.Flag
                  preserveAspectRatio="xMidYMid slice"
                  className="h-8 w-11 rounded-md"
                />
              </button>
              {langOpen && (
                <div className="absolute right-0 bottom-full mb-2 min-w-[140px] rounded-xl border border-border-light bg-surface-light p-1 shadow-lg dark:border-border-dark dark:bg-surface-dark">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      lang={l.code}
                      aria-current={l.code === locale ? "true" : undefined}
                      onClick={() => {
                        closeMobileMenu();
                        switchLanguage(l.code);
                      }}
                      className={clsx(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-light hover:bg-muted-light dark:text-ink-dark dark:hover:bg-muted-dark",
                        l.code === locale && "font-bold",
                      )}
                    >
                      <l.Flag className="h-4 w-6 rounded-sm object-cover" />
                      {t.header.languages[l.code]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
