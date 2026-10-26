import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "@/components/i18n/Link";
import { ArrowLeft } from "lucide-react";
import clsx from "@/lib/clsx";
import ContentActions from "@/components/ui/ContentActions";
import RichText from "@/components/ui/RichText";
import { getArticleDetail } from "@/services/guideArticle";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import ArticleViewTracker from "../ArticleViewTracker";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleDetail(slug, await getLocale());

  return article ? { title: `${article.title} - KOLEKSI` } : {};
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const [article, t] = await Promise.all([getArticleDetail(slug, locale), getDictionary(locale)]);

  if (!article) notFound();

  return (
    <div>
      <ArticleViewTracker slug={article.slug} />

      <Link
        href="/panduan-praktis/artikel"
        aria-label={t.common.back}
        className="flex h-10 w-10 items-center justify-center rounded-full text-koleksi-navy-dark transition hover:bg-koleksi-navy-deep/5 dark:text-ink-dark"
      >
        <ArrowLeft size={24} />
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 xl:grid-cols-[1fr_270px] xl:items-start xl:gap-10">
        <div>
          {article.image && (
            <div className="relative aspect-2/1 w-full overflow-hidden rounded-2xl">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 730px, 100vw"
                preload
              />
            </div>
          )}

          <h1 className="mt-8 text-[32px] font-bold leading-10 text-koleksi-navy-dark dark:text-ink-dark">
            {article.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {article.author && (
              <p className="text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/60">
                {t.common.by}: {article.author}
              </p>
            )}
            <span
              className={clsx(
                "inline-flex w-fit items-center rounded-full px-3 py-1 text-[12px] leading-3 font-semibold text-white",
                article.category.color,
              )}
            >
              {article.category.name}
            </span>
          </div>

          <RichText
            html={article.content}
            className="mt-8 space-y-4 text-justify text-[14px] leading-[21px] text-koleksi-navy-dark/80 dark:text-ink-dark/70 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-koleksi-navy-dark [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-koleksi-navy-dark [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl"
          />

          <div className="mt-8 h-px w-full bg-koleksi-navy-dark/10" />
          {/* Aksi artikel -- mobile only, di atas Artikel Terkait */}
          <ContentActions className="mt-8 md:hidden" />

          {/* Related articles */}
          {article.related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
                {t.guide.articles.related}
              </h2>
              <div className="mt-6 divide-y divide-border-light dark:divide-border-dark">
                {article.related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/panduan-praktis/artikel/${item.slug}`}
                    className="group flex gap-4 py-5 first:pt-0"
                  >
                    <div className="relative aspect-270/183 w-[160px] shrink-0 overflow-hidden rounded-xl bg-koleksi-navy-dark/10 sm:w-[200px] lg:w-[270px]">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="270px"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] leading-3 text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                        {item.date}
                      </p>
                      <h3 className="mt-2 text-[20px] font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                        {item.title}
                      </h3>
                      {item.author && (
                        <p className="mt-2 text-[14px] leading-[14px] text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                          {t.common.by}: {item.author}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right widget */}
        <aside className="hidden md:block">
          <ContentActions />
        </aside>
      </div>
    </div>
  );
}
