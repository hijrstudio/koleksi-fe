"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewAllLink from "@/components/ui/ViewAllLink";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import clsx from "@/lib/clsx";
import { panduanPraktisItems } from "@/data/mockData";

import "swiper/css";

export default function PanduanPraktis() {
  const swiperRef = useRef<SwiperType | null>(null);
  const bleedRef = useRef<HTMLDivElement | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [bleedWidth, setBleedWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    function updateBleedWidth() {
      if (bleedRef.current) {
        const left = bleedRef.current.getBoundingClientRect().left;
        setBleedWidth(document.documentElement.clientWidth - left);
      }
    }
    updateBleedWidth();
    window.addEventListener("resize", updateBleedWidth);
    return () => window.removeEventListener("resize", updateBleedWidth);
  }, []);

  return (
    <SectionContainer withGuides topDivider topDividerCenter variant="white">
      <RevealItem>
        <SectionHeader
          title="Panduan Praktis"
          showArrows
          prevDisabled={isBeginning}
          nextDisabled={isEnd}
          onPrev={() => swiperRef.current?.slidePrev()}
          onNext={() => swiperRef.current?.slideNext()}
        />
      </RevealItem>

      <div
        ref={bleedRef}
        style={bleedWidth ? { width: bleedWidth } : undefined}
      >
        <RevealGrid>
          <Swiper
            slidesPerView="auto"
            spaceBetween={32}
            onSwiper={(s) => {
              swiperRef.current = s;
              setIsBeginning(s.isBeginning);
              setIsEnd(s.isEnd);
            }}
            onSlideChange={(s) => {
              setIsBeginning(s.isBeginning);
              setIsEnd(s.isEnd);
            }}
          >
            {panduanPraktisItems.map((item) => (
              <SwiperSlide key={item.id} className="w-auto!">
                <RevealItem className="flex w-[min(88vw,560px)] gap-6 sm:w-140">
                  <div className="relative h-40 w-[270px] shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="270px"
                    />
                    {item.isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <Play
                          size={28}
                          className="fill-white text-white drop-shadow"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={clsx(
                        "inline-flex w-fit items-center rounded-full px-3.5 py-2 text-[12px] leading-3 font-semibold text-white",
                        item.tagColor === "artikel"
                          ? "bg-badge-artikel"
                          : "bg-badge-video",
                      )}
                    >
                      {item.tag}
                    </span>
                    <h3 className="text-card-title mt-3 font-bold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-3.5 text-koleksi-navy-dark/60">
                      Oleh: {item.author}
                    </p>
                  </div>
                </RevealItem>
              </SwiperSlide>
            ))}
          </Swiper>
        </RevealGrid>
      </div>

      <ViewAllLink href="/panduan-praktis" />
    </SectionContainer>
  );
}
