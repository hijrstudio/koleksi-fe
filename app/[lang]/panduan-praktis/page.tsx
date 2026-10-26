import { localizedRedirect } from "@/lib/i18n/server";

export default async function PanduanPraktisIndexPage() {
  await localizedRedirect("/panduan-praktis/artikel");
}
