import HeroSliderClient from "@/components/home/HeroSliderClient";
import { getHeroSlides } from "@/services/heroBanner";
import type { HeroSlide } from "@/types";

/** Dipakai kalau belum ada banner published atau API sedang tidak bisa diakses. */
const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: "fallback",
    type: "image",
    src: "/images/banner.png",
    mimeType: "image/png",
    title: "KOLEKSI",
  },
];

export default async function HeroSlider() {
  const slides = await getHeroSlides();

  return (
    <HeroSliderClient slides={slides.length > 0 ? slides : FALLBACK_SLIDES} />
  );
}
