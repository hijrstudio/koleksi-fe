"use client";

import { useEffect, useId, useMemo } from "react";
import Image from "next/image";
import { authErrorClass } from "@/components/auth/authStyles";
import { format, useI18n } from "@/components/i18n/I18nProvider";
import { MAX_PHOTO_MB, MIN_PHOTO_PX, PHOTO_TYPES } from "@/lib/profile/validation";

interface PhotoInputProps {
  /** Foto tersimpan (atau avatar default dari backend). */
  currentUrl: string;
  /** Avatar default — ditampilkan setelah "Hapus foto" sampai disimpan. */
  defaultUrl: string;
  /** false = masih avatar default → tombol "Hapus" disembunyikan. */
  hasPhoto: boolean;
  file: File | null;
  removed: boolean;
  onSelect: (file: File | null) => void;
  onRemove: () => void;
  error?: string;
  disabled?: boolean;
}

const actionClass =
  "cursor-pointer text-sm font-bold text-koleksi-navy-dark underline underline-offset-2 transition hover:text-koleksi-green disabled:cursor-not-allowed disabled:opacity-50 dark:text-ink-dark";

/** Foto profil: preview bulat + Unggah/Ganti & Hapus. Disimpan bersama form (tombol Simpan). */
export default function PhotoInput({
  currentUrl,
  defaultUrl,
  hasPhoto,
  file,
  removed,
  onSelect,
  onRemove,
  error,
  disabled,
}: PhotoInputProps) {
  const { t } = useI18n();
  const inputId = useId();
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  // Lepas object URL lama supaya tidak bocor memori
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const src = preview ?? (removed ? defaultUrl : currentUrl);
  const showRemove = !!file || (hasPhoto && !removed);

  return (
    <div>
      <div className="flex items-center gap-5">
        <Image
          src={src}
          alt={t.profile.photo.alt}
          width={88}
          height={88}
          unoptimized={!!preview}
          className="size-22 shrink-0 rounded-full bg-muted-light object-cover dark:bg-muted-dark"
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <label htmlFor={inputId} className={actionClass} aria-disabled={disabled}>
              {hasPhoto || file ? t.profile.photo.change : t.profile.photo.upload}
            </label>
            {showRemove && (
              <button type="button" onClick={file ? () => onSelect(null) : onRemove} disabled={disabled} className={actionClass}>
                {file ? t.auth.cancel : t.profile.photo.remove}
              </button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">
            {format(t.profile.photo.hint, { max: MAX_PHOTO_MB, min: MIN_PHOTO_PX })}
          </p>
          {removed && !file && (
            <p className="mt-1 text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">
              {t.profile.photo.willRemove}
            </p>
          )}
        </div>

        <input
          id={inputId}
          type="file"
          accept={PHOTO_TYPES.join(",")}
          disabled={disabled}
          aria-label={t.profile.photo.choose}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className="sr-only"
          onChange={(e) => {
            onSelect(e.target.files?.[0] ?? null);
            // Reset supaya file yang sama bisa dipilih lagi
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p id={`${inputId}-error`} className={authErrorClass}>
          {error}
        </p>
      )}
    </div>
  );
}
