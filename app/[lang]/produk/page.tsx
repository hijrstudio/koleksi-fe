import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RevealGroup } from "@/components/ui/Reveal";
import { getDictionary } from "@/lib/i18n/server";
import KatalogProduk from "./KatalogProduk";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.products.metaTitle, description: t.products.metaDescription };
}

export default async function ProdukPage() {
  const t = await getDictionary();

  return (
    <>
      <Header />
      <main>
        {/* Banner full width, tinggi 400px (mengecil di layar kecil). */}
        <section className="relative h-[220px] w-full sm:h-[300px] lg:h-[400px]">
          <Image
            src="/images/produk-banner.png"
            alt={t.products.bannerAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </section>

        <RevealGroup>
          <KatalogProduk />
        </RevealGroup>
      </main>
      <Footer />
    </>
  );
}
