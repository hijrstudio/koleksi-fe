"use client";

import { useState } from "react";
import clsx from "@/lib/clsx";

const TABS = [
  { id: "profil-organisasi", label: "Profil Organisasi" },
  { id: "kepengurusan", label: "Kepengurusan" },
  { id: "visi-misi", label: "Visi & Misi" },
  { id: "aturan-adart", label: "Aturan & AD/ART" },
  { id: "informasi-keanggotaan", label: "Informasi Keanggotaan" },
  { id: "sponsorship-partnership", label: "Sponsorship & Partnership" },
  { id: "faq", label: "FAQ" },
  { id: "kontak-kami", label: "Kontak Kami" },
];

export default function AboutTabs() {
  const [activeId, setActiveId] = useState(TABS[0].id);

  return (
    <div className="flex flex-wrap justify-center gap-3 md:max-w-[80%] md:mx-auto">
      {TABS.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveId(tab.id);
              document
                .getElementById(tab.id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={clsx(
              "rounded-[22px] px-5 py-2.5 text-base font-bold leading-6 transition cursor-pointer",
              isActive
                ? "bg-[#64748B] text-white"
                : "bg-koleksi-navy-deep/10 text-koleksi-navy-deep hover:bg-koleksi-navy-deep/15",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
