import { NextResponse, type NextRequest } from "next/server";
import { getRegulations } from "@/services/guideRegulation";

/**
 * Proxy list dokumen regulasi untuk Client Component (pencarian / paginasi).
 * Browser tidak pernah memegang BACKEND_API_TOKEN: request ke backend dilakukan dari server.
 *
 *   GET /api/regulations?search=&page=
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Number(params.get("page"));

  try {
    const result = await getRegulations({
      search: (params.get("search") ?? "").slice(0, 100),
      page: Number.isInteger(page) && page > 0 ? page : 1,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/regulations]", error);
    return NextResponse.json({ message: "Gagal memuat dokumen." }, { status: 502 });
  }
}
