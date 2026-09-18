"use client";

import { CSSProperties, ElementType, ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Top-level: title vs. content below it shouldn't reveal at the same time. */
const revealSection: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.28, delayChildren: 0.05 },
  },
};

/** Nested: cards in a loop (grid/slider) reveal one after another, not all at once. */
const revealGrid: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, ease: EASE_OUT },
  },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  /** Render as a different tag than <div> (e.g. "p", "ul", "li"). */
  as?: ElementType;
}

/** Wrap a whole section with this once (in page.tsx) -- it observes the
 * viewport itself and cascades the reveal down to any RevealGrid/RevealItem
 * nested inside, however deep, even through plain non-motion wrappers. */
export function RevealGroup({
  children,
  className,
  style,
  id,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  return (
    <MotionTag
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
      variants={revealSection}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}

/** Wrap a grid/list/slider of repeating cards -- staggers its RevealItem
 * children once the surrounding RevealGroup reveals it. No viewport logic
 * of its own; it only relays the state it inherits. */
export function RevealGrid({
  children,
  className,
  style,
  id,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  return (
    <MotionTag
      id={id}
      variants={revealGrid}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}

/** A single reveal-in-view unit (a title block, a card, a button row...). */
export function RevealItem({
  children,
  className,
  style,
  id,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  return (
    <MotionTag
      id={id}
      variants={revealItem}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}
