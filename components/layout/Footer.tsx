import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { RiInstagramFill, RiLinkedinFill, RiYoutubeFill } from "react-icons/ri";
import TikTokIcon from "@/components/ui/TikTokIcon";

const socialLinks = [
  { icon: RiInstagramFill, href: "https://instagram.com", label: "Instagram" },
  { icon: RiLinkedinFill, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: TikTokIcon, href: "https://tiktok.com", label: "TikTok" },
  { icon: RiYoutubeFill, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-[#072B15] text-white/70">
      <div className="mx-auto max-w-[1400px] px-6 grid grid-cols-1 gap-10 py-14 sm:grid-cols-3">
        {/* Brand */}
        <div>
          <Image
            src="/images/logo-koleksi.svg"
            alt="Koleksi"
            width={233}
            height={100}
          />
          <p className="mt-6 text-xs text-white/40">Member of</p>
          <Image
            src="/images/logo-imi.png"
            alt="IMI"
            width={51}
            height={64}
            className="mt-3"
          />
        </div>

        {/* Secretariat */}
        <div>
          <h3 className="mb-4 text-base font-semibold text-white">
            Sekretariat KOLEKSI
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-koleksi-green"
              />
              <span>
                Jalan Cipinang Jaya No. 89, RT.007 RW.03 Kel. Cipinang Muara,
                Kec. Jatinegara, Jakarta Timur
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} className="shrink-0 text-koleksi-green" />
              <a href="mailto:halo@koleksi.club" className="hover:text-white">
                halo@koleksi.club
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="shrink-0 text-koleksi-green" />
              <span>0818 700 111 / 0813 1000 2000</span>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-4 text-base font-semibold text-white">
            Ikuti Kami di
          </h3>
          <div className="flex gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-koleksi-green hover:text-koleksi-green"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pb-10 text-xs text-white/40">
        <div className="flex gap-4">
          <Link
            href="/syarat-ketentuan"
            className="text-white underline hover:text-white/70"
          >
            Syarat &amp; Ketentuan
          </Link>
          <Link
            href="/kebijakan-privasi"
            className="text-white underline hover:text-white/70"
          >
            Kebijakan Privasi
          </Link>
        </div>
        <p className="mt-3">
          &copy; {new Date().getFullYear()} KOLEKSI CLUB. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
