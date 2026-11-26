import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { expiredPath } from "@/lib/auth/validation";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getLeaderboard } from "@/services/points";
import LeaderboardView from "./LeaderboardView";

const PATH = "/forum/papan-peringkat";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.forum.leaderboard, robots: { index: false } };
}

/** Papan peringkat XP (khusus member). Kedua periode diambil di server; pindah tab tanpa request lagi. */
export default async function PapanPeringkatPage() {
  const token = await getSessionToken();
  const locale = await getLocale();
  if (!token) redirect(expiredPath(PATH, locale));

  let data;
  try {
    data = await Promise.all([getLeaderboard(token, "month"), getLeaderboard(token, "all")]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(expiredPath(PATH, locale));
    throw error;
  }

  const [month, all] = data;
  return <LeaderboardView boards={{ month, all }} />;
}
