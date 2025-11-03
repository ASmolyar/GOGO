export interface HeroApiResponse<T> {
  data: T;
}

export interface HeroCta {
  label?: string;
  href?: string;
}

export interface HeroContent {
  backgroundColor?: string;
  backgroundImage?: string | null;
  title?: string;
  subtitle?: string;
  year?: string;
  tagline?: string;
  bubbles?: string[];
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}

const DEFAULT_BACKEND_URL = 'http://localhost:4000';

const API_BASE_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? DEFAULT_BACKEND_URL;

export async function fetchHeroContent(): Promise<HeroContent | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/impact/hero`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as HeroApiResponse<HeroContent>;
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to fetch hero content', error);
    return null;
  }
}

