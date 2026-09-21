import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ContentActions from "@/components/ui/ContentActions";
import Dot from "@/components/ui/Dot";
import StarRating from "@/components/ui/StarRating";
import {
  commentsBySlug,
  defaultContent,
  diskusiItems,
  formatTanggal,
} from "../data";
import DiskusiDiscussion from "./DiskusiDiscussion";

export default async function DiskusiDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = diskusiItems.find((d) => d.slug === slug);

  if (!item) notFound();

  const content = item.content ?? defaultContent;

  return (
    <div>
      <Link
        href="/forum/diskusi"
        aria-label="Kembali"
        className="flex h-10 w-10 items-center justify-center rounded-full text-koleksi-navy-dark transition hover:bg-koleksi-navy-deep/5 dark:text-ink-dark"
      >
        <ArrowLeft size={24} />
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 xl:grid-cols-[1fr_270px] xl:items-start xl:gap-10">
        <div>
          <div className="relative aspect-2/1 w-full overflow-hidden rounded-2xl">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 730px, 100vw"
              priority
            />
          </div>

          {/* Rating rata-rata + total */}
          <div className="mt-8 flex items-center gap-2">
            <StarRating value={item.rating ?? 0} />
            <span className="text-[14px] leading-5 font-normal text-koleksi-navy-dark dark:text-ink-dark">
              ({item.ratingCount ?? 0} rating)
            </span>
          </div>

          <h1 className="mt-3 text-[32px] font-bold leading-10 text-koleksi-navy-dark dark:text-ink-dark">
            {item.title}
          </h1>

          {/* User · Tanggal · Badge tag */}
          <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
            <span>{item.author}</span>
            <Dot />
            <span>{formatTanggal(item.date)}</span>
            <Dot />
            <span className="inline-flex w-fit items-center rounded-full bg-koleksi-green px-3 py-1 text-[12px] leading-3 font-semibold text-white">
              {item.tag}
            </span>
          </div>

          <div className="mt-8 space-y-4 text-justify text-[14px] leading-[21px] text-koleksi-navy-dark/80 dark:text-ink-dark/70">
            {content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Jumlah komentar, form komentar, dan daftar komentar */}
          <DiskusiDiscussion
            key={item.id}
            initialComments={commentsBySlug[item.slug] ?? []}
            views={item.views}
          />
        </div>

        {/* Right widget */}
        <aside className="hidden md:block">
          <ContentActions variant="navy" />
        </aside>
      </div>
    </div>
  );
}
