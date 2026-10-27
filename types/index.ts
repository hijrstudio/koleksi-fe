export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  /** true = disembunyikan sementara dari menu (desktop & mobile); halamannya tetap ada. */
  hidden?: boolean;
}

export type Locale = "id" | "en";

/** Teks bilingual dari API backend. */
export type LocalizedText = Record<Locale, string>;

/** Bungkus response collection Laravel API Resource: `{ data: [...] }`. */
export interface ApiCollection<T> {
  data: T[];
}

/** Response mentah GET /hero-banners. */
export interface HeroBannerResponse {
  id: number;
  type: "image" | "video";
  mime_type: string;
  url: string;
  title: LocalizedText;
  updated_at: string | null;
}

/** Data yang dipakai komponen HeroSlider (sudah dimapping dari API). */
export interface HeroSlide {
  id: string;
  type: "image" | "video";
  src: string;
  mimeType: string;
  title: string;
}

export interface StatItem {
  icon: string;
  value: string;
  label: string;
}

export interface ArticleCard {
  id: string;
  tag: string;
  tagColor: "artikel" | "video" | "playbook";
  title: string;
  author: string | null;
  image: string | null;
  isVideo?: boolean;
  /** Artikel: link ke halaman detail. */
  href?: string;
  /** Video: dibuka di popup YouTube. */
  youtubeId?: string;
  /** Web Playbook: dibuka di popup PDF. */
  playbook?: PlaybookListItem;
}

/** Response mentah GET /guides/latest: playbook, video & artikel terbaru dalam satu bentuk. */
export interface LatestGuideResponse {
  id: number;
  type: "playbook" | "video" | "article";
  title: LocalizedText;
  author: string | null;
  image: string | null;
  slug: string | null;
  youtube_id: string | null;
  published_at: string | null;
}

export interface NewsCard {
  id: string;
  tag: string;
  /** true = badge kuning (Berita EV / Liputan), false = teks hijau (News Release). */
  badge?: boolean;
  title: string;
  date: string;
  href?: string;
  /** Berita EV: `href` = link berita di media lain, dibuka di tab baru. */
  external?: boolean;
}

/** Slot kartu berita di homepage (GET /news/latest), urutan tetap dari backend. */
export type LatestNewsSlot = "news_release" | "latest" | "archive";

/** Response mentah GET /news/latest: NewsResponse + slot. */
export interface LatestNewsResponse extends NewsResponse {
  slot: LatestNewsSlot;
}

/** Response kartu berita (list, detail, homepage). */
export interface NewsResponse {
  id: number;
  category: {
    value: "news_release" | "ev_news" | "coverage";
    label: LocalizedText;
    /** true = Berita EV: tautan ke berita di media lain (lihat `source`). */
    external: boolean;
  };
  title: LocalizedText;
  /** Ringkasan — hanya Berita EV (lainnya null). */
  summary: LocalizedText | null;
  /** List & detail berita; Berita EV: penulis di media sumber, atau nama media. */
  author?: string | null;
  /** Hanya Berita EV (lainnya null). `url` sudah divalidasi http/https di CMS. */
  source: { url: string; name: string; author: string | null; published_on: string | null } | null;
  slug: string;
  image: string | null;
  published_at: string | null;
}

export interface ActivityCard {
  id: string;
  title: string;
  date: string;
  image: string | null;
  href?: string;
}

/** Response mentah GET /events/latest. Tanggal Y-m-d tanpa jam. */
export interface EventResponse {
  id: number;
  title: LocalizedText;
  slug: string;
  image: string | null;
  start_date: string;
  end_date: string;
  location: string;
  phase: "upcoming" | "ongoing" | "done" | null;
}

