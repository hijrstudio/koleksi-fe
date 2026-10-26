import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import ContentFooter from "@/components/layout/ContentFooter";
import OrnamentStrip from "@/components/layout/OrnamentStrip";
import Sidebar from "./Sidebar";

export default function ForumLayout({ children }: { children: ReactNode }) {
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
