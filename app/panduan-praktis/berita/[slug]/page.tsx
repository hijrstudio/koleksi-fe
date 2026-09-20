import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewsTag from "@/components/ui/NewsTag";
import ContentActions from "../../ContentActions";
import { beritaItems } from "../data";

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const berita = beritaItems.find((b) => b.slug === slug);

  if (!berita) notFound();

  const relatedBerita = beritaItems
    .filter((b) => b.id !== berita.id)
    .slice(0, 3);

  return (
    <div>
      <Link
        href="/panduan-praktis/berita"
        aria-label="Kembali"
        className="flex h-10 w-10 items-center justify-center rounded-full text-koleksi-navy-dark transition hover:bg-koleksi-navy-deep/5 dark:text-ink-dark"
      >
        <ArrowLeft size={24} />
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 xl:grid-cols-[1fr_270px] xl:items-start xl:gap-10">
        <div>
          <div className="relative aspect-2/1 w-full overflow-hidden rounded-2xl">
            <Image
              src={berita.image}
              alt={berita.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 730px, 100vw"
              priority
            />
          </div>

          <h1 className="mt-8 text-[32px] font-bold leading-10 text-koleksi-navy-dark dark:text-ink-dark">
            {berita.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/60">
              Oleh: {berita.author}
            </p>
            <NewsTag tag={berita.tag} />
          </div>

          <div className="mt-8 space-y-4 text-justify text-[14px] leading-[21px] text-koleksi-navy-dark/80 dark:text-ink-dark/70">
            {berita.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 h-px w-full bg-koleksi-navy-dark/10" />

          {/* Aksi berita -- mobile only, di atas Berita Terkait */}
          <ContentActions className="mt-8 md:hidden" />

          {/* Related berita */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
              Berita Terkait
            </h2>
            <div className="mt-6 divide-y divide-border-light dark:divide-border-dark">
              {relatedBerita.map((item) => (
                <Link
                  key={item.id}
                  href={`/panduan-praktis/berita/${item.slug}`}
                  className="group flex gap-4 py-5 first:pt-0"
                >
                  <div className="relative aspect-270/183 w-[160px] shrink-0 overflow-hidden rounded-xl sm:w-[200px] lg:w-[270px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="270px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] leading-3 text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                      {item.date}
                    </p>
                    <h3 className="mt-2 text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[14px] text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                      Oleh: {item.author}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right widget */}
        <aside className="hidden md:block">
          <ContentActions />
        </aside>
      </div>
    </div>
  );
}
