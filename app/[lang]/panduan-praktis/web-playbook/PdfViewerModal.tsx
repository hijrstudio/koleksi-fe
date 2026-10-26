"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/i18n/Link";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Loader2, X } from "lucide-react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import type { PlaybookListItem } from "@/types";
import { format, useI18n } from "@/components/i18n/I18nProvider";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** Perkiraan rasio tinggi/lebar sebelum halaman dirender (A4 portrait). */
const DEFAULT_PAGE_RATIO = 1.414;

/**
 * pdf.js dimuat hanya saat popup dibuka (tidak membebani halaman). Worker dibuat sekali lewat pola
 * `new Worker(new URL(..., import.meta.url))` supaya ikut di-bundle bundler.
 */
async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  if (!pdfjs.GlobalWorkerOptions.workerPort) {
    pdfjs.GlobalWorkerOptions.workerPort = new Worker(
      new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
      { type: "module" },
    );
  }
  return pdfjs;
}

interface PdfViewerModalProps {
  playbook: PlaybookListItem | null;
  /** Member login → tombol Unduh tampil. Tetap dicek ulang di server (/api/playbooks/{id}/download). */
  canDownload: boolean;
  onClose: () => void;
}

/**
 * Popup baca PDF Web Playbook. Halaman dirender ke canvas (bukan viewer PDF bawaan browser), jadi tidak ada
 * tombol unduh / cetak; klik kanan & Ctrl+S / Ctrl+P juga ditahan. Ini mencegah unduhan biasa, bukan
 * proteksi mutlak (file yang bisa dilihat selalu bisa di-screenshot).
 */
export default function PdfViewerModal({ playbook, canDownload, onClose }: PdfViewerModalProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (!playbook) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && ["s", "p"].includes(e.key.toLowerCase())) e.preventDefault();
    }
    window.addEventListener("keydown", onKeyDown);

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [playbook, onClose]);

  return (
    <AnimatePresence>
      {playbook && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="playbook-viewer-title"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="flex h-full max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-surface-dark"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-border-light px-5 py-4 dark:border-border-dark">
              <h3
                id="playbook-viewer-title"
                className="line-clamp-2 text-lg font-bold leading-6 text-koleksi-navy-dark dark:text-ink-dark"
              >
                {playbook.title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.common.close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-koleksi-navy-deep/10 text-koleksi-navy-deep transition hover:bg-koleksi-navy-deep/20 dark:text-ink-dark"
              >
                <X size={18} />
              </button>
            </div>

            {/* key: ganti playbook → viewer & state-nya mulai dari awal */}
            <PdfPages key={playbook.id} url={`/api/playbooks/${playbook.id}/file`} />

            <div className="flex items-center justify-between gap-4 border-t border-border-light px-5 py-4 dark:border-border-dark">
              {canDownload ? (
                <span />
              ) : (
                <p className="text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/60">
                  <Link
                    href="/masuk?next=%2Fpanduan-praktis%2Fweb-playbook"
                    className="font-bold text-koleksi-navy-dark underline underline-offset-2 hover:text-koleksi-green dark:text-ink-dark"
                  >
                    {t.guide.playbook.loginLink}
                  </Link>{" "}
                  {t.guide.playbook.loginToDownload}
                </p>
              )}

              {canDownload && (
                <a
                  href={`/api/playbooks/${playbook.id}/download`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-koleksi-green px-6 py-2.5 text-base font-bold leading-6 text-white transition hover:bg-koleksi-green-dark"
                >
                  <Download size={18} aria-hidden="true" />
                  {t.common.download}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Semua halaman PDF, dirender ke canvas saat mendekati area pandang (hemat memori untuk PDF panjang). */
function PdfPages({ url }: { url: string }) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let destroy: (() => void) | undefined;

    loadPdfjs()
      .then((pdfjs) => {
        if (cancelled) return;
        const task = pdfjs.getDocument({ url, enableXfa: false });
        destroy = () => void task.destroy();
        return task.promise;
      })
      .then((loaded) => {
        if (!cancelled && loaded) setDoc(loaded);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [url]);

  // Lebar halaman mengikuti lebar popup
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className="flex-1 select-none overflow-y-auto bg-koleksi-navy-deep/5 px-3 py-4 sm:px-6 dark:bg-black/20"
    >
      {error && (
        <p role="alert" className="py-16 text-center text-sm text-red-600 dark:text-red-400">
          {t.guide.playbook.documentError}
        </p>
      )}

      {!error && !doc && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-koleksi-navy-dark/60 dark:text-ink-dark/60">
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          {t.guide.playbook.documentLoading}
        </div>
      )}

      {doc && width > 0 && (
        <div className="mx-auto flex flex-col gap-4">
          {Array.from({ length: doc.numPages }, (_, i) => (
            <PdfPage key={i + 1} doc={doc} pageNumber={i + 1} width={width} />
          ))}
        </div>
      )}
    </div>
  );
}

function PdfPage({ doc, pageNumber, width }: { doc: PDFDocumentProxy; pageNumber: number; width: number }) {
  const { t } = useI18n();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [ratio, setRatio] = useState(DEFAULT_PAGE_RATIO);

  // Render hanya saat halaman mendekati area pandang (sekali saja)
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    let renderTask: RenderTask | null = null;

    doc.getPage(pageNumber).then((page) => {
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;

      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: width / base.width });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      setRatio(viewport.height / viewport.width);

      renderTask = page.render({
        canvas,
        viewport,
        transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
      });
      renderTask.promise.catch(() => {
        // Dibatalkan (popup ditutup / ukuran berubah) — abaikan
      });
    });

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [doc, pageNumber, width, visible]);

  return (
    <div
      ref={wrapperRef}
      style={{ height: Math.round(width * ratio) }}
      className="w-full overflow-hidden rounded-md bg-white shadow-sm"
    >
      <canvas
        ref={canvasRef}
        aria-label={format(t.guide.playbook.pageOf, { page: pageNumber, total: doc.numPages })}
        role="img"
        className="block h-full w-full"
      />
    </div>
  );
}
