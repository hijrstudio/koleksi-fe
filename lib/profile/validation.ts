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

/**
 * Pilihan "Merek lain" / "Tipe lain" di dropdown merek & tipe: kendaraan belum ada di katalog, member menulisnya
 * sendiri (brand_other / model_other). Admin menautkannya ke katalog di CMS.
 */
export const OTHER_OPTION = "other";
/** = kolom member_vehicles.brand_other / model_other (backend VehicleCatalogInput). */
export const OTHER_BRAND_MAX = 60;
export const OTHER_MODEL_MAX = 80;
const OTHER_TEXT_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} .,\-/()+&']*$/u;

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
  /** ID katalog, atau OTHER_OPTION kalau ditulis sendiri. */
  vehicle_brand_id: string;
  vehicle_model_id: string;
  brand_other: string;
  model_other: string;
  tahun: string;
}

export const PROFILE_FIELDS = [
  "nama_lengkap", "nama_panggilan", "tgl_lahir", "jenis_kelamin", "no_hp", "alamat",
  "city_code", "district_code", "village_code", "has_vehicle",
  "vin", "plat_kode", "plat_nomor", "plat_seri", "plat_status", "vehicle_brand_id", "vehicle_model_id",
  "brand_other", "model_other", "tahun",
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
    // No. rangka & dokumen bukti opsional; kalau No. rangka diisi harus lengkap
    if (f.vin && f.vin.length !== VIN_LENGTH) e.vin = format(m.vinLength, { length: VIN_LENGTH });
    if (!/^[A-Z]{1,2}$/.test(f.plat_kode) || !/^\d{1,4}$/.test(f.plat_nomor)) {
      e.plat = m.plateIncomplete;
    } else if (f.plat_seri && !/^[A-Z]{1,3}$/.test(f.plat_seri)) {
      e.plat = m.plateSeries;
    }

    const maxYear = new Date().getFullYear() + 1;
    if (f.tahun && !(Number(f.tahun) >= MIN_VEHICLE_YEAR && Number(f.tahun) <= maxYear)) {
      e.tahun = format(m.yearRange, { min: MIN_VEHICLE_YEAR, max: maxYear });
    }

    Object.assign(e, validateVehicleOther(f, m));

    if (docs.newCount > MAX_DOCUMENTS) e.documents = format(m.documentsCount, { max: MAX_DOCUMENTS });
    else if (docs.newBytes > MAX_DOCUMENTS_MB * 1024 * 1024) e.documents = format(m.documentsSize, { max: MAX_DOCUMENTS_MB });
  }

  return e;
}

/** Merek/tipe yang ditulis sendiri ("lain"): wajib diisi kalau dipilih, panjang & karakter dibatasi. */
function validateVehicleOther(f: ProfileFormValues, m: Dictionary["validation"]): ProfileErrors {
  const e: ProfileErrors = {};
  const check = (value: string, max: number, required: string) => {
    const text = value.trim();
    if (!text) return required;
    if (text.length > max) return format(m.otherTextMax, { max });
    return OTHER_TEXT_PATTERN.test(text) ? undefined : m.otherTextInvalid;
  };

  if (f.vehicle_brand_id === OTHER_OPTION) {
    e.brand_other = check(f.brand_other, OTHER_BRAND_MAX, m.otherBrandRequired);
  }
  if (f.vehicle_brand_id === OTHER_OPTION || f.vehicle_model_id === OTHER_OPTION) {
    e.model_other = check(f.model_other, OTHER_MODEL_MAX, m.otherModelRequired);
  }

  return Object.fromEntries(Object.entries(e).filter(([, v]) => v)) as ProfileErrors;
}

/**
 * Merek & tipe dalam format API: ID katalog, atau teks (brand_other / model_other) kalau "lain" dipilih.
 * Merek lain → tipe selalu ditulis (tipe dari merek di luar katalog pasti belum ada di katalog).
 */
export function vehicleCatalogApi(v: ProfileFormValues): Record<string, string> {
  if (v.vehicle_brand_id === OTHER_OPTION) {
    return { vehicle_brand_id: "", vehicle_model_id: "", brand_other: v.brand_other.trim(), model_other: v.model_other.trim() };
  }
  if (v.vehicle_model_id === OTHER_OPTION) {
    return { vehicle_brand_id: v.vehicle_brand_id, vehicle_model_id: "", brand_other: "", model_other: v.model_other.trim() };
  }

  return {
    vehicle_brand_id: v.vehicle_brand_id,
    vehicle_model_id: v.vehicle_brand_id ? v.vehicle_model_id : "",
    brand_other: "",
    model_other: "",
  };
}

/** Field API backend → kunci error di form (dokumen & plat digabung). */
export function errorKeyFor(apiField: string): ProfileErrorKey | null {
  if (apiField.startsWith("documents") || apiField.startsWith("remove_document_ids")) return "documents";
  if (apiField.startsWith("plat_") && apiField !== "plat_status") return "plat";
  if (apiField === "photo" || apiField === "remove_photo") return "photo";

  return (PROFILE_FIELDS as readonly string[]).includes(apiField) ? (apiField as ProfileErrorKey) : null;
}
