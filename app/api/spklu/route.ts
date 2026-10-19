import { NextResponse, type NextRequest } from "next/server";
import { getSpkluOperators } from "@/services/spklu";

/**
 * Proxy list operator SPKLU untuk Client Component (pencarian / urutan / paginasi).
 * Browser tidak pernah memegang BACKEND_API_TOKEN: request ke backend dilakukan dari server.
 *
 *   GET /api/spklu?search=&sort=asc|desc&page=
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Number(params.get("page"));

  try {
    const result = await getSpkluOperators({
      search: (params.get("search") ?? "").slice(0, 100),
      sort: params.get("sort") === "desc" ? "desc" : "asc",
      page: Number.isInteger(page) && page > 0 ? page : 1,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/spklu]", error);
    return NextResponse.json({ message: "Gagal memuat data SPKLU." }, { status: 502 });
  }
}
