import { getPlaybooks } from "@/services/guidePlaybook";
import { getCurrentMember } from "@/services/memberAuth";
import PlaybookList from "./PlaybookList";

export default async function WebPlaybookPage() {
  const [initialPage, member] = await Promise.all([getPlaybooks({ page: 1 }), getCurrentMember()]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      {/* canDownload hanya menentukan tombol Unduh tampil atau tidak; izin unduh tetap dicek di server */}
      <PlaybookList initialPage={initialPage} canDownload={member !== null} />

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
