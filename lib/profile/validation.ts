/**
 * Form "Ubah profil" member — tipe, konversi & validasi yang dipakai bersama oleh Client Component
 * (umpan balik instan) dan Server Action (sebelum diteruskan ke backend). Backend tetap memvalidasi ulang
 * (keunikan No. HP/VIN/plat, kecocokan wilayah & merek/tipe, dokumen minimal 1).
 */

import { format } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

export const VIN_LENGTH = 17;
export const MAX_DOCUMENTS = 5;
/** Total ukuran dokumen baru per sekali simpan. Batas body Server Action di next.config.ts (13mb) = dokumen + foto. */
export const MAX_DOCUMENTS_MB = 10;
export const MIN_VEHICLE_YEAR = 1990;
/** Foto profil — di server di-crop persegi & diperkecil ke 512px (WebP). */
export const MAX_PHOTO_MB = 2;
export const MIN_PHOTO_PX = 200;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

/** Pilihan form; label tampilan dari dictionary (t.form.genders / yesNo / plateStatuses). */
export const GENDER_VALUES = ["L", "P"] as const;
export const YES_NO_VALUES = ["ya", "tidak"] as const;
export const PLATE_STATUS_VALUES = ["permanen", "sementara"] as const;

/** Opsi {value, label} untuk SelectInput / RadioGroup. */
export function optionsOf<V extends string>(values: readonly V[], labels: Record<V, string>): { value: V; label: string }[] {
  return values.map((value) => ({ value, label: labels[value] }));
}

/** Semua nilai form berupa string (sama dengan nama field di API backend). */
export interface ProfileFormValues {
  nama_lengkap: string;
  nama_panggilan: string;
  /** Tampilan "DD / MM / YYYY"; dikirim ke API sebagai "Y-m-d". */
  tgl_lahir: string;
  jenis_kelamin: "" | "L" | "P";
  no_hp: string;
  alamat: string;
  city_code: string;
  district_code: string;
  village_code: string;
  has_vehicle: "ya" | "tidak";
  vin: string;
  plat_kode: string;
  plat_nomor: string;
  plat_seri: string;
  plat_status: "permanen" | "sementara";
  vehicle_brand_id: string;
  vehicle_model_id: string;
  tahun: string;
}

export const PROFILE_FIELDS = [
  "nama_lengkap", "nama_panggilan", "tgl_lahir", "jenis_kelamin", "no_hp", "alamat",
  "city_code", "district_code", "village_code", "has_vehicle",
  "vin", "plat_kode", "plat_nomor", "plat_seri", "plat_status", "vehicle_brand_id", "vehicle_model_id", "tahun",
] as const satisfies readonly (keyof ProfileFormValues)[];

/** Kode/nomor/seri plat digabung jadi satu pesan di bawah input plat. */
export type ProfileErrorKey =
  | Exclude<keyof ProfileFormValues, "plat_kode" | "plat_nomor" | "plat_seri">
  | "plat"
  | "documents"
  | "photo";

export type ProfileErrors = Partial<Record<ProfileErrorKey, string>>;

/** "1973-05-10" -> "10 / 05 / 1973" */
export function fromApiDate(ymd: string | null): string {
  const m = ymd?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]} / ${m[2]} / ${m[1]}` : "";
}

/** "10 / 05 / 1973" -> "1973-05-10"; null kalau bukan tanggal yang benar-benar ada (mis. 31/02). */
export function toApiDate(display: string): string | null {
  const m = display.match(/^(\d{2}) \/ (\d{2}) \/ (\d{4})$/);
  if (!m) return null;

  const [, dd, mm, yyyy] = m;
  const date = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
  const valid =
    date.getUTCFullYear() === Number(yyyy) &&
    date.getUTCMonth() === Number(mm) - 1 &&
    date.getUTCDate() === Number(dd);

  return valid ? `${yyyy}-${mm}-${dd}` : null;
}

const PHONE_PATTERN = /^(?:\+?62|0)?8\d{7,12}$/;

interface DocumentCheck {
  /** Dokumen lama yang tidak dihapus + dokumen baru. Kosongkan untuk melewati cek minimal 1 dokumen. */
  count?: number;
  /** Total byte dokumen baru. */
  newBytes: number;
  newCount: number;
  /** Foto profil baru yang dipilih (kalau ada). */
  photo?: { size: number; type: string } | null;
}

export function validateProfile(f: ProfileFormValues, docs: DocumentCheck, m: Dictionary["validation"]): ProfileErrors {
  const e: ProfileErrors = {};
  const today = new Date().toISOString().slice(0, 10);

  if (f.nama_lengkap.trim().length < 2) e.nama_lengkap = m.fullNameRequired;
  else if (f.nama_lengkap.length > 255) e.nama_lengkap = m.fullNameTooLong;
  if (f.nama_panggilan.length > 60) e.nama_panggilan = m.nicknameMax;

  if (f.tgl_lahir) {
    const ymd = toApiDate(f.tgl_lahir);
    if (!ymd) e.tgl_lahir = m.birthDateFormat;
    else if (ymd >= today || ymd <= "1900-01-01") e.tgl_lahir = m.birthDateInvalid;
  }

  if (!f.no_hp.trim()) e.no_hp = m.phoneRequired;
  else if (!PHONE_PATTERN.test(f.no_hp.replace(/[\s-]/g, ""))) e.no_hp = m.phoneInvalid;

  if (docs.photo) {
    if (!(PHOTO_TYPES as readonly string[]).includes(docs.photo.type)) e.photo = m.photoType;
    else if (docs.photo.size > MAX_PHOTO_MB * 1024 * 1024) e.photo = format(m.photoSize, { max: MAX_PHOTO_MB });
  }

  if (f.alamat.length > 500) e.alamat = m.addressMax;
  if (f.district_code && !f.city_code) e.city_code = m.cityFirst;
  if (f.village_code && !f.district_code) e.district_code = m.districtFirst;

  if (f.has_vehicle === "ya") {
    if (f.vin.length !== VIN_LENGTH) e.vin = format(m.vinLength, { length: VIN_LENGTH });
    if (!/^[A-Z]{1,2}$/.test(f.plat_kode) || !/^\d{1,4}$/.test(f.plat_nomor)) {
      e.plat = m.plateIncomplete;
    } else if (f.plat_seri && !/^[A-Z]{1,3}$/.test(f.plat_seri)) {
      e.plat = m.plateSeries;
    }

    const maxYear = new Date().getFullYear() + 1;
    if (f.tahun && !(Number(f.tahun) >= MIN_VEHICLE_YEAR && Number(f.tahun) <= maxYear)) {
      e.tahun = format(m.yearRange, { min: MIN_VEHICLE_YEAR, max: maxYear });
    }

    if (docs.count === 0) e.documents = m.documentsRequired;
    else if (docs.newCount > MAX_DOCUMENTS) e.documents = format(m.documentsCount, { max: MAX_DOCUMENTS });
    else if (docs.newBytes > MAX_DOCUMENTS_MB * 1024 * 1024) e.documents = format(m.documentsSize, { max: MAX_DOCUMENTS_MB });
  }

  return e;
}

/** Field API backend → kunci error di form (dokumen & plat digabung). */
export function errorKeyFor(apiField: string): ProfileErrorKey | null {
  if (apiField.startsWith("documents") || apiField.startsWith("remove_document_ids")) return "documents";
  if (apiField.startsWith("plat_") && apiField !== "plat_status") return "plat";
  if (apiField === "photo" || apiField === "remove_photo") return "photo";

  return (PROFILE_FIELDS as readonly string[]).includes(apiField) ? (apiField as ProfileErrorKey) : null;
}
