import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/auth/session";
import { expiredPath } from "@/lib/auth/validation";
import { ApiError } from "@/lib/api/client";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getForumCategories, getForumDiscussions, getForumOverview } from "@/services/forum";
import DiskusiList from "./DiskusiList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: `${t.forum.title}`, robots: { index: false } };
}

/** Daftar diskusi (khusus member). Halaman pertama dirender di server; cari/filter/muat lagi lewat /api/forum. */
export default async function DiskusiPage() {
  const token = await getSessionToken();
  const locale = await getLocale();
  if (!token) redirect(expiredPath("/forum/diskusi", locale));

  let data;
  try {
    data = await Promise.all([
      getForumCategories(token),
      getForumOverview(token),
      getForumDiscussions(token, { sort: "latest", page: 1 }),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(expiredPath("/forum/diskusi", locale));
    throw error;
  }

  const [categories, overview, firstPage] = data;
  return <DiskusiList categories={categories} overview={overview} initialPage={firstPage} />;
}
