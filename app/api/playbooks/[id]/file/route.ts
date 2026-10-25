import type { NextRequest } from "next/server";
import { pdfErrorResponse, pdfStreamResponse, playbookId } from "@/lib/playbookPdf";
import { fetchPlaybookPdf } from "@/services/guidePlaybook";

/**
 * Isi PDF untuk dibaca di popup Web Playbook (siapa saja). Dirender pdf.js ke canvas di browser,
 * jadi tidak ada toolbar unduh bawaan. Unduhan resmi: /api/playbooks/{id}/download (member).
 *
 *   GET /api/playbooks/{id}/file
 */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/playbooks/[id]/file">) {
  const id = playbookId((await ctx.params).id);
  if (!id) return Response.json({ message: "Playbook tidak ditemukan." }, { status: 404 });

  try {
    return pdfStreamResponse(await fetchPlaybookPdf(id), "inline");
  } catch (error) {
    return pdfErrorResponse(error, "GET /api/playbooks/[id]/file");
  }
}
