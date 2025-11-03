## Impact Report data fields

This document explains the purpose of each field used by the server-side configuration for the Impact Report. Files live in this folder alongside the documentation.

### Conventions
- **Colors**: Use raw color values (e.g., "#121212"). Gradients are composed in the UI from arrays like `backgroundColors`.
- **Media**: Optional image/video URLs. When present, the client chooses the best presentation (e.g., video with poster).
- **CTAs**: Common object shape `{ label, href, target, rel, trackingId }` for links and analytics.
- **Accessibility**: Provide `ariaLabel` and `...Alt` text where applicable.
- **Visibility/layout**: Use `visible`, `textAlign`, and `layoutVariant` to control rendering and style.

---

### hero.json
- **backgroundColor**: Base background color or starting color for the hero.
- **backgroundImage**: Optional background image URL.
- **title**: Primary hero title text.
- **subtitle**: Secondary title line.
- **year**: Cycle label shown in hero (e.g., "2024-2025").
- **tagline**: Short tagline beneath the title.
- **bubbles**: Single source of truth list of location/label strings shown as bubbles across all viewports.
- **primaryCta**:
  - `label`: Button text.
  - `href`: Destination URL.
  - `target`: Optional link target (e.g., `_blank`).
  - `rel`: Optional rel attribute for security/SEO.
  - `trackingId`: Optional analytics identifier.
- **secondaryCta**: Same shape as `primaryCta`.
- **backgroundVideo**:
  - `url`: Optional video source.
  - `poster`: Optional poster image.
  - `autoplay`: Whether the video should autoplay.
  - `loop`: Whether the video should loop.
  - `muted`: Whether the video should be muted by default.
- **overlay**:
  - `color`: Optional overlay color applied over the background.
  - `opacity`: Overlay opacity from 0 to 1.
- **textAlign**: Horizontal alignment of content (e.g., `center`, `left`).
- **layoutVariant**: Named layout variant for the hero (e.g., `default`).
- **backgroundImageAlt**: Alt text for `backgroundImage` when present.
- **ariaLabel**: Accessible label for the hero region.

---

### mission.json
- **type**: Section component type identifier (e.g., `MissionSection`).
- **visible**: Controls whether this section is rendered.
- **backgroundColors**: Array of color stops used to build a gradient background in the UI.
- **backgroundImage**: Optional background image URL.
- **overlay**:
  - `color`: Optional overlay color applied above background.
  - `opacity`: Overlay opacity from 0 to 1.
- **textAlign**: Horizontal alignment for section content.
- **layoutVariant**: Named layout variant (e.g., `ticket`).
- **title**: Section heading text.
- **badge**:
  - `label`: Small badge text near the title.
  - `icon`: Optional badge icon identifier.
  - `variant`: Visual style of the badge (e.g., `pill`).
- **statement**:
  - `title`: Title text displayed on the ticket block.
  - `text`: Mission statement body text.
  - `serial`: Optional serial string for aesthetic display.
  - `meta`: Meta line beneath the statement (e.g., year, theme).
- **belts**:
  - `topImages`: Array of image URLs for a top belt (optional).
  - `bottomImages`: Array of image URLs for a bottom belt (optional).
- **statsTitle**: Heading shown above the stats grid.
- **stats**: Array of stat objects displayed in the grid. Each item:
  - `id`: Stable identifier for the stat.
  - `number`: Numeric value to display.
  - `label`: Short label under the number.
  - `color`: Accent color for the stat.
  - `href`: Optional URL; when present, clicking the stat navigates to this link.
  - `cta`: Optional action object (e.g., `{ action: "openModal", modalId: "disciplines" }`).
- **modals**: Array of modal configurations for interactions. Each modal:
  - `id`: Modal identifier.
  - `title`: Modal title.
  - `visible`: Initial visibility flag.
  - `items`: Array of discipline entries, each `{ name, icon }`.
- **cta**: Optional section-level call-to-action object (see CTA shape above).
- **ariaLabel**: Accessible label for this section.


---

### population.json
- **type**: Section component type identifier (e.g., `PopulationSection`).
- **visible**: Controls whether this section is rendered.
- **backgroundColors**: Array of color stops used to build a gradient background in the UI.
- **backgroundImage**: Optional background image URL.
- **overlay**:
  - `color`: Optional overlay color applied above background.
  - `opacity`: Overlay opacity from 0 to 1.
