import { getInfographicCategories, getInfographics } from "@/services/guideInfographic";
import InfographicList from "./InfographicList";

export default async function InfografisPage() {
  const [initialPage, categories] = await Promise.all([
    getInfographics({ page: 1 }),
    getInfographicCategories(),
  ]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <InfographicList initialPage={initialPage} categories={categories} />

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
