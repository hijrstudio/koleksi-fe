"use client";

import {
  type FormEvent,
  startTransition,
  useActionState,
  useState,
} from "react";
import Link from "@/components/i18n/Link";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "@/lib/clsx";
import PasswordInput from "@/components/auth/PasswordInput";
import SelectInput from "@/components/auth/SelectInput";
import DatePickerInput from "@/components/auth/DatePickerInput";
import RadioGroup from "@/components/auth/RadioGroup";
import FileDropzone from "@/components/auth/FileDropzone";
import Field from "@/components/auth/FormField";
import {
  authErrorClass,
  authInputClass,
  authLabelClass,
  authOutlineClass,
  authSectionTitleClass,
  authSubmitClass,
} from "@/components/auth/authStyles";
import { type RegisterState, register } from "@/app/actions/register";
import PasswordRulesChecklist from "@/components/auth/PasswordRulesChecklist";
import { format, useI18n } from "@/components/i18n/I18nProvider";
import { PASSWORD_MAX } from "@/lib/auth/password";
import {
  GENDER_VALUES,
  MAX_DOCUMENTS_MB,
  PLATE_STATUS_VALUES,
  VIN_LENGTH,
  YES_NO_VALUES,
  optionsOf,
} from "@/lib/profile/validation";
import useRegionList from "@/lib/profile/useRegionList";
import {
  EMPTY_REGISTER_VALUES,
  type RegisterErrorKey,
  type RegisterFormValues,
  validateRegister,
} from "@/lib/register/validation";
import type { Regency, VehicleBrandOption } from "@/types";
import { SOURCE_OPTIONS } from "./data";

interface RegisterFormProps {
  regencies: Regency[];
  brands: VehicleBrandOption[];
}

