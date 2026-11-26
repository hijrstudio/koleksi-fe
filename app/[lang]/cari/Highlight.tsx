/**
 * Sorot kata kunci di teks (tidak peka huruf besar-kecil). Murni teks React — tidak ada HTML dari input,
 * jadi aman dari XSS walau kata kunci berisi tag.
 */
export default function Highlight({ text, query }: { text: string; query: string }) {
  const words = [...new Set(query.trim().toLowerCase().split(/\s+/).filter((w) => w.length >= 2))];
  if (words.length === 0) return <>{text}</>;

  const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-koleksi-amber/40 px-0.5 text-inherit dark:bg-koleksi-amber/30">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
