import PanduanPraktisClient from "@/components/home/PanduanPraktisClient";
import { getLatestGuides } from "@/services/guide";
import { getLocale } from "@/lib/i18n/server";

/** Server Component: fetch panduan praktis terbaru dari API, lalu render slider (client). */
export default async function PanduanPraktis() {
  const items = await getLatestGuides(await getLocale());

  // Belum ada konten published / API tidak bisa diakses: sembunyikan section.
  if (items.length === 0) return null;

  return <PanduanPraktisClient items={items} />;
}
