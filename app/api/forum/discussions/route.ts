import { NextResponse, type NextRequest } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import { forumError } from "@/lib/forum/errors";
import { getForumDiscussions } from "@/services/forum";

const NO_STORE = { "Cache-Control": "private, no-store" };

/**
 * Daftar diskusi untuk pencarian / filter / "Muat lebih banyak" di halaman forum (Client Component).
 *   GET /api/forum/discussions?search=&category=&sort=latest|oldest&page=2
 */
export async function GET(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ message: "Unauthenticated." }, { status: 401, headers: NO_STORE });

  const q = request.nextUrl.searchParams;
  const page = Number(q.get("page") ?? 1);

  try {
    const result = await getForumDiscussions(token, {
      search: (q.get("search") ?? "").slice(0, 100),
      category: (q.get("category") ?? "").slice(0, 80),
      sort: q.get("sort") === "oldest" ? "oldest" : "latest",
      page: Number.isInteger(page) && page > 0 && page <= 1000 ? page : 1,
    });
    return NextResponse.json(result, { headers: NO_STORE });
  } catch (error) {
    const e = forumError(error, "Gagal memuat diskusi.");
    return NextResponse.json(e, { status: e.ok ? 200 : e.status, headers: NO_STORE });
  }
}
