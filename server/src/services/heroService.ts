import { getDatabase } from '../config/database.js';

export interface HeroCta {
  label?: string;
  href?: string;
  target?: string | null;
  rel?: string | null;
  trackingId?: string | null;
}

export interface HeroBackgroundVideo {
  url?: string | null;
  poster?: string | null;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface HeroOverlay {
  color?: string | null;
  opacity?: number;
}

export interface HeroContent {
  backgroundColor?: string | null;
  backgroundImage?: string | null;
  backgroundImageAlt?: string | null;
  title?: string;
  subtitle?: string;
  year?: string;
  tagline?: string;
  bubbles?: string[];
  primaryCta?: HeroCta | null;
  secondaryCta?: HeroCta | null;
  backgroundVideo?: HeroBackgroundVideo | null;
  overlay?: HeroOverlay | null;
  textAlign?: string;
  layoutVariant?: string;
  ariaLabel?: string;
}

export interface HeroDocument extends HeroContent {
  _id?: string;
  slug?: string;
  updatedAt?: Date;
}

const HERO_COLLECTION = 'hero';

export async function findHeroBySlug(slug = 'impact-report'): Promise<HeroDocument | null> {
  const db = await getDatabase();
  const collection = db.collection<HeroDocument>(HERO_COLLECTION);
  const doc = await collection.findOne({ slug });
  return doc ?? null;
}

