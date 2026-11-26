"use client";

import { type FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Field from "@/components/auth/FormField";
import SelectInput from "@/components/auth/SelectInput";
import { authErrorClass, authInputClass, authSubmitClass } from "@/components/auth/authStyles";
import { useI18n } from "@/components/i18n/I18nProvider";
import { createDiscussionAction } from "@/app/actions/forum";
import { expiredPath } from "@/lib/auth/validation";
import { localizePath } from "@/lib/i18n/config";
import type { ForumCategory } from "@/types";

/** = backend ForumDiscussion::TITLE_MAX / BODY_MAX & ForumController::IMAGE_MAX_KB */
const TITLE_MAX = 150;
const BODY_MAX = 10000;
const IMAGE_MAX_MB = 2;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Errors = Partial<Record<"category_id" | "title" | "body" | "image" | "form", string>>;

export default function CreateDiscussionForm({ categories }: { categories: ForumCategory[] }) {
  const { locale, t } = useI18n();
  const c = t.forum.create;
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, startTransition] = useTransition();

  function validate(): Errors {
    const e: Errors = {};
    if (!category) e.category_id = c.chooseCategory;
    if (title.trim().length < 5) e.title = c.titleMin;
    if (body.trim().length < 10) e.body = c.bodyMin;
    if (image && (!IMAGE_TYPES.includes(image.type) || image.size > IMAGE_MAX_MB * 1024 * 1024)) e.image = c.imageHint;
    return e;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const fd = new FormData();
    fd.append("category_id", category);
    fd.append("title", title.trim());
    fd.append("body", body.trim());
    if (image) fd.append("image", image, image.name);

    startTransition(async () => {
      const result = await createDiscussionAction(fd);
      if (result.ok) {
        router.push(localizePath(`/forum/diskusi/${result.data.slug}`, locale));
        return;
      }
      if (result.status === 401) {
        window.location.assign(expiredPath("/forum/diskusi/buat", locale));
        return;
      }
      setErrors({ ...(result.errors ?? {}), form: result.message });
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={pending} className="mt-10 space-y-6">
      {errors.form && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {errors.form}
        </p>
      )}

      <Field id="diskusi-kategori" label={c.category} required error={errors.category_id}>
        <SelectInput
          id="diskusi-kategori"
          placeholder={c.chooseCategory}
          options={categories.filter((cat) => cat.id).map((cat) => ({ value: String(cat.id), label: cat.name }))}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-invalid={errors.category_id ? true : undefined}
        />
      </Field>

      <Field id="diskusi-judul" label={c.titleLabel} required error={errors.title} aside={`${title.length}/${TITLE_MAX}`}>
        <input
          id="diskusi-judul"
          type="text"
          maxLength={TITLE_MAX}
          placeholder={c.titlePlaceholder}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={authInputClass}
          aria-invalid={errors.title ? true : undefined}
        />
      </Field>

      <Field id="diskusi-isi" label={c.body} required error={errors.body} aside={`${body.length}/${BODY_MAX}`}>
        <textarea
          id="diskusi-isi"
          rows={10}
          maxLength={BODY_MAX}
          placeholder={c.bodyPlaceholder}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={`${authInputClass} h-auto py-3`}
          aria-invalid={errors.body ? true : undefined}
        />
      </Field>

      <Field id="diskusi-gambar" label={c.image} error={errors.image}>
        <input
          id="diskusi-gambar"
          type="file"
          accept={IMAGE_TYPES.join(",")}
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-koleksi-navy-dark file:mr-4 file:rounded-full file:border-0 file:bg-koleksi-navy-deep file:px-4 file:py-2 file:text-sm file:font-bold file:text-white dark:text-ink-dark"
        />
        <p className="mt-2 text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">{c.imageHint}</p>
        {image && (
          <button type="button" onClick={() => setImage(null)} className={`${authErrorClass} underline`}>
            {c.removeImage}
          </button>
        )}
      </Field>

      <p className="text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">{c.guidelines}</p>

      <button type="submit" disabled={pending} className={`${authSubmitClass} inline-flex items-center justify-center gap-2`}>
        {pending && <Loader2 size={16} className="animate-spin" />}
        {pending ? c.submitting : c.submit}
      </button>
    </form>
  );
}
