import { NextResponse, type NextRequest } from "next/server";
import { getVillages } from "@/services/region";

/**
 * Proxy daftar desa/kelurahan untuk dropdown bertingkat di form profil (Client Component).
 *
 *   GET /api/regions/villages?district=31.74.01
 */
export async function GET(request: NextRequest) {
  try {
    const data = await getVillages(request.nextUrl.searchParams.get("district") ?? "");

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /api/regions/villages]", error);
    return NextResponse.json({ message: "Gagal memuat kelurahan." }, { status: 502 });
  }
}
