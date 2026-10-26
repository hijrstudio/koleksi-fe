import { NextResponse, type NextRequest } from "next/server";
import { requestLocale } from "@/lib/i18n/request";
import { getEvents } from "@/services/event";
import type { EventPhase } from "@/types";

const PHASES: readonly EventPhase[] = ["upcoming", "ongoing", "done"];

/**
 * Proxy list kegiatan untuk Client Component (tab fase / pencarian / filter / paginasi).
 * Browser tidak pernah memegang BACKEND_API_TOKEN: request ke backend dilakukan dari server.
 *
 *   GET /api/events?phase=upcoming|ongoing|done&search=&category=&page=
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const phase = PHASES.find((p) => p === params.get("phase")) ?? null;
  const category = Number(params.get("category"));
  const page = Number(params.get("page"));

  const locale = await requestLocale(params.get("lang"));

  try {
    const result = await getEvents({
      phase,
      search: (params.get("search") ?? "").slice(0, 100),
      category: Number.isInteger(category) && category > 0 ? category : null,
      page: Number.isInteger(page) && page > 0 ? page : 1,
    }, locale);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/events]", error);
    return NextResponse.json({ message: "Gagal memuat kegiatan." }, { status: 502 });
  }
}
