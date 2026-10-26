import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/home/HeroSlider";
import WelcomeStats from "@/components/home/WelcomeStats";
import PanduanPraktis from "@/components/home/PanduanPraktis";
import BeritaSection from "@/components/home/BeritaSection";
import CTABanner from "@/components/home/CTABanner";
import KegiatanTerbaru from "@/components/home/KegiatanTerbaru";
import PlaybookSection from "@/components/home/PlaybookSection";
import PartnerKami from "@/components/home/PartnerKami";
import SocialGrid from "@/components/home/SocialGrid";
import { RevealGroup } from "@/components/ui/Reveal";
import { instagramPosts, tiktokPosts } from "@/data/mockData";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSlider />
        <RevealGroup>
          <WelcomeStats />
        </RevealGroup>
        <RevealGroup>
          <PanduanPraktis />
        </RevealGroup>
        <RevealGroup>
          <BeritaSection />
        </RevealGroup>
        <RevealGroup>
          <CTABanner />
        </RevealGroup>
        <RevealGroup>
          <KegiatanTerbaru />
        </RevealGroup>
        <RevealGroup>
          <PlaybookSection />
        </RevealGroup>
        <RevealGroup>
          <PartnerKami />
        </RevealGroup>
        <RevealGroup>
          <SocialGrid
            title="Instagram"
            posts={instagramPosts}
            aspect="square"
            viewAllHref="https://instagram.com"
            topDivider
          />
        </RevealGroup>
        <RevealGroup>
          <SocialGrid
            title="TikTok"
            posts={tiktokPosts}
            aspect="portrait"
            viewAllHref="https://tiktok.com"
          />
        </RevealGroup>
      </main>
      <Footer />
    </>
  );
}
