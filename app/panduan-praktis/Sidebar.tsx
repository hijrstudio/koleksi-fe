import SectionSidebar from "@/components/layout/SectionSidebar";

const navItems = [
  { label: "Artikel", href: "/panduan-praktis/artikel" },
  { label: "Berita", href: "/panduan-praktis/berita" },
  { label: "Video Edukasi", href: "/panduan-praktis/video-edukasi" },
  { label: "Infografis", href: "/panduan-praktis/infografis" },
  { label: "Galeri Foto", href: "/panduan-praktis/galeri-foto" },
  { label: "Web Playbook", href: "/panduan-praktis/web-playbook" },
  { label: "Dokumen Regulasi", href: "/panduan-praktis/dokumen-regulasi" },
  { label: "Glosarium EV", href: "/panduan-praktis/glosarium-ev" },
  // { label: "Pencarian", href: "/panduan-praktis/pencarian" },
];

export default function Sidebar() {
  return <SectionSidebar items={navItems} />;
}
