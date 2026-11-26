import "server-only";

import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ForumPoll, ForumPollType, NumberedPage } from "@/types";

/**
 * Polling & voting forum atas nama member yang login (token dari cookie httpOnly). Tanpa cache: jumlah suara
 * berubah terus & pilihan berbeda per member.
 */
function auth(token: string) {
  return { headers: { Authorization: `Bearer ${token}` }, revalidate: false as const };
}

export interface PollQuery {
  type: ForumPollType;
  search?: string;
  page?: number;
}

export async function getForumPolls(token: string, q: PollQuery): Promise<NumberedPage<ForumPoll>> {
  const res = await apiFetch<{ data: ForumPoll[]; meta?: { current_page: number; last_page: number } }>(API_ENDPOINTS.forumPolls, {
    ...auth(token),
    query: { type: q.type, search: q.search || undefined, page: q.page },
  });

  return { items: res.data, page: res.meta?.current_page ?? 1, lastPage: Math.max(1, res.meta?.last_page ?? 1) };
}

export async function voteForumPoll(token: string, pollId: number, optionId: number): Promise<ForumPoll> {
  return (await apiFetch<{ data: ForumPoll }>(API_ENDPOINTS.forumPollVote(pollId), {
    ...auth(token),
    method: "POST",
    headers: { ...auth(token).headers, "Content-Type": "application/json" },
    body: JSON.stringify({ option_id: optionId }),
  })).data;
}
