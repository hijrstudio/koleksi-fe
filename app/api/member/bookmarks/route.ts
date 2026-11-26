import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { isBookmarkTarget } from "@/lib/bookmark";
import { getBookmarkStatus, getBookmarks } from "@/services/bookmark";

const NO_STORE = { "Cache-Control": "private, no-store" };

/**
 * Untuk tombol Simpan & halaman Tersimpan (Client Component):
 *   GET /api/member/bookmarks?type=news&slug=x  → { saved, guest }   status satu konten
 *   GET /api/member/bookmarks?lang=id&page=2    → ForumPage<BookmarkItem>
 * Tamu → { saved: false, guest: true } (halaman berita/artikel publik tetap tampil normal).
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const token = await getSessionToken();
  const target = { type: q.get("type"), slug: q.get("slug") };

  try {
    if (q.has("type")) {
      if (!isBookmarkTarget(target)) return NextResponse.json({ message: "Invalid." }, { status: 422, headers: NO_STORE });
      if (!token) return NextResponse.json({ saved: false, guest: true }, { headers: NO_STORE });
      return NextResponse.json({ saved: await getBookmarkStatus(token, target), guest: false }, { headers: NO_STORE });
    }

    if (!token) return NextResponse.json({ message: "Unauthenticated." }, { status: 401, headers: NO_STORE });
    const page = Number(q.get("page") ?? 1);
    const locale = q.get("lang") === "en" ? "en" : "id";
    return NextResponse.json(
      await getBookmarks(token, locale, Number.isInteger(page) && page > 0 && page <= 100 ? page : 1),
      { headers: NO_STORE },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Sesi tidak berlaku: untuk status, perlakukan sebagai tamu
      return q.has("type")
        ? NextResponse.json({ saved: false, guest: true }, { headers: NO_STORE })
        : NextResponse.json({ message: "Unauthenticated." }, { status: 401, headers: NO_STORE });
    }
    if (error instanceof ApiError && error.status === 404) {
      return NextResponse.json({ saved: false, guest: false }, { headers: NO_STORE });
    }
    console.error("[GET /api/member/bookmarks]", error instanceof ApiError ? error.status : error);
    return NextResponse.json({ message: "Gagal memuat simpanan." }, { status: 502, headers: NO_STORE });
  }
}