/** Response mentah GET /events (paginasi bernomor). */
export interface EventListResponse {
  data: EventResponse[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

/** Response mentah GET /events/categories. */
export interface EventCategoryResponse {
  id: number;
  name: LocalizedText;
}

export type EventPhase = "upcoming" | "ongoing" | "done";

export interface EventQuery {
  /** Kosong = semua fase. */
  phase?: EventPhase | null;
  search?: string;
  category?: number | null;
  page?: number;
}

export interface EventListItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  image: string | null;
}

export interface EventPage {
  items: EventListItem[];
  page: number;
  totalPages: number;
}

export interface EventCategory {
  id: number;
  name: string;
}

/** Response mentah GET /events/{slug}. Rich text = HTML tersanitasi. */
export interface EventDetailResponse {
  data: EventResponse & {
    category: EventCategoryResponse;
    description: LocalizedText;
    registration_info: LocalizedText | null;
    latitude: number | null;
    longitude: number | null;
    maps_url: string | null;
  };
  related: EventResponse[];
}

export interface EventDetail extends EventListItem {
  category: string;
  location: string;
  /** HTML tersanitasi. */
  description: string;
  /** HTML tersanitasi; null kalau kosong. */
  registrationInfo: string | null;
  /** "lat,lng" untuk embed Google Maps; null kalau koordinat belum diisi. */
  mapQuery: string | null;
  mapsUrl: string | null;
  related: EventListItem[];
}

export interface PlaybookCard {
  id: string;
  title: string;
  image: string;
  href: string;
}

export interface PartnerLogo {
  id: string;
  name: string;
  logo: string;
  /** Intrinsic pixel size of the logo file, used to render it at its
   * natural aspect ratio instead of stretching/squashing it. */
  width: number;
  height: number;
  /** Website partner (opsional). */
  url?: string | null;
}

/** Response mentah GET /partners. */
export interface PartnerResponse {
  id: number;
  name: string;
  logo: string | null;
  url: string | null;
}

export interface SocialPost {
  id: string;
  image: string;
  caption?: string;
  href: string;
}

/** GET /member/notifications — notifikasi tersimpan (riwayat). Teks disusun website dari `type` + `params`. */
export interface MemberNotification {
  id: string;
  /** mis. "account.password_changed", "membership.registration_approved" */
  type: string;
  /** Teks bahasa Indonesia dari backend — dipakai kalau `type` belum dikenal website. */
  title: string;
  message: string;
  params: Partial<Record<"changed_at" | "amount" | "period_label" | "renewal_date" | "active_until" | "days_left", string | number>>;
  read: boolean;
  created_at: string | null;
}

/** "Perlu tindakan" — dihitung dari status akun (/member/me), hilang sendiri setelah diselesaikan. */
export type NotificationAlert =
  | { kind: "change_password" }
  | { kind: "complete_profile" }
  | { kind: "billing"; billing: MemberBilling };

/** GET /api/member/notifications (route Next.js) */
export interface NotificationFeed {
  alerts: NotificationAlert[];
  items: MemberNotification[];
  unreadCount: number;
}

/** Teks bilingual yang boleh kosong (field opsional di CMS). */
export type NullableLocalizedText = Record<Locale, string | null>;

export interface ManagementMemberResponse {
  id: number;
  name: string;
  position: NullableLocalizedText;
  photo: string | null;
}

export interface FaqResponse {
  id: number;
  question: NullableLocalizedText;
  /** HTML tersanitasi. */
  answer: NullableLocalizedText;
}

/** Response mentah GET /about. Field rich text berisi HTML yang sudah disanitasi backend. */
export interface AboutResponse {
  summary: NullableLocalizedText;
  image: string | null;
  profil_organisasi: NullableLocalizedText;
  visi: NullableLocalizedText;
  misi: NullableLocalizedText;
  syarat_anggota: NullableLocalizedText;
  daftar_ulang_anggota: NullableLocalizedText;
  documents: {
    aturan_ad_art: string | null;
    sponsor: string | null;
    mitra: string | null;
  };
  management: {
    period: { start_year: number; end_year: number; label: string };
    penasihat: ManagementMemberResponse[];
    bidang: ManagementMemberResponse[];
  } | null;
  faqs: FaqResponse[];
}

export interface ManagementPerson {
  id: string;
  name: string;
  role: string;
  photo: string | null;
}

export interface FaqItem {
  id: string;
  question: string;
  /** HTML tersanitasi. */
  answer: string;
}

/** Data halaman Tentang Kami (sudah dimapping ke satu bahasa). */
export interface AboutPageData {
  /** HTML */
  summary: string | null;
  image: string | null;
  /** HTML */
  profilOrganisasi: string | null;
  visi: string | null;
  /** HTML */
  misi: string | null;
  /** HTML */
  syaratAnggota: string | null;
  /** HTML */
  daftarUlangAnggota: string | null;
  documents: AboutResponse["documents"];
  management: {
    periodLabel: string;
    /** Baris pertama penasihat (Ketua Umum & Wakil). */
    pengurusUtama: ManagementPerson[];
    /** Sisa penasihat (Sekretaris, Bendahara, ...). */
    pengurusInti: ManagementPerson[];
    pengurusBidang: ManagementPerson[];
  } | null;
  faqs: FaqItem[];
}

/* ---------- Artikel panduan ---------- */

export interface GuideCategoryResponse {
  id: number;
  name: LocalizedText;
}

/** Response mentah item list / related artikel. */
export interface ArticleCardResponse {
  id: number;
  type: "article";
  title: LocalizedText;
  author: string | null;
  category: GuideCategoryResponse;
  image: string | null;
  slug: string;
  published_at: string | null;
}

export interface ArticleListResponse {
  data: ArticleCardResponse[];
  meta: { current_page: number; per_page: number; has_more: boolean };
}

export interface PopularArticleResponse {
  id: number;
  title: LocalizedText;
  slug: string;
  views: number;
  published_at: string | null;
}

export interface ArticleDetailResponse {
  data: ArticleCardResponse & { content: LocalizedText };
  related: ArticleCardResponse[];
}

export type ArticleSort = "latest" | "oldest";

export interface ArticleQuery {
  search?: string;
  category?: number | null;
  sort?: ArticleSort;
  page?: number;
}

export interface ArticleCategory {
  id: number;
  name: string;
  /** Class Tailwind warna badge. */
  color: string;
}

export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  author: string | null;
  image: string | null;
  category: ArticleCategory;
  date: string;
}

