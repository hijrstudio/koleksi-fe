"use client";

import { useEffect } from "react";

/**
 * Catat 1 view saat halaman detail artikel dibuka.
 * Sekali per artikel per sesi tab browser (sessionStorage), supaya refresh tidak menambah view.
 */
export default function ArticleViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `article-viewed:${slug}`;

    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage diblokir (mode privat dll.): tetap kirim view
    }

    fetch(`/api/articles/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // Gagal mencatat view tidak boleh mengganggu pembaca
    });
  }, [slug]);

  return null;
}
