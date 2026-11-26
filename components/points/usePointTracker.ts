"use client";

import { useEffect } from "react";
import { trackVisitAction } from "@/app/actions/points";

/**
 * Kunjungan harian & menu berpoin (lihat config/points.php di backend — server yang menentukan poin).
 * Daftar menu di sini hanya untuk mengurangi request: sinyal dikirim sekali per (hari WIB, menu) per browser.
 */
const MENUS: Record<string, string> = {
  "tentang-kami": "/tentang-kami",
  "panduan-praktis": "/panduan-praktis",
  kegiatan: "/kegiatan",
  galeri: "/kegiatan/galeri",
  berita: "/berita",
  "ev-garage": "/ev-garage",
  spklu: "/spklu",
};

const STORAGE_KEY = "koleksi:points";

function wibDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
}

function menuFor(path: string): string | null {
  let match: string | null = null;
  let length = 0;
  for (const [key, prefix] of Object.entries(MENUS)) {
    if ((path === prefix || path.startsWith(`${prefix}/`)) && prefix.length > length) {
      match = key;
      length = prefix.length;
    }
  }
  return match;
}

function readSent(today: string): string[] {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as { day: string; keys: string[] } | null;
    return data?.day === today ? data.keys : [];
  } catch {
    return [];
  }
}

function writeSent(today: string, keys: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ day: today, keys }));
  } catch {
    /* storage diblokir: tetap jalan, hanya request bisa terulang */
  }
}

/** Dipakai di Header: `loggedIn` dari status sesi (tamu tidak mengirim apa pun), `path` tanpa prefix bahasa. */
export function usePointTracker(loggedIn: boolean, path: string) {
  useEffect(() => {
    if (!loggedIn) return;

    const today = wibDate();
    const menu = menuFor(path);
    const wanted = ["visit", ...(menu ? [`menu:${menu}`] : [])];
    const sent = readSent(today);
    if (wanted.every((key) => sent.includes(key))) return;

    // Ditandai dulu supaya navigasi cepat / tab lain tidak mengirim ganda; server tetap menolak duplikat
    writeSent(today, [...new Set([...sent, ...wanted])]);
    trackVisitAction(path).then((result) => {
      if (!result.ok) writeSent(today, readSent(today).filter((key) => !wanted.includes(key) || sent.includes(key)));
    });
  }, [loggedIn, path]);
}
