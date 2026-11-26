import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import ContentFooter from "@/components/layout/ContentFooter";
import OrnamentStrip from "@/components/layout/OrnamentStrip";
import { getSessionToken } from "@/lib/auth/session";
import { getForumOverview } from "@/services/forum";
import type { ForumOverview } from "@/types";
import Sidebar from "./Sidebar";

/** Forum khusus member (proxy.ts mengarahkan tamu ke /masuk; halaman memvalidasi token lewat requireMember). */
export default async function ForumLayout({ children }: { children: ReactNode }) {
  const token = await getSessionToken();
  let stats: ForumOverview["stats"] | null = null;
  if (token) {
    // Statistik sidebar bukan bagian penting: gagal dimuat → sidebar tanpa angka
    stats = await getForumOverview(token).then((o) => o.stats).catch(() => null);
  }

  return (
    <>
      <Header />
      <Sidebar stats={stats} />
      <main className="px-6 py-8 lg:ml-[305px] lg:px-10 lg:py-10">
        {children}
        <ContentFooter />
      </main>
      <OrnamentStrip />
    </>
  );
}
