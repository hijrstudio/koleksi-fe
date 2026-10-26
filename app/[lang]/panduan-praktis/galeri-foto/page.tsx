import { getLocale } from "@/lib/i18n/server";
import { getGalleryAlbums } from "@/services/gallery";
import GalleryList from "./GalleryList";

export default async function GaleriFotoPage() {
  const initialPage = await getGalleryAlbums({ page: 1 }, await getLocale());

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <GalleryList initialPage={initialPage} />

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
