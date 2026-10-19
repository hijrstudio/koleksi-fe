"use client";

import { DragEvent, useId, useState } from "react";
import { FileText, X } from "lucide-react";
import clsx from "@/lib/clsx";

interface FileDropzoneProps {
  files: File[];
  onChange: (files: File[]) => void;
  /** Batas ukuran per file, dalam MB. */
  maxSizeMb: number;
  accept?: string;
  invalid?: boolean;
  describedBy?: string;
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Area unggah dokumen: drag & drop atau klik "Unggah". */
export default function FileDropzone({
  files,
  onChange,
  maxSizeMb,
  accept,
  invalid,
  describedBy,
}: FileDropzoneProps) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const maxBytes = maxSizeMb * 1024 * 1024;
    const incoming = Array.from(list);
    const ok = incoming.filter((f) => f.size <= maxBytes);
    setRejected(incoming.filter((f) => f.size > maxBytes).map((f) => f.name));
    // Nama sama = file yang sama, jangan dobel.
    const names = new Set(files.map((f) => f.name));
    onChange([...files, ...ok.filter((f) => !names.has(f.name))]);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        aria-describedby={describedBy}
        className={clsx(
          "flex h-42.5 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center transition",
          dragging
            ? "border-koleksi-green bg-koleksi-green/5"
            : invalid
              ? "border-red-500"
              : "border-koleksi-navy-dark/20 dark:border-border-dark",
        )}
      >
        <p className="text-xs text-koleksi-navy-dark/70 dark:text-ink-dark/70">
          Drag dokumen atau{" "}
          <label
            htmlFor={inputId}
            className="cursor-pointer font-bold text-koleksi-navy-dark underline underline-offset-2 transition hover:text-koleksi-green dark:text-ink-dark"
          >
            Unggah
          </label>
        </p>
        <input
          id={inputId}
          type="file"
          multiple
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            addFiles(e.target.files);
            // Reset supaya file yang sama bisa dipilih lagi setelah dihapus.
            e.target.value = "";
          }}
        />
      </div>

      {rejected.length > 0 && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          Melebihi {maxSizeMb} MB: {rejected.join(", ")}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file) => (
            <li
              key={file.name}
              className="flex items-center gap-3 rounded-lg bg-muted-light px-4 py-2.5 text-sm text-koleksi-navy-dark dark:bg-muted-dark dark:text-ink-dark"
            >
              <FileText size={16} aria-hidden="true" className="shrink-0" />
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <span className="shrink-0 text-xs text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                {formatSize(file.size)}
              </span>
              <button
                type="button"
                aria-label={`Hapus ${file.name}`}
                onClick={() => onChange(files.filter((f) => f !== file))}
                className="shrink-0 rounded-full p-1 text-koleksi-navy-dark/50 transition hover:text-red-600 dark:text-ink-dark/50"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
