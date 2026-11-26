import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Gambar preview link default (1200×630): logo + tagline di atas gradasi warna Header KOLEKSI. Dibuat saat build. */
export const dynamic = "force-static";

export async function GET() {
  const logo = await readFile(join(process.cwd(), "public/images/logo-koleksi.svg"), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(270deg, #22c55e 0%, #1b3a6a 100%)",
          color: "#ffffff",
          gap: 36,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/svg+xml;base64,${logo}`} alt="" height={180} />
        <div style={{ fontSize: 44, fontWeight: 700, textAlign: "center", maxWidth: 960 }}>
          Komunitas Mobil Elektrik Indonesia
        </div>
        <div style={{ fontSize: 28, opacity: 0.85 }}>koleksi.club</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
