import "server-only";

import { headers } from "next/headers";

/**
 * IP pengunjung, diteruskan ke backend sebagai X-Forwarded-For (rate limit login per pengunjung,
 * IP di notifikasi keamanan). Rate limit per akun di backend tetap berlaku walau header ini dipalsukan.
 */
export async function clientIp(): Promise<string | null> {
  const h = await headers();

  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}
