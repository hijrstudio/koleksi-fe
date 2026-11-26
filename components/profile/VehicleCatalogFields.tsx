"use client";

import Field from "@/components/auth/FormField";
import SelectInput from "@/components/auth/SelectInput";
import { authInputClass } from "@/components/auth/authStyles";
import { useI18n } from "@/components/i18n/I18nProvider";
import {
  OTHER_BRAND_MAX,
  OTHER_MODEL_MAX,
  OTHER_OPTION,
} from "@/lib/profile/validation";
import type { VehicleBrandOption } from "@/types";

type Key = "vehicle_brand_id" | "vehicle_model_id" | "brand_other" | "model_other";

interface VehicleCatalogFieldsProps {
  /** Prefix id input ("daftar" / "profil"). */
  idPrefix: string;
  brands: VehicleBrandOption[];
  values: Record<Key, string>;
  required?: boolean;
  onChange: (key: Key, value: string, patch?: Partial<Record<Key, string>>) => void;
  errorFor: (key: Key) => string | undefined;
}

/**
 * Merek & tipe kendaraan: pilih dari katalog, atau "Merek lain" / "Tipe lain" lalu tulis sendiri kalau belum ada
 * di daftar. Merek lain → tipe langsung berupa isian teks (tipenya pasti juga belum ada di katalog).
 */
export default function VehicleCatalogFields({
  idPrefix,
  brands,
  values,
  required,
  onChange,
  errorFor,
}: VehicleCatalogFieldsProps) {
  const { t } = useI18n();
  const brandId = `${idPrefix}-merek`;
  const modelId = `${idPrefix}-tipe`;
  const otherBrand = values.vehicle_brand_id === OTHER_OPTION;
  const otherModel = otherBrand || values.vehicle_model_id === OTHER_OPTION;

  const brandOptions = [
    ...brands.map((b) => ({ value: String(b.id), label: b.name })),
    { value: OTHER_OPTION, label: t.form.otherBrand },
  ];
  const modelOptions = [
    ...(brands
      .find((b) => String(b.id) === values.vehicle_brand_id)
      ?.models.map((m) => ({ value: String(m.id), label: m.name })) ?? []),
    { value: OTHER_OPTION, label: t.form.otherModel },
  ];

  const brandError = errorFor("vehicle_brand_id") ?? errorFor("brand_other");
  const modelError = errorFor("vehicle_model_id") ?? errorFor("model_other");
  const a11y = (error: string | undefined, id: string) =>
    ({
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${id}-error` : undefined,
    }) as const;

  return (
    <div className="grid grid-cols-2 gap-5">
      <Field id={brandId} label={t.form.brand} required={required} error={brandError}>
        <SelectInput
          id={brandId}
          options={brandOptions}
          value={values.vehicle_brand_id}
          onChange={(e) =>
            onChange("vehicle_brand_id", e.target.value, { vehicle_model_id: "" })
          }
          {...a11y(otherBrand ? undefined : brandError, brandId)}
        />
        {otherBrand && (
          <input
            id={`${brandId}-lain`}
            type="text"
            maxLength={OTHER_BRAND_MAX}
            placeholder={t.form.otherBrandPlaceholder}
            aria-label={t.form.otherBrandPlaceholder}
            value={values.brand_other}
            onChange={(e) => onChange("brand_other", e.target.value)}
            className={`${authInputClass} mt-3`}
            {...a11y(brandError, brandId)}
          />
        )}
      </Field>

      <Field id={modelId} label={t.form.model} required={required} error={modelError}>
        {!otherBrand && (
          <SelectInput
            id={modelId}
            options={modelOptions}
            value={values.vehicle_model_id}
            disabled={!values.vehicle_brand_id}
            onChange={(e) => onChange("vehicle_model_id", e.target.value)}
            {...a11y(otherModel ? undefined : modelError, modelId)}
          />
        )}
        {otherModel && (
          <input
            id={otherBrand ? modelId : `${modelId}-lain`}
            type="text"
            maxLength={OTHER_MODEL_MAX}
            placeholder={t.form.otherModelPlaceholder}
            aria-label={t.form.otherModelPlaceholder}
            value={values.model_other}
            onChange={(e) => onChange("model_other", e.target.value)}
            className={otherBrand ? authInputClass : `${authInputClass} mt-3`}
            {...a11y(modelError, modelId)}
          />
        )}
      </Field>
    </div>
  );
}
