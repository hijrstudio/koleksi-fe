"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";
import clsx from "@/lib/clsx";
import { peringkatList } from "./data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Warna trofi juara 1-3 (emas, perak, perunggu) -- diambil dari desain.
const TROPHY_COLORS = ["text-[#ccb129]", "text-[#bfbfbf]", "text-[#bf6c31]"];

export default function PapanPeringkatPage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_270px] xl:gap-10">
      <div>
        <h2 className="text-xl font-bold text-koleksi-navy-dark dark:text-ink-dark">
          Papan Peringkat
        </h2>

        <ol className="mt-9 flex flex-col gap-2">
          {peringkatList.map((item, index) => {
            const rank = index + 1;
            const isTop = rank <= 3;

            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: EASE_OUT,
                  delay: index * 0.05,
                }}
                // Top 3: bg rgba(10,22,40,0.0333) tanpa garis; 4+: putih + border.
                className={clsx(
                  "flex items-center gap-5.5 rounded-[10px] border p-5",
                  isTop
                    ? "border-transparent bg-koleksi-navy-dark/[0.0333] dark:bg-white/5"
                    : "border-border-light dark:border-border-dark",
                )}
              >
                <Image
                  src={item.avatar}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={clsx(
                        "inline-block rounded-full border border-muted-steel px-2 py-1 text-[10px] leading-3 font-bold",
                        isTop ? "bg-muted-steel text-white" : "text-muted-steel",
                      )}
                    >
                      #{rank}
                    </span>
                    {isTop && (
                      <FaTrophy
                        size={18}
                        role="img"
                        aria-label={`Juara ${rank}`}
                        className={clsx("shrink-0", TROPHY_COLORS[index])}
                      />
                    )}
                  </div>
                  <p className="mt-2 flex items-baseline gap-2.5 text-sm leading-5">
                    <span className="shrink-0 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                      {item.name}
                    </span>
                    <span className="truncate font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                      {item.city}
                    </span>
                  </p>
                </div>

                {/* XP sejajar dengan baris badge (rata atas) */}
                <span className="shrink-0 self-start text-base leading-5 font-bold text-koleksi-navy-dark dark:text-ink-dark">
                  {item.xp} XP
                </span>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {/* Empty spacer matching the article-list page's right widget
          column, so this content column is the exact same width even
          though there's no widget here. */}
      <div aria-hidden="true" className="hidden xl:block" />
    </div>
  );
}
