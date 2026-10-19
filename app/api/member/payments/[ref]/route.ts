import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { MERCHANT_REF, getIuranPayment } from "@/services/memberPayment";

/**
 * Polling status pembayaran iuran dari dialog QRIS (Client Component).
 * Token member dibaca dari cookie httpOnly di server — browser tidak pernah memegangnya.
 * Backend hanya mengembalikan pembayaran milik member pemilik token (lainnya 404).
 *
 *   GET /api/member/payments/KLK0007-261012170105-ABC123
 */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/member/payments/[ref]">) {
  const { ref } = await ctx.params;

  if (!MERCHANT_REF.test(ref)) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const data = await getIuranPayment(token, ref);

    return NextResponse.json({ data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ApiError && [401, 404, 429].includes(error.status)) {
      return NextResponse.json({ message: "Gagal memuat status." }, { status: error.status });
    }

    console.error("[GET /api/member/payments/[ref]]", error instanceof ApiError ? error.status : error);
    return NextResponse.json({ message: "Gagal memuat status pembayaran." }, { status: 502 });
  }
}
