import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "@/components/i18n/Link";
import { ArrowLeft, Pin } from "lucide-react";
import ContentActions from "@/components/ui/ContentActions";
import Dot from "@/components/ui/Dot";
import RoleBadge from "@/components/ui/RoleBadge";
import StarRating from "@/components/ui/StarRating";
import { ApiError } from "@/lib/api/client";
import { getSessionToken } from "@/lib/auth/session";
import { expiredPath } from "@/lib/auth/validation";
import { format } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { getForumComments, getForumDiscussion } from "@/services/forum";
import { DEFAULT_DISCUSSION_IMAGE, formatTanggal } from "../data";
import DiskusiDiscussion from "./DiskusiDiscussion";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.forum.title, robots: { index: false } };
}

/** Detail diskusi (khusus member). Diskusi yang disembunyikan / dihapus admin = 404. */
export default async function DiskusiDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const path = `/forum/diskusi/${slug}`;
  if (!/^[a-z0-9-]{1,190}$/.test(slug)) notFound();

  const token = await getSessionToken();
  if (!token) redirect(expiredPath(path, locale));

  let data;
  try {
    data = await Promise.all([getForumDiscussion(token, slug), getForumComments(token, slug, 1)]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect(expiredPath(path, locale));
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const [item, comments] = data;
  const t = await getDictionary(locale);
  // Isi teks biasa: paragraf dipisah baris kosong, baris baru di dalam paragraf dipertahankan
  const paragraphs = item.body.split(/\n{2,}/);

  return (
    <div>
      <Link
        href="/forum/diskusi"
        aria-label={t.common.back}
        className="flex h-10 w-10 items-center justify-center rounded-full text-koleksi-navy-dark transition hover:bg-koleksi-navy-deep/5 dark:text-ink-dark"
      >
        <ArrowLeft size={24} />
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 xl:grid-cols-[1fr_270px] xl:items-start xl:gap-10">
        <div className="min-w-0">
          <div className="relative aspect-2/1 w-full overflow-hidden rounded-2xl bg-koleksi-navy-dark/10">
            <Image
              src={item.image ?? DEFAULT_DISCUSSION_IMAGE}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 730px, 100vw"
              priority
            />
          </div>

          {/* Rating rata-rata + jumlah pemberi rating */}
          <div className="mt-8 flex items-center gap-2">
            <StarRating value={item.rating.average} />
            <span className="text-[14px] leading-5 font-normal text-koleksi-navy-dark dark:text-ink-dark">
              {format(t.forum.ratingCount, { count: item.rating.count })}
            </span>
          </div>

          <h1 className="mt-3 text-[32px] font-bold leading-10 wrap-break-word text-koleksi-navy-dark dark:text-ink-dark">
            {item.title}
          </h1>

          {/* Penulis · Tanggal · Kategori */}
          <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
            {item.is_pinned && (
              <>
                <span className="inline-flex items-center gap-1 font-semibold text-koleksi-green-dark">
                  <Pin size={12} aria-hidden="true" />
                  {t.forum.pinned}
                </span>
                <Dot />
              </>
            )}
            <span>{item.author.name}</span>
            <RoleBadge role={item.author.role} />
            <Dot />
            <span>{formatTanggal(item.created_at, locale)}</span>
            <Dot />
            <span className="inline-flex w-fit items-center rounded-full bg-koleksi-green px-3 py-1 text-[12px] leading-3 font-semibold text-white">
              {item.category.name}
            </span>
          </div>

          <div className="mt-8 space-y-4 text-[14px] leading-[21px] wrap-break-word whitespace-pre-line text-koleksi-navy-dark/80 dark:text-ink-dark/70">
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Jumlah komentar, form komentar + rating, daftar komentar */}
          <DiskusiDiscussion
            key={item.slug}
            slug={item.slug}
            initialComments={comments.items}
            initialHasMore={comments.hasMore}
            commentsCount={item.comments_count}
            views={item.views_count}
            myRating={item.my_rating ?? 0}
            canRate={!item.is_mine}
            isLocked={item.is_locked}
            shareTitle={item.title}
          />
        </div>

        <aside className="hidden md:block">
          <ContentActions variant="navy" bookmark={{ type: "discussion", slug: item.slug }} shareTitle={item.title} />
        </aside>
      </div>
    </div>
  );
}
