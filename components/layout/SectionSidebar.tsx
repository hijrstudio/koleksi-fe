"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "@/lib/clsx";

const sectionOptions = [
  { label: "Panduan Praktis", value: "/panduan-praktis" },
  { label: "Forum", value: "/forum" },
];

export interface SidebarNavItem {
  label: string;
  href: string;
}

/**
 * Sidebar bersama untuk section /panduan-praktis dan /forum: dropdown
 * pindah section + daftar menu. Konten tambahan section (mis. tombol dan
 * statistik forum) dikirim lewat `children`, dirender di bawah menu.
 *
 * - >= 1024px : fixed di kiri (305px).
 * - <  1024px : blok di atas konten; menu horizontal scroll di bawah 768px.
 */
export default function SectionSidebar({
  items,
  children,
}: {
  items: SidebarNavItem[];
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const activeEl = nav?.querySelector<HTMLElement>('[data-active="true"]');
    if (!nav || !activeEl) return;
    nav.scrollTo({
      left: activeEl.offsetLeft - (nav.clientWidth - activeEl.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [pathname]);

  const activeSection = pathname.startsWith("/forum")
    ? "/forum"
    : "/panduan-praktis";
  const activeLabel = sectionOptions.find(
    (opt) => opt.value === activeSection,
  )?.label;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <aside className="relative w-full border-b border-koleksi-navy-dark/10 bg-surface-light px-6 py-6 lg:fixed lg:inset-y-0 lg:top-20 lg:z-40 lg:w-[305px] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:py-8 lg:px-8 dark:bg-surface-dark">
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-full border border-border-light px-4 py-2.5 text-base leading-6 font-bold text-koleksi-navy transition hover:border-koleksi-navy-deep dark:border-border-dark dark:text-ink-dark"
        >
          {activeLabel}
          <ChevronDown
            size={16}
            className={clsx(
              "transition-transform duration-300",
              open && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-10 overflow-hidden rounded-2xl border border-border-light bg-surface-light py-2 shadow-lg dark:border-border-dark dark:bg-surface-dark"
            >
              {sectionOptions.map((opt) => {
                const isActive = opt.value === activeSection;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      if (!isActive) router.push(opt.value);
                    }}
                    className={clsx(
                      "block w-full px-4 py-2.5 text-left text-sm transition cursor-pointer",
                      isActive
                        ? "font-bold text-koleksi-navy-dark dark:text-ink-dark"
                        : "font-normal text-koleksi-navy-dark/50 hover:text-koleksi-navy-dark dark:text-ink-dark/50",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav
        ref={navRef}
        className="relative -mx-6 mt-4 flex gap-6 overflow-x-auto px-6 scrollbar-none md:mx-0 md:flex-col md:gap-0 md:overflow-visible md:px-4 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              data-active={isActive}
              className={clsx(
                "shrink-0 whitespace-nowrap py-2.5 text-sm transition",
                isActive
                  ? "font-bold text-koleksi-blue"
                  : "text-koleksi-navy-dark/80 hover:text-koleksi-blue dark:text-ink-dark/60",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </aside>
  );
}
