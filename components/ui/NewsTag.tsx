import clsx from "@/lib/clsx";

const BADGE_TAGS = ["Liputan", "Berita EV"];

export default function NewsTag({
  tag,
  className,
}: {
  tag: string;
  className?: string;
}) {
  const isBadge = BADGE_TAGS.includes(tag);

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
