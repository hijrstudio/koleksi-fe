import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api/client";
import { clientIp } from "@/lib/auth/clientIp";
import { registrationPaymentError, registrationToken } from "@/lib/register/payment";
import { MERCHANT_REF } from "@/services/memberPayment";
import { getRegistrationPaymentStatus } from "@/services/registrationPayment";

/**
 * Polling status pembayaran iuran pendaftaran. Backend hanya mengembalikan pembayaran milik pendaftar pemilik token.
 *
 *   POST /api/registrations/payment/status  { token, merchant_ref }
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const token = registrationToken(body);
  const ref = typeof body?.merchant_ref === "string" ? body.merchant_ref : "";

  if (!token || !MERCHANT_REF.test(ref)) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  try {
    const data = await getRegistrationPaymentStatus(token, ref, await clientIp());

    return NextResponse.json({ data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return registrationPaymentError(error, "POST /api/registrations/payment/status", error instanceof ApiError ? error : null);
  }
}
