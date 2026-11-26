import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { expiredPath } from "@/lib/auth/validation";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getDirectoryCities, getDirectoryMembers } from "@/services/memberDirectory";
import DirectoryList from "./DirectoryList";

const PATH = "/forum/direktori-anggota";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.forum.directory, robots: { index: false } };
}

/** Direktori anggota (khusus member). Halaman pertama & daftar kota dirender di server. */
export default async function DirektoriAnggotaPage() {
  const token = await getSessionToken();
  const locale = await getLocale();
  if (!token) redirect(expiredPath(PATH, locale));

  let data;
  try {
    data = await Promise.all([getDirectoryMembers(token, { page: 1 }), getDirectoryCities(token)]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(expiredPath(PATH, locale));
    throw error;
  }

  const [firstPage, cities] = data;
  return <DirectoryList initialPage={firstPage} cities={cities} />;
}
