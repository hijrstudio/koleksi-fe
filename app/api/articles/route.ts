import { NextResponse, type NextRequest } from "next/server";
import { getArticles } from "@/services/guideArticle";
import type { ArticleSort } from "@/types";

/**
 * Proxy list artikel untuk Client Component (pencarian / filter / muat lebih banyak).
 * Browser tidak pernah memegang BACKEND_API_TOKEN: request ke backend dilakukan dari server.
 *
 *   GET /api/articles?search=&category=&sort=latest|oldest&page=
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const category = Number(params.get("category"));
  const page = Number(params.get("page"));
  const sort: ArticleSort = params.get("sort") === "oldest" ? "oldest" : "latest";

  try {
    const result = await getArticles({
      search: (params.get("search") ?? "").slice(0, 100),
      category: Number.isInteger(category) && category > 0 ? category : null,
      sort,
      page: Number.isInteger(page) && page > 0 ? page : 1,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/articles]", error);
    return NextResponse.json({ message: "Gagal memuat artikel." }, { status: 502 });
  }
}
