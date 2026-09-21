"use client";

import { useState, type ComponentProps } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import clsx from "@/lib/clsx";
import ContentActions from "@/components/ui/ContentActions";
import Dot from "@/components/ui/Dot";
import RoleBadge from "@/components/ui/RoleBadge";
import { countComments, type DiskusiComment } from "../data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Kolom komentar: div dengan `background: rgba(10, 22, 40, 0.0333333)` dan
 * `border-radius: 10px` (= bg-koleksi-navy-dark/[0.0333] rounded-[10px]);
 * textarea di dalamnya transparan.
 */
function CommentField({
  className,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <div className="rounded-[10px] border border-border-light bg-koleksi-navy-dark/[0.0333] transition focus-within:border-koleksi-navy-deep dark:border-border-dark dark:bg-white/5">
      <textarea
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
  "rounded-full bg-koleksi-navy-deep px-6 py-2.5 text-sm font-bold text-white transition hover:bg-koleksi-navy";

// Mock "user yang sedang login" untuk komentar baru.
const CURRENT_USER = {
  author: "User",
  role: "Member",
  avatar: "/images/profil-1.jpg",
};

function createComment(text: string): DiskusiComment {
  return {
    id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...CURRENT_USER,
    text,
    replies: [],
  };
}

function addReplyTo(
  list: DiskusiComment[],
  parentId: string,
  reply: DiskusiComment,
): DiskusiComment[] {
  return list.map((c) =>
    c.id === parentId
      ? { ...c, replies: [...c.replies, reply] }
      : { ...c, replies: addReplyTo(c.replies, parentId, reply) },
  );
}

/** 5 bintang outline; hover mewarnai sampai bintang yang di-hover, klik menyimpan. */
function RatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHover(null)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Beri rating ${n} dari 5`}
          aria-pressed={value === n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(null)}
          className="cursor-pointer"
        >
          {/* Aktif (hover / terpilih): bintang penuh koleksi-amber, bukan
              hanya garis tepi -- `fill` diberi lewat atribut supaya pasti
              terisi. */}
          <Star
            size={16}
            fill={n <= shown ? "currentColor" : "none"}
            className={clsx(
              "transition-colors duration-200",
              n <= shown
                ? "text-koleksi-amber"
                : "text-koleksi-navy-dark/40 dark:text-ink-dark/40",
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
  onSubmit: (text: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSend) onSubmit(text.trim());
      }}
    >
      <CommentField
        autoFocus
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Balas komentar..."
        aria-label="Balas komentar"
        className="h-24"
      />
      <div className="mt-3 flex items-center gap-3">
        <button type="submit" className={SEND_BUTTON_CLASS}>
          Kirim
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-4 py-2.5 text-sm font-bold text-koleksi-navy-dark/60 transition hover:text-koleksi-navy-dark dark:text-ink-dark/60 dark:hover:text-ink-dark"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

function CommentThread({
  comment,
  replyingTo,
  onToggleReply,
  onSubmitReply,
  delay = 0,
}: {
  comment: DiskusiComment;
  replyingTo: string | null;
  onToggleReply: (id: string) => void;
  onSubmitReply: (parentId: string, text: string) => void;
  delay?: number;
}) {
  const isReplying = replyingTo === comment.id;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay }}
        className="rounded-[10px] bg-koleksi-navy-dark/[0.0333] px-5 pt-5 pb-4 dark:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <Image
            src={comment.avatar}
            alt={comment.author}
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full object-cover"
          />
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-bold text-koleksi-navy-dark dark:text-ink-dark">
              {comment.author}
            </span>
            <RoleBadge role={comment.role} className="shrink-0" />
          </div>
        </div>

        <p className="mt-2 pl-11 text-sm leading-[21px] wrap-break-word text-koleksi-navy-dark/80 dark:text-ink-dark/70">
          {comment.text}
        </p>

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            aria-expanded={isReplying}
            onClick={() => onToggleReply(comment.id)}
            className="cursor-pointer text-xs leading-4 text-koleksi-navy-dark/60 underline transition hover:text-koleksi-green dark:text-ink-dark/60"
          >
            Reply
          </button>
        </div>
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
            onToggleReply={onToggleReply}
            onSubmitReply={onSubmitReply}
          />
        </div>
      ))}
    </div>
  );
}

export default function DiskusiDiscussion({
  initialComments,
  views,
}: {
  initialComments: DiskusiComment[];
  views: number;
}) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const canSend = text.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setComments((prev) => [...prev, createComment(text.trim())]);
    setText("");
  }

  function handleSubmitReply(parentId: string, replyText: string) {
    setComments((prev) =>
      addReplyTo(prev, parentId, createComment(replyText)),
    );
    setReplyingTo(null);
  }

  return (
    <>
      {/* Komentar · Dilihat */}
      <div className="mt-10 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] leading-[14px] font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
        <span>{countComments(comments)} Komentar</span>
        <Dot />
        <span>Dilihat: {views}</span>
      </div>

      {/* Simpan / Bagikan -- mobile only (di desktop ada di aside kanan) */}
      <ContentActions variant="navy" className="mt-8 md:hidden" />

      <form onSubmit={handleSubmit} className="mt-10 md:mt-16">
        <CommentField
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Komentar disini..."
          aria-label="Komentar"
          className="h-30"
        />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <button type="submit" className={SEND_BUTTON_CLASS}>
            Kirim
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[14px] leading-5 font-normal text-koleksi-navy-dark/60 dark:text-ink-dark/50">
              Beri rating:
            </span>
            <RatingInput value={userRating} onChange={setUserRating} />
          </div>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="mt-14 text-sm text-koleksi-navy-dark/50 dark:text-ink-dark/50">
          Belum ada komentar. Jadilah yang pertama berkomentar.
        </p>
      ) : (
        <div className="mt-14 flex flex-col gap-5">
          {comments.map((comment, index) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              replyingTo={replyingTo}
              onToggleReply={(id) =>
                setReplyingTo((prev) => (prev === id ? null : id))
              }
              onSubmitReply={handleSubmitReply}
              delay={index * 0.08}
            />
          ))}
        </div>
      )}
    </>
  );
}
