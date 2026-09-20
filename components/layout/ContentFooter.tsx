import Link from "next/link";
import { RiInstagramFill, RiLinkedinFill, RiYoutubeFill } from "react-icons/ri";
import TikTokIcon from "@/components/ui/TikTokIcon";

const socialLinks = [
  { icon: RiInstagramFill, href: "https://instagram.com", label: "Instagram" },
  { icon: RiLinkedinFill, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: TikTokIcon, href: "https://tiktok.com", label: "TikTok" },
  { icon: RiYoutubeFill, href: "https://youtube.com", label: "YouTube" },
];

export default function ContentFooter() {
  return (
    <footer className="mt-16 lg:mt-30">
      <h3 className="text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark">
        Ikuti Kami
      </h3>
      <div className="mt-5 flex gap-5">
        {socialLinks.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-koleksi-navy-dark/40 transition hover:text-koleksi-green dark:text-ink-dark/40"
          >
            <Icon size={32} />
          </a>
        ))}
      </div>

      <div className="mt-16 flex gap-4 text-xs font-bold text-koleksi-navy-dark dark:text-ink-dark">
        <Link href="/syarat-ketentuan" className="underline">
          Syarat & Ketentuan
        </Link>
        <Link href="/kebijakan-privasi" className="underline">
          Kebijakan Privasi
        </Link>
      </div>
      <p className="mt-2 text-xs text-koleksi-navy-dark/50 dark:text-ink-dark/50">
        &copy; {new Date().getFullYear()} KOLEKSI CLUB. All Rights Reserved.
      </p>
    </footer>
  );
}
