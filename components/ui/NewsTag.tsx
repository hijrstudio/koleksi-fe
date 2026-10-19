import clsx from "@/lib/clsx";

const BADGE_TAGS = ["Liputan", "Berita EV"];

/**
 * Tag kategori berita: Berita EV & Liputan = badge kuning, News Release = teks hijau tanpa badge.
 * `badge` bisa diisi eksplisit dari nilai kategori API (aman untuk label bahasa lain);
 * kalau kosong, ditentukan dari teks tag.
 */
export default function NewsTag({
  tag,
  badge,
  className,
}: {
  tag: string;
  badge?: boolean;
  className?: string;
}) {
  const isBadge = badge ?? BADGE_TAGS.includes(tag);

  return (
    <span
      className={clsx(
        "inline-block text-xs font-semibold",
        isBadge
          ? "rounded-[10px] bg-badge-liputan px-2.5 py-1 text-koleksi-navy-dark"
          : "text-koleksi-green",
        className,
      )}
    >
      {tag}
    </span>
  );
}
