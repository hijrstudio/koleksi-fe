import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { safeRedirectPath } from "@/lib/auth/validation";
import { DEFAULT_LOCALE, isLocale, localizePath } from "@/lib/i18n/config";

/**
 * Sesi tidak berlaku lagi (token kadaluarsa / dicabut): hapus cookie lalu ke halaman Masuk.
 * Server Component tidak boleh mengubah cookie, jadi halaman yang mendeteksinya redirect ke sini.
 *
 *   GET /api/auth/expired?next=/dasbor&lang=en   (lang kosong = Indonesia)
 */
export function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang");
  const url = new URL(localizePath("/masuk", isLocale(lang) ? lang : DEFAULT_LOCALE), request.url);
  const next = request.nextUrl.searchParams.get("next");
  if (next) {
    url.searchParams.set("next", safeRedirectPath(next));
  }

  const response = NextResponse.redirect(url);
  response.cookies.delete(SESSION_COOKIE);

  return response;
}
