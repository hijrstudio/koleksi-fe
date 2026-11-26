import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { expiredPath } from "@/lib/auth/validation";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getForumPolls } from "@/services/forumPoll";
import PollingVotingList from "./PollingVotingList";

const PATH = "/forum/polling-voting";

/** Waktu server saat request (dinamis per request, bukan saat build). */
function requestTime(): number {
  return Date.now();
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.forum.sidebar.polls, robots: { index: false } };
}

/** Polling & voting (khusus member). Halaman pertama kedua bagian dirender di server. */
export default async function PollingVotingPage() {
  const token = await getSessionToken();
  const locale = await getLocale();
  if (!token) redirect(expiredPath(PATH, locale));

  let data;
  try {
    data = await Promise.all([
      getForumPolls(token, { type: "voting", page: 1 }),
      getForumPolls(token, { type: "polling", page: 1 }),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(expiredPath(PATH, locale));
    throw error;
  }

  const [voting, polling] = data;
  // Waktu render dikirim ke client supaya "x jam lagi" sama di server & browser
  return <PollingVotingList initialVoting={voting} initialPolling={polling} now={requestTime()} />;
}
