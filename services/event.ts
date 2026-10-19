import { ApiError, apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ActivityCard,
  ApiCollection,
  EventCategory,
  EventCategoryResponse,
  EventDetail,
  EventDetailResponse,
  EventListItem,
  EventListResponse,
  EventPage,
  EventQuery,
  EventResponse,
  Locale,
} from "@/types";

/**
 * Rentang tanggal event (input Y-m-d, tanpa jam):
 *   satu hari      -> "3 September 2026"
 *   bulan sama     -> "3–5 September 2026"
 *   beda bulan     -> "30 September – 2 Oktober 2026"
 */
function formatDateRange(start: string, end: string, locale: Locale): string {
  const formatter = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC", // tanggal murni: hindari bergeser hari karena zona waktu
  });

  const startDate = new Date(`${start}T00:00:00Z`);
  if (!end || end === start) return formatter.format(startDate);

  return formatter.formatRange(startDate, new Date(`${end}T00:00:00Z`));
}

function toActivityCard(event: EventResponse, locale: Locale): ActivityCard {
  return {
    id: `kegiatan-${event.id}`,
    title: event.title[locale] || event.title.id,
    date: formatDateRange(event.start_date, event.end_date, locale),
    image: event.image,
    href: `/kegiatan/${event.slug}`,
  };
}

/**
 * 4 kegiatan published terbaru (start_date terbaru dulu) untuk homepage.
 * Kalau API gagal, kembalikan [] supaya halaman tetap render.
 */
export async function getLatestEvents(locale: Locale = "id"): Promise<ActivityCard[]> {
  try {
    const { data } = await apiFetch<ApiCollection<EventResponse>>(API_ENDPOINTS.latestEvents, {
      revalidate: 60,
      tags: ["events"],
    });

    return data.map((event) => toActivityCard(event, locale));
  } catch (error) {
    console.error("[getLatestEvents]", error);
    return [];
  }
}

function toListItem(event: EventResponse, locale: Locale): EventListItem {
  return {
    id: `kegiatan-${event.id}`,
    slug: event.slug,
    title: event.title[locale] || event.title.id,
    date: formatDateRange(event.start_date, event.end_date, locale),
    image: event.image,
  };
}

/**
 * Kalender kegiatan (8 per halaman): tab fase (kosong = semua), pencarian, filter kategori.
 * Fase dihitung backend dari start_date & end_date terhadap hari ini.
 */
export async function getEvents(query: EventQuery = {}, locale: Locale = "id"): Promise<EventPage> {
  const res = await apiFetch<EventListResponse>(API_ENDPOINTS.events, {
    query: {
      phase: query.phase ?? undefined,
      search: query.search?.trim() || undefined,
      category: query.category ?? undefined,
      page: query.page ?? 1,
    },
    revalidate: 60,
    tags: ["events"],
  });

  return {
    items: res.data.map((event) => toListItem(event, locale)),
    page: res.meta.current_page,
    totalPages: Math.max(1, res.meta.last_page),
  };
}

/** Kategori kegiatan published untuk dropdown filter. */
export async function getEventCategories(locale: Locale = "id"): Promise<EventCategory[]> {
  const { data } = await apiFetch<ApiCollection<EventCategoryResponse>>(API_ENDPOINTS.eventCategories, {
    revalidate: 300,
    tags: ["events"],
  });

  return data.map((category) => ({
    id: category.id,
    name: category.name[locale] || category.name.id,
  }));
}

/** Isi rich text dianggap kosong kalau tanpa teks (mis. "<p></p>" dari editor). */
function richTextOrNull(html: string | undefined): string | null {
  return html && html.replace(/<[^>]*>|&nbsp;/g, "").trim() ? html : null;
}

/** Detail kegiatan + 4 kegiatan terkait. null jika tidak ada / belum published. */
export async function getEventDetail(slug: string, locale: Locale = "id"): Promise<EventDetail | null> {
  try {
    const { data, related } = await apiFetch<EventDetailResponse>(API_ENDPOINTS.eventDetail(slug), {
      revalidate: 60,
      tags: ["events", `events:${slug}`],
    });

    const hasCoordinates = data.latitude !== null && data.longitude !== null;

    return {
      ...toListItem(data, locale),
      category: data.category.name[locale] || data.category.name.id,
      location: data.location,
      description: data.description[locale] || data.description.id,
      registrationInfo: richTextOrNull(data.registration_info?.[locale] || data.registration_info?.id),
      mapQuery: hasCoordinates ? `${data.latitude},${data.longitude}` : null,
      mapsUrl: data.maps_url,
      related: related.map((event) => toListItem(event, locale)),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
