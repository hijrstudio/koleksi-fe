import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionContainer from "@/components/ui/SectionContainer";
import clsx from "@/lib/clsx";
import { formatRupiahRange } from "@/lib/formatRupiah";
import ProdukCard from "../ProdukCard";
import {
  DEFAULT_SHOPEE_URL,
  DEFAULT_TOKOPEDIA_URL,
  defaultProdukSummary,
  produkList,
  type Produk,
} from "../data";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const produk = produkList.find((p) => p.slug === slug);
  return { title: produk ? `${produk.name} - Produk KOLEKSI` : "Produk - KOLEKSI" };
}

/** "Produk Lainnya": pakai relatedSlugs kalau ada, kalau tidak kategori sama dulu. */
function getRelated(produk: Produk): Produk[] {
  const explicit = (produk.relatedSlugs ?? [])
    .map((slug) => produkList.find((p) => p.slug === slug))
    .filter((p): p is Produk => Boolean(p) && p!.id !== produk.id);
  if (explicit.length > 0) return explicit.slice(0, 3);

  const others = produkList.filter((p) => p.id !== produk.id);
  const sameCategory = others.filter((p) => p.category === produk.category);
  const rest = others.filter((p) => p.category !== produk.category);
  return [...sameCategory, ...rest].slice(0, 3);
}

export default async function ProdukDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const produk = produkList.find((p) => p.slug === slug);

  if (!produk) notFound();

  const images = produk.images?.length ? produk.images : [produk.image];
  const summary = produk.summary ?? defaultProdukSummary;
  const related = getRelated(produk);

  return (
    <>
      <Header />
      <main>
        {/* Tanpa guideline & ornament -- cuma wrapper max-width biasa. */}
        <SectionContainer>
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[570px_minmax(0,600px)] xl:items-start xl:gap-8">
            {/* Kolom kiri: gambar bersusun ke bawah (570x570, radius 10px).
                Di bawah xl jadi galeri geser horizontal. */}
            <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 [scrollbar-width:none] xl:mx-0 xl:flex-col xl:gap-8 xl:overflow-visible xl:px-0 [&::-webkit-scrollbar]:hidden">
              {images.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className={clsx(
                    "relative aspect-square shrink-0 snap-center overflow-hidden rounded-[10px] xl:w-full",
                    images.length > 1 ? "w-[85%] sm:w-[60%]" : "w-full",
                  )}
                >
                  <Image
                    src={src}
                    alt={`${produk.name} - gambar ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 570px, 85vw"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            {/* Kolom kanan (maks 600px) */}
            <div>
              <h1 className="text-[32px] leading-10 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                {produk.name}
              </h1>

              <p
                className={clsx(
                  "mt-5 text-2xl leading-8 font-bold",
                  produk.soldOut
                    ? "text-koleksi-navy-dark/40 dark:text-ink-dark/40"
                    : "text-koleksi-green",
                )}
              >
                {produk.soldOut
                  ? "Stok Habis"
                  : formatRupiahRange(produk.price, produk.priceMax)}
              </p>

              <div className="mt-10 space-y-4 text-[14px] leading-[21px] font-normal text-koleksi-navy-dark/80 dark:text-ink-dark/70">
                {summary.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Beli via marketplace -- disembunyikan kalau stok habis. */}
              {!produk.soldOut && (
                <div className="mt-14">
                  <p className="text-base leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                    Beli Sekarang via
                  </p>
                  <div className="mt-5 flex min-h-[42px] flex-wrap items-center gap-x-6 gap-y-4">
                    <a
                      href={produk.shopeeUrl ?? DEFAULT_SHOPEE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Beli di Shopee"
                      className="transition hover:opacity-80"
                    >
                      <Image
                        src="/images/shopee.png"
                        alt="Shopee"
                        width={190}
                        height={42}
                        className="h-[42px] w-auto"
                      />
                    </a>
                    <a
                      href={produk.tokopediaUrl ?? DEFAULT_TOKOPEDIA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Beli di Tokopedia"
                      className="transition hover:opacity-80"
                    >
                      <Image
                        src="/images/tokopedia.png"
                        alt="Tokopedia"
                        width={145}
                        height={32}
                        className="h-8 w-auto"
                      />
                    </a>
                  </div>
                  <p className="mt-5 text-xs leading-4 text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                    * Harga dapat berubah sewaktu-waktu
                  </p>
                </div>
              )}

              {related.length > 0 && (
                <section className="mt-20">
                  <h2 className="text-2xl leading-8 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                    Produk Lainnya
                  </h2>
                  <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-8">
                    {related.map((item) => (
                      <ProdukCard key={item.id} produk={item} size="sm" />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </SectionContainer>
      </main>
      <Footer />
    </>
  );
}
