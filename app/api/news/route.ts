import { NextResponse, type NextRequest } from "next/server";
import { NEWS_CATEGORIES } from "@/lib/newsCategories";
import { getNews } from "@/services/news";

/**
 * Proxy list berita untuk Client Component (pencarian / filter / sort / paginasi).
 * Browser tidak pernah memegang BACKEND_API_TOKEN: request ke backend dilakukan dari server.
 *
 *   GET /api/news?search=&category=news_release|ev_news|coverage&sort=latest|oldest&page=
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const category = NEWS_CATEGORIES.find((c) => c.value === params.get("category"))?.value ?? null;
  const page = Number(params.get("page"));

  try {
    const result = await getNews({
      search: (params.get("search") ?? "").slice(0, 100),
      category,
      sort: params.get("sort") === "oldest" ? "oldest" : "latest",
      page: Number.isInteger(page) && page > 0 ? page : 1,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/news]", error);
    return NextResponse.json({ message: "Gagal memuat berita." }, { status: 502 });
  }
}
