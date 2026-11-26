import { NextResponse, type NextRequest } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import { forumError } from "@/lib/forum/errors";
import { getDirectoryMembers } from "@/services/memberDirectory";

const NO_STORE = { "Cache-Control": "private, no-store" };

/**
 * Direktori anggota untuk pencarian / filter kota / pindah halaman (Client Component).
 *   GET /api/forum/members?search=&city=31.74&page=2
 */
export async function GET(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ message: "Unauthenticated." }, { status: 401, headers: NO_STORE });

  const q = request.nextUrl.searchParams;
  const page = Number(q.get("page") ?? 1);

  try {
    const result = await getDirectoryMembers(token, {
      search: (q.get("search") ?? "").slice(0, 100),
      city: q.get("city") ?? undefined,
      page: Number.isInteger(page) && page > 0 && page <= 1000 ? page : 1,
    });
    return NextResponse.json(result, { headers: NO_STORE });
  } catch (error) {
    const e = forumError(error, "Gagal memuat anggota.");
    return NextResponse.json(e, { status: e.ok ? 200 : e.status, headers: NO_STORE });
  }
}
