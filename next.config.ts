import type { NextConfig } from "next";

// Gambar hero banner dll. dilayani dari storage backend (Laravel): {origin}/storage/...
const backendUrl = new URL(process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1");
// Staging/production (Laravel Cloud): file dilayani dari bucket object storage, bukan {origin}/storage.
// Isi dengan URL publik bucket (AWS_URL di Laravel Cloud), mis. https://xxxx.r2.dev
const storageUrl = process.env.BACKEND_STORAGE_URL ? new URL(process.env.BACKEND_STORAGE_URL) : null;

const nextConfig: NextConfig = {
  // Build mandiri untuk Docker (fe/Dockerfile); tetap aman kalau di-deploy di Vercel.
  output: "standalone",
  experimental: {
    // Form "Ubah profil" mengunggah dokumen kendaraan (total maks. 10 MB) + foto profil (maks. 2 MB)
    // lewat Server Action (lib/profile/validation.ts) + overhead multipart. Default Next: 1 MB (action) & 10 MB (proxy).
    serverActions: { bodySizeLimit: "13mb" },
    proxyClientMaxBodySize: "13mb",
  },
  /**
   * Indonesia (default) tanpa prefix: /kegiatan dilayani diam-diam oleh app/[lang]/kegiatan (lang = "id").
   * Sengaja di sini, BUKAN NextResponse.rewrite di proxy.ts: di VPS server Next berjalan dengan HOSTNAME=127.0.0.1,
   * dan Next menormalkan host proxy ke "localhost" → rewrite dari proxy dianggap ke server luar (500, TLS ke port
   * HTTP sendiri). Rewrite config selalu internal. afterFiles: file publik (gambar, favicon) & /api dicek dulu.
   */
  async rewrites() {
    const notPrefixed = "(?!(?:en|id|api|_next)(?:/|$))[^/.]+";
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/", destination: "/id" },
        { source: `/:first(${notPrefixed})`, destination: "/id/:first" },
        { source: `/:first(${notPrefixed})/:rest+`, destination: "/id/:first/:rest+" },
      ],
      fallback: [],
    };
  },
  // Berita & galeri foto dipisah dari Panduan Praktis: URL lama (sudah tersebar / terindeks) dialihkan permanen.
  // Query (?tags=) ikut terbawa otomatis.
  async redirects() {
    return ["", "/en"].flatMap((prefix) => [
      { source: `${prefix}/panduan-praktis/berita`, destination: `${prefix}/berita`, permanent: true },
      { source: `${prefix}/panduan-praktis/berita/:slug`, destination: `${prefix}/berita/:slug`, permanent: true },
      { source: `${prefix}/panduan-praktis/galeri-foto`, destination: `${prefix}/kegiatan/galeri/foto`, permanent: true },
      // /kegiatan/galeri belum punya halaman sendiri: arahkan ke foto (sementara, supaya bisa diganti halaman galeri)
      { source: `${prefix}/kegiatan/galeri`, destination: `${prefix}/kegiatan/galeri/foto`, permanent: false },
    ]);
  },
  images: {
    remotePatterns: [
      {
        protocol: backendUrl.protocol.replace(":", "") as "http" | "https",
        hostname: backendUrl.hostname,
        port: backendUrl.port,
        pathname: "/storage/**",
      },
      ...(storageUrl
        ? [
            {
              protocol: storageUrl.protocol.replace(":", "") as "http" | "https",
              hostname: storageUrl.hostname,
              port: storageUrl.port,
              pathname: `${storageUrl.pathname.replace(/\/$/, "")}/**`,
            },
          ]
        : []),
      // Thumbnail bawaan YouTube untuk video edukasi yang tidak upload thumbnail
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
    // Next 16 memblokir optimasi gambar dari IP lokal (127.0.0.1); izinkan saat development, dan di VPS
    // (IMAGES_ALLOW_LOCAL_IP=true saat build) karena API_DOMAIN di container fe diarahkan ke 127.0.0.1:
    // NAT VPS tidak bisa menjangkau IP publiknya sendiri. Aman: host tetap dibatasi remotePatterns di atas.
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV !== "production" || process.env.IMAGES_ALLOW_LOCAL_IP === "true",
  },
};

export default nextConfig;
