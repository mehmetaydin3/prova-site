# Prova web tokens: app → web mapping

The marketing site extends the app's approved design system. This document maps every app token
to its web form, names the source, and lists each web-only adaptation with its reason. It is the
baseline for the three prototype directions and for the Codex review. The CSS form of this table is
[`shared/tokens.css`](shared/tokens.css); change a value here first, then there.

**Sources (app repo `prova`, main `2f42439` unless noted)**

| Source | What it holds |
|---|---|
| `Prova/Prova/DesignSystem/ProvaDesignSystem.swift` | `Brand` (raw palette, lines 78–183), `Colors` (semantic, 206–394), `Typography`, `Spacing`, `Radius` (577), `Motion` (≈640–730) |
| `Prova/Prova/DesignSystem/ProvaComponents.swift`, `ProvaRow.swift`, `ProvaLayout.swift` | Components, rows, width classes |
| `docs/DESIGN-SYSTEM.md` | Token reference and the rules around them |
| `docs/design-philosophy.md` (approved 2026-10-01) | The seven principles, voice guide, success tests |
| branch `design/launch-handoff` (draft PR #54) | `Motion.Spring.downbeat`, `LaunchCurtain.swift`, the BrandMark asset |
| `~/.claude/projects/-Users-mehmetaydin-prova/memory/prova-launch-ops.md` | The 2026-10-05 site spec for the legal pages (light `#F7F6FB`/`#1A1726`, dark `#131019`/`#F4F2FA`, 17px/1.55, 68ch) |

The brand system now in production by the Design lead (brand-forward direction, gradient headers)
is a **proposal** until the founder approves it. Nothing below depends on it; when it lands, the
raw `--brand-*` values and `--font-display` are the expected points of change.

---

## 1 · Color

The app's rule carries over whole: **build from semantic tokens, never the raw palette**, and color
has four jobs: **act** (`primary`), **state** (success/warning/error/info), **warmth** (`accent`:
a person or a win) and **brand** (the signature gradient). About 90% of any page is neutral.

| App token (`Colors.*`) | Light | Dark | CSS | Web use |
|---|---|---|---|---|
| `canvas` | `#F7F6FB` | `#131019` | `--canvas` | page ground |
| `surface` / `surfaceElevated` | `#FFFFFF` | `#1E1A2B` / `#272235` | `--surface`, `--surface-elevated` | cards, nav, phone screens |
| `textPrimary` | `#1A1726` | `#F4F2FA` | `--text` | body and headings (17.6:1 / 17.0:1) |
| `textSecondary` | `#6B6780` | `#9A95AD` | `--text-secondary` | ledes, meta, captions (4.5:1+) |
| `primary` | `#473CDD` | `#9992FC` | `--primary` | links, outlines, tints. "If it's violet, it's tappable." Never headings |
| `primaryFill` / `primaryPressed` | `#473CDD` / `#3A30C2` | `#675FE3` / `#574FD0` | `--primary-fill`, `--primary-pressed` | the one filled button per section, white on it |
| `onPrimary`, `onDark`, `onFeedback` | `#FFFFFF` | same | `--on-primary`, `--on-dark` | text on fills and on the night |
| `accent` / `accentText` / `accentFill` | `#FD7267` / `#C63D30` / `#C63D30` | `#FD7267` / `#FD7267` / `#C63D30` | `--accent*` | a teacher's pinned note, a new-note badge, a win. Never buttons |
| `success`, `successText`, `successLightFill` | `#1B9D8F`, `#157A70`, `#1FB6A6` | `#1FB6A6` | `--success*` | done marks, the "shared" pill |
| `warning`, `warningText` | `#C47D09`, `#9C6307` | `#F5A623` | `--warning*` | "schematic" captions, attention |
| `error` / `info` / `record` | `#C9282E` / `#3E63DD` / `#E5484D` | `#EE7276` / `#7C95EA` / `#E5484D` | `--error`, `--info`, `--record` | the record light is fixed in both appearances |
| `border` / `separator` / `fieldBorder` | `#E6E3F0` / `#E6E3F0` / `#8F8CA1` | `#342E47` / `#342E47` / `#726C89` | `--border`, `--separator`, `--field-border` | hairlines; a field's edge is 3:1 |
| `Opacity.wash` 0.14 | primary at 14% | same | `--primary-wash` | chips, pills, avatars (ink on a wash) |
| `Brand.iconNight` | `#060511` | same | `--night` | the icon's tile and the launch ground only |

**Gradients.** Tonal = material, multi-hue = a moment.

| App | CSS | Where the web may use it |
|---|---|---|
| `brandGradient` (tonal violet) | `--brand-gradient` | chart bars, the bars in "Since last lesson" |
| `celebrationGradient` coral → orange | `--celebration-gradient` | a win: the level-up card, nowhere else |
| `signatureGradient` blue → violet → warm | `--signature-gradient` | the brand band under the beta CTA, the mark. **Never under text** (white on its warm end is under 2:1) |
| `stageGradient` ink → indigo | `--stage-gradient` | a Performance-run moment, dark in both themes |
| `funGradient` (the hero card on Today) | not mapped | the app is moving it off everyday screens (design-audit decision 1); the site doesn't adopt it |

**Contrast.** Every text pairing in `tokens.css` is a pairing the app already pins at 4.5:1 in
`DesignTokenContrastTests`. New web pairings: `--text-secondary` on `--surface-elevated` (dark)
5.1:1; `--primary` on `--night` 6.9:1; `--on-dark` on `--night` 19:1. Increase Contrast has no
web equivalent (`prefers-contrast: more` is not implemented for colors here), so the baseline
values are the ones used.

## 2 · Typography

The app sets everything in the rounded system face (`design: .rounded`; Circular Std is licensed
but `useBrandFont` is off), semibold is the heaviest weight, and hierarchy comes from size, color
and space first.

| App (`Typography.*`) | Size / weight | CSS | Web note |
|---|---|---|---|
| `body` / `prose` | 17 regular / loose | `--text-body` 17px, `--leading-body` 1.55, `--leading-prose` 1.65 | the same as the legal site spec |
| `callout`, `subhead`, `footnote`, `caption` | 16 / 15 / 13 / 12 medium | `--text-callout` … `--text-caption` | captions get `--weight-medium` |
| `headline` | 17 semibold | `--text-headline` | row titles, button labels |
| `title3`, `title2`, `title`, `largeTitle` | 20 / 22 / 28 / 34 semibold | `--text-title3` … `--text-large-title` | section sub-heads |
| `display`, `displayXL` | 44 / 64 semibold, fixed, × `displayScale` 1.0–1.3 | `--text-display`, `--text-display-xl` as `clamp()` | the hero headline. Fluid between the app's compact and expanded values |
| `numeric`, `numericXL` | tabular, semibold / 80 medium | `.tnum`, `--font-mono` | timecodes and minutes tick in tabular digits; the bigger the numeral, the lighter |
| `statusLabel`, `metadata` | mono, caps | `.status`, `.eyebrow` | the LED pill label is the only all-caps text |

**Font stack.** `--font-body: ui-rounded, "SF Pro Rounded", -apple-system, …`. `ui-rounded` is a
CSS generic family that resolves to SF Pro Rounded on macOS and iOS, so Apple users see the app's
own face; everyone else gets their system sans. No web font is loaded for body text, which keeps
the first paint fast.

**Weights.** Regular 400, medium 500, semibold 600. **Bold (700) is retired**, as in the app.

## 3 · Spacing and layout

| App | Value | CSS |
|---|---|---|
| `Spacing.xxs … xxxl` | 2 4 8 12 16 24 32 40 | `--sp-xxs … --sp-xxxl`, used by meaning (inside a group one step smaller than around it) |
| `LayoutTokens.pageMargin` | 16 / 24 / 32 at compact / medium / expanded | `--page-margin`, switched at the app's own breakpoints 600 and 900 |
| `readableMax` | 640 / 720 | `--readable-max: 68ch` (the legal site's column) |
| `formMax` | 480 | `--form-max`: buttons and fields stop here, as `PrimaryButtonStyle` does on iPad |
| `Sizing.minHitTarget`, `buttonHeight` | 44, 52 | `--hit-min`, `--button-height` |

## 4 · Radius, lines, elevation

| App | Value | CSS |
|---|---|---|
| `Radius.xs sm md lg xl pill` | 4 10 14 20 28 999, `.continuous` | `--r-xs … --r-pill`. Cards and buttons `lg`, sheets and heroes `xl`, fields `md`, chips `pill`. Nested shapes stay concentric |
| `BorderWidth.hairline / thick` | 1 / 2 | `--border-hairline`, `--border-thick` |
| `.elevation(.card / .raised / .glow)` | | `--shadow-card`, `--shadow-raised`, `--glow-primary` |

## 5 · Components

| App (`ProvaComponents.swift`) | CSS class | Kept exactly |
|---|---|---|
| `PrimaryButtonStyle` | `.btn.primary` | 52 high, `primaryFill`, white label, radius `lg`, caps at `formMax`, one per section |
| `SecondaryButtonStyle` | `.btn.secondary` | label in `primary`, hairline outline, same metrics |
| `.provaCard()` | `.card` | surface, hairline border, radius `lg`, card elevation |
| `Chip` | `.chip` | ink on a 14% wash, one line, never compresses |
| `StatusPill` | `.status` (+ `.success`, `.record`) | LED dot + mono uppercase label on a wash; glyph-coded |
| `Avatar` | `.avatar` | ink initials on a violet wash |
| `ProvaTextField` | `.field` | `fieldBorder` edge, 44 minimum height |
| `SectionHeader` | `.eyebrow` + `h2` | eyebrow in mono caps, title semibold |
| `StatTile` | `.since .row` | big ink number, label beside it, tint belongs to the glyph alone |
| `CelebrationOverlay` | Direction C's level-up card | scrim → hero → title → chip → message, `pop` spring, warm bloom |

## 6 · Motion

| App (`Motion.*`) | Curve | CSS / JS | Web use |
|---|---|---|---|
| `quick` | easeOut 0.15 | `--m-quick` / `--e-quick` | press and hover |
| `standard` | easeInOut 0.25 | `--m-standard` / `--e-standard` | a screen swapping in the pinned phone |
| `gentle`, `entrance` | spring 0.4/0.8, 0.5/0.75 | `--m-gentle`, `--m-entrance` with settled beziers | a card's 10px settle as it enters |
| `pop` | spring 0.52/0.55, overshoots | `--m-pop` / `--e-pop` (bezier with overshoot) | a pinned note landing, the level-up card |
| `reduced` | easeInOut 0.2 | `--m-reduced` | every token collapses to this under Reduce Motion |
| `downbeat` (launch-handoff) | spring m 1, k 420, c 35, ζ 0.85, contact ≈ 244 ms, settles ≈ 414 ms | solved exactly in JS (`springAt(t)` in Direction A) | the mark drops into the nav once per session |

Rules carried over: motion **explains a change** and is over in 250 ms on everyday surfaces;
**nothing loops** except a live recording's waveform; celebrations are rich and single;
**Reduce Motion** turns springs into a 200 ms cross-fade, stops every loop, and keeps the meaning.
On the web `prefers-reduced-motion: reduce` does all three in `tokens.css`, and every scroll-linked
effect has a static resting state (the waveform's playhead rests at 0:18).

## 7 · Web adaptations, and why

| Adaptation | Reason |
|---|---|
| **Scroll-linked playhead and screen swaps** (not in the app) | The reader's scroll is the only "tap" a web page has. Motion driven by the reader is motion that explains a change they asked for. It never autoplays and has a resting state |
| **The Downbeat on the page** (the mark drops into the nav) | The one motion that moves the brand, reused at its one job: arrival. Once per session, replayable from the mark, a cross-fade under Reduce Motion |
| **Hover states and focus rings** | Pointer devices need them; the app's `pointer lift` becomes `:hover`, and `:focus-visible` gets the 2px `primary` ring the app's `IconButton` pointer highlight implies |
| **Fluid display sizes** (`clamp()`) | The app scales hero text with `displayScale` 1.0–1.3 by width class; `clamp()` is the same idea without steps |
| **A 1120px container** for two-column product sections | The app's `readableMax` caps prose; a phone beside its copy needs about 1.5× that. Prose columns inside still obey 68ch |
| **`--sp-section`** 64–140px between sections | The app's largest step is 40 (one focus). A page with eight beats needs a bigger step between beats; inside a beat the 4pt scale holds |
| **Shadows as CSS** | `.elevation()` has no web form; two shadows and a glow approximate `card`, `raised`, `glow` |
| **A display face per direction** | Each direction tests one web display face for headings (A: Geist, B: Fraunces, C: Bricolage Grotesque). Body and UI text stay on the app's rounded stack. The founder picks one, or none, when choosing a direction; if the brand system brings Circular Std to the web, it replaces all three |
| **Direction A's night ground** | The app keeps the night (`#060511`) for the launch and the icon's tile. Direction A proposes the whole page as a brand moment on that ground, with the app's dark canvas and surfaces on top. This is a deliberate question for the founder: does the site get to be the moment the app is calm for? |
| **Not adopted:** `funGradient`, Increase Contrast values, Dynamic Type | The app is retiring the first; the second has no web hook; the third is the browser's zoom, which the layouts tolerate to 200% |

## 8 · Concept material vs the shipped app

The prototypes use the real Today and sign-in screens from the current build (`today-max-*.jpg`,
`signin-*.jpg`, captured by the launch studies at 440×956pt). The BrandMark crop and the Downbeat
films come from branch `design/launch-handoff` / the launch studies, which are **not merged**:
they are concept material and every prototype labels them so. The four loop screens in the pinned
phone are **schematic** (HTML built from these tokens), marked in a caption, to be replaced by
screen recordings from the asset list in the review page.
