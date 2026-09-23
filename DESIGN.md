# DESIGN.md: ZippyScale realtor page

Single-file build: `index.html` with inline CSS and JS, self-hosted fonts in `fonts/`, logos and icons in `assets/`, photos in `assets/img/` (credits in `assets/img/CREDITS.md`). No build step, no framework. GitHub Pages serves `main`. Rewritten 17 Sep 2026 to describe the v4 page; every value below is a CSS custom property in `index.html` `:root`.

## Color

| Token | Hex | Use |
|---|---|---|
| `--cream` | #FFFDF7 | Page ground, most sections |
| `--paper` | #FFFFFF | Cards on cream; results and pay sections |
| `--sand` / `--sand-2` | #F5F2E8 / #EFEBDD | City section band, inner tiles, mock grounds |
| `--line` / `--line-2` | #E7E3D6 / #D6D1C1 | `--line` for every card border; `--line-2` for controls and tags |
| `--line-strong` | #8A8577 | Input borders, strike-through, dashed pay segment |
| `--charcoal` | #2A2A35 | Dark sections (how, final), buttons in mocks |
| `--card-dark` / `--border-dark` | #33333F / #44444F | Cards and hairlines on charcoal |
| `--lime` | #D5EB4B | Accent |
| `--lime-text` | #6B7C10 | Accent text on light grounds (4.57:1) |
| `--head` / `--body` / `--muted` | #1A1A2E / #4A5568 / #5B6270 | Text on light |
| `--body-dark` | #C9CBD6 | Text on charcoal |

Strategy: restrained, light-dominant. Section grounds run cream (hero), sand (work strip), cream (problem), charcoal (story), cream (we do / you do, with a charcoal CTA card), white (results, pay), sand (city), cream (FAQ), charcoal (final). Buttons are charcoal on light grounds and lime on dark ones. Lime is also spent on the ICP highlight, booked-call states, the "You do" card tint, the pay stage 2 dot, the beam, the report sweep and quiz selection. Never gradient text.

## Type

Space Grotesk (headings, card titles, stats), Inter with a metric-matched Arial fallback (body, UI), JetBrains Mono 700 uppercase (labels, tags, dates only).

| Role | Token | Size at 1440 (phone) | Weight |
|---|---|---|---|
| H1 | `--fs-h1` | 64 (40) | 700 |
| H2 | `--fs-h2` | 48 (32) | 700 |
| ICP callout | `--fs-icp` | 28 (20) | 600 |
| Proof stat, hero and results | `--fs-stat` | 28 (24) | 700 |
| Card, step, day and plan titles | `--fs-card` | 22 (18) | 600 |
| Lede, section subs, FAQ questions (Inter) | `--fs-body-lg` | 20 (18) | 400 / 600 |
| Body | `--fs-body` | 17 (16) | 400 |
| Small: captions, chips, mock text | `--fs-small` | 14 | 400 to 600 |
| Label (mono) | `--fs-label` | 12 | 700 |

No text renders under 12px. Mock artefacts reuse these sizes; they never introduce their own.

## Space and layout

- 4/8 spacing scale: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 104. Every padding, margin and gap uses a token.
- One container: 1200px max, 24px gutters (20px on phones). 12-column grid, 24px column gap.
- Section padding 104 (80 under 1024, 64 on phones). `.tight` (64 / 48 / 40 top) where a section continues the previous idea: different after problem, pay after results.
- H2 measure 28ch. Problem, how and pay heads are centred; the rest are left-aligned splits.
- Surfaces: `--r-card` 20 for outer cards, `--r-inner` 12 for anything inside a card, `--r-pill` 999 for pills and buttons, `--r-book` for book covers. Two shadows: `--sh-card` for cards, `--sh-float` for artefacts that sit on a ground (hero, guide spread, Booked pill).

## Imagery

- Three Unsplash photos (condo, craftsman house, Burnaby skyline), cropped, lightly desaturated, WebP at 1x/2x, each under 45KB. Used only inside mocks tagged Example. No people's faces.
- Line icons: Lucide-style stroke icons at 1.75 stroke in one sprite. No emoji, no clip-art illustrations.
- Real logo files only (`assets/logo-light@3x.png`, favicon tile from `assets/icon-256.png`).

## Motion

Six page-level elements (round 5, declared exception to the skill's cap of 4). The CSS default is the final state; no-JS and `prefers-reduced-motion` show everything. The H1 and every CTA button never animate.

1. Hero assembly: ad rises, a line draws along its curve to the guide, the guide rises, a line draws to the booked call, the event wipes, the tick draws (2.24s, once, only if the stage is on screen at first paint).
2. Work strip marquee (80s loop, 60s on phones) with a visible Pause switch; pauses on hover, focus and off-screen. Copies are aria-hidden and inert. Reduced motion: a swipe row.
3. Story (1024px and up): the step crossing the viewport centre swaps the visual in a sticky stage (IntersectionObserver, no scroll listener). Below 1024 each step shows its visual inline. No ancestor of the stage may get `overflow` other than visible.
4. Pay line: fills with the scrollbar through the three stages (CSS scroll-driven, rAF fallback).
5. CTA card border beam: one lime lap when a card is half in view, once per viewing (4.5s).
6. Report preview: one lime highlight sweep over the three rows (1.1s); values are always visible.

Feedback outside the budget: button press, FAQ open and close, quiz screen slides, sticky phone bar slide. Easing `cubic-bezier(0.16,1,0.3,1)`; movement `cubic-bezier(0.77,0,0.175,1)`.

## Bans

No side-stripe borders, gradient text, glassmorphism, hero-metric templates, identical icon card grids, modals (the quiz is a full-screen step flow), fake dashboards or AI-generated imagery.

## Gates

`site-rebuild/qa/overlap.py` (nothing covers text inside visuals), `site-rebuild/qa/minfont.py` (no text under 12px), `site-rebuild/audit/design/recheck.py` (type sizes, radii, shadows and spacing stay on these tokens), `landing-page-build/scripts/probe.py` (710 visible words, round 5).
