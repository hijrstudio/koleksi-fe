export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface HeroSlide {
  id: string;
  eyebrowLogos: string[];
  title: string;
  image: string;
}

export interface StatItem {
  icon: string;
  value: string;
  label: string;
}

export interface ArticleCard {
  id: string;
  tag: string;
  tagColor: "artikel" | "video";
  title: string;
  author: string;
  image: string;
  isVideo?: boolean;
}

export interface NewsCard {
  id: string;
  tag: string;
  title: string;
  date: string;
}

export interface ActivityCard {
  id: string;
  title: string;
  date: string;
  image: string;
}

export interface PlaybookCard {
  id: string;
  title: string;
  image: string;
  href: string;
}

export interface PartnerLogo {
  id: string;
  name: string;
  logo: string;
  /** Intrinsic pixel size of the logo file, used to render it at its
   * natural aspect ratio instead of stretching/squashing it. */
  width: number;
  height: number;
}

export interface SocialPost {
  id: string;
  image: string;
  caption?: string;
  href: string;
}
