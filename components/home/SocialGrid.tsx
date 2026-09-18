import Image from "next/image";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewAllLink from "@/components/ui/ViewAllLink";
import { RevealGrid, RevealItem } from "@/components/ui/Reveal";
import clsx from "@/lib/clsx";
import { SocialPost } from "@/types";

interface SocialGridProps {
  title: string;
  posts: SocialPost[];
  aspect?: "square" | "portrait";
  viewAllHref: string;
  topDivider?: boolean;
}

export default function SocialGrid({
  title,
  posts,
  aspect = "square",
  viewAllHref,
  topDivider = false,
}: SocialGridProps) {
  return (
    <SectionContainer withGuides topDivider={topDivider} variant="white">
      <RevealItem>
        <SectionHeader title={title} />
      </RevealItem>

      <RevealGrid
        className={clsx(
          "grid grid-cols-2 gap-8",
          aspect === "square" ? "sm:grid-cols-3" : "sm:grid-cols-4",
        )}
      >
        {posts.map((post) => (
          <RevealItem key={post.id}>
            <a
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-xl"
            >
              <div
                className={clsx(
                  "relative w-full",
                  aspect === "square" ? "aspect-square" : "aspect-[27/37]",
                )}
              >
                <Image
                  src={post.image}
                  alt={post.caption ?? title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 640px) 25vw, 50vw"
                />
              </div>
            </a>
          </RevealItem>
        ))}
      </RevealGrid>

      <ViewAllLink href={viewAllHref} />
    </SectionContainer>
  );
}
