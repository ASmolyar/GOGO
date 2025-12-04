import { Router } from 'express';
import { findPartnersBySlug, upsertPartnersBySlug } from "../services/partnersService.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/impact/partners", async (req, res, next) => {
  try {
    const slug = (req.query.slug as string) ?? "impact-report";
    console.log("[partners] GET", { slug });
    const partners = await findPartnersBySlug(slug);

    if (!partners) {
      console.warn("[partners] GET not found", { slug });
      return res.status(404).json({ error: "Partners content not found" });
    }

    const { _id, slug: storedSlug, ...data } = partners;
    console.log("[partners] GET success", {
      slug,
      fields: Object.keys(data || {}),
    });
    return res.json({ data });
  } catch (error) {
    return next(error);
  }
});

router.put("/impact/partners", requireAuth, async (req, res, next) => {
  try {
    const slug = (req.query.slug as string) ?? "impact-report";
    const data = (req.body ?? {}) as Record<string, unknown>;
    console.log("[partners] PUT request", {
      slug,
      incomingKeys: Object.keys(data || {}),
    });

    const allowedKeys = [
      // Visibility
      "visible",
      "animationsEnabled",
      // Background
      "sectionBgGradient",
      "glowColor1",
      "glowColor2",
      "glowColor3",
      // Header
      "title",
      "titleGradient",
      "subtitle",
      "subtitleColor",
      // Grid label
      "gridLabel",
      "gridLabelColor",
      // Badge/card styling
      "badgeBgColor",
      "badgeHoverBgColor",
      "badgeBorderColor",
      "badgeHoverBorderColor",
      "badgeTitleColor",
      "badgeDescriptorColor",
      "badgeBorderRadius",
      // Partners list
      "partners",
      // Fallback link
      "fallbackLink",
      // Between note
      "betweenNoteText",
      "betweenNoteColor",
      // Carousel
      "carousel",
      // CTA
      "cta",
      // Accessibility
      "ariaLabel",
    ];

    const sanitized: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (key in data) sanitized[key] = (data as any)[key];
    }

    console.log("[partners] PUT sanitized", {
      slug,
      sanitizedKeys: Object.keys(sanitized),
    });

    const saved = await upsertPartnersBySlug(slug, sanitized as any);
    const { _id, slug: storedSlug, ...response } = saved ?? {};
    console.log("[partners] PUT success", {
      slug,
      updatedFields: Object.keys(response || {}),
    });
    return res.json({ data: response });
  } catch (error) {
    return next(error);
  }
});

export default router;

