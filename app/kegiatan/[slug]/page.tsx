import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bookmark, Share } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionContainer from "@/components/ui/SectionContainer";
import {
  DEFAULT_MAP_QUERY,
  defaultKegiatanContent,
  defaultRegistrationNotes,
  kegiatanList,
} from "../data";

export default async function KegiatanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = kegiatanList.find((k) => k.slug === slug);

  if (!item) notFound();

  const content = item.content ?? defaultKegiatanContent;
  const registrationNotes = item.registrationNotes ?? defaultRegistrationNotes;
  const mapQuery = item.mapQuery ?? DEFAULT_MAP_QUERY;

  // Kegiatan terkait: kategori sama, kecualikan diri sendiri, maks 4.
  // Kalau kurang dari 4, penuhi dengan kegiatan lain di luar kategori itu.
  const sameCategory = kegiatanList.filter(
    (k) => k.id !== item.id && k.category === item.category,
  );
  const others = kegiatanList.filter(
    (k) => k.id !== item.id && k.category !== item.category,
  );
  const relatedKegiatan = [...sameCategory, ...others].slice(0, 4);

  return (
    <>
      <Header />
      <main>
        {/* Tanpa guideline & ornament -- cuma wrapper max-width biasa. */}
        <SectionContainer>
          <Link
            href="/kegiatan"
            aria-label="Kembali"
            className="flex h-10 w-10 items-center justify-center rounded-full text-koleksi-navy-dark transition hover:bg-koleksi-navy-deep/5 dark:text-ink-dark"
          >
            <ArrowLeft size={24} />
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-10 xl:grid-cols-[1fr_370px] xl:items-start xl:gap-10">
            <div>
              <div className="relative aspect-2/1 w-full overflow-hidden rounded-2xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 630px, 100vw"
                  priority
                />
              </div>

              <h1 className="mt-8 text-[32px] font-bold leading-10 text-koleksi-navy-dark dark:text-ink-dark">
                {item.title}
              </h1>

              <p className="mt-3 flex items-center gap-1.5 text-sm font-normal leading-3.5 text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                <Image
                  src="/images/icon-kegiatan.svg"
                  alt=""
                  width={16}
                  height={16}
                />
                {item.date}
              </p>

              <div className="mt-8 space-y-4 text-justify text-[14px] leading-[21px] text-koleksi-navy-dark/80 dark:text-ink-dark/70">
                {content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Waktu & Lokasi */}
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                    Waktu
                  </h3>
                  <p className="mt-2 text-sm text-koleksi-navy-dark/70 dark:text-ink-dark/60">
                    {item.timeRange ?? item.date}
                  </p>
                </div>
                {item.location && (
                  <div>
                    <h3 className="text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                      Lokasi
                    </h3>
                    <p className="mt-2 text-sm font-medium text-koleksi-green underline">
                      {item.location}
                    </p>
                  </div>
                )}
              </div>

              {/* Peta -- dummy, titik koordinat bukan lokasi sebenarnya. */}
              <div className="mt-6 h-[280px] w-full overflow-hidden rounded-2xl border border-border-light sm:h-[360px] dark:border-border-dark">
                <iframe
                  title={`Peta lokasi: ${item.location ?? item.title}`}
                  src={`https://www.google.com/maps?q=${mapQuery}&z=12&output=embed`}
                  className="h-full w-full dark:invert dark:grayscale"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right widget -- tanpa guideline & ornament. */}
            <aside className="flex flex-col gap-10">
              <div className="rounded-[10px] bg-koleksi-navy-dark/[0.0333] p-5 dark:bg-white/5">
                <h2 className="text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                  Pendaftaran
                </h2>
                <ul className="mt-4 space-y-3">
                  {registrationNotes.map((note, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm leading-5 text-koleksi-navy-dark/70 dark:text-ink-dark/60"
                    >
                      <span aria-hidden="true" className="shrink-0">
                        •
                      </span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={item.registrationHref ?? "#"}
                  target={item.registrationHref ? "_blank" : undefined}
                  rel={item.registrationHref ? "noopener noreferrer" : undefined}
                  className="mt-6 flex w-fit items-center justify-center rounded-full bg-koleksi-navy-deep px-6 py-2.5 text-sm font-bold text-white transition hover:bg-koleksi-navy"
                >
                  Daftar Sekarang
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full bg-koleksi-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-koleksi-green-dark"
                >
                  <Bookmark size={16} />
                  Simpan
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-border-light px-5 py-2.5 text-sm font-bold text-koleksi-navy-dark transition hover:border-koleksi-navy-deep dark:border-border-dark dark:text-ink-dark"
                >
                  <Share size={16} />
                  Bagikan
                </button>
              </div>

              <div>
                <h2 className="text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                  Kegiatan Terkait
                </h2>
                <div className="mt-6 divide-y divide-border-light dark:divide-border-dark">
                  {relatedKegiatan.map((k) => (
                    <Link
                      key={k.id}
                      href={`/kegiatan/${k.slug}`}
                      className="group flex gap-3 py-4 first:pt-0"
                    >
                      <div className="relative aspect-170/100 w-24 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={k.image}
                          alt={k.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="96px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-bold leading-5 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                          {k.title}
                        </p>
                        <p className="mt-1 text-xs text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                          {k.date}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </SectionContainer>
      </main>
      <Footer />
    </>
  );
}
