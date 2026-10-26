import { NextResponse, type NextRequest } from "next/server";
import { requestLocale } from "@/lib/i18n/request";
import { getVideos } from "@/services/guideVideo";

/**
 * Proxy list video edukasi untuk Client Component (pencarian / filter / paginasi).
 * Browser tidak pernah memegang BACKEND_API_TOKEN: request ke backend dilakukan dari server.
 *
 *   GET /api/videos?search=&category=&page=
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const category = Number(params.get("category"));
  const page = Number(params.get("page"));

  const locale = await requestLocale(params.get("lang"));

  try {
    const result = await getVideos({
      search: (params.get("search") ?? "").slice(0, 100),
      category: Number.isInteger(category) && category > 0 ? category : null,
      page: Number.isInteger(page) && page > 0 ? page : 1,
    }, locale);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/videos]", error);
    return NextResponse.json({ message: "Gagal memuat video." }, { status: 502 });
  }
}
