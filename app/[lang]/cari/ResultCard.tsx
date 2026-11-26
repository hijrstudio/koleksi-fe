import Image from "next/image";
import Link from "@/components/i18n/Link";
import { ExternalLink, PlayCircle } from "lucide-react";
import Dot from "@/components/ui/Dot";
import { formatPlainDate } from "@/lib/formatDate";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import type { Locale, SearchItem } from "@/types";
import Highlight from "./Highlight";

const DEFAULT_IMAGE = "/images/sample-image1.png";

/** Halaman tujuan di website ini; berita dari media lain & video → link luar (tab baru). */
function internalHref(item: SearchItem): string | null {
  if (item.url || !item.slug) return null;
  return { news: `/berita/${item.slug}`, article: `/panduan-praktis/artikel/${item.slug}`, event: `/kegiatan/${item.slug}`, video: null }[item.type];
}

/** Hanya http(s): link luar dari backend tidak boleh berupa javascript: dsb. */
function safeExternal(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export default function ResultCard({ item, query, locale, t }: { item: SearchItem; query: string; locale: Locale; t: Dictionary }) {
  const internal = internalHref(item);
  const external = internal ? null : safeExternal(item.url);
  const className = "group flex gap-4 rounded-2xl p-3 transition hover:bg-koleksi-navy-dark/[0.0333] sm:gap-5 dark:hover:bg-white/5";

  const body = (
    <>
      <div className="relative aspect-27/16 w-28 shrink-0 overflow-hidden rounded-xl bg-koleksi-navy-dark/10 sm:w-44">
        <Image
          src={item.image ?? DEFAULT_IMAGE}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="176px"
        />
        {item.type === "video" && (
          <PlayCircle size={32} aria-hidden="true" className="absolute inset-0 m-auto text-white drop-shadow" />
        )}
      </div>
      <div className="min-w-0 py-1">
        <span className="inline-flex rounded-full bg-koleksi-green px-3 py-1 text-[12px] leading-3 font-semibold text-white">
          {t.searchPage.types[item.type]}
        </span>
        <p className="mt-2 line-clamp-2 text-base leading-6 font-bold wrap-break-word text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark">
          <Highlight text={item.title} query={query} />
        </p>
        {item.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-koleksi-navy-dark/70 dark:text-ink-dark/60">
            <Highlight text={item.excerpt} query={query} />
          </p>
        )}
        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/50">
          {item.date && <span>{formatPlainDate(item.date, locale, "short")}</span>}
          {item.date && item.meta && <Dot />}
          {item.meta && <span className="truncate">{item.meta}</span>}
          {external && (
            <span className="inline-flex items-center gap-1" title={t.searchPage.external}>
              <ExternalLink size={12} aria-label={t.searchPage.external} />
            </span>
          )}
        </p>
      </div>
    </>
  );

  if (internal) {
    return (
      <Link href={internal} className={className}>
        {body}
      </Link>
    );
  }
  if (external) {
    return (
      <a href={external} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }
  return <div className={className}>{body}</div>;
}
