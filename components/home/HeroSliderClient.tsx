"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { HeroSlide } from "@/types";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroSliderClient({ slides }: { slides: HeroSlide[] }) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="relative bg-koleksi-navy-dark">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        onSwiper={(s) => (swiperRef.current = s)}
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative aspect-16/6 w-full">
              {slide.type === "video" ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={index === 0 ? "auto" : "metadata"}
                  aria-label={slide.title}
                >
                  <source src={slide.src} type={slide.mimeType} />
                </video>
              ) : (
                <Image
                  src={slide.src}
                  alt={slide.title || "Banner"}
                  fill
                  preload={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Prev/Next arrows: plain icons (no border/circle), vertically centered
          across the full hero height, flush near the viewport edges. */}
      <button
        type="button"
        aria-label="Slide sebelumnya"
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute inset-y-0 left-2 z-10 flex items-center px-2 text-white/80 transition hover:text-white sm:left-4"
      >
        <ChevronLeft size={28} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Slide berikutnya"
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute inset-y-0 right-2 z-10 flex items-center px-2 text-white/80 transition hover:text-white sm:right-4"
      >
        <ChevronRight size={28} strokeWidth={1.75} />
      </button>

      {/* Pagination dots: centered, bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex w-full justify-center sm:bottom-9">
        <div className="hero-pagination pointer-events-auto flex items-center justify-center gap-0" />
      </div>
    </section>
  );
}
