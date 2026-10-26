import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { getCurrentMember } from "@/services/memberAuth";
import { getMemberNotifications, notificationAlerts } from "@/services/memberNotification";
import type { NotificationFeed } from "@/types";

const NO_STORE = { "Cache-Control": "private, no-store" };

/**
 * Isi lonceng notifikasi di Header (Client Component). Token member dibaca dari cookie httpOnly di server.
 *   alerts      → "perlu tindakan" dari status akun (ganti kata sandi awal, iuran, lengkapi profil)
 *   items       → notifikasi tersimpan di backend (riwayat, dengan status dibaca)
 *
 *   GET /api/member/notifications → NotificationFeed
 */
export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401, headers: NO_STORE });
  }

  try {
    const [member, notifications] = await Promise.all([getCurrentMember(), getMemberNotifications(token)]);
    if (!member) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401, headers: NO_STORE });
    }

    const feed: NotificationFeed = { alerts: notificationAlerts(member), ...notifications };
    return NextResponse.json(feed, { headers: NO_STORE });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401, headers: NO_STORE });
    }

    console.error("[GET /api/member/notifications]", error instanceof ApiError ? error.status : error);
    return NextResponse.json({ message: "Gagal memuat notifikasi." }, { status: 502, headers: NO_STORE });
  }
}
