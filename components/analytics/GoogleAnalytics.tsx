import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js). ID diambil dari NEXT_PUBLIC_GA_ID saat build (lihat Dockerfile & workflow deploy);
 * kosong = tidak dipasang (dev lokal / tes docker tidak ikut terhitung). ID GA bukan rahasia: memang tampil di HTML.
 * Pindah halaman (client navigation) tercatat otomatis oleh "enhanced measurement" GA4 (perubahan history).
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export default function GoogleAnalytics() {
  // Hanya format ID GA4 yang sah, karena nilainya ditulis ke dalam script inline
  if (!/^G-[A-Z0-9]{4,20}$/.test(GA_ID)) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
