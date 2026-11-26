import "server-only";

import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ForumCategory,
  ForumComment,
  ForumDiscussionDetail,
  ForumDiscussionSummary,
  ForumOverview,
  ForumPage,
} from "@/types";

/**
 * Forum — semua request atas nama member yang login (token dari cookie httpOnly, tidak pernah ke browser).
 * Tanpa cache: isi forum berubah terus & berbeda per member (rating saya, diskusi saya).
 */
function auth(token: string) {
  return { headers: { Authorization: `Bearer ${token}` }, revalidate: false as const };
}

interface Paginated<T> {
  data: T[];
  links?: { next: string | null };
  meta?: { current_page: number; last_page?: number };
}

function page<T>(res: Paginated<T>): ForumPage<T> {
  const lastPage = res.meta?.last_page;
  return {
    items: res.data,
    hasMore: lastPage !== undefined ? (res.meta?.current_page ?? 1) < lastPage : Boolean(res.links?.next),
  };
}

export async function getForumCategories(token: string): Promise<ForumCategory[]> {
  return (await apiFetch<{ data: ForumCategory[] }>(API_ENDPOINTS.forumCategories, auth(token))).data;
}

export async function getForumOverview(token: string): Promise<ForumOverview> {
  return (await apiFetch<{ data: ForumOverview }>(API_ENDPOINTS.forumOverview, auth(token))).data;
}

export interface DiscussionQuery {
  search?: string;
  category?: string;
  sort?: "latest" | "oldest";
  page?: number;
}

export async function getForumDiscussions(token: string, q: DiscussionQuery): Promise<ForumPage<ForumDiscussionSummary>> {
  const res = await apiFetch<Paginated<ForumDiscussionSummary>>(API_ENDPOINTS.forumDiscussions, {
    ...auth(token),
    query: { search: q.search || undefined, category: q.category || undefined, sort: q.sort, page: q.page },
  });

  return page(res);
}

export async function getForumDiscussion(token: string, slug: string): Promise<ForumDiscussionDetail> {
  return (await apiFetch<{ data: ForumDiscussionDetail }>(API_ENDPOINTS.forumDiscussion(slug), auth(token))).data;
}

export async function getForumComments(token: string, slug: string, pageNumber = 1): Promise<ForumPage<ForumComment>> {
  return page(await apiFetch<Paginated<ForumComment>>(API_ENDPOINTS.forumComments(slug), { ...auth(token), query: { page: pageNumber } }));
}

export async function createForumDiscussion(token: string, body: FormData): Promise<ForumDiscussionDetail> {
  return (await apiFetch<{ data: ForumDiscussionDetail }>(API_ENDPOINTS.forumDiscussions, {
    ...auth(token), method: "POST", body,
  })).data;
}

export async function postForumComment(token: string, slug: string, body: string, parentId?: number): Promise<ForumComment> {
  return (await apiFetch<{ data: ForumComment }>(API_ENDPOINTS.forumComments(slug), {
    ...auth(token),
    method: "POST",
    headers: { ...auth(token).headers, "Content-Type": "application/json" },
    body: JSON.stringify({ body, parent_id: parentId ?? null }),
  })).data;
}

export async function rateForumDiscussion(token: string, slug: string, rating: number) {
  return (await apiFetch<{ data: { average: number; count: number; mine: number } }>(API_ENDPOINTS.forumRating(slug), {
    ...auth(token),
    method: "PUT",
    headers: { ...auth(token).headers, "Content-Type": "application/json" },
    body: JSON.stringify({ rating }),
  })).data;
}
