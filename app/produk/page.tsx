import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RevealGroup } from "@/components/ui/Reveal";
import KatalogProduk from "./KatalogProduk";

export const metadata: Metadata = {
  title: "Produk - KOLEKSI",
  description:
    "Produk KOLEKSI: mobil listrik (EV), aksesoris, dan charger untuk komunitas mobil elektrik Indonesia.",
};

export default function ProdukPage() {
  return (
    <>
      <Header />
      <main>
        {/* Banner full width, tinggi 400px (mengecil di layar kecil). */}
        <section className="relative h-[220px] w-full sm:h-[300px] lg:h-[400px]">
          <Image
            src="/images/produk-banner.png"
            alt="Produk KOLEKSI"
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
