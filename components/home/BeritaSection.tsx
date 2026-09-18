import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewAllLink from "@/components/ui/ViewAllLink";
import NewsTag from "@/components/ui/NewsTag";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import { beritaItems } from "@/data/mockData";

export default function BeritaSection() {
  return (
    <SectionContainer withGuides variant="white">
      <RevealItem>
        <SectionHeader title="Berita" />
      </RevealItem>

      <RevealGrid className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {beritaItems.map((item) => (
          <RevealItem
            key={item.id}
            className="rounded-xl border border-border-light p-5 transition hover:border-koleksi-green dark:border-border-dark"
          >
            <NewsTag tag={item.tag} />
            <h3 className="mt-5 text-xl font-bold leading-6 text-koleksi-navy-dark">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-[21px] text-koleksi-navy-dark/60">
              {item.date}
            </p>
          </RevealItem>
        ))}
      </RevealGrid>

      <ViewAllLink href="/berita" />
    </SectionContainer>
  );
}
