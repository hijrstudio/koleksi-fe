"use client";

import { useState, useTransition, type ComponentProps } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Star } from "lucide-react";
import clsx from "@/lib/clsx";
import ContentActions from "@/components/ui/ContentActions";
import Dot from "@/components/ui/Dot";
import RoleBadge from "@/components/ui/RoleBadge";
import { format, useI18n } from "@/components/i18n/I18nProvider";
import { postCommentAction, rateDiscussionAction } from "@/app/actions/forum";
import { expiredPath } from "@/lib/auth/validation";
import { splitLocale } from "@/lib/i18n/config";
import type { ForumComment, ForumPage, Locale } from "@/types";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** = backend ForumComment::BODY_MAX / MAX_DEPTH */
const COMMENT_MAX = 2000;
const MAX_DEPTH = 2;

/**
 * Sesi habis di tengah jalan → /api/auth/expired (hapus cookie) → halaman masuk → kembali ke diskusi ini.
 * Path tanpa prefix bahasa; bahasa ikut lewat expiredPath.
 */
function toLogin(locale: Locale) {
  window.location.assign(expiredPath(splitLocale(window.location.pathname).path, locale));
}

/**
 * Kolom komentar: div dengan `background: rgba(10, 22, 40, 0.0333333)` dan
 * `border-radius: 10px` (= bg-koleksi-navy-dark/[0.0333] rounded-[10px]);
 * textarea di dalamnya transparan.
 */
function CommentField({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <div className="rounded-[10px] border border-border-light bg-koleksi-navy-dark/[0.0333] transition focus-within:border-koleksi-navy-deep dark:border-border-dark dark:bg-white/5">
      <textarea
        maxLength={COMMENT_MAX}
        {...props}
        className={clsx(
          "block w-full resize-none bg-transparent px-5 py-4 text-sm text-koleksi-navy-dark placeholder:text-koleksi-navy-dark/40 focus:outline-none dark:text-ink-dark",
          className,
        )}
      />
    </div>
  );
}

const SEND_BUTTON_CLASS =
  "inline-flex items-center gap-2 rounded-full bg-koleksi-navy-deep px-6 py-2.5 text-sm font-bold text-white transition hover:bg-koleksi-navy disabled:opacity-60 dark:bg-koleksi-green dark:hover:bg-koleksi-green-dark";

/**
 * Sisipkan balasan baru di pohon komentar. Backend menempelkan balasan dari komentar tingkat terdalam ke
 * induknya (maks 3 tingkat), jadi di sini juga: balasan untuk komentar depth 2 masuk ke induk komentar itu.
 */
function insertReply(list: ForumComment[], parentId: number, reply: ForumComment): ForumComment[] {
  return list.map((c) => {
    if (c.id === parentId) return { ...c, replies: [...c.replies, reply] };
    if (c.replies.some((r) => r.id === parentId && r.depth >= MAX_DEPTH)) {
      return { ...c, replies: [...c.replies, reply] };
    }
    return { ...c, replies: insertReply(c.replies, parentId, reply) };
  });
}

/** 5 bintang outline; hover mewarnai sampai bintang yang di-hover, klik menyimpan. */
function RatingInput({
  value,
  disabled,
  onChange,
}: {
  value: number;
  disabled?: boolean;
  onChange: (rating: number) => void;
}) {
  const { t } = useI18n();
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(null)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          aria-label={format(t.forum.rateValue, { value: n })}
          aria-pressed={value === n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(null)}
          className="cursor-pointer disabled:cursor-not-allowed"
        >
          <Star
            size={16}
            fill={n <= shown ? "currentColor" : "none"}
            className={clsx(
              "transition-colors duration-200",
              n <= shown ? "text-koleksi-amber" : "text-koleksi-navy-dark/40 dark:text-ink-dark/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function ReplyForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (text: string) => Promise<string | null>;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const canSend = text.trim().length > 0 && !pending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSend) return;
        startTransition(async () => setError(await onSubmit(text.trim())));
      }}
    >
      <CommentField
        autoFocus
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.forum.replyPlaceholder}
        aria-label={t.forum.replyLabel}
        className="h-24"
      />
      {error && <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
      <div className="mt-3 flex items-center gap-3">
        <button type="submit" disabled={!canSend} className={SEND_BUTTON_CLASS}>
          {pending && <Loader2 size={14} className="animate-spin" />}
          {t.common.send}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-4 py-2.5 text-sm font-bold text-koleksi-navy-dark/60 transition hover:text-koleksi-navy-dark dark:text-ink-dark/60 dark:hover:text-ink-dark"
        >
          {t.auth.cancel}
        </button>
      </div>
    </form>
  );
}

