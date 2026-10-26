import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RevealGroup } from "@/components/ui/Reveal";
import { getGarageBrands, getGarageVehicles } from "@/services/evGarage";
import type { GaragePage } from "@/types";
import { getDictionary } from "@/lib/i18n/server";
import EvGarage from "./EvGarage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.evGarage.metaTitle, description: t.evGarage.metaDescription };
}

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
