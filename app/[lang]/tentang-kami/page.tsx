import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/i18n/Link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import RichText from "@/components/ui/RichText";
import { RevealGroup, RevealGrid, RevealItem } from "@/components/ui/Reveal";
import { getAboutPage } from "@/services/about";
import { format } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import AboutTabs from "./AboutTabs";
import ProfileCard from "./ProfileCard";
import FaqAccordion from "./FaqAccordion";
import ContactForm from "./ContactForm";

const BODY_TEXT = "text-[14px] font-normal leading-[21px]";

const DOC_BUTTON_CLASS =
  "inline-flex items-center rounded-full border hover:border-koleksi-navy-deep/60 px-6 py-2.5 text-base font-bold text-koleksi-navy-deep transition border-koleksi-navy-deep dark:border-border-dark";

function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className={`${BODY_TEXT} text-koleksi-navy-dark/60`}>{children}</p>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.about.metaTitle, description: t.about.metaDescription };
}

export default async function TentangKamiPage() {
  const locale = await getLocale();
  const [about, t] = await Promise.all([getAboutPage(locale), getDictionary(locale)]);
  const { management, documents } = about;

  return (
    <>
      <Header />
      <main>
        {/* Informasi Singkat */}
        <SectionContainer variant="white">
          <RevealGroup className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <RevealItem>
              {about.summary && (
                <RichText
                  html={about.summary}
                  className="space-y-6 text-card-title font-bold"
                />
              )}
            </RevealItem>

            {about.image && (
              <RevealItem className="relative aspect-570/320 w-full overflow-hidden rounded-2xl">
                <Image
                  src={about.image}
                  alt={t.about.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </RevealItem>
            )}
          </RevealGroup>
        </SectionContainer>

        <SectionContainer withGuides withOrnament topDivider variant="white">
          <RevealGroup>
            <RevealItem>
              <AboutTabs />
            </RevealItem>
          </RevealGroup>

          {/* Profil Organisasi */}
          <RevealGroup id="profil-organisasi" className="mt-16 scroll-mt-28">
            <RevealItem>
              <SectionHeader title={t.about.tabs.profile} />
            </RevealItem>

            {about.profilOrganisasi && (
              <RevealItem>
                <RichText
                  html={about.profilOrganisasi}
                  className={`${BODY_TEXT} columns-1 gap-x-12 text-koleksi-navy-dark/80 sm:columns-2 [&_p]:mb-4 [&_p]:break-inside-avoid`}
                />
              </RevealItem>
            )}
          </RevealGroup>

          {/* Kepengurusan */}
          <RevealGroup id="kepengurusan" className="mt-24 scroll-mt-28">
            <RevealItem>
              <SectionHeader title={t.about.tabs.management} />

              {management ? (
                <>
                  <p className="text-[20px] font-bold leading-6 text-koleksi-navy-dark">
                    {format(t.about.period, { period: management.periodLabel })}
                  </p>
                  <p className={`mt-4 ${BODY_TEXT} text-koleksi-navy-dark/60`}>
                    {t.about.advisors}
                  </p>
                </>
              ) : (
                <EmptyNote>{t.about.noManagement}</EmptyNote>
              )}
            </RevealItem>

            {management && (
              <>
                <RevealGrid className="mt-6 mb-10 flex flex-col items-center gap-y-15">
                  {[management.pengurusUtama, management.pengurusInti]
                    .filter((row) => row.length > 0)
                    .map((row, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap justify-center gap-x-25 gap-y-20"
                      >
                        {row.map((person) => (
                          <RevealItem key={person.id}>
                            <ProfileCard {...person} />
                          </RevealItem>
                        ))}
                      </div>
                    ))}
                </RevealGrid>

                <RevealGrid className="mt-16 grid grid-cols-1 gap-x-16 gap-y-6 sm:grid-cols-2">
                  {management.pengurusBidang.map((person) => (
                    <RevealItem key={person.id}>
                      <p className="text-base font-bold leading-6 text-koleksi-navy-dark">
                        {person.name}
                      </p>
                      <p className={`${BODY_TEXT} text-koleksi-navy-dark/60`}>
                        {person.role}
                      </p>
                    </RevealItem>
                  ))}
                </RevealGrid>
              </>
            )}
          </RevealGroup>

          {/* Visi & Misi */}
          <RevealGroup
            id="visi-misi"
            className="mt-24 scroll-mt-28 grid grid-cols-1 gap-10 sm:grid-cols-2"
          >
            <RevealItem>
              <h3 className="font-display text-2xl font-bold leading-8 text-koleksi-navy">
                {t.about.vision}
              </h3>
              {about.visi && (
                <p className={`mt-4 whitespace-pre-line ${BODY_TEXT} text-koleksi-navy-dark/80`}>
                  {about.visi}
                </p>
              )}
            </RevealItem>

            <RevealItem>
              <h3 className="font-display text-2xl font-bold leading-8 text-koleksi-navy">
                {t.about.mission}
              </h3>
              {about.misi && (
                <RichText
                  html={about.misi}
                  className={`mt-4 ${BODY_TEXT} text-koleksi-navy-dark/80 [&_ul]:mt-2`}
                />
              )}
            </RevealItem>
          </RevealGroup>

          {/* Aturan & AD/ART */}
          <RevealGroup id="aturan-adart" className="mt-24 scroll-mt-28">
            <RevealItem>
              <SectionHeader title={t.about.tabs.rules} />
            </RevealItem>

            <RevealItem>
              {documents.aturan_ad_art ? (
                <>
                  <p className={`${BODY_TEXT} text-koleksi-navy-dark/60`}>
                    {t.about.pdfDocument}
                  </p>
                  <a
                    href={documents.aturan_ad_art}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 ${DOC_BUTTON_CLASS}`}
                  >
                    {t.common.view}
                  </a>
                </>
              ) : (
                <EmptyNote>{t.about.noDocument}</EmptyNote>
              )}
            </RevealItem>
          </RevealGroup>

          {/* Informasi Keanggotaan */}
          <RevealGroup id="informasi-keanggotaan" className="mt-24 scroll-mt-28">
            <RevealItem>
              <SectionHeader title={t.about.membership} />
            </RevealItem>

            <RevealGrid className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              <RevealItem>
                <h3 className="text-xl leading-6 font-bold leading-8 text-koleksi-navy-dark">
                  {t.about.requirements}
                </h3>
                {about.syaratAnggota && (
                  <RichText
                    html={about.syaratAnggota}
                    className={`mt-4 ${BODY_TEXT} text-koleksi-navy-dark/80`}
                  />
                )}

                <Link
                  href="/daftar"
                  className="mt-8 inline-flex items-center rounded-full bg-koleksi-navy-dark px-6 py-2.5 text-base font-bold leading-6 text-white transition hover:bg-koleksi-navy"
                >
                  {t.common.register}
                </Link>
              </RevealItem>

              <RevealItem>
                <h3 className="text-xl leading-6 font-bold leading-8 text-koleksi-navy-dark">
                  {t.about.reRegistration}
                </h3>
                {about.daftarUlangAnggota && (
                  <RichText
                    html={about.daftarUlangAnggota}
                    className={`mt-4 ${BODY_TEXT} text-koleksi-navy-dark/80`}
                  />
                )}

                <Link
                  href="/daftar-ulang"
                  className="mt-8 inline-flex items-center rounded-full border border-koleksi-navy-deep px-6 py-2.5 text-base font-bold leading-6 text-koleksi-navy-deep transition hover:border-koleksi-navy-deep/60"
                >
                  {t.about.reRegister}
                </Link>
              </RevealItem>
            </RevealGrid>
          </RevealGroup>

          {/* Sponsorship & Partnership */}
          <RevealGroup
            id="sponsorship-partnership"
            className="mt-24 scroll-mt-28"
          >
            <RevealItem>
              <SectionHeader title={t.about.tabs.sponsorship} />
            </RevealItem>

            <RevealItem>
              {documents.sponsor || documents.mitra ? (
                <>
                  <p className={`${BODY_TEXT} text-koleksi-navy-dark/60`}>
                    {t.about.downloadDocuments}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {documents.sponsor && (
                      <a
                        href={documents.sponsor}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={DOC_BUTTON_CLASS}
                      >
                        {t.about.sponsor}
                      </a>
                    )}
                    {documents.mitra && (
                      <a
                        href={documents.mitra}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={DOC_BUTTON_CLASS}
                      >
                        {t.about.partner}
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <EmptyNote>{t.about.noDocument}</EmptyNote>
              )}
            </RevealItem>
          </RevealGroup>

          {/* FAQ */}
          <RevealGroup id="faq" className="mt-24 scroll-mt-28">
            <RevealItem>
              <SectionHeader title={t.about.tabs.faq} />

              <h3 className="mb-6  text-xl font-bold leading-6 text-koleksi-navy-dark">
                {t.about.faqGeneral}
              </h3>
            </RevealItem>

            {about.faqs.length > 0 ? (
              <FaqAccordion items={about.faqs} />
            ) : (
              <EmptyNote>{t.about.noFaq}</EmptyNote>
            )}
          </RevealGroup>

          {/* Kontak Kami */}
          <RevealGroup id="kontak-kami" className="mt-24 scroll-mt-28">
            <RevealItem>
              <SectionHeader title={t.about.tabs.contact} />
            </RevealItem>

            <RevealItem>
              <ContactForm />
            </RevealItem>
          </RevealGroup>
        </SectionContainer>
      </main>
      <Footer />
    </>
  );
}
