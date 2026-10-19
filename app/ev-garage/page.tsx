import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RevealGroup } from "@/components/ui/Reveal";
import { getGarageBrands, getGarageVehicles } from "@/services/evGarage";
import type { GaragePage } from "@/types";
import EvGarage from "./EvGarage";

export const metadata: Metadata = {
  title: "EV Garage - KOLEKSI",
  description:
    "Cari jenis dan spesifikasi pengisian daya kendaraan listrik: baterai, AC, DC, dan jangkauan per merek.",
};

const EMPTY_PAGE: GaragePage = { items: [], page: 1, totalPages: 1, total: 0 };

export default async function EvGaragePage() {
  // Halaman pertama tabel (A-Z) & grid logo merek diambil paralel di server.
  const [initialPage, brands] = await Promise.all([
    getGarageVehicles({ sort: "asc", page: 1 }).catch((error) => {
      console.error("[EvGaragePage]", error);
      return null;
    }),
    getGarageBrands(),
  ]);

  return (
    <>
      <Header />
      <main>
        <RevealGroup>
          <EvGarage
            initialPage={initialPage ?? EMPTY_PAGE}
            initialError={initialPage === null}
            brands={brands}
          />
        </RevealGroup>
      </main>
      <Footer />
    </>
  );
}
