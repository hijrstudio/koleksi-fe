import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "./Sidebar";
import ContentFooter from "./ContentFooter";
import OrnamentStrip from "./OrnamentStrip";

export default function PanduanPraktisLayout({
  children,
}: {
  children: ReactNode;
}) {
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