function CommentThread({
  comment,
  replyingTo,
  canReply,
  onToggleReply,
  onSubmitReply,
  delay = 0,
}: {
  comment: ForumComment;
  replyingTo: number | null;
  canReply: boolean;
  onToggleReply: (id: number) => void;
  onSubmitReply: (parentId: number, text: string) => Promise<string | null>;
  delay?: number;
}) {
  const { t } = useI18n();
  const isReplying = replyingTo === comment.id;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay }}
        className="rounded-[10px] bg-koleksi-navy-dark/[0.0333] px-5 pt-5 pb-4 dark:bg-white/5"
      >
        {comment.hidden || !comment.author ? (
          <p className="text-sm italic text-koleksi-navy-dark/50 dark:text-ink-dark/50">{t.forum.hiddenComment}</p>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Image
                src={comment.author.avatar}
                alt={comment.author.name}
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full object-cover"
              />
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm font-bold text-koleksi-navy-dark dark:text-ink-dark">
                  {comment.author.name}
                </span>
                <RoleBadge role={comment.author.role} className="shrink-0" />
              </div>
            </div>

            <p className="mt-2 pl-11 text-sm leading-[21px] wrap-break-word whitespace-pre-line text-koleksi-navy-dark/80 dark:text-ink-dark/70">
              {comment.body}
            </p>

            {canReply && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  aria-expanded={isReplying}
                  onClick={() => onToggleReply(comment.id)}
                  className="cursor-pointer text-xs leading-4 text-koleksi-navy-dark/60 underline transition hover:text-koleksi-green dark:text-ink-dark/60"
                >
                  {t.forum.reply}
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>

      <AnimatePresence initial={false}>
        {isReplying && (
          <motion.div
            key="reply-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="ml-5 overflow-hidden"
          >
            <div className="pt-3">
              <ReplyForm
                onSubmit={(text) => onSubmitReply(comment.id, text)}
                onCancel={() => onToggleReply(comment.id)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Balasan: kartu terpisah, menjorok ke kanan dari komentar induk */}
      {comment.replies.map((reply) => (
        <div key={reply.id} className="mt-3 ml-5">
          <CommentThread
            comment={reply}
            replyingTo={replyingTo}
            canReply={canReply}
            onToggleReply={onToggleReply}
            onSubmitReply={onSubmitReply}
          />
        </div>
      ))}
    </div>
  );
}

interface DiskusiDiscussionProps {
  slug: string;
  initialComments: ForumComment[];
  initialHasMore: boolean;
  commentsCount: number;
  views: number;
  myRating: number;
  /** false = diskusi milik sendiri (tidak bisa memberi rating). */
  canRate: boolean;
  isLocked: boolean;
  /** Judul diskusi (teks yang ikut dibagikan). */
  shareTitle: string;
}

export default function DiskusiDiscussion({
  slug,
  initialComments,
  initialHasMore,
  commentsCount,
  views,
  myRating,
  canRate,
  isLocked,
  shareTitle,
}: DiskusiDiscussionProps) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [count, setCount] = useState(commentsCount);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(myRating);
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const [ratingPending, startRating] = useTransition();

  const canSend = text.trim().length > 0 && !pending;

  async function send(body: string, parentId?: number): Promise<{ comment?: ForumComment; error?: string }> {
    const result = await postCommentAction(slug, body, parentId);
    if (result.ok) return { comment: result.data };
    if (result.status === 401) toLogin(locale);
    return { error: result.message };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    startTransition(async () => {
      const { comment, error: message } = await send(text.trim());
      if (comment) {
        setComments((prev) => [...prev, comment]);
        setCount((c) => c + 1);
        setText("");
      }
      setError(message ?? null);
    });
  }

  async function handleSubmitReply(parentId: number, replyText: string): Promise<string | null> {
    const { comment, error: message } = await send(replyText, parentId);
    if (comment) {
      setComments((prev) => insertReply(prev, parentId, comment));
      setCount((c) => c + 1);
      setReplyingTo(null);
    }
    return message ?? null;
  }

  function handleRate(rating: number) {
    const previous = userRating;
    setUserRating(rating);
    startRating(async () => {
      const result = await rateDiscussionAction(slug, rating);
      if (result.ok) {
        setRatingMessage(t.forum.ratingSaved);
        router.refresh(); // perbarui rata-rata rating di atas
      } else {
        if (result.status === 401) toLogin(locale);
        setUserRating(previous);
        setRatingMessage(result.message);
      }
    });
  }

  async function loadMore() {
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/forum/discussions/${encodeURIComponent(slug)}/comments?page=${page + 1}`, { cache: "no-store" });
      if (res.status === 401) return toLogin(locale);
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as ForumPage<ForumComment>;
      setComments((prev) => [...prev, ...data.items.filter((c) => !prev.some((p) => p.id === c.id))]);
      setHasMore(data.hasMore);
      setPage((p) => p + 1);
    } catch {
      setError(t.forum.loadError);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <>
      {/* Komentar · Dilihat */}
      <div className="mt-10 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
        <span>{format(t.forum.comments, { count })}</span>
        <Dot />
        <span>{format(t.forum.views, { count: views })}</span>
      </div>

      {/* Simpan / Bagikan -- mobile only (di desktop ada di aside kanan) */}
      <ContentActions variant="navy" className="mt-8 md:hidden" bookmark={{ type: "discussion", slug }} shareTitle={shareTitle} />

      {isLocked ? (
        <p className="mt-10 rounded-[10px] bg-koleksi-navy-dark/[0.0333] px-5 py-4 text-sm text-koleksi-navy-dark/70 md:mt-16 dark:bg-white/5 dark:text-ink-dark/70">
          {t.forum.locked}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 md:mt-16">
          <CommentField
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.forum.commentPlaceholder}
            aria-label={t.forum.commentLabel}
            className="h-30"
          />
          {error && <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <button type="submit" disabled={!canSend} className={SEND_BUTTON_CLASS}>
              {pending && <Loader2 size={14} className="animate-spin" />}
              {t.common.send}
            </button>
            {canRate && (
              <div className="flex items-center gap-3">
                <span className="text-[14px] leading-5 font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
                  {t.forum.rate}
                </span>
                <RatingInput value={userRating} disabled={ratingPending} onChange={handleRate} />
              </div>
            )}
          </div>
          {ratingMessage && (
            <p aria-live="polite" className="mt-2 text-right text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">
              {ratingMessage}
            </p>
          )}
        </form>
      )}

      {/* Diskusi terkunci tetap bisa diberi rating */}
      {isLocked && canRate && (
        <div className="mt-5 flex items-center gap-3">
          <span className="text-[14px] leading-5 font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">{t.forum.rate}</span>
          <RatingInput value={userRating} disabled={ratingPending} onChange={handleRate} />
        </div>
      )}

      {comments.length === 0 ? (
        <p className="mt-14 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">{t.forum.noComments}</p>
      ) : (
        <div className="mt-14 flex flex-col gap-5">
          {comments.map((comment, index) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              replyingTo={replyingTo}
              canReply={!isLocked}
              onToggleReply={(id) => setReplyingTo((prev) => (prev === id ? null : id))}
              onSubmitReply={handleSubmitReply}
              delay={(index % 20) * 0.05}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-koleksi-navy-deep px-6 py-2.5 text-sm font-bold text-koleksi-navy-deep transition hover:border-koleksi-navy-deep/60 disabled:opacity-60 dark:border-white dark:text-white"
        >
          {loadingMore && <Loader2 size={16} className="animate-spin" />}
          {loadingMore ? t.common.loading : t.forum.loadMoreComments}
        </button>
      )}
    </>
  );
}
