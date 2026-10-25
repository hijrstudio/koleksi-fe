/**
 * Filter level (Beginner / Intermediate / Advance) — sementara tidak dipakai: tabel guide_playbooks belum punya
 * kolom level. Tab di PlaybookList di-comment; aktifkan lagi bersama kolom level di backend.
 */
export const LEVELS = ["Beginner", "Intermediate", "Advance"] as const;
export type Level = (typeof LEVELS)[number];
