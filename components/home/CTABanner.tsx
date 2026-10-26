import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import { getDictionary } from "@/lib/i18n/server";

export default async function CTABanner() {
  const t = await getDictionary();

  return (
    <section className="bg-[linear-gradient(180deg,#F1F5F9_50%,#3B82F6_75%,#1A3A6B_100%)]">
      <RevealGrid
        className="mx-auto grid  grid-cols-1 gap-6  py-14 sm:grid-cols-2"
        style={{ maxWidth: "var(--content-max-w)" }}
      >
        {/* Left: white card */}
        <RevealItem className="flex flex-col justify-between rounded-2xl bg-surface-light p-8 shadow-sm gap-16">
          <p className="max-w-[80%] text-[32px] leading-10 font-display font-bold text-koleksi-navy">
            {t.home.cta.shopTitle}
          </p>
          <div className="mt-8 flex items-center justify-between">
            <div className="relative h-[70px] w-32.5">
              <Image
                src="/images/logo-koleksi.svg"
                alt="KOLEKSI"
                fill
                className="object-contain object-left"
                sizes="112px"
              />
            </div>
            <LinkButton href="/produk" variant="outline">
              {t.home.cta.viewProducts}
            </LinkButton>
          </div>
        </RevealItem>

        {/* Right: green card, CTA button pinned to the right */}
        <RevealItem className="flex flex-col justify-between rounded-2xl bg-koleksi-green p-8 text-white">
          <p className="max-w-[80%] text-[32px] leading-10 font-display font-bold">
            {t.home.cta.joinTitle}
          </p>
          <div className="mt-8 flex justify-end">
            <LinkButton href="/daftar" variant="dark">
              {t.common.register}
            </LinkButton>
          </div>
        </RevealItem>
      </RevealGrid>
    </section>
  );
}
