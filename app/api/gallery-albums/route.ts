import { NextResponse, type NextRequest } from "next/server";
import { requestLocale } from "@/lib/i18n/request";
import { getGalleryAlbums } from "@/services/gallery";

/**
 * Proxy list album galeri untuk Client Component (pencarian / paginasi).
 * Browser tidak pernah memegang BACKEND_API_TOKEN: request ke backend dilakukan dari server.
 *
 *   GET /api/gallery-albums?search=&page=
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Number(params.get("page"));

  const locale = await requestLocale(params.get("lang"));

  try {
    const result = await getGalleryAlbums({
      search: (params.get("search") ?? "").slice(0, 100),
      page: Number.isInteger(page) && page > 0 ? page : 1,
    }, locale);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/gallery-albums]", error);
    return NextResponse.json({ message: "Gagal memuat galeri." }, { status: 502 });
  }
}
