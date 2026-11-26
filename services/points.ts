import "server-only";

import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Leaderboard, LeaderboardPeriod, LeaderboardRow, PointRule } from "@/types";

/** Poin & papan peringkat atas nama member yang login (token dari cookie httpOnly). Tanpa cache. */
function auth(token: string) {
  return { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, revalidate: false as const };
}

export async function getLeaderboard(token: string, period: LeaderboardPeriod): Promise<Leaderboard> {
  const res = await apiFetch<{ data: LeaderboardRow[]; me: Leaderboard["me"]; period: LeaderboardPeriod; rules: PointRule[] }>(
    API_ENDPOINTS.forumLeaderboard,
    { ...auth(token), query: { period } },
  );

  return { period: res.period, rows: res.data, me: res.me, rules: res.rules };
}

export async function postVisit(token: string, path: string): Promise<number> {
  const res = await apiFetch<{ data: { earned: number } }>(API_ENDPOINTS.pointsVisit, {
    ...auth(token), method: "POST", body: JSON.stringify({ path }),
  });
  return res.data.earned;
}

export type ReadTarget = { type: "news" | "article"; slug: string };

export async function postReadStart(token: string, target: ReadTarget): Promise<number> {
  const res = await apiFetch<{ data: { seconds: number } }>(API_ENDPOINTS.pointsReadStart, {
    ...auth(token), method: "POST", body: JSON.stringify(target),
  });
  return res.data.seconds;
}

export async function postReadClaim(token: string, target: ReadTarget): Promise<number> {
  const res = await apiFetch<{ data: { earned: number } }>(API_ENDPOINTS.pointsReadClaim, {
    ...auth(token), method: "POST", body: JSON.stringify(target),
  });
  return res.data.earned;
}
