import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api/client";
import { clientIp } from "@/lib/auth/clientIp";
import { registrationPaymentError, registrationToken } from "@/lib/register/payment";
import { startRegistrationPayment } from "@/services/registrationPayment";

/**
 * Tombol "Tampilkan QRIS" di halaman bayar iuran pendaftaran. Token pendaftar dari link e-mail dikirim di body.
 *
 *   POST /api/registrations/payment/checkout  { token }
 */
export async function POST(request: NextRequest) {
  const token = registrationToken(await request.json().catch(() => null));
  if (!token) return NextResponse.json({ message: "Link pembayaran tidak valid." }, { status: 404 });

  try {
    const data = await startRegistrationPayment(token, await clientIp());

    return NextResponse.json({ data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return registrationPaymentError(error, "POST /api/registrations/payment/checkout", error instanceof ApiError ? error : null);
  }
}
