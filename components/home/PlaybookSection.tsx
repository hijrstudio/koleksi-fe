import Image from "next/image";
import Link from "@/components/i18n/Link";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewAllLink from "@/components/ui/ViewAllLink";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getPlaybooks } from "@/services/guidePlaybook";

const HOME_LIMIT = 4;

/** 4 Web Playbook terbaru dari CMS. Klik "Lihat" → halaman Web Playbook (PDF dibuka di popup di sana). */
export default async function PlaybookSection() {
  const locale = await getLocale();
  const [items, t] = await Promise.all([
    getPlaybooks({ page: 1 }, locale)
      .then((page) => page.items.slice(0, HOME_LIMIT))
      .catch((error) => {
        console.error("[PlaybookSection]", error);
        return [];
      }),
    getDictionary(locale),
  ]);

  // Belum ada playbook published / API tidak bisa diakses: sembunyikan section.
  if (items.length === 0) return null;

  return (
    <SectionContainer withGuides topDivider variant="white">
      <RevealItem>
        <SectionHeader title={t.home.playbook} />
      </RevealItem>

      <RevealGrid className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {items.map((item) => (
          <RevealItem
            key={item.id}
            className="group relative overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-270/320 w-full bg-koleksi-navy-deep/10">
              {item.cover && (
                <Image
                  src={item.cover}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 640px) 22vw, 45vw"
                />
              )}
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="absolute inset-x-0 top-0 z-10 p-4">
              <p className="text-2xl font-bold leading-8 text-white">
                {item.title}
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 z-10 flex justify-end p-4">
              <Link
                href="/panduan-praktis/web-playbook"
                aria-label={`${t.common.view} ${item.title}`}
                className="rounded-full bg-koleksi-amber px-5 py-2 text-base font-bold leading-6 text-koleksi-navy-deep"
              >
                {t.common.view}
              </Link>
            </div>
          </RevealItem>
        ))}
      </RevealGrid>

      <ViewAllLink href="/panduan-praktis/web-playbook" />
    </SectionContainer>
  );
}
