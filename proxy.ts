import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, localizePath, splitLocale } from "@/lib/i18n/config";

/** Sama dengan SESSION_COOKIE di lib/auth/session.ts (file itu server-only, tidak di-import di sini). */
const SESSION_COOKIE = "koleksi_session";

/**
 * 1. Bahasa: halaman ada di app/[lang]/…. Indonesia (default) tanpa prefix dilayani lewat rewrites() di
 *    next.config.ts (browser tetap melihat /kegiatan); English memakai /en/… apa adanya. /id/… diarahkan ke
 *    versi tanpa prefix supaya satu halaman tidak punya dua URL.
 * 2. Dasbor: pengecekan optimistis — hanya ada/tidaknya cookie sesi, tanpa memanggil backend (proxy jalan di
 *    setiap request, termasuk prefetch). Validasi token yang sebenarnya dilakukan halaman lewat
 *    getCurrentMember() — yang tidak valid diarahkan ke /api/auth/expired.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { locale, path } = splitLocale(pathname);
  const explicitDefault = pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`);

  if (explicitDefault) {
    return NextResponse.redirect(new URL(path + search, request.url), 308);
  }

  if ((path === "/dasbor" || path.startsWith("/dasbor/")) && !request.cookies.has(SESSION_COOKIE)) {
    const url = new URL(localizePath("/masuk", locale), request.url);
    url.searchParams.set("next", path + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Semua halaman, kecuali API, aset Next.js, dan file statis (ada titik di path: favicon.ico, gambar, …)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
