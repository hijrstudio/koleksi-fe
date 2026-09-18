import Image from "next/image";
import Link from "next/link";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewAllLink from "@/components/ui/ViewAllLink";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import { playbookItems } from "@/data/mockData";

export default function PlaybookSection() {
  return (
    <SectionContainer withGuides topDivider variant="white">
      <RevealItem>
        <SectionHeader title="Playbook" />
      </RevealItem>

      <RevealGrid className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {playbookItems.map((item) => (
          <RevealItem
            key={item.id}
            className="group relative overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-270/320 w-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 640px) 22vw, 45vw"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="absolute inset-x-0 top-0 z-10 p-4">
              <p className="text-2xl font-bold leading-8 text-white">
                {item.title}
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 z-10 flex justify-end p-4">
              <Link
                href={item.href}
                className="rounded-full bg-koleksi-amber px-5 py-2 text-base font-bold leading-6 text-koleksi-navy-deep"
              >
                Lihat
              </Link>
            </div>
          </RevealItem>
        ))}
      </RevealGrid>

      <ViewAllLink href="/panduan-praktis/web-playbook" />
    </SectionContainer>
  );
}
