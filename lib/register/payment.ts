import "server-only";

import { NextResponse } from "next/server";
import type { ApiError } from "@/lib/api/client";

/** Format token link bayar dari backend: {id}.{expires}.{hmac-sha256 hex}. Ditolak lebih awal kalau bentuknya salah. */
const TOKEN = /^\d{1,10}\.\d{1,12}\.[a-f0-9]{64}$/;

export function registrationToken(body: unknown): string | null {
  const token = (body as { token?: unknown } | null)?.token;

  return typeof token === "string" && TOKEN.test(token) ? token : null;
}

/** Error backend → response JSON singkat untuk browser (pesan backend diteruskan untuk 404/409/422/429). */
export function registrationPaymentError(error: unknown, where: string, apiError: ApiError | null): NextResponse {
  if (apiError && [404, 409, 422, 429].includes(apiError.status)) {
    const message = (apiError.body as { message?: string; errors?: Record<string, string[]> } | undefined);
    const text = Object.values(message?.errors ?? {})[0]?.[0] ?? message?.message ?? "Permintaan ditolak.";

    return NextResponse.json({ message: text }, { status: apiError.status });
  }

  console.error(`[${where}]`, apiError ? apiError.status : error);
  return NextResponse.json({ message: "Gagal menghubungi server pembayaran. Coba lagi." }, { status: 502 });
}
