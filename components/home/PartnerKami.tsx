import Image from "next/image";
import SectionContainer from "@/components/ui/SectionContainer";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import { partnerLogos } from "@/data/mockData";

export default function PartnerKami() {
  const firstRowCount = Math.ceil(partnerLogos.length / 2);
  const rows = [
    partnerLogos.slice(0, firstRowCount),
    partnerLogos.slice(firstRowCount),
  ];

  return (
    <SectionContainer withGuides withOrnament topDivider variant="white">
      <RevealItem>
        <h2 className="font-display text-center text-2xl font-bold text-koleksi-navy dark:text-ink-dark leading-10 sm:text-[32px]">
          Partner Kami
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
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  className="h-12 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-15"
                />
              </RevealItem>
            ))}
          </RevealGrid>
        ))}
      </div>
    </SectionContainer>
  );
}
