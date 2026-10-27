import Image from "next/image";
import clsx from "@/lib/clsx";

/** Kartu penasihat: foto bulat + nama + jabatan. Tanpa foto, hanya nama & jabatan. */
export default function ProfileCard({
  name,
  role,
  photo,
}: {
  name: string;
  role: string;
  photo: string | null;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      {photo && (
        <div className="relative h-[130px] w-[130px] overflow-hidden rounded-full bg-koleksi-navy-dark/10">
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
            sizes="130px"
          />
        </div>
      )}
      <p className={clsx("text-base font-bold leading-6 text-koleksi-navy-dark", photo && "mt-4")}>
        {name}
      </p>
      <p className="text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/60">
        {role}
      </p>
    </div>
  );
}
