import { Star } from "lucide-react";

const STARS = [0, 1, 2, 3, 4];

/**
 * Tampilan rating read-only (5 bintang) dengan nilai rata-rata, mendukung
 * pecahan (mis. 4.5 = 4 bintang penuh + setengah).
 */
export default function StarRating({
  value,
  size = 16,
  gap = 4,
}: {
  /** 0 - 5 */
  value: number;
  size?: number;
  /** jarak antar bintang (px) */
  gap?: number;
}) {
  const clamped = Math.min(5, Math.max(0, value));
  const filledWidth =
    Math.floor(clamped) * (size + gap) + (clamped % 1) * size;

  return (
    <span
      role="img"
      aria-label={`Rating ${clamped} dari 5`}
      className="relative inline-flex text-koleksi-amber"
      style={{ gap }}
    >
      {STARS.map((i) => (
        <Star key={i} size={size} className="shrink-0" />
      ))}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 flex overflow-hidden"
        style={{ gap, width: filledWidth }}
      >
        {STARS.map((i) => (
          <Star
            key={i}
            size={size}
            fill="currentColor"
            className="shrink-0"
          />
        ))}
      </span>
    </span>
  );
}
