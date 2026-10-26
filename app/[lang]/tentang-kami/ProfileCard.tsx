import Image from "next/image";
import { UserRound } from "lucide-react";

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
      <div className="relative flex h-[130px] w-[130px] items-center justify-center overflow-hidden rounded-full bg-koleksi-navy-dark/10">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
            sizes="130px"
          />
        ) : (
          <UserRound size={56} className="text-koleksi-navy-dark/30" aria-hidden />
        )}
      </div>
      <p className="mt-4 text-base font-bold leading-6 text-koleksi-navy-dark">
        {name}
      </p>
      <p className="text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/60">
        {role}
      </p>
    </div>
  );
}
