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
  backgroundOpacity?: number;
  title?: string;
  subtitle?: string;
  year?: string;
  tagline?: string;
  bubbles?: string[];
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}

// Media upload flow:
// 1) Use client/src/services/upload.api.ts -> uploadFile(file, { folder? })
// 2) Persist the returned { key, publicUrl, ...metadata } in your domain model
// 3) Render using the publicUrl

const DEFAULT_BACKEND_URL = 'http://localhost:4000';

const API_BASE_URL =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? DEFAULT_BACKEND_URL;

export async function fetchHeroContent(): Promise<HeroContent | null> {
  try {
    const url = `${API_BASE_URL}/api/impact/hero`;
    console.log('[client][hero] GET', { url });
    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) {
      console.warn('[client][hero] GET failed', { status: response.status });
      return null;
    }

    const payload = (await response.json()) as HeroApiResponse<HeroContent>;
    console.log('[client][hero] GET success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to fetch hero content', error);
    return null;
  }
}

export async function saveHeroContent(
  data: Record<string, unknown>,
  options?: { slug?: string },
): Promise<HeroContent | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/impact/hero`);
    if (options?.slug) url.searchParams.set('slug', options.slug);
    console.log('[client][hero] PUT', { url: url.toString(), keys: Object.keys(data || {}) });
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.warn('[client][hero] PUT failed', { status: response.status });
      return null;
    }

    const payload = (await response.json()) as HeroApiResponse<HeroContent>;
    console.log('[client][hero] PUT success', { fields: Object.keys(payload?.data || {}) });
    return payload?.data ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ImpactReport] Failed to save hero content', error);
    return null;
  }
}

