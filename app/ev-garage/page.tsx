import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RevealGroup } from "@/components/ui/Reveal";
import EvGarage from "./EvGarage";

export const metadata: Metadata = {
  title: "EV Garage - KOLEKSI",
  description:
    "Cari jenis dan spesifikasi pengisian daya kendaraan listrik: baterai, AC, DC, dan jangkauan per merek.",
};

export default function EvGaragePage() {
  return (
    <>
      <Header />
      <main>
        <RevealGroup>
          <EvGarage />
        </RevealGroup>
      </main>
      <Footer />
    </>
  );
}
