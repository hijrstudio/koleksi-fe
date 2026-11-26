import type { BookmarkTarget, BookmarkType } from "@/types";

export const BOOKMARK_TYPES: readonly BookmarkType[] = ["discussion", "news", "article"];

/** Validasi target simpanan dari input pengguna (tipe dikenal + slug aman). */
export function isBookmarkTarget(value: unknown): value is BookmarkTarget {
  const v = value as Partial<BookmarkTarget> | null;
  return Boolean(
    v &&
      typeof v.type === "string" &&
      (BOOKMARK_TYPES as readonly string[]).includes(v.type) &&
      typeof v.slug === "string" &&
      /^[a-z0-9-]{1,190}$/.test(v.slug),
  );
}

/** Halaman konten di website (path tanpa prefix bahasa). */
export function bookmarkHref(target: BookmarkTarget): string {
  switch (target.type) {
    case "discussion":
      return `/forum/diskusi/${target.slug}`;
    case "news":
      return `/berita/${target.slug}`;
    case "article":
      return `/panduan-praktis/artikel/${target.slug}`;
  }
}
