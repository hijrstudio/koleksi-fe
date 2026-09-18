"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Moon, Search, Sun, X } from "lucide-react";
import { navItems } from "@/data/mockData";
import { useTheme } from "@/components/providers/ThemeProvider";
import clsx from "@/lib/clsx";
import { TbMoonFilled, TbSunHighFilled } from "react-icons/tb";
import { ID, GB } from "country-flag-icons/react/3x2";

const LANGUAGES = [
  { code: "id", label: "Indonesia", Flag: ID },
  { code: "en", label: "English", Flag: GB },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState(LANGUAGES[0]);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[linear-gradient(270deg,rgba(34,197,94,0.9)_0%,rgba(27,58,106,0.9)_100%)] backdrop-blur-sm">
      <div className="mx-auto max-w-[1680px] px-6 lg:px-10 flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/logo-koleksi.svg"
            alt="Koleksi"
            width={140}
            height={60}
            className="h-15 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 lg:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
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
          <Link
            href="/masuk"
            className="hidden rounded-full bg-[#0D1F3C] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-light sm:inline-flex"
          >
            Masuk
          </Link>

          <button
            type="button"
            aria-label="Cari"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            aria-label="Ganti tema terang/gelap"
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
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-light hover:bg-muted-light dark:text-ink-dark dark:hover:bg-muted-dark"
                  >
                    <l.Flag className="h-4 w-6 rounded-sm object-cover" />
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={clsx(
          "overflow-hidden transition-[max-height] duration-300 lg:hidden",
          mobileOpen ? "max-h-[80vh]" : "max-h-0",
        )}
      >
        <nav className="mx-auto max-w-[1680px] px-6 lg:px-10 flex flex-col gap-1 pb-4">
          {navItems.map((item) => (
            <div key={item.label}>
              <button
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-white"
                onClick={() =>
                  setOpenDropdown((prev) =>
                    prev === item.label ? null : item.label,
                  )
                }
              >
                {item.label}
                {item.children && (
                  <ChevronDown
                    size={14}
                    className={clsx(
                      "transition-transform",
                      openDropdown === item.label && "rotate-180",
                    )}
                  />
                )}
              </button>
              {item.children && openDropdown === item.label && (
                <div className="ml-3 flex flex-col gap-1 border-l border-white/20 pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="rounded-lg px-3 py-2 text-sm text-white/80"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/masuk"
            className="mt-2 rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-koleksi-navy"
          >
            Masuk
          </Link>
        </nav>
      </div>
    </header>
  );
}
