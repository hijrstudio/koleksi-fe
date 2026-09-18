import Image from "next/image";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewAllLink from "@/components/ui/ViewAllLink";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import { kegiatanTerbaru } from "@/data/mockData";

export default function KegiatanTerbaru() {
  return (
    <SectionContainer withGuides withOrnament variant="white">
      <RevealItem>
        <SectionHeader title="Kegiatan Terbaru" />
      </RevealItem>

      <RevealGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {kegiatanTerbaru.map((item) => (
          <RevealItem
            key={item.id}
            className="group flex items-center gap-8"
          >
            <div className="relative h-40 w-[270px] shrink-0 overflow-hidden rounded-2xl">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="270px"
              />
            </div>
            <div>
              <h3 className="max-w-[90%] text-[20px] font-bold leading-6 text-koleksi-navy-dark">
                {item.title}
              </h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm font-normal leading-3.5 text-koleksi-navy-dark/60">
                <Image
                  src="/images/icon-kegiatan.svg"
                  alt=""
                  width={16}
                  height={16}
                />
                {item.date}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGrid>

      <ViewAllLink href="/kegiatan" />
    </SectionContainer>
  );
}
