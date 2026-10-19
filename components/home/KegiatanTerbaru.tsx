import Image from "next/image";
import Link from "next/link";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewAllLink from "@/components/ui/ViewAllLink";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import { getLatestEvents } from "@/services/event";

export default async function KegiatanTerbaru() {
  const items = await getLatestEvents();

  // Belum ada kegiatan published / API tidak bisa diakses: sembunyikan section.
  if (items.length === 0) return null;

  return (
    <SectionContainer withGuides withOrnament variant="white">
      <RevealItem>
        <SectionHeader title="Kegiatan Terbaru" />
      </RevealItem>

      <RevealGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <RevealItem key={item.id}>
            <Link
              href={item.href ?? "/kegiatan"}
              className="group flex items-center gap-8"
            >
              <div className="relative h-40 w-[270px] shrink-0 overflow-hidden rounded-2xl bg-koleksi-navy-dark/10">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="270px"
                  />
                )}
              </div>
              <div>
                <h3 className="max-w-[90%] text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green">
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
            </Link>
          </RevealItem>
        ))}
      </RevealGrid>

      <ViewAllLink href="/kegiatan" />
    </SectionContainer>
  );
}
