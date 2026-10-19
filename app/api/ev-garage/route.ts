import { NextResponse, type NextRequest } from "next/server";
import { getGarageVehicles } from "@/services/evGarage";

const BRAND_SLUG = /^[a-z0-9-]{1,60}$/;

/**
 * Proxy tabel EV Garage untuk Client Component (filter merek / pencarian / urutan / paginasi).
 * Browser tidak pernah memegang BACKEND_API_TOKEN: request ke backend dilakukan dari server.
 *
 *   GET /api/ev-garage?brand={slug}&search=&sort=asc|desc&page=
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const brand = params.get("brand");
  const page = Number(params.get("page"));

  try {
    const result = await getGarageVehicles({
      brand: brand && BRAND_SLUG.test(brand) ? brand : null,
      search: (params.get("search") ?? "").slice(0, 100),
      sort: params.get("sort") === "desc" ? "desc" : "asc",
      page: Number.isInteger(page) && page > 0 ? page : 1,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/ev-garage]", error);
    return NextResponse.json({ message: "Gagal memuat data EV Garage." }, { status: 502 });
  }
}
