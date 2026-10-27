"use client";

import SectionSidebar from "@/components/layout/SectionSidebar";
import { useI18n } from "@/components/i18n/I18nProvider";

/** Sidebar galeri kegiatan: foto & video. */
export default function Sidebar() {
  const { nav } = useI18n().t;

  const navItems = [
    { label: nav.gallery, href: "/kegiatan/galeri/foto" },
    { label: nav.video, href: "/kegiatan/galeri/video" },
  ];

  return <SectionSidebar items={navItems} title={nav.events} />;
}
