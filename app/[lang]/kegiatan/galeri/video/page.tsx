import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getEventVideos } from "@/services/eventVideo";
import EventVideoList from "./EventVideoList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: `${t.events.videos.title} - KOLEKSI` };
}

export default async function VideoKegiatanPage() {
  const initialPage = await getEventVideos({ page: 1 }, await getLocale());

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <EventVideoList initialPage={initialPage} />

      {/* Spacer selebar kolom widget halaman artikel, supaya lebar konten sama */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
