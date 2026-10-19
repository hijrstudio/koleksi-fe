import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  AboutPageData,
  AboutResponse,
  Locale,
  ManagementMemberResponse,
  ManagementPerson,
  NullableLocalizedText,
} from "@/types";

/** Jumlah penasihat di baris pertama (Ketua Umum & Wakil Ketua). */
const PENGURUS_UTAMA_COUNT = 2;

function pick(text: NullableLocalizedText, locale: Locale): string | null {
  return text[locale] || text.id || null;
}

function toPerson(member: ManagementMemberResponse, locale: Locale): ManagementPerson {
  return {
    id: `pengurus-${member.id}`,
    name: member.name,
    role: pick(member.position, locale) ?? "",
    photo: member.photo,
  };
}

/**
 * Semua data halaman Tentang Kami.
 *
 * Sengaja TIDAK menelan error: kalau backend gagal saat revalidasi, Next.js tetap menyajikan
 * versi halaman terakhir yang berhasil (stale), bukan halaman yang kontennya kosong.
 */
export async function getAboutPage(locale: Locale = "id"): Promise<AboutPageData> {
  const { data } = await apiFetch<{ data: AboutResponse }>(API_ENDPOINTS.about, {
    revalidate: 300,
    tags: ["about"],
  });

  const penasihat = data.management?.penasihat.map((m) => toPerson(m, locale)) ?? [];

  return {
    summary: pick(data.summary, locale),
    image: data.image,
    profilOrganisasi: pick(data.profil_organisasi, locale),
    visi: pick(data.visi, locale),
    misi: pick(data.misi, locale),
    syaratAnggota: pick(data.syarat_anggota, locale),
    daftarUlangAnggota: pick(data.daftar_ulang_anggota, locale),
    documents: data.documents,
    management: data.management
      ? {
          periodLabel: data.management.period.label,
          pengurusUtama: penasihat.slice(0, PENGURUS_UTAMA_COUNT),
          pengurusInti: penasihat.slice(PENGURUS_UTAMA_COUNT),
          pengurusBidang: data.management.bidang.map((m) => toPerson(m, locale)),
        }
      : null,
    faqs: data.faqs
      .map((faq) => ({
        id: `faq-${faq.id}`,
        question: pick(faq.question, locale) ?? "",
        answer: pick(faq.answer, locale) ?? "",
      }))
      .filter((faq) => faq.question !== ""),
  };
}
