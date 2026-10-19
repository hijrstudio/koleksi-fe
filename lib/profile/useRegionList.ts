"use client";

import { useEffect, useState } from "react";
import type { Region } from "@/types";

/**
 * Daftar kecamatan / kelurahan untuk `parentCode`, diambil lewat /api/regions/* (token backend
 * tetap di server). Hasil di-cache per kode induk selama form terbuka. Dipakai form Daftar & Ubah profil.
 */
export default function useRegionList(
  kind: "districts" | "villages",
  parentCode: string,
  initial: { parent: string; items: Region[] } = { parent: "", items: [] },
) {
  const [cache, setCache] = useState<Record<string, Region[]>>(
    initial.parent ? { [initial.parent]: initial.items } : {},
  );
  const [failedFor, setFailedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!parentCode || cache[parentCode]) return;

    const controller = new AbortController();
    const param = kind === "districts" ? "regency" : "district";

    fetch(`/api/regions/${kind}?${param}=${encodeURIComponent(parentCode)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(({ data }: { data: Region[] }) =>
        setCache((c) => ({ ...c, [parentCode]: data })),
      )
      .catch(() => {
        if (!controller.signal.aborted) setFailedFor(parentCode);
      });

    return () => controller.abort();
  }, [kind, parentCode, cache]);

  const items = parentCode ? cache[parentCode] : undefined;

  return {
    items: items ?? [],
    loading: !!parentCode && !items && failedFor !== parentCode,
    failed: !!parentCode && failedFor === parentCode,
  };
}
