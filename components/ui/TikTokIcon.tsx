/** lucide-react has no TikTok glyph; a small inline SVG keeps the icon set visually consistent. */
export default function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.6 5.82c-.97-.86-1.6-2.04-1.72-3.37h-3.03v13.9c0 1.58-1.28 2.86-2.86 2.86a2.86 2.86 0 0 1 0-5.72c.28 0 .55.04.8.12V10.7a5.86 5.86 0 0 0-.8-.06A5.86 5.86 0 1 0 15 16.35V9.03a8.15 8.15 0 0 0 4.7 1.5V7.5c-1.16 0-2.24-.36-3.1-.98z" />
    </svg>
  );
}
