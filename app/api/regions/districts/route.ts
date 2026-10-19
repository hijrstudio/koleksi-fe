import { NextResponse, type NextRequest } from "next/server";
import { getDistricts } from "@/services/region";

/**
 * Proxy daftar kecamatan untuk dropdown bertingkat di form profil (Client Component).
 *
 *   GET /api/regions/districts?regency=31.74
 */
export async function GET(request: NextRequest) {
  try {
    const data = await getDistricts(request.nextUrl.searchParams.get("regency") ?? "");

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/regions/districts]", error);
    return NextResponse.json({ message: "Gagal memuat kecamatan." }, { status: 502 });
  }
}
