import clsx from "@/lib/clsx";

/**
 * Render HTML dari rich text editor CMS. HTML sudah disanitasi backend (allowlist anti-XSS)
 * saat disimpan, jadi aman untuk dangerouslySetInnerHTML. Jangan pakai untuk HTML dari sumber lain.
 *
 * Style dasar untuk list, link, dan bold; spacing paragraf diatur pemanggil lewat className.
 */
export default function RichText({
  html,
  className,
  as: Tag = "div",
}: {
  html: string;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag
      className={clsx(
        "[&_p:empty]:hidden",
        "[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
        "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_li_ul]:mt-1 [&_li_ol]:mt-1",
        "[&_a]:text-koleksi-green [&_a]:underline",
        "[&_strong]:font-bold [&_em]:italic",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
