import { getRegulations } from "@/services/guideRegulation";
import RegulationList from "./RegulationList";

export default async function DokumenRegulasiPage() {
  const initialPage = await getRegulations({ page: 1 });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <RegulationList initialPage={initialPage} />

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
