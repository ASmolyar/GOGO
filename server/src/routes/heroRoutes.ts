import { Router } from 'express';
import { findHeroBySlug, upsertHeroBySlug } from '../services/heroService.js';
import { apiKeyAuth } from '../middleware/apiKeyAuth.js';

const router = Router();

router.get('/impact/hero', async (req, res, next) => {
  try {
    const slug = (req.query.slug as string) ?? 'impact-report';
    const hero = await findHeroBySlug(slug);

    if (!hero) {
      return res.status(404).json({ error: 'Hero content not found' });
    }

    const { _id, slug: storedSlug, ...data } = hero;
    return res.json({ data });
  } catch (error) {
    return next(error);
  }
});

router.put('/impact/hero', apiKeyAuth, async (req, res, next) => {
  try {
    const slug = (req.query.slug as string) ?? 'impact-report';
    const data = (req.body ?? {}) as Record<string, unknown>;
    const allowedKeys = [
      'backgroundColor',
      'backgroundImage',
      'backgroundImageAlt',
      'title',
      'subtitle',
      'year',
      'tagline',
      'bubbles',
      'primaryCta',
      'secondaryCta',
      'backgroundVideo',
      'overlay',
      'textAlign',
      'layoutVariant',
      'ariaLabel',
    ];

    const sanitized: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (key in data) sanitized[key] = (data as any)[key];
    }

    const saved = await upsertHeroBySlug(slug, sanitized as any);
    const { _id, slug: storedSlug, ...response } = saved ?? {};
    return res.json({ data: response });
  } catch (error) {
    return next(error);
  }
});

export default router;

