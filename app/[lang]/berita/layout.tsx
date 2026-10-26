import { ReactNode, Suspense } from "react";
import Header from "@/components/layout/Header";
import ContentFooter from "@/components/layout/ContentFooter";
import OrnamentStrip from "@/components/layout/OrnamentStrip";
import Sidebar from "./Sidebar";

/** Layout sama dengan Panduan Praktis; hanya sidebar-nya berisi kategori berita. */
export default function BeritaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {/* Sidebar membaca ?tags= (useSearchParams) */}
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <main className="px-6 py-8 lg:ml-[305px] lg:px-10 lg:py-10">
        {children}
        <ContentFooter />
      </main>
      <OrnamentStrip />
    </>
  );
}
