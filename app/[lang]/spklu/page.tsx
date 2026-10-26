import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RevealGroup } from "@/components/ui/Reveal";
import { getSpkluBrands, getSpkluOperators } from "@/services/spklu";
import type { SpkluPage } from "@/types";
import { getDictionary } from "@/lib/i18n/server";
import Spklu from "./Spklu";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.spklu.metaTitle, description: t.spklu.metaDescription };
}

const EMPTY_PAGE: SpkluPage = { items: [], page: 1, totalPages: 1, total: 0 };

export default async function SpkluPage() {
  // Halaman pertama (A-Z) & semua brand untuk slider diambil paralel di server.
  const [initialPage, brands] = await Promise.all([
    getSpkluOperators({ sort: "asc", page: 1 }).catch((error) => {
      console.error("[SpkluPage]", error);
      return null;
    }),
    getSpkluBrands(),
  ]);

  return (
    <>
      <Header />
      <main>
        <RevealGroup>
          <Spklu
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
