import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import type { NavItem } from "@/types";

/** Menu utama Header. Path tanpa prefix bahasa — komponen Link menambahkan /en untuk English. */
export function getNavItems(t: Dictionary): NavItem[] {
  const nav = t.nav;

  return [
    { label: nav.aboutUs, href: "/tentang-kami" },
    {
      label: nav.community,
      href: "/komunitas",
      children: [
        { label: nav.practicalGuide, href: "/panduan-praktis" },
        { label: nav.forum, href: "/forum" },
      ],
    },
    {
      label: nav.events,
      href: "/kegiatan",
      children: [
        { label: nav.events, href: "/kegiatan" },
        { label: nav.gallery, href: "/panduan-praktis/galeri-foto" },
        { label: nav.video, href: "/panduan-praktis/video-edukasi" },
      ],
    },
    {
      label: nav.news,
      href: "/berita",
      children: [
        { label: nav.newsRelease, href: "/berita?tags=news-release" },
        { label: nav.evNews, href: "/berita?tags=berita-ev" },
        { label: nav.coverage, href: "/berita?tags=liputan" },
      ],
    },
    { label: nav.products, href: "/produk" },
    {
      label: nav.evEcosystem,
      href: "/ev-garage",
      children: [
        { label: nav.evGarage, href: "/ev-garage" },
        { label: nav.spklu, href: "/spklu" },
      ],
    },
  ];
}
