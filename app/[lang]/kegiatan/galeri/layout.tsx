import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import ContentFooter from "@/components/layout/ContentFooter";
import OrnamentStrip from "@/components/layout/OrnamentStrip";
import Sidebar from "./Sidebar";

/**
 * Layout galeri kegiatan (/kegiatan/galeri/foto, /kegiatan/galeri/video): sama dengan Panduan Praktis, sidebar
 * berisi jenis galeri. Jenis baru cukup ditambah sebagai sub-route + menu di Sidebar.
 * /kegiatan dan detail kegiatan tetap memakai layout halaman penuh sendiri.
 */
export default function GaleriKegiatanLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="px-6 py-8 lg:ml-[305px] lg:px-10 lg:py-10">
        {children}
        <ContentFooter />
      </main>
      <OrnamentStrip />
    </>
  );
}
