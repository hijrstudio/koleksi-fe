import { NextResponse, type NextRequest } from "next/server";
import { trackArticleView } from "@/services/guideArticle";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

/**
 * Hitung view artikel. Dipanggil oleh ArticleViewTracker saat halaman detail dibuka,
 * diteruskan ke backend (PUT /guides/articles/{slug}/view) dengan token dari server.
 */
export async function POST(_request: NextRequest, ctx: RouteContext<"/api/articles/[slug]/view">) {
  const { slug } = await ctx.params;

  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  try {
    const views = await trackArticleView(slug);
    if (views === null) {
      return NextResponse.json({ message: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ views });
  } catch (error) {
    console.error("[POST /api/articles/[slug]/view]", error);
    return NextResponse.json({ message: "Gagal mencatat view." }, { status: 502 });
  }
}
