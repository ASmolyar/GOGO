import { getDatabase } from '../config/database.js';

// Individual partner item
export interface PartnerItem {
  id: string;
  name: string;
  descriptor?: string;  // Optional description
  url?: string;  // Optional individual link
  dotColor: string;
}

// Carousel settings
export interface PartnersCarousel {
  enabled: boolean;
  showCustomItems: boolean;  // If false, just show names from overflow partners
  customItems: string[];  // Custom names/items for carousel if showCustomItems is true
  speed: number;  // Animation duration in seconds
  itemBgColor?: string;
  itemTextColor?: string;
  itemBorderColor?: string;
  itemHoverBgColor?: string;
  itemHoverTextColor?: string;
}

// CTA buttons configuration
export interface PartnersCTA {
  viewAllText: string;
  viewAllUrl: string;
  viewAllBgColor?: string;
  viewAllTextColor?: string;
  viewAllBorderColor?: string;
  viewAllHoverBgColor?: string;
  donateText: string;
  donateUrl: string;
  donateBgGradient?: string;
  donateTextColor?: string;
  donateHoverBgGradient?: string;
}

// Fallback link settings
export interface PartnersFallbackLink {
  enabled: boolean;
  url: string;  // Default: https://guitarsoverguns.org/supporters/
}

export interface PartnersContent {
  // Section visibility
  visible?: boolean | null;
  animationsEnabled?: boolean | null;

  // Section background
  sectionBgGradient?: string | null;
  
  // Ambient glow/blob colors
  glowColor1?: string | null;
  glowColor2?: string | null;
  glowColor3?: string | null;

  // Header styling
  title?: string | null;
  titleGradient?: string | null;
  subtitle?: string | null;
  subtitleColor?: string | null;

  // Grid label styling
  gridLabel?: string | null;
  gridLabelColor?: string | null;

  // Badge/card styling
  badgeBgColor?: string | null;
  badgeHoverBgColor?: string | null;
  badgeBorderColor?: string | null;
  badgeHoverBorderColor?: string | null;
  badgeTitleColor?: string | null;
  badgeDescriptorColor?: string | null;
  badgeBorderRadius?: number | null;

  // Partners list
  partners?: PartnerItem[] | null;

  // Fallback link for partners without individual URLs
  fallbackLink?: PartnersFallbackLink | null;

  // Between note (text between grid and carousel)
  betweenNoteText?: string | null;
  betweenNoteColor?: string | null;

  // Carousel settings
  carousel?: PartnersCarousel | null;

  // CTA buttons
  cta?: PartnersCTA | null;

  // Accessibility
  ariaLabel?: string | null;
}

export interface PartnersDocument extends PartnersContent {
  _id?: string;
  slug?: string;
  updatedAt?: Date;
}

const PARTNERS_COLLECTION = 'partners';

export async function findPartnersBySlug(slug = 'impact-report'): Promise<PartnersDocument | null> {
  const db = await getDatabase();
  const collection = db.collection<PartnersDocument>(PARTNERS_COLLECTION);
  const doc = await collection.findOne({ slug });
  return doc ?? null;
}

export async function upsertPartnersBySlug(slug: string, data: PartnersContent): Promise<PartnersDocument> {
  const db = await getDatabase();
  const collection = db.collection<PartnersDocument>(PARTNERS_COLLECTION);

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
  return saved as PartnersDocument;
}

