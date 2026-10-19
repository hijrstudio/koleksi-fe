import { ApiError, apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import formatDate from "@/lib/formatDate";
import { isNewsBadge } from "@/lib/newsCategories";
import type {
  ApiCollection,
  Locale,
  NewsCard,
  NewsDetail,
  NewsDetailResponse,
  NewsListItem,
  NewsListResponse,
  NewsPage,
  NewsQuery,
  NewsResponse,
} from "@/types";

function toNewsCard(news: NewsResponse, locale: Locale): NewsCard {
  return {
    id: `berita-${news.id}`,
    tag: news.category.label[locale] || news.category.label.id,
    badge: isNewsBadge(news.category.value),
    title: news.title[locale] || news.title.id,
    date: formatDate(news.published_at, locale),
    href: `/panduan-praktis/berita/${news.slug}`,
  };
}

function toListItem(news: NewsResponse, locale: Locale): NewsListItem {
  return {
    id: `berita-${news.id}`,
    slug: news.slug,
    tag: news.category.label[locale] || news.category.label.id,
    badge: isNewsBadge(news.category.value),
    title: news.title[locale] || news.title.id,
    author: news.author ?? null,
    image: news.image,
    date: formatDate(news.published_at, locale, "long"),
  };
}

/**
 * 3 berita published terbaru untuk homepage.
 * Kalau API gagal, kembalikan [] supaya halaman tetap render.
 */
export async function getLatestNews(locale: Locale = "id"): Promise<NewsCard[]> {
  try {
    const { data } = await apiFetch<ApiCollection<NewsResponse>>(API_ENDPOINTS.latestNews, {
      revalidate: 60,
      tags: ["news"],
    });

    return data.map((news) => toNewsCard(news, locale));
  } catch (error) {
    console.error("[getLatestNews]", error);
    return [];
  }
}

/** List berita (5 per halaman) dengan pencarian, filter kategori, dan urutan. */
export async function getNews(query: NewsQuery = {}, locale: Locale = "id"): Promise<NewsPage> {
  const res = await apiFetch<NewsListResponse>(API_ENDPOINTS.news, {
    query: {
      search: query.search?.trim() || undefined,
      category: query.category ?? undefined,
      sort: query.sort ?? "latest",
      page: query.page ?? 1,
    },
    revalidate: 60,
    tags: ["news"],
  });

  return {
    items: res.data.map((news) => toListItem(news, locale)),
    page: res.meta.current_page,
    totalPages: Math.max(1, res.meta.last_page),
  };
}

/** Detail berita + berita terkait (kategori sama). null jika tidak ada / belum published. */
export async function getNewsDetail(slug: string, locale: Locale = "id"): Promise<NewsDetail | null> {
  try {
    const { data, related } = await apiFetch<NewsDetailResponse>(API_ENDPOINTS.newsDetail(slug), {
      revalidate: 60,
      tags: ["news", `news:${slug}`],
    });

    return {
      ...toListItem(data, locale),
      content: data.content[locale] || data.content.id,
      related: related.map((news) => toListItem(news, locale)),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
