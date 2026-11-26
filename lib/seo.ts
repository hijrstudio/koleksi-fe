import type { Metadata } from "next";

/**
 * Open Graph (preview link saat dibagikan ke WhatsApp, Facebook, X, Telegram).
 * SITE_URL = domain website (default production), dipakai sebagai metadataBase supaya URL gambar absolut.
 */
export const SITE_URL = process.env.SITE_URL || "https://koleksi.club";

/** Gambar preview default 1200×630 (logo + warna KOLEKSI), lihat app/api/og/route.tsx. */
export const DEFAULT_OG_IMAGE = "/api/og";

/** HTML → teks ringkas untuk description preview. */
export function plainExcerpt(html: string | null | undefined, max = 160): string {
  const text = (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/**
 * Metadata Open Graph + kartu X untuk satu halaman. `image` = sampul konten (absolut dari backend);
 * kosong → gambar default. Objek openGraph halaman MENGGANTI milik layout (tidak digabung), jadi siteName dsb.
 * selalu diisi di sini.
 */
export function openGraph({
  title,
  description,
  image,
  type = "website",
  locale = "id",
}: {
  title: string;
  description?: string;
  image?: string | null;
  type?: "website" | "article";
  locale?: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const images = [{ url: image || DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }];

  return {
    openGraph: {
      type,
      siteName: "KOLEKSI",
      title,
      description,
      images,
      locale: locale === "en" ? "en_US" : "id_ID",
    },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  };
}
