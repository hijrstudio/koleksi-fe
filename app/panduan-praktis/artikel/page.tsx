import Link from "next/link";
import { Rss } from "lucide-react";
import {
  getArticleCategories,
  getArticles,
  getPopularArticles,
} from "@/services/guideArticle";
import ArticleList from "./ArticleList";

export default async function ArtikelPage() {
  const [initialPage, categories, popularArticles] = await Promise.all([
    getArticles({ sort: "latest", page: 1 }),
    getArticleCategories(),
    getPopularArticles(),
  ]);

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="lg:max-w-[80%] font-display text-[32px] font-bold leading-10 text-koleksi-navy dark:text-ink-dark">
              Panduan Praktis dan Pengetahuan tentang EV
            </h1>
            <p className="mt-6 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/60">
              Informasi seputar kendaraan listrik dan infrastrukturnya.
            </p>
          </div>
          <a
            href="#"
            className="flex w-fit items-center gap-1.5 rounded-full bg-koleksi-navy-deep/[0.0333] px-4 py-2 text-sm font-medium text-koleksi-navy-dark/50 transition hover:text-koleksi-green dark:text-ink-dark/50"
          >
            <Rss size={14} />
            RSS
          </a>
        </div>
        {/* Empty spacer matching the right widget column below, so the
            1fr track here computes to the exact same width as the
            article-list column. */}
        <div aria-hidden="true" className="hidden xl:block" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 md:mt-16 xl:grid-cols-[1fr_270px]">
        {/* Article list */}
        <ArticleList initialPage={initialPage} categories={categories} />

        {/* Right widgets */}
        <aside className="flex flex-col gap-12">
          <div className="relative flex aspect-270/320 w-full flex-col overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#F1F5F9_50%,#3B82F6_75%,#1A3A6B_100%)] p-5">
            <span className="absolute right-4 top-4 rounded-full bg-koleksi-amber px-2.5 py-1 text-[12px] font-bold uppercase text-koleksi-navy-deep">
              NEW
            </span>
            <p className="mt-8 text-[24px] font-bold leading-8 text-koleksi-navy-dark">
              Mini Touring: Jakarta–Bogor
            </p>
            <Link
              href="#"
              className="mt-auto inline-flex w-fit items-center self-end rounded-full bg-koleksi-navy-deep px-5 py-2 text-base font-bold leading-6 text-white transition hover:bg-koleksi-navy"
            >
              Lihat
            </Link>
          </div>

          {popularArticles.length > 0 && (
            <div>
              <h3 className="text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                Terpopuler
              </h3>
              <ul className="mt-8 divide-y divide-border-light dark:divide-border-dark">
                {popularArticles.map((item) => (
                  <li key={item.id} className="py-3 first:pt-0">
                    <Link
                      href={`/panduan-praktis/artikel/${item.slug}`}
                      className="group block"
                    >
                      <p className="text-sm font-semibold leading-[21px] text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                        {item.date}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="mt-3 inline-block text-sm font-medium text-koleksi-navy-dark/60 underline transition hover:text-koleksi-green dark:text-ink-dark/60"
              >
                Lihat Semua
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
