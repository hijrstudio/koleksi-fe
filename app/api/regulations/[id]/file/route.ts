import type { NextRequest } from "next/server";
import { pdfErrorResponse, pdfStreamResponse, playbookId } from "@/lib/playbookPdf";
import { fetchRegulationPdf } from "@/services/guideRegulation";

/**
 * Isi PDF dokumen regulasi (siapa saja), dibuka di tab baru dengan viewer PDF bawaan browser.
 *
 *   GET /api/regulations/{id}/file
 */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/regulations/[id]/file">) {
  const id = playbookId((await ctx.params).id);
  if (!id) return Response.json({ message: "Dokumen tidak ditemukan." }, { status: 404 });

  try {
    return pdfStreamResponse(await fetchRegulationPdf(id), "inline");
  } catch (error) {
    return pdfErrorResponse(error, "GET /api/regulations/[id]/file", "Dokumen tidak ditemukan.");
  }
}
