import "server-only";

import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { MemberNotification, MemberProfile, NotificationAlert } from "@/types";

/** 20 notifikasi terbaru milik member (tanpa pengingat iuran — itu ditampilkan dari `billing`). */
export async function getMemberNotifications(token: string): Promise<{ items: MemberNotification[]; unreadCount: number }> {
  const res = await apiFetch<{ data: MemberNotification[]; meta: { unread_count: number } }>(API_ENDPOINTS.memberNotifications, {
    headers: { Authorization: `Bearer ${token}` },
    revalidate: false,
  });

  return { items: res.data, unreadCount: res.meta.unread_count };
}

/** Tandai dibaca: satu (`id`) atau semua. Mengembalikan sisa jumlah belum dibaca. */
export async function markMemberNotificationsRead(token: string, id?: string): Promise<number> {
  const res = await apiFetch<{ meta: { unread_count: number } }>(API_ENDPOINTS.memberNotificationsRead, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(id ? { id } : {}),
    revalidate: false,
  });

  return res.meta.unread_count;
}

/** "Perlu tindakan" dari status akun — urutan: keamanan dulu, lalu iuran, lalu profil (sama dengan banner Dasbor). */
export function notificationAlerts(member: MemberProfile): NotificationAlert[] {
  const alerts: NotificationAlert[] = [];

  if (member.must_change_password) alerts.push({ kind: "change_password" });
  if (member.billing.state !== "ok") alerts.push({ kind: "billing", billing: member.billing });
  if (!member.profile_completed) alerts.push({ kind: "complete_profile" });

  return alerts;
}
