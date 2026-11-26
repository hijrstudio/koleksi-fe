import { NextResponse, type NextRequest } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import { forumError } from "@/lib/forum/errors";
import { getForumComments } from "@/services/forum";

const NO_STORE = { "Cache-Control": "private, no-store" };

/** Komentar halaman berikutnya ("Muat komentar lainnya").  GET /api/forum/discussions/{slug}/comments?page=2 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ message: "Unauthenticated." }, { status: 401, headers: NO_STORE });

  const { slug } = await params;
  const page = Number(request.nextUrl.searchParams.get("page") ?? 1);
  if (!/^[a-z0-9-]{1,190}$/.test(slug) || !Number.isInteger(page) || page < 1 || page > 1000) {
    return NextResponse.json({ message: "Not found." }, { status: 404, headers: NO_STORE });
  }

  try {
    return NextResponse.json(await getForumComments(token, slug, page), { headers: NO_STORE });
  } catch (error) {
    const e = forumError(error, "Gagal memuat komentar.");
    return NextResponse.json(e, { status: e.ok ? 200 : e.status, headers: NO_STORE });
  }
}