- **textAlign**: Horizontal alignment for section content.
- **layoutVariant**: Named layout variant (e.g., `cards`).
- **header**:
  - `badge`: Small badge text (e.g., "Who We Serve").
  - `name`: Section name (e.g., "Our Population").
  - `title`: Large heading line below the header.
- **intro**: Array of paragraph strings that introduce the section.
- **graphs**:
  - `demographicsPie`:
    - `slices`: Array of pie slices, each `{ id, label, value, color }`.
    - `caption`: Text displayed below the chart.
  - `outcomes`: Array of simple outcome cards, each `{ value, label }`.
- **skillsIntro**: Lead-in sentence for the skill chips.
- **skills**: Array of strings to render as skills/benefits chips.
- **cgas**: Array of additional percent cards, each `{ value, label }`.
- **gallery**:
  - `visible`: Whether to render the image gallery.
  - `images`: Array of image URLs (client may choose responsive variants).
- **ariaLabel**: Accessible label for this section.

---

### financial.json
- **type**: Section component type identifier (e.g., `FinancialSection`).
- **visible**: Controls whether this section is rendered.
- **backgroundColors**: Array of color stops used to build a gradient background in the UI.
- **backgroundImage**: Optional background image URL.
- **overlay**:
  - `color`: Optional overlay color applied above background.
  - `opacity`: Overlay opacity from 0 to 1.
- **textAlign**: Horizontal alignment for section content.
- **layoutVariant**: Named layout variant (e.g., `dashboard`).
- **header**:
  - `title`: Section heading (e.g., "Financial Overview").
  - `subtitle`: Supporting copy beneath the title.
- **timeseries**:
  - `years`: Array of x-axis labels.
  - `revenue`: Array of revenue values aligned with `years`.
  - `expenses`: Array of expense values aligned with `years`.
  - `maxY`: Maximum y-axis ceiling used for scaling.
- **kpis**: Optional array of KPI cards (if `null`, client can compute from `timeseries`).
- **pies**:
  - `comesFrom`: Array for revenue sources pie, items `{ id, label, value, color }`.
  - `goesTo`: Array for expense allocations pie, items `{ id, label, value, color }`.
- **programServices**:
  - `includes`: Array of strings describing what Program Services include.
- **ariaLabel**: Accessible label for this section.

---

### method.json
- **type**: Section component type identifier (e.g., `MethodSection`).
- **visible**: Controls whether this section is rendered.
- **backgroundColors**: Array of color stops used to build a gradient background in the UI.
- **backgroundImage**: Optional background image URL.
- **overlay**:
  - `color`: Optional overlay color applied above background.
  - `opacity`: Overlay opacity from 0 to 1.
- **textAlign**: Horizontal alignment for section content.
- **layoutVariant**: Named layout variant (e.g., `grid-cards`).
- **header**:
  - `title`: Section heading (e.g., "Our Method").
  - `subtitle`: Supporting copy beneath the title.
- **items**: Array of method cards, each `{ icon, text }`.
  - `icon`: Icon identifier (client maps identifier to actual SVG/icon component).
  - `text`: Card label.
- **narrative**: Paragraph text explaining the approach.
- **ariaLabel**: Accessible label for this section.

---

### curriculum.json
- **type**: Section component type identifier (e.g., `CurriculumSection`).
- **visible**: Controls whether this section is rendered.
- **backgroundColors**: Array of color stops used to build a gradient background in the UI.
- **backgroundImage**: Optional background image URL.
- **overlay**:
  - `color`: Optional overlay color applied above background.
  - `opacity`: Overlay opacity from 0 to 1.
- **textAlign**: Horizontal alignment for section content.
- **layoutVariant**: Named layout variant (e.g., `cards-and-timeline`).
- **header**:
  - `title`: Section heading.
  - `subtitle`: Supporting copy beneath the title.
- **cards**: Array of curriculum cards, each `{ title, text, badges[] }`.
- **timeline**: Array of strings describing the session flow.
- **ariaLabel**: Accessible label for this section.


