import "server-only";

import { ApiError } from "@/lib/api/client";

/** ID playbook dari segmen URL; null kalau bukan bilangan bulat positif. */
export function playbookId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * Teruskan PDF dari backend ke browser tanpa membaca seluruh isinya ke memori (di-stream).
 * `inline` = dibaca di popup, `attachment` = diunduh.
 */
export function pdfStreamResponse(upstream: Response, disposition: "inline" | "attachment"): Response {
  // Nama file asli dari backend (slug judul), tipe disposisi ditentukan di sini
  const upstreamDisposition = upstream.headers.get("content-disposition") ?? "";
  const filename = /filename="?([^";]+)"?/i.exec(upstreamDisposition)?.[1] ?? "playbook.pdf";

  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": `${disposition}; filename="${filename}"`,
    "X-Content-Type-Options": "nosniff",
    // Jangan disimpan cache bersama (proxy/CDN); unduhan member tidak di-cache sama sekali
    "Cache-Control": disposition === "inline" ? "private, max-age=300" : "private, no-store",
  });
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length);

  return new Response(upstream.body, { status: 200, headers });
}

/** Status error backend → response JSON singkat untuk browser. */
export function pdfErrorResponse(error: unknown, where: string): Response {
  if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
    return Response.json(
      { message: error.status === 401 ? "Silakan masuk untuk mengunduh." : "Playbook tidak ditemukan." },
      { status: error.status },
    );
  }

  console.error(`[${where}]`, error instanceof ApiError ? error.status : error);
  return Response.json({ message: "Gagal memuat file." }, { status: 502 });
}
