# DESIGN.md — ZippyScale

Single-file build: `index.html`, inline CSS and JS, self-hosted fonts in `fonts/`, PNG logos in `assets/` (`logo-light.png` on cream, `logo-dark.png` on charcoal), generated imagery in `assets/img/`. No build step, no framework, GitHub Pages serving `main` at repo root. A push to `main` is the deploy.

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
| Lime text | #6B7C10 | oklch(52.4% 0.121 116) | Accent text on cream (4.57:1). #B8CF2E fails at 1.72:1, never use it for text |
| Head | #1A1A2E | oklch(22.6% 0.028 285) | Headings on light |
| Body | #4A5568 | oklch(45.9% 0.036 264) | Body on light |
| Body dark | #C9CBD6 | oklch(83.6% 0.011 285) | Body on charcoal |

Strategy: **committed, light-dominant since 10 Sep 2026.** Charcoal is punctuation, not half the page: at most two dark moments on a page, used where a claim is made rather than explained. Lime is the single accent and appears only on the CTA, on active motion states, and on the accent word in a heading. Never two accent colours. No gradients on text, ever.

**Override, 10 Sep 2026, Sandy's ruling.** The market this page sells into converts on faces, brokerage logos, video and a repeated identical CTA. The nearest comparable page, a former client's, runs 143 images, 2 videos and the same button eight times. The editorial charcoal treatment reads as a design agency to a working agent. So: the palette and the three typefaces stay locked, the surface ratio does not. Light ground carries the page, real faces of real people we have worked with carry the proof, and the CTA repeats.

Theme reasoning: an agent reads this on a phone, outdoors, between showings. So the reading surface is light cream, and charcoal is used as punctuation, for the sections that make a claim rather than explain one.

## Type

- Space Grotesk 700 for headings, clamp scale, tracking -0.02em.
- Inter 400/500/700 for body at 17px base, 1.65 line height, 68ch max measure.
- JetBrains Mono 700 for eyebrows, day markers, counters, chip labels, all uppercase with 0.12em to 0.16em tracking. Mono is the signal that a number is real.
- Scale ratio at least 1.25 between steps.

## Space and layout

- One container: max-width 1120px, 24px gutters.
- Section padding 96px, tightened to 64px via `.tight` when two sections are a continuous idea.
- Rhythm is intentionally uneven: full-bleed diagram sections sit against tight editorial blocks.
- No uniform three-across card grids. When items are peers, they are laid out as a diagram, a numbered ladder or an asymmetric split, never as identical boxes.

## Bans carried from the skill

No side-stripe borders. No gradient text. No decorative glass. No hero-metric template. No identical card grids. No modals.

## Motion

- Curve: ease-out-expo `cubic-bezier(0.16, 1, 0.3, 1)` for entrances, 500 to 900ms. Never bounce.
- Never animate layout properties. Transform and opacity only, plus `stroke-dashoffset` for diagram draw-on.
- Motion must mean something: an enquiry arriving, a clock running to the answer, an appointment landing on a week, time advancing across the 45 days.
- Scroll-linked movement uses a single rAF loop reading one `getBoundingClientRect` batch, not one observer per element.
- `prefers-reduced-motion` collapses every animation to its final state, including diagram draws and counters.

## Imagery

- Photographic images are generated on-brand (GPT Image 2 via the higgsfield-generate skill) and used only where a real scene helps: a phone lighting up on a kitchen counter, an open-house sign-in sheet, a listing appointment at a dining table. Every image is desaturated toward the charcoal and cream palette so it never fights the lime.
- Diagrams are hand-authored SVG, stroke 1.5, lime for the active path, muted for the inert path.
- No stock-photo handshakes, no drone hero video, no fake dashboard screenshots showing invented numbers.

## Amendment, 10 September 2026 — typeface and ground replaced

Sandy's instruction: "kill zippy scale typography though will redo it", benchmarked against
a realtor coaching company. The realtor page no longer uses the house type or the cream ground.

| Was | Now |
|---|---|
| Space Grotesk 700 / Inter / JetBrains Mono | **Figtree 400 / 600 / 800**, self-hosted, one family for everything |
| Cream #FFFDF7 ground, charcoal punctuation | **White #FFFFFF ground**, ink **#0B1220**, surface **#F6F8FB** |
| Accent text #6B7C10 on cream | Accent text **#5C6A0C** (5.96:1 on white, 5.6:1 on surface) |
| Wordmark PNG in the nav | **Favicon tile only.** `assets/icon-256.png` at 24px inside a 42px ink tile, radius 11px |

Lime #D5EB4B is unchanged and still the only accent. It is spent in exactly three places:
buttons, the headline highlight behind "back second.", and the step numbers in the dark block.

Contrast corrections made at the same time: `--muted` #8A93A3 (2.91:1 on surface, failed) is now
**#68707E** (4.69:1). The "LIVE" label and the booked tick use **#067647**, not #12B76A (2.47:1).
The #12B76A green survives only as the pulsing dot, which carries no information.

Type ramp is px tokens, not rem, because the previous build had a 17px body against a 16px root
and produced 37 distinct rendered sizes. `--t-xs:13 · --t-sm:14 · --t-base:17 · --t-md:19 ·
--t-lg:23 · --t-xl:30`, headings on clamp().

Motion budget, five items, each one justified:
1. Hero message thread, plays once on load. It **is** the service, demonstrated.
2. Headline highlight swipe, 850ms, once.
3. Live dot pulse on the ICP callout.
4. Scroll reveals, fade plus 14px, 600ms, unobserved after firing, with a 4s reveal-everything backstop.
5. The lime rule that draws across the three steps in the dark block.
Everything collapses to its final state under `prefers-reduced-motion`.
