"use client";

import {
  type FormEvent,
  startTransition,
  useActionState,
  useState,
} from "react";
import Link from "@/components/i18n/Link";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import clsx from "@/lib/clsx";
import { format, useI18n } from "@/components/i18n/I18nProvider";
import Field from "@/components/auth/FormField";
import SelectInput from "@/components/auth/SelectInput";
import DatePickerInput from "@/components/auth/DatePickerInput";
import PhotoInput from "./PhotoInput";
import RadioGroup from "@/components/auth/RadioGroup";
import FileDropzone from "@/components/auth/FileDropzone";
import {
  authErrorClass,
  authInputClass,
  authLabelClass,
  authSectionTitleClass,
  authSubmitClass,
} from "@/components/auth/authStyles";
import { type ProfileState, updateProfile } from "@/app/actions/profile";
import {
  GENDER_VALUES,
  MAX_DOCUMENTS_MB,
  PLATE_STATUS_VALUES,
  type ProfileErrorKey,
  type ProfileErrors,
  type ProfileFormValues,
  VIN_LENGTH,
  YES_NO_VALUES,
  optionsOf,
  fromApiDate,
  validateProfile,
} from "@/lib/profile/validation";
import useRegionList from "@/lib/profile/useRegionList";
import type {
  MemberEditProfile,
  Regency,
  Region,
  VehicleBrandOption,
  VehicleVerificationStatus,
} from "@/types";

/** Daftar kecamatan/kelurahan yang sudah diambil server untuk wilayah tersimpan (supaya tidak fetch ulang). */
export interface InitialRegionLists {
  cityCode: string;
  districts: Region[];
  districtCode: string;
  villages: Region[];
}

interface ProfileFormProps {
  profile: MemberEditProfile;
  regencies: Regency[];
  brands: VehicleBrandOption[];
  regionLists: InitialRegionLists;
}

const subLinkClass =
  "text-sm font-bold text-koleksi-navy-dark/60 underline underline-offset-2 transition hover:text-koleksi-green dark:text-ink-dark/60";

const cancelClass =
  "inline-flex min-w-35.75 items-center justify-center rounded-full border border-koleksi-navy-dark px-8 py-2.5 text-xl leading-8 font-bold text-koleksi-navy-dark transition hover:border-koleksi-green hover:text-koleksi-green dark:border-ink-dark/40 dark:text-ink-dark";

/** Warna badge status verifikasi kendaraan; label dari dictionary (t.profile.verification). */
const VERIFICATION: Record<
  VehicleVerificationStatus,
  { className: string }
> = {
  pending: {
    className: "bg-[#f3e5c9] text-koleksi-navy-dark",
  },
  verified: {
    className: "bg-koleksi-green/15 text-koleksi-green",
  },
  rejected: {
    className: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  },
};

function toValues(p: MemberEditProfile): ProfileFormValues {
  const v = p.vehicle;

  return {
    nama_lengkap: p.nama_lengkap ?? "",
    nama_panggilan: p.nama_panggilan ?? "",
    tgl_lahir: fromApiDate(p.tgl_lahir),
    jenis_kelamin: p.jenis_kelamin ?? "",
    no_hp: p.no_hp ?? "",
    alamat: p.alamat ?? "",
    city_code: p.city?.code ?? "",
    district_code: p.district?.code ?? "",
    village_code: p.village?.code ?? "",
    // Member baru (belum pernah isi) default "Ya" seperti form Daftar
    has_vehicle: p.has_vehicle || (!p.profile_completed && !v) ? "ya" : "tidak",
    vin: v?.vin ?? "",
    plat_kode: v?.plat_kode ?? "",
    plat_nomor: v?.plat_nomor ?? "",
    plat_seri: v?.plat_seri ?? "",
    plat_status: v?.plat_status ?? "permanen",
    vehicle_brand_id: v?.vehicle_brand_id ? String(v.vehicle_brand_id) : "",
    vehicle_model_id: v?.vehicle_model_id ? String(v.vehicle_model_id) : "",
    tahun: v?.tahun ? String(v.tahun) : "",
  };
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * `useActionState` ada di sini; field form di-remount (key = savedAt) setiap kali berhasil disimpan
 * supaya dokumen baru, daftar hapus & error ter-reset ke data terbaru dari server.
 */
export default function ProfileForm(props: ProfileFormProps) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(
    updateProfile,
    {},
  );

  return (
    <ProfileFields
      key={state.savedAt ?? 0}
      {...props}
      profile={state.profile ?? props.profile}
      state={state}
      formAction={formAction}
      pending={pending}
    />
  );
}

