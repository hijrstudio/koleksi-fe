"use client";

import { useSearchParams } from "next/navigation";
import SectionSidebar from "@/components/layout/SectionSidebar";
import { useBarePathname, useI18n } from "@/components/i18n/I18nProvider";
import { NEWS_CATEGORIES, NEWS_SIDEBAR_ORDER } from "@/lib/newsCategories";

/** Sidebar /berita: kategori berita (News Release, Berita EV, Liputan) → /berita?tags={slug}. */
export default function Sidebar() {
  const { t } = useI18n();
  const pathname = useBarePathname();
  const tags = useSearchParams().get("tags");

  const navItems = NEWS_SIDEBAR_ORDER.map((value) => {
    const category = NEWS_CATEGORIES.find((c) => c.value === value)!;
    return { label: t.nav[category.labelKey], href: `/berita?tags=${category.slug}` };
  });

  // Aktif hanya di halaman list dengan ?tags= yang dikenal (detail berita / semua berita: tidak ada yang aktif)
  const activeHref = pathname === "/berita" && tags ? (navItems.find((item) => item.href === `/berita?tags=${tags}`)?.href ?? null) : null;

  return <SectionSidebar items={navItems} title={t.nav.news} activeHref={activeHref} />;
}
