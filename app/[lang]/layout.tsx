import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import I18nProvider from "@/components/i18n/I18nProvider";
import { HTML_LANG, LOCALES, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/server";
import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

/** Halaman dibangun statis untuk kedua bahasa (ID tanpa prefix lewat proxy.ts, EN di /en). */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getDictionary(lang);

  return {
    title: t.meta.siteTitle,
    description: t.meta.siteDescription,
    // Beritahu mesin pencari pasangan halaman ID & EN
    alternates: { languages: { id: "/", en: "/en" } },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dictionary = await getDictionary(lang);

  return (
    <html
      lang={HTML_LANG[lang]}
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider locale={lang} dictionary={dictionary}>
          <ThemeProvider>{children}</ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
