import clsx from "@/lib/clsx";

/**
 * Badge peran anggota forum (Member, n00b, Moderator, ...).
 * Default: outline muted-steel. Moderator: teks hijau + bg #16A34A1A.
 */
export default function RoleBadge({
  role,
  className,
}: {
  role: string;
  className?: string;
}) {
  const isModerator = role === "Moderator";

  return (
    <span
      className={clsx(
        "inline-block rounded-full border px-2 py-0.5 text-[10px] leading-3 font-bold",
        isModerator
          ? "border-transparent bg-koleksi-green-dark/10 text-koleksi-green-dark"
          : "border-muted-steel text-muted-steel",
        className,
      )}
    >
      {role}
    </span>
  );
}