export default function RegisterForm({ regencies, brands }: RegisterFormProps) {
  const { locale, t } = useI18n();
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    register,
    {},
  );
  const [form, setForm] = useState<RegisterFormValues>(EMPTY_REGISTER_VALUES);
  const [documents, setDocuments] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  // Error dari server disembunyikan per field begitu field itu diubah.
  const [edited, setEdited] = useState<
    Partial<Record<RegisterErrorKey, boolean>>
  >({});

  const districts = useRegionList("districts", form.city_code);
  const villages = useRegionList("villages", form.district_code);

  const hasVehicle = form.has_vehicle === "ya";
  const docCheck = {
    count: documents.length,
    bytes: documents.reduce((sum, f) => sum + f.size, 0),
  };

  // Error custom baru tampil setelah submit pertama, lalu ikut live saat diketik.
  const clientErrors = submitted ? validateRegister(form, docCheck, t.validation) : {};
  const errorFor = (key: RegisterErrorKey) =>
    clientErrors[key] ?? (edited[key] ? undefined : state.errors?.[key]);

  function set<K extends keyof RegisterFormValues>(
    key: K,
    value: RegisterFormValues[K],
    patch?: Partial<RegisterFormValues>,
  ) {
    setForm((f) => ({ ...f, [key]: value, ...patch }));
    const errorKey: RegisterErrorKey =
      key === "plat_kode" || key === "plat_nomor" || key === "plat_seri"
        ? "plat"
        : key;
    setEdited((e) => ({ ...e, [errorKey]: true }));
  }

  /** Props aksesibilitas error untuk input dengan id `id`. */
  function invalid(key: RegisterErrorKey, id: string) {
    const error = errorFor(key);
    return {
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${id}-error` : undefined,
    } as const;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    if (Object.keys(validateRegister(form, docCheck, t.validation)).length > 0) {
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    fd.append("lang", locale);
    if (hasVehicle) {
      documents.forEach((file) => fd.append("documents", file, file.name));
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
  const brandOptions = brands.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));
  const modelOptions =
    brands
      .find((b) => String(b.id) === form.vehicle_brand_id)
      ?.models.map((m) => ({ value: String(m.id), label: m.name })) ?? [];

  const platError = errorFor("plat");
  const documentsError = errorFor("documents");

  return (
    <>
      <form onSubmit={handleSubmit} noValidate aria-busy={pending}>
        {state.message && (
          <p
            role="alert"
            className="mb-10 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {state.message}
          </p>
        )}

        <fieldset disabled={pending}>
          {/* Akun */}
          <div className="flex flex-col gap-5">
            <Field
              id="daftar-email"
              label={t.form.emailLabel}
              required
              error={errorFor("email")}
            >
              <input
                id="daftar-email"
                type="email"
                autoComplete="email"
                placeholder={t.auth.emailPlaceholder}
                required
                maxLength={255}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                {...invalid("email", "daftar-email")}
                className={authInputClass}
              />
            </Field>

            <Field
              id="daftar-password"
              label={t.auth.register.passwordLabel}
              required
              error={errorFor("password")}
            >
              <PasswordInput
                id="daftar-password"
                autoComplete="new-password"
                placeholder={t.auth.register.passwordPlaceholder}
                required
                maxLength={PASSWORD_MAX}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                aria-invalid={errorFor("password") ? true : undefined}
                aria-describedby={clsx(
                  errorFor("password") && "daftar-password-error",
                  "daftar-password-syarat",
                )}
              />
            </Field>

            {/* Checklist syarat — langsung berubah saat diketik */}
            <PasswordRulesChecklist
              id="daftar-password-syarat"
              password={form.password}
              className="-mt-1"
            />

            <Field
              id="daftar-confirm"
              label={t.auth.register.confirmLabel}
              required
              error={errorFor("password_confirmation")}
            >
              <PasswordInput
                id="daftar-confirm"
                autoComplete="new-password"
                placeholder={t.auth.register.confirmPlaceholder}
                required
                maxLength={PASSWORD_MAX}
                value={form.password_confirmation}
                onChange={(e) => set("password_confirmation", e.target.value)}
                {...invalid("password_confirmation", "daftar-confirm")}
              />
            </Field>
          </div>

          <div className="mt-15 grid grid-cols-1 gap-x-7.5 gap-y-15 lg:grid-cols-2">
            {/* Data Pribadi */}
            <section aria-labelledby="daftar-pribadi">
              <div className="flex h-6 items-center gap-5">
                <h2 id="daftar-pribadi" className={authSectionTitleClass}>
                  {t.form.personalData}
                </h2>
                <Link
                  href="/kebijakan-privasi"
                  className="text-sm font-bold text-koleksi-navy-dark/60 underline underline-offset-2 transition hover:text-koleksi-green dark:text-ink-dark/60"
                >
                  {t.auth.register.viewPrivacy}
                </Link>
              </div>

              <div className="mt-10 flex flex-col gap-5">
                <Field
                  id="daftar-nama"
                  label={t.form.fullName}
                  required
                  error={errorFor("nama_lengkap")}
                >
                  <input
                    id="daftar-nama"
                    type="text"
                    autoComplete="name"
                    placeholder={t.form.fullNamePlaceholder}
                    required
                    maxLength={255}
                    value={form.nama_lengkap}
                    onChange={(e) => set("nama_lengkap", e.target.value)}
                    {...invalid("nama_lengkap", "daftar-nama")}
                    className={authInputClass}
                  />
                </Field>

                <Field
                  id="daftar-panggilan"
                  label={t.form.nickname}
                  error={errorFor("nama_panggilan")}
                >
                  <input
                    id="daftar-panggilan"
                    type="text"
                    autoComplete="nickname"
                    placeholder={t.form.nicknamePlaceholder}
                    maxLength={60}
                    value={form.nama_panggilan}
                    onChange={(e) => set("nama_panggilan", e.target.value)}
                    {...invalid("nama_panggilan", "daftar-panggilan")}
                    className={authInputClass}
                  />
                </Field>

                <Field
                  id="daftar-lahir"
                  label={t.form.birthDate}
                  error={errorFor("tgl_lahir")}
                >
                  <DatePickerInput
                    id="daftar-lahir"
                    autoComplete="bday"
                    value={form.tgl_lahir}
                    onChange={(value) => set("tgl_lahir", value)}
                    {...invalid("tgl_lahir", "daftar-lahir")}
                  />
                </Field>

                <Field
                  id="daftar-gender"
                  label={t.form.gender}
                  error={errorFor("jenis_kelamin")}
                >
                  <SelectInput
                    id="daftar-gender"
                    options={optionsOf(GENDER_VALUES, t.form.genders)}
                    value={form.jenis_kelamin}
                    onChange={(e) =>
                      set(
                        "jenis_kelamin",
                        e.target.value as RegisterFormValues["jenis_kelamin"],
                      )
                    }
                    {...invalid("jenis_kelamin", "daftar-gender")}
                  />
                </Field>

                <Field
                  id="daftar-hp"
                  label={t.form.phone}
                  required
                  error={errorFor("no_hp")}
                >
                  <input
                    id="daftar-hp"
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
                    {...invalid("no_hp", "daftar-hp")}
                    className={authInputClass}
                  />
                </Field>

                <Field
                  id="daftar-alamat"
                  label={t.form.address}
                  error={errorFor("alamat")}
                >
                  <input
                    id="daftar-alamat"
                    type="text"
                    autoComplete="street-address"
                    placeholder={t.form.addressPlaceholder}
                    maxLength={500}
                    value={form.alamat}
                    onChange={(e) => set("alamat", e.target.value)}
                    {...invalid("alamat", "daftar-alamat")}
                    className={authInputClass}
                  />
                </Field>

                <Field id="daftar-kota" label={t.form.city} error={errorFor("city_code")}>
                  <SelectInput
                    id="daftar-kota"
                    options={cityOptions}
                    value={form.city_code}
                    onChange={(e) =>
                      set("city_code", e.target.value, {
                        district_code: "",
                        village_code: "",
                      })
                    }
                    {...invalid("city_code", "daftar-kota")}
                  />
                </Field>

                <Field
                  id="daftar-kecamatan"
                  label={t.form.district}
                  error={
                    errorFor("district_code") ??
                    (districts.failed ? t.form.districtsFailed : undefined)
                  }
                >
                  <SelectInput
                    id="daftar-kecamatan"
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
                    {...invalid("district_code", "daftar-kecamatan")}
                  />
                </Field>

                <Field
                  id="daftar-kelurahan"
                  label={t.form.village}
                  error={
                    errorFor("village_code") ??
                    (villages.failed ? t.form.villagesFailed : undefined)
                  }
                >
                  <SelectInput
                    id="daftar-kelurahan"
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
                    {...invalid("village_code", "daftar-kelurahan")}
                  />
                </Field>
              </div>
            </section>

            {/* Informasi Kendaraan */}
            <section aria-labelledby="daftar-kendaraan">
              <div className="flex h-6 items-center">
                <h2 id="daftar-kendaraan" className={authSectionTitleClass}>
                  {t.form.vehicleInfo}
                </h2>
              </div>

              <div className="mt-10">
                <p id="daftar-kendaraan-label" className={authLabelClass}>
                  {t.form.hasVehicle}
                </p>
                <RadioGroup
                  name="has_vehicle"
                  ariaLabelledBy="daftar-kendaraan-label"
                  options={optionsOf(YES_NO_VALUES, t.form.yesNo)}
                  value={form.has_vehicle}
                  onChange={(v) => set("has_vehicle", v)}
                  required
                />
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
                        id="daftar-vin"
                        label={t.form.vin}
                        required
                        aside={format(t.form.characters, { count: form.vin.length, max: VIN_LENGTH })}
                        error={errorFor("vin")}
                      >
                        <input
                          id="daftar-vin"
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
                          {...invalid("vin", "daftar-vin")}
                          className={clsx(authInputClass, "uppercase")}
                        />
                      </Field>

                      <Field
                        id="daftar-plat"
                        label={t.form.plate}
                        required
                        error={platError}
                      >
                        <div
                          role="group"
                          aria-labelledby="daftar-plat-label"
                          className="flex gap-5"
                        >
                          <input
                            id="daftar-plat"
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
                            {...invalid("plat", "daftar-plat")}
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
                          id="daftar-status-plat-label"
                          className={authLabelClass}
                        >
                          {t.form.plateStatus}
                        </p>
                        <RadioGroup
                          name="plat_status"
                          ariaLabelledBy="daftar-status-plat-label"
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
                          id="daftar-merek"
                          label={t.form.brand}
                          error={errorFor("vehicle_brand_id")}
                        >
                          <SelectInput
                            id="daftar-merek"
                            options={brandOptions}
                            value={form.vehicle_brand_id}
                            onChange={(e) =>
                              set("vehicle_brand_id", e.target.value, {
                                vehicle_model_id: "",
                              })
                            }
                            {...invalid("vehicle_brand_id", "daftar-merek")}
                          />
                        </Field>
                        <Field
                          id="daftar-tipe"
                          label={t.form.model}
                          error={errorFor("vehicle_model_id")}
                        >
                          <SelectInput
                            id="daftar-tipe"
                            options={modelOptions}
                            value={form.vehicle_model_id}
                            disabled={!form.vehicle_brand_id}
                            onChange={(e) =>
                              set("vehicle_model_id", e.target.value)
                            }
                            {...invalid("vehicle_model_id", "daftar-tipe")}
                          />
                        </Field>
                      </div>

                      <Field
                        id="daftar-tahun"
                        label={t.form.year}
                        error={errorFor("tahun")}
                      >
                        <input
                          id="daftar-tahun"
                          type="text"
                          inputMode="numeric"
                          placeholder="-"
                          maxLength={4}
                          value={form.tahun}
                          onChange={(e) =>
                            set("tahun", e.target.value.replace(/\D/g, ""))
                          }
                          {...invalid("tahun", "daftar-tahun")}
                          className={authInputClass}
                        />
                      </Field>

                      <div>
                        <div className="mb-2 flex items-baseline justify-between gap-3">
                          <p
                            id="daftar-dokumen-label"
                            className={clsx(authLabelClass, "mb-0")}
                          >
                            {t.form.documents}
                          </p>
                          <span className="shrink-0 text-xs text-koleksi-navy-dark/60 dark:text-ink-dark/60">
                            {format(t.form.maxSize, { max: MAX_DOCUMENTS_MB })}
                          </span>
                        </div>
                        <FileDropzone
                          files={documents}
                          onChange={(files) => {
                            setDocuments(files);
                            setEdited((e) => ({ ...e, documents: true }));
                          }}
                          maxSizeMb={MAX_DOCUMENTS_MB}
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          invalid={!!documentsError}
                          describedBy={
                            documentsError ? "daftar-dokumen-error" : undefined
                          }
                        />
                        {documentsError && (
                          <p id="daftar-dokumen-error" className={authErrorClass}>
                            {documentsError}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* Lainnya */}
          <section aria-labelledby="daftar-lainnya" className="mt-15">
            <div className="flex h-6 items-center">
              <h2 id="daftar-lainnya" className={authSectionTitleClass}>
                {t.auth.register.others}
              </h2>
            </div>
            <div className="mt-10">
              <Field
                id="daftar-sumber"
                label={t.auth.register.heardFrom}
                error={errorFor("heard_from")}
              >
                <SelectInput
                  id="daftar-sumber"
                  options={SOURCE_OPTIONS.map((value) => ({ value, label: t.auth.register.sources[value] }))}
                  value={form.heard_from}
                  onChange={(e) => set("heard_from", e.target.value)}
                  {...invalid("heard_from", "daftar-sumber")}
                />
              </Field>
            </div>
          </section>
        </fieldset>

        <button
          type="submit"
          disabled={pending}
          className={clsx(authSubmitClass, "mt-10")}
        >
          {pending ? t.auth.sending : t.common.register}
        </button>
      </form>

      <hr className="mt-20 border-border-light dark:border-border-dark" />

      <div className="mt-15 flex flex-wrap items-center gap-5">
        <p className="text-base text-koleksi-navy-dark dark:text-ink-dark">
          {t.auth.register.alreadyRegistered}
        </p>
        <Link href="/masuk" className={authOutlineClass}>
          {t.common.login}
        </Link>
      </div>
    </>
  );
}
