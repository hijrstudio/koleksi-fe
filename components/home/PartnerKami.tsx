import Image from "next/image";
import SectionContainer from "@/components/ui/SectionContainer";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import type { PartnerLogo } from "@/types";
import { getPartners } from "@/services/partner";
import { getDictionary } from "@/lib/i18n/server";

export default async function PartnerKami() {
  const [partnerLogos, t] = await Promise.all([getPartners(), getDictionary()]);

  // Belum ada partner published / API tidak bisa diakses: sembunyikan section.
  if (partnerLogos.length === 0) return null;

  const firstRowCount = Math.ceil(partnerLogos.length / 2);
  const rows = [
    partnerLogos.slice(0, firstRowCount),
    partnerLogos.slice(firstRowCount),
  ];

  return (
    <SectionContainer withGuides withOrnament topDivider variant="white">
      <RevealItem>
        <h2 className="font-display text-center text-2xl font-bold text-koleksi-navy dark:text-ink-dark leading-10 md:text-[32px]">
          {t.home.partners}
        </h2>
      </RevealItem>

      <div className="mt-12 flex flex-col items-center gap-y-8">
        {rows.map((row, i) => (
          <RevealGrid
            key={i}
            className="flex flex-wrap items-center justify-center gap-10 sm:gap-25 sm:space-y-8"
          >
            {row.map((partner) => (
              <RevealItem key={partner.id}>
                {partner.url ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={partner.name}
                  >
                    {renderLogo(partner)}
                  </a>
                ) : (
                  renderLogo(partner)
                )}
              </RevealItem>
            ))}
          </RevealGrid>
        ))}
      </div>
    </SectionContainer>
  );
}

function renderLogo(partner: PartnerLogo) {
  return (
    <Image
      src={partner.logo}
      alt={partner.name}
      width={partner.width}
      height={partner.height}
      className="h-12 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-15"
    />
  );
}
