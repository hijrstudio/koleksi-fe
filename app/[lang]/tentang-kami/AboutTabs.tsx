"use client";

import { useState } from "react";
import clsx from "@/lib/clsx";
import { useI18n } from "@/components/i18n/I18nProvider";

/** id = anchor section di halaman Tentang Kami; key = label di dictionary (t.about.tabs). */
const TABS = [
  { id: "profil-organisasi", key: "profile" },
  { id: "kepengurusan", key: "management" },
  { id: "visi-misi", key: "visionMission" },
  { id: "aturan-adart", key: "rules" },
  { id: "informasi-keanggotaan", key: "membershipInfo" },
  { id: "sponsorship-partnership", key: "sponsorship" },
  { id: "faq", key: "faq" },
  { id: "kontak-kami", key: "contact" },
] as const;

export default function AboutTabs() {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState<string>(TABS[0].id);

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
                ? "bg-muted-steel text-white"
                : "bg-koleksi-navy-deep/10 text-koleksi-navy-deep hover:bg-koleksi-navy-deep/15",
            )}
          >
            {t.about.tabs[tab.key]}
          </button>
        );
      })}
    </div>
  );
}
