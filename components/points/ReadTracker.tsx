"use client";

import { useEffect } from "react";
import { claimReadAction, startReadAction } from "@/app/actions/points";

/**
 * Poin baca artikel / berita: saat halaman dibuka server mencatat waktu mulai, lalu setelah member benar-benar
 * berada di halaman ini selama `seconds` (tab terlihat), poin diklaim. Server memeriksa ulang waktunya — klaim
 * sebelum waktunya ditolak. Tamu: tidak terjadi apa-apa. Tidak merender apa pun.
 */
export default function ReadTracker({ type, slug }: { type: "news" | "article"; slug: string }) {
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    startReadAction({ type, slug }).then((seconds) => {
      if (cancelled || seconds === null) return;

      let visible = 0;
      timer = setInterval(() => {
        if (document.visibilityState !== "visible") return;
        visible += 1;
        // +2 detik toleransi: jam server & browser tidak persis sama
        if (visible >= seconds + 2) {
          clearInterval(timer);
          claimReadAction({ type, slug });
        }
      }, 1000);
    });

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [type, slug]);

  return null;
}
