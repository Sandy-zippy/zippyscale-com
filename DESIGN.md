# DESIGN.md — ZippyScale West

Single-file build: `index.html`, inline CSS and JS, self-hosted fonts in `fonts/`, SVG logos in `assets/`, generated imagery in `assets/`. No build step, no framework, GitHub Pages.

## Color

Brand-locked hex values are canonical (they exist across decks, invoices and the India site), OKLCH equivalents noted for judging lightness and chroma moves.

| Role | Hex | OKLCH | Use |
|---|---|---|---|
| Cream | #FFFDF7 | oklch(99.3% 0.011 95) | Light sections |
| White | #FFFFFF | oklch(100% 0 0) | Raised surfaces on cream |
| Charcoal | #2A2A35 | oklch(28.5% 0.017 285) | Dark sections, footer, page background |
| Card dark | #33333F | oklch(33.5% 0.018 285) | Cards on charcoal |
| Border dark | #3E3E48 | oklch(38.8% 0.015 285) | Hairlines on charcoal |
| Lime | #D5EB4B | oklch(89.5% 0.166 111) | CTA fill, accents on dark, motion trails |
| Lime dark | #B8CF2E | oklch(80.6% 0.169 113) | Accent text on cream |
| Head | #1A1A2E | oklch(22.6% 0.028 285) | Headings on light |
| Body | #4A5568 | oklch(45.9% 0.036 264) | Body on light |
| Body dark | #C9CBD6 | oklch(83.6% 0.011 285) | Body on charcoal |

Strategy: **committed**. Charcoal carries roughly half the page surface; lime is the single accent and appears only on the CTA, on active motion states, and on the accent word in a heading. Never two accent colours. No gradients on text, ever.

Theme reasoning: a developer reads this on a laptop in a site office in daylight, skimming between meetings. So the reading surface is light cream, and charcoal is used as punctuation, for the sections that make a claim rather than explain one.

## Type

- Space Grotesk 700 for headings, clamp scale, tracking -0.02em.
- Inter 400/500/700 for body at 17px base, 1.65 line height, 68ch max measure.
- JetBrains Mono 700 for eyebrows, day markers, counters, chip labels, all uppercase with 0.12em to 0.16em tracking. Mono is the signal that a number is real.
- Scale ratio at least 1.25 between steps.

## Space and layout

- One container: max-width 1120px, 24px gutters.
- Section padding 84px, tightened to 64px when two sections are a continuous idea.
- Rhythm is intentionally uneven: full-bleed diagram sections sit against tight editorial blocks.
- No uniform three-across card grids. When items are peers, they are laid out as a diagram, a numbered ladder or an asymmetric split, never as identical boxes.

## Bans carried from the skill

No side-stripe borders. No gradient text. No decorative glass. No hero-metric template. No identical card grids. No modals.

## Motion

- Curve: ease-out-expo `cubic-bezier(0.16, 1, 0.3, 1)` for entrances, 500 to 900ms. Never bounce.
- Never animate layout properties. Transform and opacity only, plus `stroke-dashoffset` for diagram draw-on.
- Motion must mean something: flow along the pipeline, sorting into qualified and nurture, a counter reaching a real figure, time advancing across the 30 days.
- Scroll-linked movement uses a single rAF loop reading one `getBoundingClientRect` batch, not one observer per element.
- `prefers-reduced-motion` collapses every animation to its final state, including diagram draws and counters.

## Imagery

- Photographic images are generated on-brand (GPT Image 2 via the higgsfield-generate skill) and used only where a real scene helps: a sales gallery, a site visit, a project under construction. Every image is desaturated toward the charcoal and cream palette so it never fights the lime.
- Diagrams are hand-authored SVG, stroke 1.5, lime for the active path, muted for the inert path.
- No stock-photo handshakes, no drone hero video, no fake dashboard screenshots showing invented numbers.
