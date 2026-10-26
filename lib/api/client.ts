import "server-only";

/**
 * HTTP client ke API backend (Laravel) dengan static bearer token.
 *
 * Server-only: BACKEND_API_TOKEN tidak berprefix NEXT_PUBLIC_ dan file ini di-guard
 * `server-only`, jadi build akan error kalau tidak sengaja di-import dari Client Component.
 *
 *   const res = await apiFetch<ApiCollection<X>>(API_ENDPOINTS.x, { query: { page: 1 }, revalidate: 300 });
 */

type QueryValue = string | number | boolean | null | undefined;

export interface ApiFetchOptions extends Omit<RequestInit, "headers"> {
  query?: Record<string, QueryValue>;
  headers?: Record<string, string>;
  /** Detik cache data (ISR). `false` = tidak di-cache. Default 60. */
  revalidate?: number | false;
  /** Tag untuk revalidateTag() on-demand. */
  tags?: string[];
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly endpoint: string,
    public readonly body?: unknown,
  ) {
    super(`API ${endpoint} gagal dengan status ${status}`);
    this.name = "ApiError";
  }
}

const DEFAULT_REVALIDATE = 60;

/**
 * GET dicoba ulang kalau koneksi putus (mis. ECONNRESET saat TLS handshake ketika build memanggil API paralel)
 * atau gateway sibuk. Hanya GET: POST/PUT (login, pembayaran) tidak boleh terkirim dua kali.
 */
const RETRY_DELAYS_MS = [300, 1000];
const RETRY_STATUSES = new Set([502, 503, 504]);

/** fetch + retry untuk request GET (lihat RETRY_DELAYS_MS). */
async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  const retryable = (init.method ?? "GET").toUpperCase() === "GET";

  for (let attempt = 0; ; attempt++) {
    const last = !retryable || attempt >= RETRY_DELAYS_MS.length;

    try {
      const res = await fetch(url, init);
      if (last || !RETRY_STATUSES.has(res.status)) return res;
    } catch (error) {
      // Dibatalkan pemanggil (AbortController) → jangan diulang
      if (last || (error as Error).name === "AbortError" || init.signal?.aborted) throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
  }
}

function buildUrl(endpoint: string, query?: ApiFetchOptions["query"]): string {
  const baseUrl = process.env.BACKEND_API_URL;
  if (!baseUrl) {
    throw new Error("BACKEND_API_URL belum diset di .env.local");
  }

  const url = new URL(`${baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

export async function apiFetch<T>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const { query, headers, revalidate = DEFAULT_REVALIDATE, tags, ...init } = options;

  const token = process.env.BACKEND_API_TOKEN;
  if (!token) {
    throw new Error("BACKEND_API_TOKEN belum diset di .env.local");
  }

  const res = await fetchWithRetry(buildUrl(endpoint, query), {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    ...(revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate, tags } }),
  });

  if (!res.ok) {
    throw new ApiError(res.status, endpoint, await res.json().catch(() => undefined));
  }

  return res.json() as Promise<T>;
}

/**
 * Seperti apiFetch tapi mengembalikan Response mentah (body tidak dibaca) — untuk file biner (mis. PDF)
 * yang di-stream ulang oleh Route Handler. Tidak di-cache. `bearer` menggantikan BACKEND_API_TOKEN
 * (mis. token member). Melempar ApiError kalau status bukan 2xx.
 */
export async function apiFetchRaw(endpoint: string, { bearer }: { bearer?: string } = {}): Promise<Response> {
  const token = bearer ?? process.env.BACKEND_API_TOKEN;
  if (!token) {
    throw new Error("BACKEND_API_TOKEN belum diset di .env.local");
  }

  const res = await fetchWithRetry(buildUrl(endpoint), {
    headers: { Accept: "application/pdf, application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new ApiError(res.status, endpoint, await res.json().catch(() => undefined));
  }

  return res;
}
