import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "@/components/i18n/Link";
import { ArrowLeft } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { expiredPath } from "@/lib/auth/validation";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getForumCategories } from "@/services/forum";
import CreateDiscussionForm from "./CreateDiscussionForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.forum.create.metaTitle, robots: { index: false } };
}

/** Buat diskusi (khusus member). Diskusi langsung terbit; admin bisa memoderasi di CMS. */
export default async function BuatDiskusiPage() {
  const locale = await getLocale();
  const token = await getSessionToken();
  if (!token) redirect(expiredPath("/forum/diskusi/buat", locale));

  let categories;
  try {
    categories = await getForumCategories(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(expiredPath("/forum/diskusi/buat", locale));
    throw error;
  }
  const t = await getDictionary(locale);

  return (
    <div className="max-w-3xl">
      <Link
        href="/forum/diskusi"
        aria-label={t.common.back}
        className="flex h-10 w-10 items-center justify-center rounded-full text-koleksi-navy-dark transition hover:bg-koleksi-navy-deep/5 dark:text-ink-dark"
      >
        <ArrowLeft size={24} />
      </Link>
      <h1 className="mt-6 font-display text-[32px] font-bold leading-10 text-koleksi-navy dark:text-badge-liputan">
        {t.forum.create.title}
      </h1>
      <p className="mt-4 text-base leading-6 text-koleksi-navy-dark/80 dark:text-ink-dark/60">{t.forum.create.intro}</p>

      <CreateDiscussionForm categories={categories} />
    </div>
  );
}
