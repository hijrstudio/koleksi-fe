import type { NextConfig } from "next";

// Gambar hero banner dll. dilayani dari storage backend (Laravel): {origin}/storage/...
const backendUrl = new URL(process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1");
// Staging/production (Laravel Cloud): file dilayani dari bucket object storage, bukan {origin}/storage.
// Isi dengan URL publik bucket (AWS_URL di Laravel Cloud), mis. https://xxxx.r2.dev
const storageUrl = process.env.BACKEND_STORAGE_URL ? new URL(process.env.BACKEND_STORAGE_URL) : null;

const nextConfig: NextConfig = {
  experimental: {
    // Form "Ubah profil" mengunggah dokumen kendaraan (total maks. 10 MB) + foto profil (maks. 2 MB)
    // lewat Server Action (lib/profile/validation.ts) + overhead multipart. Default Next: 1 MB (action) & 10 MB (proxy).
    serverActions: { bodySizeLimit: "13mb" },
    proxyClientMaxBodySize: "13mb",
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
    // Next 16 memblokir optimasi gambar dari IP lokal (127.0.0.1); izinkan hanya saat development.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;
