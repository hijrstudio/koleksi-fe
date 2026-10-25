import type { NextRequest } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import { pdfErrorResponse, pdfStreamResponse, playbookId } from "@/lib/playbookPdf";
import { downloadPlaybookPdf } from "@/services/guidePlaybook";

/**
 * Unduh PDF Web Playbook — hanya member yang login. Dicek di server (cookie sesi → token member → backend),
 * bukan hanya dengan menyembunyikan tombol: tamu yang membuka URL ini langsung mendapat 401.
 *
 *   GET /api/playbooks/{id}/download
 */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/playbooks/[id]/download">) {
  const id = playbookId((await ctx.params).id);
  if (!id) return Response.json({ message: "Playbook tidak ditemukan." }, { status: 404 });

  const token = await getSessionToken();
  if (!token) return Response.json({ message: "Silakan masuk untuk mengunduh." }, { status: 401 });

  try {
    return pdfStreamResponse(await downloadPlaybookPdf(id, token), "attachment");
  } catch (error) {
    return pdfErrorResponse(error, "GET /api/playbooks/[id]/download");
  }
}
