import Link from "@/components/i18n/Link";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewAllLink from "@/components/ui/ViewAllLink";
import NewsTag from "@/components/ui/NewsTag";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import { getLatestNews } from "@/services/news";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import type { NewsCard } from "@/types";

export default async function BeritaSection() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const items = await getLatestNews(locale, t.home.newsSlots);

  // Belum ada berita published / API tidak bisa diakses: sembunyikan section.
  if (items.length === 0) return null;

  return (
    <SectionContainer withGuides variant="white">
      <RevealItem>
        <SectionHeader title={t.home.news} />
      </RevealItem>

      <RevealGrid className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <RevealItem
            key={item.id}
            className="rounded-xl border border-border-light transition hover:border-koleksi-green dark:border-border-dark"
          >
            {item.external ? (
              // Berita EV: link ke berita di media lain
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="block h-full p-5">
                {cardBody(item)}
                <span className="sr-only">{t.common.opensInNewTab}</span>
              </a>
            ) : (
              <Link href={item.href ?? "/berita"} className="block h-full p-5">
                {cardBody(item)}
              </Link>
            )}
          </RevealItem>
        ))}
      </RevealGrid>

      <ViewAllLink href="/berita" />
    </SectionContainer>
  );
}

function cardBody(item: NewsCard) {
  return (
    <>
      <NewsTag tag={item.tag} badge={item.badge} />
      <h3 className="mt-5 line-clamp-2 text-xl font-bold leading-6 text-koleksi-navy-dark">
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-[21px] text-koleksi-navy-dark/60">
        {item.date}
      </p>
    </>
  );
}
