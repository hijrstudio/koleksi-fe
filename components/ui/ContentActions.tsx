"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Bookmark, BookmarkCheck, Check, Link2, Loader2, Share2 } from "lucide-react";
import { FaFacebookF, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import clsx from "@/lib/clsx";
import { useI18n } from "@/components/i18n/I18nProvider";
import { setBookmarkAction } from "@/app/actions/bookmark";
import { expiredPath } from "@/lib/auth/validation";
import { splitLocale } from "@/lib/i18n/config";
import type { BookmarkTarget } from "@/types";

/**
 * Tombol Simpan + Bagikan di halaman detail (artikel, berita, diskusi).
 * Halaman detail merendernya dua kali: di atas bagian bawah konten untuk
 * layar < 768px, dan di <aside> kanan/bawah untuk layar >= 768px.
 *
 * variant "green" (default): Simpan hijau -- artikel & berita.
 * variant "navy": Simpan navy + Bagikan border navy -- diskusi forum.
 *
 * Simpan: status dari /api/member/bookmarks; tamu → halaman masuk (kembali ke sini). Bagikan: link halaman ini
 * (preview judul + gambar dari Open Graph halaman) ke WhatsApp / Facebook / X / Telegram, salin link, atau menu
 * bagikan bawaan HP.
 */
export default function ContentActions({
  className,
  variant = "green",
  bookmark,
  shareTitle,
}: {
  className?: string;
  variant?: "green" | "navy";
  bookmark?: BookmarkTarget;
  /** Teks yang ikut dibagikan (judul konten). */
  shareTitle?: string;
}) {
  const { locale, t } = useI18n();
  const isNavy = variant === "navy";
  const [saved, setSaved] = useState(false);
  const [guest, setGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bookmark) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ type: bookmark.type, slug: bookmark.slug });
    fetch(`/api/member/bookmarks?${params}`, { cache: "no-store", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { saved: false, guest: false }))
      .then((data: { saved: boolean; guest: boolean }) => {
        setSaved(data.saved);
        setGuest(data.guest);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [bookmark]);

  // Tutup panel bagikan: klik di luar / Escape
  useEffect(() => {
    if (!shareOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!shareRef.current?.contains(e.target as Node)) setShareOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShareOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [shareOpen]);

  function toLogin() {
    window.location.assign(expiredPath(splitLocale(window.location.pathname).path, locale));
  }

  function toggleSave() {
    if (!bookmark) return;
    if (guest) return toLogin();

    const next = !saved;
    setSaved(next);
    setError(null);
    startTransition(async () => {
      const result = await setBookmarkAction(bookmark, next);
      if (result.ok) {
        setSaved(result.data.saved);
      } else {
        setSaved(!next);
        if (result.status === 401) return toLogin();
        setError(result.message);
      }
    });
  }

  // URL bersih (tanpa query/hash) supaya preview & link yang dibagikan konsisten
  function shareUrl() {
    return `${window.location.origin}${window.location.pathname}`;
  }

  const shareText = shareTitle ?? (typeof document !== "undefined" ? document.title : "");
  const targets = [
    { key: "whatsapp", label: t.share.whatsapp, Icon: FaWhatsapp, href: (u: string) => `https://wa.me/?text=${encodeURIComponent(`${shareText} ${u}`)}` },
    { key: "facebook", label: t.share.facebook, Icon: FaFacebookF, href: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
    { key: "x", label: t.share.x, Icon: FaXTwitter, href: (u: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(shareText)}` },
    { key: "telegram", label: t.share.telegram, Icon: FaTelegramPlane, href: (u: string) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(shareText)}` },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t.share.copy, shareUrl());
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: shareText, url: shareUrl() });
      setShareOpen(false);
    } catch {
      /* dibatalkan pengguna */
    }
  }

  const SaveIcon = saved ? BookmarkCheck : Bookmark;
  // Panel bagikan hanya tampil setelah diklik (di browser), jadi aman membaca navigator saat render
  const canNativeShare = shareOpen && typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      {bookmark && (
        <button
          type="button"
          onClick={toggleSave}
          disabled={pending}
          aria-pressed={saved}
          className={clsx(
            "flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition disabled:opacity-70",
            isNavy
              ? "bg-koleksi-navy-deep hover:bg-koleksi-navy dark:bg-koleksi-navy dark:hover:bg-koleksi-navy-deep dark:ring-1 dark:ring-white/30"
              : "bg-koleksi-green hover:bg-koleksi-green-dark",
          )}
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <SaveIcon size={16} />}
          {guest ? t.bookmark.loginToSave : saved ? t.bookmark.saved : t.bookmark.save}
        </button>
      )}
      {error && <p role="alert" className="text-center text-xs text-red-600 dark:text-red-400">{error}</p>}

      <div ref={shareRef} className="relative">
        <button
          type="button"
          onClick={() => setShareOpen((v) => !v)}
          aria-expanded={shareOpen}
          aria-haspopup="menu"
          className={clsx(
            "flex w-full items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold text-koleksi-navy-dark transition dark:text-ink-dark",
            isNavy
              ? "border-koleksi-navy-deep hover:border-koleksi-navy-deep/60 dark:border-ink-dark"
              : "border-border-light hover:border-koleksi-navy-deep dark:border-border-dark",
          )}
        >
          <Share2 size={16} />
          {t.common.share}
        </button>

        {shareOpen && (
          <div
            role="menu"
            aria-label={t.share.title}
            className="absolute right-0 left-0 z-30 mt-2 rounded-2xl border border-border-light bg-surface-light p-2 shadow-lg dark:border-border-dark dark:bg-surface-dark"
          >
            <p className="px-3 pt-1 pb-2 text-xs font-semibold text-koleksi-navy-dark/60 dark:text-ink-dark/60">{t.share.title}</p>
            {targets.map(({ key, label, Icon, href }) => (
              <a
                key={key}
                role="menuitem"
                href={href(typeof window !== "undefined" ? shareUrl() : "")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShareOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-koleksi-navy-dark transition hover:bg-muted-light dark:text-ink-dark dark:hover:bg-muted-dark"
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </a>
            ))}
            <button
              type="button"
              role="menuitem"
              onClick={copyLink}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-koleksi-navy-dark transition hover:bg-muted-light dark:text-ink-dark dark:hover:bg-muted-dark"
            >
              {copied ? <Check size={16} className="text-koleksi-green" /> : <Link2 size={16} />}
              <span aria-live="polite">{copied ? t.share.copied : t.share.copy}</span>
            </button>
            {canNativeShare && (
              <button
                type="button"
                role="menuitem"
                onClick={nativeShare}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-koleksi-navy-dark transition hover:bg-muted-light dark:text-ink-dark dark:hover:bg-muted-dark"
              >
                <Share2 size={16} />
                {t.share.more}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
