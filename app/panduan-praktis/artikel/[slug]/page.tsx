import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import clsx from "@/lib/clsx";
import { articles, categoryColor } from "../data";

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) notFound();

  const relatedArticles = articles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div>
      <Link
        href="/panduan-praktis/artikel"
        aria-label="Kembali"
        className="flex h-10 w-10 items-center justify-center rounded-full text-koleksi-navy-dark transition hover:bg-koleksi-navy-deep/5 dark:text-ink-dark"
      >
        <ArrowLeft size={24} />
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 xl:grid-cols-[1fr_270px] xl:items-start xl:gap-10">
        <div>
          <div className="relative aspect-2/1 w-full overflow-hidden rounded-2xl">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 730px, 100vw"
              priority
            />
          </div>

          <h1 className="mt-8 text-[28px] font-bold leading-9 text-koleksi-navy-dark dark:text-ink-dark sm:text-[32px] sm:leading-10">
            {article.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/60">
              Oleh: {article.author}
            </p>
            <span
              className={clsx(
                "inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] leading-3 font-semibold text-white",
                categoryColor[article.category],
              )}
            >
              {article.category}
            </span>
          </div>

          <div className="mt-8 space-y-4 text-justify text-[14px] leading-[21px] text-koleksi-navy-dark/80 dark:text-ink-dark/70">
            {article.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 h-px w-full bg-koleksi-navy-dark/10" />

          {/* Related articles */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
              Artikel Terkait
            </h2>
            <div className="mt-6 divide-y divide-border-light dark:divide-border-dark">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/panduan-praktis/artikel/${item.slug}`}
                  className="group flex gap-4 py-5 first:pt-0"
                >
                  <div className="relative aspect-270/183 w-[130px] shrink-0 overflow-hidden rounded-xl sm:w-[200px] lg:w-[270px]">
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
        <aside className="flex flex-col gap-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-koleksi-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-koleksi-green-dark"
          >
            <Bookmark size={16} />
            Simpan
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border-light px-5 py-2.5 text-sm font-bold text-koleksi-navy-dark transition hover:border-koleksi-navy-deep dark:border-border-dark dark:text-ink-dark"
          >
            <Share2 size={16} />
            Bagikan
          </button>
        </aside>
      </div>
    </div>
  );
}
