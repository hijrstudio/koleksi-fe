import "server-only";

import { apiFetch } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

/** IP pengunjung diteruskan sebagai X-Forwarded-For → throttle pendaftaran di backend per pengunjung. */
function forwardedFor(clientIp: string | null): Record<string, string> {
  return clientIp ? { "X-Forwarded-For": clientIp } : {};
}

/** Simpan pendaftaran (multipart: data + dokumen kendaraan). Melempar ApiError 422/429 kalau ditolak. */
export async function registerMember(body: FormData, clientIp: string | null): Promise<{ email: string }> {
  const { data } = await apiFetch<{ data: { email: string } }>(API_ENDPOINTS.registrations, {
    method: "POST",
    headers: forwardedFor(clientIp),
    body,
    revalidate: false,
  });

  return data;
}

/** Kirim ulang link verifikasi. Backend selalu membalas pesan yang sama (tidak membocorkan e-mail terdaftar). */
export async function resendRegistrationVerification(email: string, clientIp: string | null): Promise<string> {
  const { message } = await apiFetch<{ message: string }>(API_ENDPOINTS.registrationResendVerification, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...forwardedFor(clientIp) },
    body: JSON.stringify({ email }),
    revalidate: false,
  });

  return message;
}
