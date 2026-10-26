import { formatPlainDate } from "@/lib/formatDate";
import type { Locale, MemberProfile } from "@/types";

/** Data kartu profil di Dasbor (dimapping dari GET /member/me). */
export interface DashboardProfile {
  name: string;
  avatar: string;
  noLambung: string;
  level: number;
  xp: number;
  points: number;
  location: string;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  /** Profil belum lengkap -> tampilkan banner "Silakan melengkapi...". */
  profileIncomplete: boolean;
  /** Masih memakai kata sandi awal (hasil import) -> banner "Silakan ubah kata sandi...". */
  mustChangePassword: boolean;
}

export function toDashboardProfile(member: MemberProfile, locale: Locale): DashboardProfile {
  const { membership } = member;

  return {
    name: member.nama_lengkap,
    avatar: member.photo_url,
    noLambung: member.no_lambung_label,
    // Level/XP/Poin belum ada di backend.
    level: 1,
    xp: 0,
    points: 0,
    location: member.city_name ?? "-",
    isActive: membership.is_active,
    validFrom: formatPlainDate(membership.valid_from, locale, "short") || "-",
    validUntil: formatPlainDate(membership.valid_until, locale, "short") || "-",
    profileIncomplete: !member.profile_completed,
    mustChangePassword: member.must_change_password,
  };
}

export interface MapCity {
  name: string;
  lat: number;
  lng: number;
}

/** 10 kota dummy, sengaja tersebar supaya label pin gak saling tumpuk. */
export const MAP_CITIES: MapCity[] = [
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Bandung", lat: -6.9175, lng: 107.6191 },
  { name: "Semarang", lat: -6.9667, lng: 110.4167 },
  { name: "Yogyakarta", lat: -7.7956, lng: 110.3695 },
  { name: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { name: "Denpasar", lat: -8.6705, lng: 115.2126 },
  { name: "Medan", lat: 3.5952, lng: 98.6722 },
  { name: "Palembang", lat: -2.9761, lng: 104.7754 },
  { name: "Makassar", lat: -5.1477, lng: 119.4327 },
  { name: "Balikpapan", lat: -1.2379, lng: 116.8529 },
];

/** 10 merek dummy. */
export const MAP_BRANDS = [
  "BYD",
  "Hyundai",
  "Wuling",
  "Tesla",
  "Toyota",
  "Kia",
  "MG",
  "Chery",
  "Neta",
  "BMW",
] as const;

/** Jumlah anggota per kota per merek (deterministik, bukan acak, supaya
 *  angka server & client sama). Jakarta dibuat paling ramai. */
export const MEMBER_COUNTS: Record<
  string,
  Record<string, number>
> = Object.fromEntries(
  MAP_CITIES.map((city, ci) => [
    city.name,
    Object.fromEntries(
      MAP_BRANDS.map((brand, bi) => {
        const base = ci === 0 ? 8 : 1;
        const count =
          base + ((ci * 7 + bi * 13 + ci * bi) % (ci === 0 ? 9 : 11));
        return [brand, count];
      }),
    ),
  ]),
);

/** Kartu Riwayat: key = ?kategori= sekaligus kunci judul/deskripsi di dictionary (t.dashboard.historyCards). */
export const RIWAYAT_KATEGORI = ["semua", "tersimpan", "forum", "transaksi"] as const;

// TODO: halaman riwayat belum ada -- href disiapkan dulu.
export const riwayatHref = (kategori: (typeof RIWAYAT_KATEGORI)[number]) => `/dasbor/riwayat?kategori=${kategori}`;
