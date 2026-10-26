"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import clsx from "@/lib/clsx";

import "swiper/css";

/** Durasi geser 1 logo (ms) -- makin besar makin pelan. */
const MARQUEE_SPEED = 3500;

/** Loop Swiper butuh cukup slide; logo yang sedikit diulang sampai minimal segini. */
const MARQUEE_MIN_SLIDES = 12;

export interface MarqueeLogo {
  id: string;
  name: string;
  logo: string;
  /** Link (http/https, divalidasi CMS) — dibuka di tab baru. */
  url: string | null;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Slider logo berjalan pelan & linear terus-menerus (mis. Sponsor di Home); berhenti di tempat saat kursor masuk
 * atau saat fokus keyboard, lanjut lagi saat keluar. Klik logo → link di tab baru.
 * Pengunjung dengan "kurangi animasi" (prefers-reduced-motion) mendapat deretan logo statis.
 */
export default function LogoMarquee({ items, className }: { items: MarqueeLogo[]; className?: string }) {
  const swiperRef = useRef<SwiperType | null>(null);
  const hoveredRef = useRef(false);
  // Server & render pertama: animasi aktif (sama dengan kebanyakan pengunjung) → tidak ada hydration mismatch
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  if (reducedMotion) {
    return (
      <ul className={clsx("flex flex-wrap items-center justify-center gap-x-10 gap-y-6", className)}>
        {items.map((item) => (
          <li key={item.id}>
            <LogoLink item={item} />
          </li>
        ))}
      </ul>
    );
  }

  const repeat = Math.max(1, Math.ceil(MARQUEE_MIN_SLIDES / items.length));
  const slides = Array.from({ length: repeat }, () => items).flat();

  // pauseOnMouseEnter bawaan Swiper menunggu transisi (MARQUEE_SPEED ms) selesai dulu,
  // jadi posisi wrapper dibekukan manual supaya langsung diam.
  const freeze = () => {
    const s = swiperRef.current;
    if (!s || s.destroyed || hoveredRef.current) return;
    hoveredRef.current = true;
    s.autoplay.stop();
    const { m41 } = new DOMMatrixReadOnly(getComputedStyle(s.wrapperEl).transform);
    s.setTransition(0);
    s.setTranslate(m41);
    s.animating = false;
  };

  // Selesaikan sisa jarak ke slide aktif dengan kecepatan yang sama, baru autoplay dijalankan lagi
  // -- tidak ada lonjakan kecepatan.
  const resume = () => {
    const s = swiperRef.current;
    if (!s || s.destroyed || !hoveredRef.current) return;
    hoveredRef.current = false;
    const target = -s.slidesGrid[s.activeIndex];
    const step = (s.slidesSizesGrid[s.activeIndex] ?? 1) + Number(s.params.spaceBetween ?? 0);
    const remaining = Math.abs(target - s.translate);
    if (remaining < 1) {
      s.autoplay.start();
      return;
    }
    s.once("transitionEnd", () => {
      if (!hoveredRef.current) s.autoplay.start();
    });
    s.slideTo(s.activeIndex, (remaining / step) * MARQUEE_SPEED, false);
  };

  return (
    <div
      className={clsx("logo-marquee", className)}
      onPointerEnter={(e) => e.pointerType === "mouse" && freeze()}
      onPointerLeave={(e) => e.pointerType === "mouse" && resume()}
      onFocus={freeze}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resume();
      }}
    >
      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={0}
        loop
        speed={MARQUEE_SPEED}
        allowTouchMove={false}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
      >
        {slides.map((item, i) => (
          // Salinan untuk loop disembunyikan dari pembaca layar & tombol Tab (cukup sekali per logo)
          <SwiperSlide key={`${item.id}-${i}`} className="w-auto!" aria-hidden={i >= items.length || undefined}>
            <LogoLink item={item} hidden={i >= items.length} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function LogoLink({ item, hidden = false }: { item: MarqueeLogo; hidden?: boolean }) {
  const logo = (
    <span className="relative block h-12 w-full sm:h-15">
      <Image
        src={item.logo}
        alt={item.name}
        fill
        className="object-contain opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
        sizes="208px"
      />
    </span>
  );
  const boxClass = "group flex h-20 w-40 items-center justify-center px-4 sm:w-52 sm:px-6";

  return item.url ? (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.name}
      tabIndex={hidden ? -1 : undefined}
      className={clsx(boxClass, "rounded-lg focus-visible:outline-2 focus-visible:outline-koleksi-green")}
    >
      {logo}
    </a>
  ) : (
    <span className={boxClass}>{logo}</span>
  );
}
