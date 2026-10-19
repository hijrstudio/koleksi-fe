"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { createIuranPayment } from "@/services/memberPayment";
import type { IuranPayment } from "@/types";

export type StartPaymentResult =
  | { ok: true; payment: IuranPayment }
  | { ok: false; message: string; expired?: boolean };

/**
 * Klik "Bayar Iuran" → backend membuat (atau mengembalikan) QRIS. Nominal & rincian SELALU dari backend,
 * tidak pernah dari client. Error dikembalikan sebagai nilai (bukan throw) supaya pesannya sampai ke member.
 */
export async function startIuranPayment(): Promise<StartPaymentResult> {
  const token = await getSessionToken();
  if (!token) return { ok: false, expired: true, message: "Sesi Anda berakhir. Silakan masuk kembali." };

  try {
    const payment = await createIuranPayment(token);
    if (payment.status === "success") revalidatePath("/dasbor");

    return { ok: true, payment };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) return { ok: false, expired: true, message: "Sesi Anda berakhir. Silakan masuk kembali." };
      if (error.status === 429) return { ok: false, message: "Terlalu sering. Coba lagi dalam 1 menit." };

      const errors = (error.body as { errors?: Record<string, string[]> } | undefined)?.errors;
      if (error.status === 422 && errors?.payment?.[0]) return { ok: false, message: errors.payment[0] };
    }

    console.error("[startIuranPayment]", error instanceof ApiError ? error.status : error);
    return { ok: false, message: "Gagal membuat QRIS. Silakan coba lagi beberapa saat lagi." };
  }
}

/** Setelah pembayaran berhasil: kartu iuran, status & masa berlaku di Dasbor dimuat ulang. */
export async function refreshDashboard(): Promise<void> {
  revalidatePath("/dasbor");
}