/**
 * Dropdown hanya berisi merek/tipe aktif. Merek/tipe milik member yang sudah
 * dinonaktifkan di CMS ditambahkan lagi supaya pilihannya tetap tampil (dan
 * tetap bisa disimpan, backend mengizinkan nilai yang sedang dipakai).
 */
function withCurrentVehicle(
  brands: VehicleBrandOption[],
  vehicle: MemberEditProfile["vehicle"],
): VehicleBrandOption[] {
  const brand = vehicle?.vehicle_brand;
  if (!brand) return brands;

  const model = vehicle.vehicle_model;
  const list = brands.some((b) => b.id === brand.id)
    ? brands
    : [...brands, { id: brand.id, name: brand.name, models: [] }];

  if (!model) return list;

  return list.map((b) =>
    b.id === brand.id && !b.models.some((m) => m.id === model.id)
      ? { ...b, models: [...b.models, { id: model.id, name: model.name }] }
      : b,
  );
}

function ProfileFields({
  profile,
  regencies,
  brands,
  regionLists,
  state,
  formAction,
  pending,
}: ProfileFormProps & {
  state: ProfileState;
  formAction: (payload: FormData) => void;
  pending: boolean;
}) {
  const { locale, t } = useI18n();
  const [form, setForm] = useState<ProfileFormValues>(() => toValues(profile));
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Error dari server disembunyikan per field begitu field itu diubah.
  const [edited, setEdited] = useState<
    Partial<Record<ProfileErrorKey, boolean>>
  >({});

  const districts = useRegionList("districts", form.city_code, {
    parent: regionLists.cityCode,
    items: regionLists.districts,
  });
  const villages = useRegionList("villages", form.district_code, {
    parent: regionLists.districtCode,
    items: regionLists.villages,
  });

  const hasVehicle = form.has_vehicle === "ya";
  const existingDocs = (profile.vehicle?.documents ?? []).filter(
    (d) => !removedIds.includes(d.id),
  );

  const clientErrors: ProfileErrors = submitted
    ? validateProfile(form, {
        count: existingDocs.length + newFiles.length,
        newCount: newFiles.length,
        newBytes: newFiles.reduce((sum, f) => sum + f.size, 0),
        photo,
      }, t.validation)
    : {};
  const errorFor = (key: ProfileErrorKey) =>
    clientErrors[key] ?? (edited[key] ? undefined : state.errors?.[key]);

  function set<K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K],
    patch?: Partial<ProfileFormValues>,
  ) {
    setForm((f) => ({ ...f, [key]: value, ...patch }));
    const errorKey: ProfileErrorKey =
      key === "plat_kode" || key === "plat_nomor" || key === "plat_seri"
        ? "plat"
        : key;
    setEdited((e) => ({ ...e, [errorKey]: true }));
  }

  /** Props aksesibilitas error untuk input dengan id `id`. */
  function invalid(key: ProfileErrorKey, id: string) {
    const error = errorFor(key);
    return {
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${id}-error` : undefined,
    } as const;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    const errors = validateProfile(form, {
      count: existingDocs.length + newFiles.length,
      newCount: newFiles.length,
      newBytes: newFiles.reduce((sum, f) => sum + f.size, 0),
      photo,
    }, t.validation);
    if (Object.keys(errors).length > 0) {
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    fd.append("lang", locale);
    if (photo) fd.append("photo", photo, photo.name);
    else if (removePhoto) fd.append("remove_photo", "1");
    if (hasVehicle) {
      newFiles.forEach((file) => fd.append("documents", file, file.name));
      removedIds.forEach((id) => fd.append("remove_document_ids", String(id)));
    }

    setEdited({});
    startTransition(() => formAction(fd));
  }

  const cityOptions = regencies.map((r) => ({
    value: r.code,
    label: r.name,
    group: r.province,
  }));
  const districtOptions = districts.items.map((r) => ({
    value: r.code,
    label: r.name,
  }));
  const villageOptions = villages.items.map((r) => ({
    value: r.code,
    label: r.name,
  }));
  const brandList = withCurrentVehicle(brands, profile.vehicle);
  const brandOptions = brandList.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));
  const modelOptions =
    brandList
      .find((b) => String(b.id) === form.vehicle_brand_id)
      ?.models.map((m) => ({ value: String(m.id), label: m.name })) ?? [];

  const verification = profile.vehicle
    ? VERIFICATION[profile.vehicle.verification_status]
    : null;
  const platError = errorFor("plat");
  const documentsError = errorFor("documents");

  return (
    <>
      <form onSubmit={handleSubmit} noValidate aria-busy={pending}>
        {state.savedAt && !state.message && (
          <p
            role="status"
            className="mb-10 rounded-lg bg-koleksi-green/10 px-4 py-3 text-sm font-semibold text-koleksi-green"
          >
            {t.profile.saved}
          </p>
        )}
        {state.message && (
          <p
            role="alert"
            className="mb-10 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {state.message}
          </p>
        )}

        <fieldset
          disabled={pending}
          className="grid grid-cols-1 gap-x-7.5 gap-y-15 lg:grid-cols-2"
        >
          {/* Data Pribadi */}
          <section aria-labelledby="profil-pribadi">
            <div className="flex h-6 items-center gap-5">
              <h2 id="profil-pribadi" className={authSectionTitleClass}>
                {t.form.personalData}
              </h2>
              {/* <Link href="/kebijakan-privasi" className={subLinkClass}>
                Lihat Halaman Privasi
              </Link> */}
            </div>

            <div className="mt-10 flex flex-col gap-5">
              <PhotoInput
                currentUrl={profile.photo_url}
                defaultUrl={profile.default_photo_url}
                hasPhoto={profile.has_photo}
                file={photo}
                removed={removePhoto}
                onSelect={(file) => {
                  setPhoto(file);
                  setRemovePhoto(false);
                  setEdited((e) => ({ ...e, photo: true }));
                }}
                onRemove={() => {
                  setRemovePhoto(true);
                  setEdited((e) => ({ ...e, photo: true }));
                }}
                error={errorFor("photo")}
                disabled={pending}
              />

              <Field
                id="profil-nama"
                label={t.form.fullName}
                required
                error={errorFor("nama_lengkap")}
              >
                <input
                  id="profil-nama"
                  type="text"
                  autoComplete="name"
                  placeholder={t.form.fullNamePlaceholder}
                  required
                  maxLength={255}
                  value={form.nama_lengkap}
                  onChange={(e) => set("nama_lengkap", e.target.value)}
                  {...invalid("nama_lengkap", "profil-nama")}
                  className={authInputClass}
                />
              </Field>

              <Field
                id="profil-panggilan"
                label={t.form.nickname}
                error={errorFor("nama_panggilan")}
              >
                <input
                  id="profil-panggilan"
                  type="text"
                  autoComplete="nickname"
                  placeholder={t.form.nicknamePlaceholder}
                  maxLength={60}
                  value={form.nama_panggilan}
                  onChange={(e) => set("nama_panggilan", e.target.value)}
                  {...invalid("nama_panggilan", "profil-panggilan")}
                  className={authInputClass}
                />
              </Field>

              <Field
                id="profil-lahir"
                label={t.form.birthDate}
                error={errorFor("tgl_lahir")}
              >
                <DatePickerInput
                  id="profil-lahir"
                  autoComplete="bday"
                  value={form.tgl_lahir}
                  onChange={(value) => set("tgl_lahir", value)}
                  {...invalid("tgl_lahir", "profil-lahir")}
                />
              </Field>

              <Field
                id="profil-gender"
                label={t.form.gender}
                error={errorFor("jenis_kelamin")}
              >
                <SelectInput
                  id="profil-gender"
                  options={optionsOf(GENDER_VALUES, t.form.genders)}
                  value={form.jenis_kelamin}
                  onChange={(e) =>
                    set(
                      "jenis_kelamin",
                      e.target.value as ProfileFormValues["jenis_kelamin"],
                    )
                  }
                  {...invalid("jenis_kelamin", "profil-gender")}
                />
              </Field>

              <Field
                id="profil-hp"
                label={t.form.phone}
                required
                error={errorFor("no_hp")}
              >
                <input
                  id="profil-hp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0890 1234 5678"
                  required
                  maxLength={20}
                  value={form.no_hp}
                  onChange={(e) =>
                    set("no_hp", e.target.value.replace(/[^\d+ -]/g, ""))
                  }
                  {...invalid("no_hp", "profil-hp")}
                  className={authInputClass}
                />
              </Field>

              <Field
                id="profil-alamat"
                label={t.form.address}
                error={errorFor("alamat")}
              >
                <input
                  id="profil-alamat"
                  type="text"
                  autoComplete="street-address"
                  placeholder={t.form.addressPlaceholder}
                  maxLength={500}
                  value={form.alamat}
                  onChange={(e) => set("alamat", e.target.value)}
                  {...invalid("alamat", "profil-alamat")}
                  className={authInputClass}
                />
              </Field>

              <Field
                id="profil-kota"
                label={t.form.city}
                error={errorFor("city_code")}
              >
                <SelectInput
                  id="profil-kota"
                  options={cityOptions}
                  value={form.city_code}
                  onChange={(e) =>
                    set("city_code", e.target.value, {
                      district_code: "",
                      village_code: "",
                    })
                  }
                  {...invalid("city_code", "profil-kota")}
                />
              </Field>

              <Field
                id="profil-kecamatan"
                label={t.form.district}
                error={
                  errorFor("district_code") ??
                  (districts.failed ? t.form.districtsFailed : undefined)
                }
              >
                <SelectInput
                  id="profil-kecamatan"
                  options={districtOptions}
                  placeholder={
                    districts.loading
                      ? t.common.loading
                      : form.city_code
                        ? t.form.select
                        : "-"
                  }
                  disabled={!form.city_code || districts.loading}
                  value={form.district_code}
                  onChange={(e) =>
                    set("district_code", e.target.value, { village_code: "" })
                  }
                  {...invalid("district_code", "profil-kecamatan")}
                />
              </Field>

              <Field
                id="profil-kelurahan"
                label={t.form.village}
                error={
                  errorFor("village_code") ??
                  (villages.failed ? t.form.villagesFailed : undefined)
                }
              >
                <SelectInput
                  id="profil-kelurahan"
                  options={villageOptions}
                  placeholder={
                    villages.loading
                      ? t.common.loading
                      : form.district_code
                        ? t.form.select
                        : "-"
                  }
                  disabled={!form.district_code || villages.loading}
                  value={form.village_code}
                  onChange={(e) => set("village_code", e.target.value)}
                  {...invalid("village_code", "profil-kelurahan")}
                />
              </Field>
            </div>
          </section>

          {/* Informasi Kendaraan */}
          <section aria-labelledby="profil-kendaraan">
            <div className="flex h-6 items-center justify-between gap-3">
              <h2 id="profil-kendaraan" className={authSectionTitleClass}>
                {t.form.vehicleInfo}
              </h2>
              {hasVehicle && verification && (
                <span
                  className={clsx(
                    "shrink-0 rounded-md px-2 py-1 text-[11px] leading-3 font-semibold",
                    verification.className,
                  )}
                >
                  {t.profile.verification[profile.vehicle!.verification_status]}
                </span>
              )}
            </div>

            <div className="mt-10">
              <p id="profil-punya-kendaraan" className={authLabelClass}>
                {t.form.hasVehicle}
              </p>
              <RadioGroup
                name="has_vehicle"
                ariaLabelledBy="profil-punya-kendaraan"
                options={optionsOf(YES_NO_VALUES, t.form.yesNo)}
                value={form.has_vehicle}
                onChange={(v) => set("has_vehicle", v)}
                required
              />
              {hasVehicle &&
                profile.vehicle?.verification_status === "rejected" &&
                profile.vehicle.rejection_reason && (
                  <p className={authErrorClass}>
                    {format(t.profile.rejectedReason, { reason: profile.vehicle.rejection_reason })}
                  </p>
                )}
            </div>

            <AnimatePresence initial={false}>
              {hasVehicle && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  {/* pt (bukan mt) supaya animasi height-nya mulus. Sedikit
                      padding horizontal biar ring focus gak kepotong. */}
                  <div className="-mx-1 flex flex-col gap-5 px-1 pt-5 pb-1">
                    <Field
                      id="profil-vin"
                      label={t.form.vin}
                      required
                      aside={format(t.form.characters, { count: form.vin.length, max: VIN_LENGTH })}
                      error={errorFor("vin")}
                    >
                      <input
                        id="profil-vin"
                        type="text"
                        autoCapitalize="characters"
                        spellCheck={false}
                        placeholder="ABCDEFG1234567890"
                        maxLength={VIN_LENGTH}
                        required
                        value={form.vin}
                        onChange={(e) =>
                          set(
                            "vin",
                            e.target.value
                              .toUpperCase()
                              .replace(/[^A-Z0-9]/g, ""),
                          )
                        }
                        {...invalid("vin", "profil-vin")}
                        className={clsx(authInputClass, "uppercase")}
                      />
                    </Field>

                    <Field
                      id="profil-plat"
                      label={t.form.plate}
                      required
                      error={platError}
                    >
                      <div
                        role="group"
                        aria-labelledby="profil-plat-label"
                        className="flex gap-5"
                      >
                        <input
                          id="profil-plat"
                          type="text"
                          aria-label={t.form.plateRegion}
                          autoCapitalize="characters"
                          placeholder="B"
                          maxLength={2}
                          required
                          value={form.plat_kode}
                          onChange={(e) =>
                            set(
                              "plat_kode",
                              e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z]/g, ""),
                            )
                          }
                          {...invalid("plat", "profil-plat")}
                          className={clsx(
                            authInputClass,
                            "w-13 px-0 text-center",
                          )}
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          aria-label={t.form.plateNumber}
                          placeholder="1234"
                          maxLength={4}
                          required
                          value={form.plat_nomor}
                          onChange={(e) =>
                            set("plat_nomor", e.target.value.replace(/\D/g, ""))
                          }
                          aria-invalid={platError ? true : undefined}
                          className={clsx(
                            authInputClass,
                            "w-19 px-0 text-center",
                          )}
                        />
                        <input
                          type="text"
                          aria-label={t.form.plateSeries}
                          autoCapitalize="characters"
                          placeholder="XYZ"
                          maxLength={3}
                          value={form.plat_seri}
                          onChange={(e) =>
                            set(
                              "plat_seri",
                              e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z]/g, ""),
                            )
                          }
                          aria-invalid={platError ? true : undefined}
                          className={clsx(
                            authInputClass,
                            "w-17 px-0 text-center",
                          )}
                        />
                      </div>
                    </Field>

                    <div>
                      <p
                        id="profil-status-plat-label"
                        className={authLabelClass}
                      >
                        {t.form.plateStatus}
                      </p>
                      <RadioGroup
                        name="plat_status"
                        ariaLabelledBy="profil-status-plat-label"
                        options={optionsOf(PLATE_STATUS_VALUES, t.form.plateStatuses)}
                        value={form.plat_status}
                        onChange={(v) => set("plat_status", v)}
                        required
                      />
                      {errorFor("plat_status") && (
                        <p className={authErrorClass}>
                          {errorFor("plat_status")}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <Field
                        id="profil-merek"
                        label={t.form.brand}
                        error={errorFor("vehicle_brand_id")}
                      >
                        <SelectInput
                          id="profil-merek"
                          options={brandOptions}
                          value={form.vehicle_brand_id}
                          onChange={(e) =>
                            set("vehicle_brand_id", e.target.value, {
                              vehicle_model_id: "",
                            })
                          }
                          {...invalid("vehicle_brand_id", "profil-merek")}
                        />
                      </Field>
                      <Field
                        id="profil-tipe"
                        label={t.form.model}
                        error={errorFor("vehicle_model_id")}
                      >
                        <SelectInput
                          id="profil-tipe"
                          options={modelOptions}
                          value={form.vehicle_model_id}
                          disabled={!form.vehicle_brand_id}
                          onChange={(e) =>
                            set("vehicle_model_id", e.target.value)
                          }
                          {...invalid("vehicle_model_id", "profil-tipe")}
                        />
                      </Field>
                    </div>

                    <Field
                      id="profil-tahun"
                      label={t.form.year}
                      error={errorFor("tahun")}
                    >
                      <input
                        id="profil-tahun"
                        type="text"
                        inputMode="numeric"
                        placeholder="-"
                        maxLength={4}
                        value={form.tahun}
                        onChange={(e) =>
                          set("tahun", e.target.value.replace(/\D/g, ""))
                        }
                        {...invalid("tahun", "profil-tahun")}
                        className={authInputClass}
                      />
                    </Field>

                    <div>
                      <div className="mb-2 flex items-baseline justify-between gap-3">
                        <p
                          id="profil-dokumen-label"
                          className={clsx(authLabelClass, "mb-0")}
                        >
                          {t.form.documents}
                        </p>
                        <span className="shrink-0 text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">
                          {format(t.form.maxSize, { max: MAX_DOCUMENTS_MB })}
                        </span>
                      </div>

                      {existingDocs.length > 0 && (
                        <ul
                          aria-label={t.profile.savedDocuments}
                          className="mb-3 flex flex-col gap-2"
                        >
                          {existingDocs.map((doc) => (
                            <li
                              key={doc.id}
                              className="flex items-center gap-3 rounded-lg border border-koleksi-navy-dark/10 px-4 py-2.5 text-sm text-koleksi-navy-dark dark:border-border-dark dark:text-ink-dark"
                            >
                              <FileText
                                size={16}
                                aria-hidden="true"
                                className="shrink-0"
                              />
                              <span className="min-w-0 flex-1 truncate">
                                {doc.original_name}
                              </span>
                              <span className="shrink-0 text-xs text-koleksi-navy-dark/50 dark:text-ink-dark/50">
                                {formatSize(doc.size)}
                              </span>
                              <button
                                type="button"
                                aria-label={format(t.form.remove, { name: doc.original_name })}
                                onClick={() => {
                                  setRemovedIds((ids) => [...ids, doc.id]);
                                  setEdited((e) => ({ ...e, documents: true }));
                                }}
                                className="shrink-0 rounded-full p-1 text-koleksi-navy-dark/50 transition hover:text-red-600 dark:text-ink-dark/50"
                              >
                                <X size={14} aria-hidden="true" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}

                      <FileDropzone
                        files={newFiles}
                        onChange={(files) => {
                          setNewFiles(files);
                          setEdited((e) => ({ ...e, documents: true }));
                        }}
                        maxSizeMb={MAX_DOCUMENTS_MB}
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        invalid={!!documentsError}
                        describedBy={
                          documentsError ? "profil-dokumen-error" : undefined
                        }
                      />
                      {documentsError && (
                        <p id="profil-dokumen-error" className={authErrorClass}>
                          {documentsError}
                        </p>
                      )}
                      {removedIds.length > 0 && (
                        <p className="mt-2 text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">
                          {format(t.profile.documentsToRemove, { count: removedIds.length })}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </fieldset>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={pending} className={authSubmitClass}>
            {pending ? t.auth.saving : t.common.save}
          </button>
          <Link href="/dasbor" className={cancelClass}>
            {t.auth.cancel}
          </Link>
        </div>
      </form>

      <div className="mt-15 flex flex-col items-start gap-2.5">
        {/* <Link href="/dasbor/profile/ubah-email" className={subLinkClass}>
          Ubah e-mail
        </Link> */}
        <Link href="/dasbor/profile/ubah-kata-sandi" className={subLinkClass}>
          {t.profile.changePassword}
        </Link>
      </div>
    </>
  );
}
