import Image from "next/image";

export default function ProfileCard({
  name,
  role,
  photo,
}: {
  name: string;
  role: string;
  photo: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative h-[130px] w-[130px] overflow-hidden rounded-full">
        <Image
          src={photo}
          alt={name}
          fill
          className="object-cover"
          sizes="130px"
        />
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
