import SectionContainer from "@/components/ui/SectionContainer";
import LogoMarquee from "@/components/ui/LogoMarquee";
import { RevealItem } from "@/components/ui/Reveal";
import { getSponsors } from "@/services/sponsor";
import { getDictionary } from "@/lib/i18n/server";

/** Sponsor dari CMS (urutan sort) — slider logo berjalan, berhenti saat di-hover, klik → website sponsor (tab baru). */
export default async function SponsorSection() {
  const [sponsors, t] = await Promise.all([getSponsors(), getDictionary()]);

  // Belum ada sponsor published / API tidak bisa diakses: sembunyikan section.
  if (sponsors.length === 0) return null;

  return (
    <SectionContainer withGuides withOrnament topDivider variant="white">
      <RevealItem>
        <h2 className="font-display text-center text-2xl font-bold text-koleksi-navy dark:text-ink-dark leading-10 md:text-[32px]">
          {t.home.sponsors}
        </h2>
      </RevealItem>

      <RevealItem className="mt-12">
        <LogoMarquee items={sponsors} />
      </RevealItem>
    </SectionContainer>
  );
}
