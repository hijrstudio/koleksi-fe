import { ApiError, apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import formatDate from "@/lib/formatDate";
import type {
  ApiCollection,
  ArticleCardResponse,
  ArticleCategory,
  ArticleDetail,
  ArticleDetailResponse,
  ArticleListItem,
  ArticleListResponse,
  ArticlePage,
  ArticleQuery,
  GuideCategoryResponse,
  Locale,
  PopularArticle,
  PopularArticleResponse,
} from "@/types";

/** Warna badge kategori, dipilih tetap per id kategori (kategori dibuat dinamis di CMS). */
const CATEGORY_COLORS = [
  "bg-badge-artikel",
  "bg-fuchsia-500",
  "bg-sky-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
];

function toCategory(category: GuideCategoryResponse, locale: Locale): ArticleCategory {
  return {
    id: category.id,
    name: category.name[locale] || category.name.id,
    color: CATEGORY_COLORS[category.id % CATEGORY_COLORS.length],
  };
}

function toListItem(article: ArticleCardResponse, locale: Locale): ArticleListItem {
  return {
    id: `artikel-${article.id}`,
    slug: article.slug,
    title: article.title[locale] || article.title.id,
    author: article.author,
    image: article.image,
    category: toCategory(article.category, locale),
    date: formatDate(article.published_at, locale),
  };
}

/** List artikel (5 per halaman) dengan pencarian, filter kategori, dan urutan. */
export async function getArticles(query: ArticleQuery = {}, locale: Locale = "id"): Promise<ArticlePage> {
  const res = await apiFetch<ArticleListResponse>(API_ENDPOINTS.articles, {
    query: {
      search: query.search?.trim() || undefined,
      category: query.category ?? undefined,
      sort: query.sort ?? "latest",
      page: query.page ?? 1,
    },
    revalidate: 60,
    tags: ["articles"],
  });

  return {
    items: res.data.map((article) => toListItem(article, locale)),
    page: res.meta.current_page,
    hasMore: res.meta.has_more,
  };
}

export async function getArticleCategories(locale: Locale = "id"): Promise<ArticleCategory[]> {
  const { data } = await apiFetch<ApiCollection<GuideCategoryResponse>>(API_ENDPOINTS.articleCategories, {
    revalidate: 300,
    tags: ["articles"],
  });

  return data.map((category) => toCategory(category, locale));
}

export async function getPopularArticles(locale: Locale = "id"): Promise<PopularArticle[]> {
  const { data } = await apiFetch<ApiCollection<PopularArticleResponse>>(API_ENDPOINTS.popularArticles, {
    revalidate: 300,
    tags: ["articles"],
  });

  return data.map((article) => ({
    id: `populer-${article.id}`,
    slug: article.slug,
    title: article.title[locale] || article.title.id,
    date: formatDate(article.published_at, locale, "long"),
  }));
}

/** Detail artikel + artikel terkait. null jika tidak ada / belum published. */
export async function getArticleDetail(slug: string, locale: Locale = "id"): Promise<ArticleDetail | null> {
  try {
    const { data, related } = await apiFetch<ArticleDetailResponse>(API_ENDPOINTS.article(slug), {
      revalidate: 60,
      tags: ["articles", `article:${slug}`],
    });

    return {
      ...toListItem(data, locale),
      content: data.content[locale] || data.content.id,
      related: related.map((article) => toListItem(article, locale)),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** Tambah 1 view artikel (dipanggil dari route handler saat halaman detail dibuka). */
export async function trackArticleView(slug: string): Promise<number | null> {
  try {
    const { data } = await apiFetch<{ data: { views: number } }>(API_ENDPOINTS.articleView(slug), {
      method: "PUT",
      revalidate: false,
    });
    return data.views;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