export interface ArticlePage {
  items: ArticleListItem[];
  page: number;
  hasMore: boolean;
}

export interface PopularArticle {
  id: string;
  slug: string;
  title: string;
  date: string;
}

export interface ArticleDetail extends ArticleListItem {
  /** HTML tersanitasi. */
  content: string;
  related: ArticleListItem[];
}

/* ---------- Video edukasi ---------- */

export interface VideoCardResponse {
  id: number;
  type: "video";
  title: LocalizedText;
  category: GuideCategoryResponse;
  image: string | null;
  youtube_id: string;
  published_at: string | null;
}

export interface VideoListResponse {
  data: VideoCardResponse[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface VideoQuery {
  search?: string;
  category?: number | null;
  page?: number;
}

export interface VideoCategory {
  id: number;
  name: string;
}

export interface VideoListItem {
  id: string;
  title: string;
  category: VideoCategory;
  date: string;
  image: string | null;
  youtubeId: string;
}

export interface VideoPage {
  items: VideoListItem[];
  page: number;
  totalPages: number;
}

/* ---------- Video kegiatan ---------- */

export interface EventVideoCardResponse {
  id: number;
  title: LocalizedText;
  image: string | null;
  youtube_id: string;
  published_at: string | null;
}

export interface EventVideoListResponse {
  data: EventVideoCardResponse[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface EventVideoQuery {
  search?: string;
  page?: number;
}

/** Sama dengan VideoListItem (video edukasi) tanpa kategori. */
export type EventVideoListItem = Omit<VideoListItem, "category">;

export interface EventVideoPage {
  items: EventVideoListItem[];
  page: number;
  totalPages: number;
}

/* ---------- Dokumen regulasi ---------- */

/** Judul satu bahasa (nama resmi dokumen). PDF: /api/regulations/{id}/file. */
export interface RegulationResponse {
  id: number;
  title: string;
  published_at: string | null;
}

export interface RegulationListResponse {
  data: RegulationResponse[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface RegulationQuery {
  search?: string;
  page?: number;
}

export interface RegulationListItem {
  id: number;
  title: string;
  /** Link PDF (proxy Next.js), dibuka di tab baru. */
  url: string;
}

export interface RegulationPage {
  items: RegulationListItem[];
  page: number;
  totalPages: number;
}

/* ---------- Infografis ---------- */

export interface InfographicCardResponse {
  id: number;
  title: LocalizedText;
  category: GuideCategoryResponse;
  image: string | null;
  published_at: string | null;
}

export interface InfographicListResponse {
  data: InfographicCardResponse[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface InfographicQuery {
  search?: string;
  category?: number | null;
  page?: number;
}

export interface InfographicListItem {
  id: string;
  title: string;
  category: VideoCategory;
  image: string | null;
}

export interface InfographicPage {
  items: InfographicListItem[];
  page: number;
  totalPages: number;
}

/* ---------- Web Playbook ---------- */

/** Response mentah GET /guides/playbooks (item). URL PDF sengaja tidak dikirim backend. */
export interface PlaybookCardResponse {
  id: number;
  title: LocalizedText;
  cover: string | null;
  published_at: string | null;
  updated_at: string | null;
}

export interface PlaybookListResponse {
  data: PlaybookCardResponse[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface PlaybookQuery {
  search?: string;
  page?: number;
}

export interface PlaybookListItem {
  /** ID backend: dipakai untuk URL /api/playbooks/{id}/file & /download. */
  id: number;
  title: string;
  cover: string | null;
}

export interface PlaybookPage {
  items: PlaybookListItem[];
  page: number;
  totalPages: number;
}

/* ---------- Galeri foto ---------- */

export interface GalleryAlbumResponse {
  id: number;
  title: LocalizedText;
  cover: string | null;
  /** Y-m-d, tanpa jam. */
  gallery_date: string | null;
  photos: { id: number; url: string | null }[];
}

export interface GalleryAlbumListResponse {
  data: GalleryAlbumResponse[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface GalleryAlbum {
  id: string;
  title: string;
  date: string;
  cover: string | null;
  /** URL foto untuk lightbox (fallback ke cover kalau album belum punya foto). */
  photos: string[];
}

export interface GalleryAlbumPage {
  items: GalleryAlbum[];
  page: number;
  totalPages: number;
}

/* ---------- Berita ---------- */

export interface NewsListResponse {
  data: NewsResponse[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface NewsDetailResponse {
  data: NewsResponse & { content: LocalizedText };
  related: NewsResponse[];
}

export interface NewsQuery {
  search?: string;
  category?: "news_release" | "ev_news" | "coverage" | null;
  sort?: "latest" | "oldest";
  page?: number;
}

export interface NewsListItem {
  id: string;
  slug: string;
  tag: string;
  badge: boolean;
  title: string;
  author: string | null;
  image: string | null;
  date: string;
  /** Berita EV: ringkasan, nama media & link berita di media lain (kartu dibuka di tab baru). */
  summary: string | null;
  sourceName: string | null;
  externalUrl: string | null;
}

export interface NewsPage {
  items: NewsListItem[];
  page: number;
  totalPages: number;
}

export interface NewsDetail extends NewsListItem {
  /** HTML tersanitasi. */
  content: string;
  related: NewsListItem[];
}

/** Response GET /member/me (`data`) & POST /member/login (`member`). */
export interface MemberProfile {
  id: number;
  no_lambung: number;
  no_lambung_label: string;
  nama_lengkap: string;
  nama_panggilan: string | null;
  email: string | null;
  no_hp: string | null;
  /** Selalu terisi: foto member, atau avatar default dari backend. */
  photo_url: string;
  city_code: string | null;
  city_name: string | null;
  tgl_bergabung: string | null;
  membership: {
    status: "active" | "inactive";
    is_active: boolean;
    period_label: string | null;
    /** "Y-m-d" — periode lunas terakhir. */
    valid_from: string | null;
    valid_until: string | null;
    /** valid_until + masa tenggang. */
    active_until: string | null;
    renewal_date: string | null;
  };
  /** Ringkasan tagihan iuran (kartu "Iuran" di Dasbor). */
  billing: MemberBilling;
  must_change_password: boolean;
  profile_completed: boolean;
  last_login_at: string | null;
}

/**
 * ok       → lunas, jatuh tempo masih jauh
 * due_soon → jatuh tempo ≤ window_days lagi  (days_left = hari menuju jatuh tempo)
 * grace    → masa tenggang                   (days_left = hari menuju nonaktif)
 * expired  → tidak aktif                     (days_left negatif)
 * unpaid   → belum pernah bayar
 */
export type BillingState = "ok" | "due_soon" | "grace" | "expired" | "unpaid";

export interface MemberBilling {
  state: BillingState;
  days_left: number | null;
  window_days: number;
  /** "Y-m-d" */
  renewal_date: string | null;
  grace_until: string | null;
  items: { invoice_number: string | null; period_label: string; amount: number }[];
  total: number;
}

/** Response POST /member/login. */
export interface MemberLoginResponse {
  token: string;
  token_type: "Bearer";
  expires_at: string;
  member: MemberProfile;
}

/** Wilayah (kode Kemendagri bertitik, mis. "31.74" / "31.74.01" / "31.74.01.1001"). */
export interface Region {
  code: string;
  name: string;
}

/** GET /regions/regencies — kab/kota beserta nama provinsinya. */
export interface Regency extends Region {
  province: string;
}

/** GET /vehicle-brands */
export interface VehicleBrandOption {
  id: number;
  name: string;
  models: { id: number; name: string }[];
}

export interface VehicleCatalogRef {
  id: number;
  name: string;
  is_active: boolean;
}

export type VehicleVerificationStatus = "pending" | "verified" | "rejected";

export interface VehicleDocument {
  id: number;
  type: string;
  original_name: string;
  mime_type: string;
  size: number;
}

/** GET/POST /member/profile (`data`). */
export interface MemberEditProfile {
  nama_lengkap: string;
  nama_panggilan: string | null;
  email: string | null;
  /** Selalu terisi: foto member, atau avatar default dari backend. */
  photo_url: string;
  /** false = masih avatar default. */
  has_photo: boolean;
  default_photo_url: string;
  no_hp: string | null;
  /** "Y-m-d" */
  tgl_lahir: string | null;
  jenis_kelamin: "L" | "P" | null;
  alamat: string | null;
  city: Region | null;
  district: Region | null;
  village: Region | null;
  has_vehicle: boolean;
  vehicle: {
    id: number;
    vin: string;
    plat_kode: string;
    plat_nomor: string;
    plat_seri: string | null;
    plat_status: "permanen" | "sementara";
    vehicle_brand_id: number | null;
    vehicle_model_id: number | null;
    /** Merek/tipe terpilih (bisa sudah dinonaktifkan di CMS, jadi tidak ada di /vehicle-brands). */
    vehicle_brand: VehicleCatalogRef | null;
    vehicle_model: VehicleCatalogRef | null;
    tahun: number | null;
    verification_status: VehicleVerificationStatus;
    rejection_reason: string | null;
    documents: VehicleDocument[];
  } | null;
  profile_completed: boolean;
}

export type IuranPaymentStatus = "pending" | "success" | "failed" | "expired" | "cancelled" | "refunded";

/** POST /member/payments/iuran & GET /member/payments/{ref} (`data`). */
export interface IuranPayment {
  merchant_ref: string;
  status: IuranPaymentStatus;
  amount: number;
  /** Isi QRIS — hanya ada selama status pending. */
  qr_string: string | null;
  expired_at: string | null;
  paid_at: string | null;
  payment_channel: string | null;
  items: { period_label: string; amount: number }[];
  /** Hanya pada GET (polling). */
  membership?: { status: "active" | "inactive"; active_until: string | null; paid_until: string | null };
}

/** Response mentah GET /spklu-operators (item). */
export interface SpkluOperatorResponse {
  id: number;
  brand_spklu: string;
  nama_operator: string;
  logo: string | null;
  aplikasi: string;
  link_playstore: string | null;
  link_appstore: string | null;
}

export interface SpkluOperatorListResponse {
  data: SpkluOperatorResponse[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

/** Response mentah GET /spklu-operators/brands (item). */
export interface SpkluBrandResponse {
  id: number;
  brand_spklu: string;
  logo: string | null;
}

export type SpkluSort = "asc" | "desc";

export interface SpkluQuery {
  search?: string;
  sort?: SpkluSort;
  page?: number;
}

export interface SpkluOperator {
  id: string;
  /** brand_spklu: label accordion & wordmark slider. */
  name: string;
  /** nama_operator: badan usaha. */
  company: string;
  app: string;
  logo: string | null;
  playStore: string | null;
  appStore: string | null;
}

export interface SpkluBrand {
  id: string;
  name: string;
  logo: string | null;
}

export interface SpkluPage {
  items: SpkluOperator[];
  page: number;
  totalPages: number;
  total: number;
}

/** Response mentah GET /ev-garage/brands (item). */
export interface GarageBrandResponse {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
}

/** Response mentah GET /ev-garage/vehicles (item). */
export interface GarageVehicleResponse {
  id: number;
  brand: { id: number; name: string; slug: string };
  type: string;
  battery_kwh: number;
  ac_kw: number;
  /** null = tidak mendukung DC fast charging. */
  dc_kw: number | null;
  range_km: number;
}

export interface GarageVehicleListResponse {
  data: GarageVehicleResponse[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export type GarageSort = "asc" | "desc";

export interface GarageQuery {
  brand?: string | null;
  search?: string;
  sort?: GarageSort;
  page?: number;
}

export interface GarageBrand {
  /** Slug merek, dipakai sebagai filter ?brand= ke API. */
  slug: string;
  name: string;
  logo: string | null;
}

export interface GarageVehicle {
  id: string;
  brand: string;
  /** Jenis / tipe kendaraan. */
  type: string;
  batteryKwh: number;
  acKw: number;
  /** null = tidak mendukung DC fast charging. */
  dcKw: number | null;
  rangeKm: number;
}

export interface GaragePage {
  items: GarageVehicle[];
  page: number;
  totalPages: number;
  total: number;
}
