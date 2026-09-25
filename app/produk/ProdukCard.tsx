import Image from "next/image";
import Link from "next/link";
import clsx from "@/lib/clsx";
import { formatRupiahRange } from "@/lib/formatRupiah";
import type { Produk } from "./data";

/**
 * Kartu produk: gambar persegi radius 10px, judul, harga (atau "Stok Habis").
 * size "md" = katalog /produk (judul 20px, harga 16px, gambar 370px di
 * desktop); size "sm" = "Produk Lainnya" di detail (judul 16px, harga 14px,
 * gambar 170px).
 */
export default function ProdukCard({
  produk,
  size = "md",
}: {
  produk: Produk;
  size?: "md" | "sm";
}) {
  const isSmall = size === "sm";

  return (
    <Link href={`/produk/${produk.slug}`} className="group block">
      <div className="relative aspect-square w-full overflow-hidden rounded-[10px]">
        <Image
          src={produk.image}
          alt={produk.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes={
            isSmall ? "170px" : "(min-width: 1024px) 370px, 50vw"
          }
        />
      </div>
      <h3
        className={clsx(
          "mt-4 line-clamp-2 font-bold leading-6 text-koleksi-navy-dark transition group-hover:text-koleksi-green dark:text-ink-dark",
          isSmall ? "text-base" : "text-[20px]",
        )}
      >
        {produk.name}
      </h3>
      <p
        className={clsx(
          "font-bold",
          isSmall ? "mt-1.5 text-sm leading-[21px]" : "mt-3 text-base leading-6",
          produk.soldOut
            ? "text-koleksi-navy-dark/40 dark:text-ink-dark/40"
            : "text-koleksi-green",
        )}
      >
        {produk.soldOut
          ? "Stok Habis"
          : formatRupiahRange(produk.price, produk.priceMax)}
      </p>
    </Link>
  );
}
