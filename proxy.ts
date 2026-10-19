import { NextResponse, type NextRequest } from "next/server";

/** Sama dengan SESSION_COOKIE di lib/auth/session.ts (file itu server-only, tidak di-import di sini). */
const SESSION_COOKIE = "koleksi_session";

/**
 * Pengecekan optimistis: hanya melihat ada/tidaknya cookie sesi, tanpa memanggil backend
 * (proxy jalan di setiap request, termasuk prefetch). Validasi token yang sebenarnya dilakukan
 * halaman lewat getCurrentMember() — yang tidak valid diarahkan ke /api/auth/expired.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }

  const url = new URL("/masuk", request.url);
  url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dasbor/:path*"],
};
