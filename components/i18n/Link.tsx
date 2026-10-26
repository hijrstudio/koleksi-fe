"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLocalizePath } from "./I18nProvider";

/**
 * Pengganti next/link: path internal otomatis mengikuti bahasa aktif ("/kegiatan" → "/en/kegiatan" saat
 * English). URL eksternal, anchor, dan /api/... tidak diubah. Pakai `import Link from "@/components/i18n/Link"`.
 */
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const localize = useLocalizePath();

  const localizedHref =
    typeof href === "string"
      ? localize(href)
      : href.pathname
        ? { ...href, pathname: localize(href.pathname) }
        : href;

  return <NextLink href={localizedHref} {...props} />;
}
