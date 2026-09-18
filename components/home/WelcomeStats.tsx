import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import { communityStats } from "@/data/mockData";

export default function WelcomeStats() {
  return (
    <SectionContainer withGuides withOrnament centerGuide>
      <div className=" grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: text + stats */}
        <div>
          <RevealItem>
            <p className="font-display uppercase text-2xl leading-8 font-bold text-koleksi-navy">
              Selamat Datang di
            </p>
            <h2 className="max-w-2xl mt-4.5 font-display uppercase text-3xl font-bold leading-14 text-koleksi-navy dark:text-white sm:text-5xl">
              Komunitas Mobil Elektrik Indonesia (KOLEKSI)
            </h2>
          </RevealItem>

          <RevealGrid className="mt-10 grid grid-cols-4 gap-4">
            {communityStats.map((stat, i) => {
              const iconUrl = `/images/icon-${stat.label.toLowerCase()}.svg`;
              return (
                <RevealItem key={stat.label} className="relative">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -left-7 top-12 bottom-0 w-px bg-border-light dark:bg-border-dark"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="block h-8 w-8 bg-[#0A1628] dark:bg-white"
                    style={{
                      maskImage: `url(${iconUrl})`,
                      maskRepeat: "no-repeat",
                      maskSize: "contain",
                      maskPosition: "center",
                      WebkitMaskImage: `url(${iconUrl})`,
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskSize: "contain",
                      WebkitMaskPosition: "center",
                    }}
                  />
                  <div className="mt-4">
                    <p className="font-display text-[32px] leading-8 font-bold text-koleksi-navy dark:text-ink-dark">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-koleksi-navy-dark dark:text-ink-dark">
                      {stat.label}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGrid>

          <RevealItem className="mt-14 flex flex-wrap items-center gap-5">
            <Link
              href="/komunitas"
              className="inline-flex items-center gap-4 rounded-full border border-border-light py-2.5 pl-6 pr-3 text-[20px] leading-8 font-bold text-koleksi-navy-deep transition hover:border-koleksi-navy-deep dark:border-border-dark"
            >
              Lihat Komunitas
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-koleksi-navy-deep text-white">
                <ChevronRight size={24} />
              </span>
            </Link>
            <Link
              href="/daftar"
              className="inline-flex items-center rounded-full bg-koleksi-green px-10 py-2.5 text-[20px] leading-8 font-bold text-koleksi-navy-deep transition hover:bg-koleksi-green-dark"
            >
              Daftar
            </Link>
          </RevealItem>
        </div>

        {/* Right: featured image + caption */}
        <RevealItem>
          <div className="relative aspect-560/314 w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/koleksi-goes-iims.png"
              alt="KOLEKSI Goes to IIMS 2026"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
          <p className="mt-4 text-card-title font-bold">
            KOLEKSI GOES TO IIMS 2026 – TALKSHOW
          </p>
          <p className="mt-2 text-card-caption">
            Tonton di{" "}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              YouTube
            </a>
          </p>
        </RevealItem>
      </div>
    </SectionContainer>
  );
}
