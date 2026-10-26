import { getLocale } from "@/lib/i18n/server";
import { newsCategoryFromSlug } from "@/lib/newsCategories";
import { getNews } from "@/services/news";
import BeritaList from "./BeritaList";

/**
 * /berita?tags=news-release|berita-ev|liputan
 * Filter kategori dari ?tags= diterapkan di server, jadi render pertama sudah sesuai filter.
 */
export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string | string[] }>;
}) {
  const { tags } = await searchParams;
  const category = newsCategoryFromSlug(Array.isArray(tags) ? tags[0] : tags);

  const initialPage = await getNews({ category, sort: "latest", page: 1 }, await getLocale());

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10 ">
      {/* key: remount saat ?tags= berubah dari menu, supaya state filter ikut reset */}
      <BeritaList
        key={category ?? "all"}
        initialPage={initialPage}
        initialCategory={category}
      />

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
