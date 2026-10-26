"use client";

import SectionSidebar from "@/components/layout/SectionSidebar";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function Sidebar() {
  const { sidebar } = useI18n().t.guide;

  const navItems = [
    { label: sidebar.articles, href: "/panduan-praktis/artikel" },
    { label: sidebar.news, href: "/panduan-praktis/berita" },
    { label: sidebar.videos, href: "/panduan-praktis/video-edukasi" },
    { label: sidebar.infographics, href: "/panduan-praktis/infografis" },
    { label: sidebar.gallery, href: "/panduan-praktis/galeri-foto" },
    { label: sidebar.playbook, href: "/panduan-praktis/web-playbook" },
    { label: sidebar.regulations, href: "/panduan-praktis/dokumen-regulasi" },
    { label: sidebar.glossary, href: "/panduan-praktis/glosarium-ev" },
    // { label: "Pencarian", href: "/panduan-praktis/pencarian" },
  ];

  return <SectionSidebar items={navItems} />;
}
