"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "@/lib/clsx";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";

interface FaqItemData {
  question: string;
  answer: string;
}

function FaqItem({ question, answer }: FaqItemData) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border-light dark:border-border-dark">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-base font-bold text-koleksi-navy-dark">
          {question}
        </span>
        <ChevronDown
          size={18}
          className={clsx(
            "shrink-0 text-koleksi-navy-dark transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/80">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqAccordion({ items }: { items: FaqItemData[] }) {
  return (
    <RevealGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <RevealItem key={item.question}>
          <FaqItem {...item} />
        </RevealItem>
      ))}
    </RevealGrid>
  );
}
