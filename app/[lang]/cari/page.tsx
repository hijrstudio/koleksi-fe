import type { Metadata } from "next";
import Link from "@/components/i18n/Link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionContainer from "@/components/ui/SectionContainer";
import { ApiError } from "@/lib/api/client";
import clsx from "@/lib/clsx";
import { format, localizePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { SEARCH_MAX, SEARCH_MIN, SEARCH_TYPES, searchAll, searchType } from "@/services/search";
import type { SearchGroup, SearchItem, SearchType } from "@/types";
import ResultCard from "./ResultCard";
import { SearchForm, SearchPagination } from "./SearchControls";

type Props = { searchParams: Promise<{ q?: string | string[]; type?: string | string[]; page?: string | string[] }> };

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  // Hasil pencarian tidak diindeks mesin pencari
  return { title: t.searchPage.metaTitle, robots: { index: false, follow: true } };
}

/** /cari?q=kata&type=news&page=2 — semua jenis (maks 4 per jenis) atau satu jenis per halaman. */
export default async function CariPage({ searchParams }: Props) {
  const params = await searchParams;
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const s = t.searchPage;

  const q = first(params.q).trim().replace(/\s+/g, " ").slice(0, SEARCH_MAX);
  const rawType = first(params.type);
  const type = SEARCH_TYPES.includes(rawType as SearchType) ? (rawType as SearchType) : null;
  const pageNumber = Math.min(100, Math.max(1, Number.parseInt(first(params.page), 10) || 1));
  const ready = q.length >= SEARCH_MIN;
  const qs = (extra: Record<string, string>) => `?${new URLSearchParams({ q, ...extra })}`;

  let groups: SearchGroup[] = [];
  let total = 0;
  let single: { items: SearchItem[]; page: number; lastPage: number; total: number } | null = null;
  let failed = false;

  if (ready) {
    try {
      if (type) {
        single = await searchType(q, type, locale, pageNumber);
        total = single.total;
      } else {
        ({ groups, total } = await searchAll(q, locale));
      }
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
      failed = true;
    }
  }

  const tabs: { key: SearchType | null; label: string }[] = [
    { key: null, label: s.all },
    ...SEARCH_TYPES.map((key) => ({ key, label: s.types[key] })),
  ];

  return (
    <>
      <Header />
      <main>
        <SectionContainer variant="white" withGuides>
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-[32px] leading-10 font-bold text-koleksi-navy dark:text-badge-liputan">{s.title}</h1>
            <div className="mt-6">
              <SearchForm key={q} initial={q} />
            </div>

            {!ready && (
              <p className="mt-6 text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/60">{format(s.hint, { min: SEARCH_MIN })}</p>
            )}

            {ready && (
              <>
                <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xl font-bold wrap-break-word text-koleksi-navy-dark dark:text-ink-dark">{format(s.resultsFor, { q })}</h2>
                  {!failed && (
                    <span className="text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/60">{format(s.resultCount, { count: total })}</span>
                  )}
                </div>

                {/* Jenis konten */}
                <nav aria-label={s.title} className="mt-5 flex gap-2 overflow-x-auto pb-1">
                  {tabs.map((tab) => {
                    const active = tab.key === type;
                    const count = tab.key && !type ? groups.find((g) => g.type === tab.key)?.total : undefined;
                    return (
                      <Link
                        key={tab.key ?? "all"}
                        href={`/cari${qs(tab.key ? { type: tab.key } : {})}`}
                        aria-current={active ? "page" : undefined}
                        className={clsx(
                          "shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition",
                          active
                            ? "border-koleksi-navy-deep bg-koleksi-navy-deep text-white dark:border-ink-dark dark:bg-ink-dark dark:text-koleksi-navy-dark"
                            : "border-border-light text-koleksi-navy-dark hover:border-koleksi-navy-deep dark:border-border-dark dark:text-ink-dark",
                        )}
                      >
                        {tab.label}
                        {count !== undefined && <span className="ml-1.5 font-normal opacity-70">{count}</span>}
                      </Link>
                    );
                  })}
                </nav>

                {failed && <p role="alert" className="mt-8 text-sm text-red-600 dark:text-red-400">{s.error}</p>}
                {!failed && total === 0 && (
                  <p className="mt-8 text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/60">{format(s.empty, { q })}</p>
                )}

                {/* Semua jenis: maks 4 per jenis + "Lihat semua" */}
                {!failed && !type &&
                  groups
                    .filter((g) => g.total > 0)
                    .map((g) => (
                      <section key={g.type} className="mt-10">
                        <h3 className="text-base font-bold text-koleksi-navy-dark dark:text-ink-dark">{s.types[g.type]}</h3>
                        <ul className="mt-3 flex flex-col gap-1">
                          {g.items.map((item, i) => (
                            <li key={`${item.type}-${item.slug ?? item.url ?? i}`}>
                              <ResultCard item={item} query={q} locale={locale} t={t} />
                            </li>
                          ))}
                        </ul>
                        {g.total > g.items.length && (
                          <Link
                            href={`/cari${qs({ type: g.type })}`}
                            className="mt-3 inline-block px-3 text-sm font-bold text-koleksi-green transition hover:text-koleksi-green-dark"
                          >
                            {format(s.seeAll, { type: s.types[g.type].toLowerCase(), count: g.total })} →
                          </Link>
                        )}
                      </section>
                    ))}

                {/* Satu jenis: per halaman */}
                {!failed && single && single.items.length > 0 && (
                  <>
                    <ul className="mt-8 flex flex-col gap-1">
                      {single.items.map((item, i) => (
                        <li key={`${item.type}-${item.slug ?? item.url ?? i}`}>
                          <ResultCard item={item} query={q} locale={locale} t={t} />
                        </li>
                      ))}
                    </ul>
                    {single.lastPage > 1 && (
                      <SearchPagination
                        base={`${localizePath("/cari", locale)}${qs({ type: type as string })}`}
                        page={single.page}
                        lastPage={single.lastPage}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </SectionContainer>
      </main>
      <Footer />
    </>
  );
}
