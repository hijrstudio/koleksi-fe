import { NextResponse } from "next/server";
import { clearSessionToken, getSessionToken } from "@/lib/auth/session";
import { getCurrentMember } from "@/services/memberAuth";
import type { HeaderUser } from "@/components/layout/Header";

const NO_STORE = { "Cache-Control": "private, no-store" };

/**
 * Status login untuk Header di halaman publik. Halaman-halaman itu statis / ISR (tidak membaca cookie di
 * server, supaya tetap di-cache), jadi Header menanyakan status login dari browser setelah halaman tampil.
 * Tanpa cookie sesi → langsung `{ user: null }` tanpa memanggil backend.
 *
 *   GET /api/auth/me → { user: { name, avatar } | null }
 */
export async function GET() {
  if (!(await getSessionToken())) {
    return NextResponse.json({ user: null }, { headers: NO_STORE });
  }

  try {
    const member = await getCurrentMember();
    if (!member) {
      // Token sudah tidak berlaku (kedaluwarsa / dicabut): bersihkan cookie-nya
      await clearSessionToken();
      return NextResponse.json({ user: null }, { headers: NO_STORE });
    }

    const user: HeaderUser = { name: member.nama_panggilan || member.nama_lengkap, avatar: member.photo_url };
    return NextResponse.json({ user }, { headers: NO_STORE });
  } catch (error) {
    console.error("[GET /api/auth/me]", error);
    return NextResponse.json({ user: null }, { status: 502, headers: NO_STORE });
  }
}
