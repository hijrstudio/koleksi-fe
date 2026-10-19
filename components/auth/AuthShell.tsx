import { ReactNode } from "react";
import Link from "next/link";
import clsx from "@/lib/clsx";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LegalFooter from "@/components/layout/LegalFooter";

interface AuthShellProps {
  title: string;
  /** Link teks kecil di kanan judul (mis. "Kembali ke Beranda"). */
  backHref: string;
  backLabel: string;
  /** Banner sticky di atas panel (mis. "*Wajib diisi" di halaman Daftar). */
  notice?: ReactNode;
  children: ReactNode;
}

/* Frame halaman auth (Masuk, Lupa Kata Sandi, Daftar): berdiri sendiri, sengaja
   tanpa Header & Footer. Frame-nya sama dengan section lain -- ornament hatch
   di gutter kiri/kanan (pindah ke strip atas/bawah di mobile) + guide-line di
   tepi panel putih. */
export default function AuthShell({
  title,
  backHref,
  backLabel,
  notice,
  children,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-muted-light dark:bg-muted-dark">
      <section className="section-ornament relative flex flex-1 flex-col">
        <span
          className="guide-line hidden md:block"
          style={{ left: "var(--gutter)", zIndex: 20 }}
        />
        <span
          className="guide-line hidden md:block"
          style={{ right: "var(--gutter)", zIndex: 20 }}
        />

        {/* Mobile: panel full-width, diberi jarak atas/bawah selebar strip
            ornament. md+: dipersempit supaya gutter ornament tetap kosong. */}
        <main className="relative z-10 mx-auto my-(--gutter) flex w-full flex-1 flex-col bg-surface-light py-12 md:my-0 md:max-w-[calc(100%-2*var(--gutter))] md:py-0 dark:bg-surface-dark">
          {/* h-0 supaya banner gak ndorong judul -- dia "melayang" di area
              padding atas panel, lalu nempel di atas layar saat discroll. */}
          {notice && (
            <div className="sticky top-3 z-30 h-0 px-4 md:top-5">{notice}</div>
          )}

          <RevealGroup
            className={clsx(
              "mx-auto flex w-full max-w-192.5 flex-1 flex-col px-6 md:px-10 md:pt-21 md:pb-10 lg:px-0 lg:pb-8",
              notice != null && "pt-12",
            )}
          >
            <RevealItem className="flex items-center justify-between gap-4">
              <h1 className="font-display text-[32px] leading-10 font-bold tracking-[-0.03em] text-koleksi-navy dark:text-ink-dark">
                {title}
              </h1>
              <Link
                href={backHref}
                className="shrink-0 text-sm font-bold text-koleksi-navy-dark/60 underline underline-offset-2 transition hover:text-koleksi-green dark:text-ink-dark/70"
              >
                {backLabel}
              </Link>
            </RevealItem>

            <RevealItem className="mt-10 md:mt-15">{children}</RevealItem>

            <RevealItem as="footer" className="mt-16 md:mt-auto md:pt-30">
              <LegalFooter />
            </RevealItem>
          </RevealGroup>
        </main>
      </section>
    </div>
  );
}
