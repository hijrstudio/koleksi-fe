import { getVideoCategories, getVideos } from "@/services/guideVideo";
import VideoList from "./VideoList";

export default async function VideoEdukasiPage() {
  const [initialPage, categories] = await Promise.all([
    getVideos({ page: 1 }),
    getVideoCategories(),
  ]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10 ">
      <VideoList initialPage={initialPage} categories={categories} />

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
