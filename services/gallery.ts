import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { formatPlainDate } from "@/lib/formatDate";
import type { GalleryAlbumListResponse, GalleryAlbumPage, Locale } from "@/types";

/** Album galeri foto (6 per halaman) dengan pencarian judul. */
export async function getGalleryAlbums(
  query: { search?: string; page?: number } = {},
  locale: Locale = "id",
): Promise<GalleryAlbumPage> {
  const res = await apiFetch<GalleryAlbumListResponse>(API_ENDPOINTS.galleryAlbums, {
    query: {
      search: query.search?.trim() || undefined,
      page: query.page ?? 1,
    },
    revalidate: 60,
    tags: ["gallery"],
  });

  return {
    items: res.data.map((album) => {
      const photos = album.photos.map((p) => p.url).filter((url): url is string => !!url);

      return {
        id: `album-${album.id}`,
        title: album.title[locale] || album.title.id,
        date: formatPlainDate(album.gallery_date, locale),
        cover: album.cover,
        photos: photos.length > 0 ? photos : album.cover ? [album.cover] : [],
      };
    }),
    page: res.meta.current_page,
    totalPages: Math.max(1, res.meta.last_page),
  };
}
