import Link from "@/components/i18n/Link";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewAllLink from "@/components/ui/ViewAllLink";
import NewsTag from "@/components/ui/NewsTag";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import { getLatestNews } from "@/services/news";
import { getDictionary, getLocale } from "@/lib/i18n/server";

export default async function BeritaSection() {
  const locale = await getLocale();
  const [items, t] = await Promise.all([getLatestNews(locale), getDictionary(locale)]);

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
            <Link href={item.href ?? "/panduan-praktis/berita"} className="block h-full p-5">
              <NewsTag tag={item.tag} badge={item.badge} />
              <h3 className="mt-5 line-clamp-2 text-xl font-bold leading-6 text-koleksi-navy-dark">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-[21px] text-koleksi-navy-dark/60">
                {item.date}
              </p>
            </Link>
          </RevealItem>
        ))}
      </RevealGrid>

      <ViewAllLink href="/panduan-praktis/berita" />
    </SectionContainer>
  );
}
