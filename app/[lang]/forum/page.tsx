import { localizedRedirect } from "@/lib/i18n/server";

export default async function ForumIndexPage() {
  await localizedRedirect("/forum/diskusi");
}
