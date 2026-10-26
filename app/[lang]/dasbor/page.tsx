import type { Metadata } from "next";
import Link from "@/components/i18n/Link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import LegalFooter from "@/components/layout/LegalFooter";
import NoticeBanner from "@/components/ui/NoticeBanner";
import clsx from "@/lib/clsx";
import { RevealGrid, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getKegiatanDays, kegiatanList } from "@/app/[lang]/kegiatan/data";
import MemberMap from "./MemberMap";
import ProfileCard from "./ProfileCard";
import PaymentCard from "./PaymentCard";
import EventCalendar, { type CalendarEvent } from "./EventCalendar";
import { requireMember } from "@/services/memberAuth";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { RIWAYAT_KATEGORI, riwayatHref, toDashboardProfile } from "./data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.dashboard.metaTitle, description: t.dashboard.metaDescription };
}

const sectionTitleClass =
  "text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark";

export default async function DasborPage() {
  const member = await requireMember("/dasbor");
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const profile = toDashboardProfile(member, locale);

  const showBilling = member.billing.state !== "ok";

  // Keamanan dulu: ganti kata sandi awal di atas, lalu lengkapi profil
  const notices = [
    profile.mustChangePassword && {
      message: t.dashboard.changePasswordNotice,
      actionLabel: t.dashboard.edit,
      href: "/dasbor/profile/ubah-kata-sandi",
    },
    profile.profileIncomplete && {
      message: t.dashboard.completeProfileNotice,
      actionLabel: t.dashboard.check,
      href: "/dasbor/profile",
    },
  ].filter((notice) => notice !== false);
  const headerUser = { name: member.nama_panggilan || member.nama_lengkap, avatar: member.photo_url };

  // Dihitung di server -- client cukup terima tanggal + slug + judul, bukan
  // seluruh isi kegiatan.
  const calendarEvents: CalendarEvent[] = kegiatanList.flatMap((k) =>
    getKegiatanDays(k).map((date) => ({
      date,
      slug: k.slug,
      title: k.title,
    })),
  );

  return (
    <>
      <Header user={headerUser} />

      {/* Tanpa ornament & guide-line -- konten di kolom 1000px di tengah. */}
      <main className="relative flex-1">
        {/* Gradasi abu tipis di belakang judul. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-linear-to-b from-muted-light to-transparent dark:from-muted-dark"
        />

        {notices.length > 0 && (
          // h-0: banner melayang di padding atas, lalu nempel di bawah Header
          // (h-20) saat discroll.
          <div className="sticky top-23 z-40 flex h-0 flex-col gap-2 px-4 pt-3 md:top-25">
            {notices.map((notice) => (
              <NoticeBanner key={notice.href} {...notice} />
            ))}
          </div>
        )}

        <div
          className={clsx(
            "relative z-10 mx-auto w-full px-6 pb-12 md:px-10 lg:px-12",
            // 2 banner → judul diturunkan supaya tidak tertutup
            notices.length > 1 ? "pt-30 md:pt-31" : "pt-20 md:pt-21",
          )}
        >
          <div className="mx-auto max-w-280">
            <RevealGroup>
              <RevealItem className="flex items-center justify-between gap-4">
                <h1 className="font-display text-[32px] leading-10 font-bold tracking-[-0.03em] text-koleksi-navy dark:text-ink-dark">
                  {t.dashboard.title}
                </h1>
                <Link
                  href="/dasbor/profile"
                  className="text-sm font-bold text-koleksi-navy-dark/60 underline underline-offset-2 transition hover:text-koleksi-green dark:text-ink-dark/70"
                >
                  {t.dashboard.edit}
                </Link>
              </RevealItem>

              <RevealItem className="mt-8">
                <MemberMap />
              </RevealItem>
            </RevealGroup>

            {/* Mobile: profil → iuran → kalender. md+: profil & iuran bertumpuk di kiri, kalender di kanan. */}
            <RevealGroup className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_13.25rem] md:gap-x-10 md:gap-y-6">
              <RevealItem className="md:max-w-121">
                <ProfileCard user={profile} />
              </RevealItem>
              {showBilling && (
                <RevealItem className="md:col-start-1 md:row-start-2 md:max-w-121">
                  <PaymentCard billing={member.billing} />
                </RevealItem>
              )}
              <RevealItem className="w-full sm:max-w-80 md:col-start-2 md:row-span-2 md:row-start-1 md:w-53 md:justify-self-end">
                <EventCalendar events={calendarEvents} />
              </RevealItem>
            </RevealGroup>

            <RevealGroup as="section" className="mt-12">
              <RevealItem>
                <h2 className={sectionTitleClass}>{t.dashboard.memberData}</h2>
                <Link
                  href="/dasbor/data-anggota"
                  className="mt-6 inline-flex h-9.5 items-center justify-center rounded-full border border-koleksi-navy-dark px-3.5 text-sm font-bold text-koleksi-navy-dark transition hover:border-koleksi-green hover:text-koleksi-green dark:border-ink-dark/40 dark:text-ink-dark"
                >
                  {t.dashboard.viewData}
                </Link>
              </RevealItem>
            </RevealGroup>

            <RevealGroup as="section" className="mt-13">
              <RevealItem>
                <h2 className={sectionTitleClass}>{t.dashboard.history}</h2>
              </RevealItem>
              <RevealGrid className="mt-6 grid grid-cols-2 gap-4 sm:gap-6.5 lg:grid-cols-4">
                {RIWAYAT_KATEGORI.map((kategori) => ({ kategori, ...t.dashboard.historyCards[kategori] })).map((card) => (
                  <RevealItem key={card.kategori}>
                    <Link
                      href={riwayatHref(card.kategori)}
                      className="group flex aspect-square flex-col rounded-xl bg-[#eef2f8] p-4 transition hover:bg-[#e3e9f3] sm:p-5 dark:bg-muted-dark dark:hover:bg-koleksi-navy-deep"
                    >
                      <h3 className="text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                        {card.title}
                      </h3>
                      <p className="mt-2 hidden text-sm text-koleksi-navy-dark/60 sm:block dark:text-ink-dark/60">
                        {card.description}
                      </p>
                      <ArrowRight
                        size={20}
                        aria-hidden="true"
                        className="mt-auto text-koleksi-blue transition-transform duration-300 group-hover:translate-x-1.5"
                      />
                    </Link>
                  </RevealItem>
                ))}
              </RevealGrid>
            </RevealGroup>

            <LegalFooter className="mt-30" />
          </div>
        </div>
      </main>
    </>
  );
}
