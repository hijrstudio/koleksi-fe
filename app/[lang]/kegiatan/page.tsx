import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionContainer from "@/components/ui/SectionContainer";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getEventCategories, getEvents } from "@/services/event";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import KalenderKegiatan from "./KalenderKegiatan";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.events.metaTitle, description: t.events.metaDescription };
}

export default async function KegiatanPage() {
  // Render awal: semua kegiatan (tanpa tab aktif), halaman 1.
  const locale = await getLocale();
  const [initialPage, categories] = await Promise.all([
    getEvents({ page: 1 }, locale),
    getEventCategories(locale),
  ]);

  return (
    <>
      <Header />
      <main>
        {/* Banner -- tanpa guideline & ornament, cuma div hijau + logo. */}
        <RevealGroup>
          <SectionContainer variant="muted">
            <RevealItem className="flex items-center justify-center rounded-2xl bg-koleksi-green px-6 py-16 sm:py-20 md:py-30">
              <Image
                src="/images/logo-koleksi.svg"
                alt="KOLEKSI"
                width={350}
                height={150}
                className="h-auto w-55 sm:w-70 lg:w-87.5"
                priority
              />
            </RevealItem>
          </SectionContainer>
        </RevealGroup>

        <RevealGroup>
          <KalenderKegiatan initialPage={initialPage} categories={categories} />
        </RevealGroup>
      </main>
      <Footer />
    </>
  );
}
