import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import clsx from "@/lib/clsx";

type Variant = "primary" | "outline" | "dark";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-koleksi-green text-white hover:bg-koleksi-green-dark focus-visible:ring-koleksi-green",
  outline:
    "border border-ink-light/20 text-ink-light hover:border-koleksi-green hover:text-koleksi-green dark:border-ink-dark/20 dark:text-ink-dark focus-visible:ring-koleksi-green",
  dark: "bg-koleksi-navy-dark text-white hover:bg-koleksi-navy focus-visible:ring-white",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-8 py-2.5 text-xl font-bold leading-[32px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

export function Button({
  children,
  variant = "primary",
  className,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  variant = "primary",
  className,
  href,
}: BaseProps & { href: string }) {
  return (
    <Link
      href={href}
      className={clsx(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </Link>
  );
}
