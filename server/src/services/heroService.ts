import { getDatabase } from '../config/database.js';

export interface HeroCta {
  label?: string;
  href?: string;
  target?: string | null;
  rel?: string | null;
  trackingId?: string | null;
}

// Removed background video and overlay support

export interface HeroContent {
  backgroundColor?: string | null;
  backgroundImage?: string | null;
  backgroundImageAlt?: string | null;
  backgroundOpacity?: number;
  title?: string;
  subtitle?: string;
  year?: string;
  tagline?: string;
  bubbles?: string[];
  primaryCta?: HeroCta | null;
  secondaryCta?: HeroCta | null;
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

export async function upsertHeroBySlug(slug: string, data: HeroContent): Promise<HeroDocument> {
  const db = await getDatabase();
  const collection = db.collection<HeroDocument>(HERO_COLLECTION);

  const now = new Date();
  const update = {
    $set: {
      ...data,
      slug,
      updatedAt: now,
    },
  };

  await collection.updateOne({ slug }, update, { upsert: true });
  const saved = await collection.findOne({ slug });
  return saved as HeroDocument;
}

