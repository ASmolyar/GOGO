import { Router } from 'express';
import { findHeroBySlug } from '../services/heroService.js';

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

export default router;

