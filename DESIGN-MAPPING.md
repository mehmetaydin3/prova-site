# Prova: app → website

This implements selected Direction A with designed light and dark appearances. It refines the existing direction rather than replacing it. `prototypes/` remains byte-for-byte unchanged from `bc79c17`, including B and C. The website is a marketing presentation of the same identity, not a new app theme.

## Authority and scope

Read-only sources inspected in `~/prova`: `CLAUDE.md`, `docs/design-philosophy.md`, `docs/DESIGN-SYSTEM.md`, the focused design decisions and launch materials they reference, `Prova/Prova/DesignSystem/ProvaDesignSystem.swift`, and the relevant styles in `ProvaComponents.swift`. App main was `164a238` at inspection. Founder-approved design intent takes precedence over unfinished screen implementations.

The original multicolor p geometry predates the motion experiment and is the approved app identity (introduced at `93a23a7`). The brand-stage/Downbeat specification in `ProvaBrand.swift` on `design/launch-handoff` (`55e5df5`) and its film are experimental branch material, not a claim that the launch animation is shipped. The website keeps the previously selected stage and motion direction from `prototypes/TOKENS.md`; it does not infer new product functionality from that branch. No App Store release was independently confirmed.

## Token mapping

`shared/tokens.css` is the existing map, copied unchanged from `prototypes/shared/tokens.css`. Page layout adaptations live separately in `site.css`.

| App role | Web token / use | Adaptation |
|---|---|---|
| Brand night `#060511` | `--night`, main stage | Dark website ground; light appearance uses the mapped canvas |
| Dark canvas `#131019` | `--canvas`, alternating practice/reply ground | Establishes narrative pacing without a new hue |
| Surface / raised `#1E1A2B` / `#272235` | `--surface`, `--surface-elevated` | Interactive samples and selected feedback |
| Text `#F4F2FA`, secondary `#9A95AD` | `--text`, `--text-secondary` | Same hierarchy; no low-opacity body copy |
| Violet action text `#9992FC` | `--primary` | Links, timestamps, selected progress |
| Filled action `#675FE3`, pressed `#574FD0` | `--primary-fill`, `--primary-pressed` | Beta action only; outlined sample controls |
| Coral `#FD7267` | `--accent` | Human connection, teacher notes, moment pins; not a destructive action |
| Teal completion | `--success` | Completed checklist progress |
| Rounded system type; regular/medium/semibold | `--font-body`, `--font-display`, `--weight-*` | No weight above 600; web display scale capped at 112px and section headings at 60px |
| Monospaced status labels | `--font-mono` | Movement numbers, timestamps and tabular timer numerals |
| Spacing 2/4/8/12/16/24/32/40 | `--sp-*` | Component internals retain the rhythm; editorial sections use fluid 72–112px intervals, 1248px maximum composition |
| Buttons/cards 20px; fields 14px; sheets/heroes 28px | `--r-lg`, `--r-md`, `--r-xl` | Screenshot devices use rounded phone frames, not new app components |
| Button 52px / hit minimum 44px | `--button-height`, `--hit-min` | Native checkbox inside a 48px clickable label; all links and sample controls have adequate targets |
| Logo tile 22.37% corner; crop 626×766 in 1024 tile | `.lockup .tile`, `.arrival-mark` | Crop width 61.13% of tile; original aspect preserved; resized raster derivative, no redrawn geometry |
| Brand aurora ≤24%; signature 2px | `--aurora`, `--signature-gradient` | Restrained hero/still stages; no wash behind instructions |

Normal tested pairings: body/night 18.24:1; secondary/raised 5.32:1; white/filled CTA 4.86:1; action text/raised 5.76:1; control edge/raised 3.09:1. Contrast preference raises the secondary and control edges. Coral signals are accompanied by text or state. Native captures retain their authentic historical appearance; they are evidence, not a token authority.

## Typography and rights

The default stack is the approved rounded system stack, with installed Segoe UI/system sans-serif fallback on other platforms. There are no font binaries, font CDN requests, or `@font-face` embeds. Circular Std is prospective in app documentation, with the brand-font switch off; a domain-specific web licence has not been established. It is deliberately not embedded. Lineto's [basic licensing guidance](https://lineto.com/information/help/licence-user-rights/basic-licencing) distinguishes web rights; its [EULA](https://lineto.com/api/front/documents/eula) is the governing reference. Apple's [font guidance](https://developer.apple.com/fonts/) does not authorize web embedding of downloaded Apple font files. Resolving an installed system font through CSS is the fallback used here.

## Choreography

The opening p settles into the existing navigation slot once per tab, using the Downbeat study's m=1, k=420, c=35 spring over approximately 414ms. The page is usable immediately. There is no curtain, pinned introduction, scroll hijacking, or autoplay media.

Five moments alternate authentic native evidence and a single benefit. Each heading settles 8px over the standard 250ms. Its product frame follows by the quick 150ms token and settles 16px over the gentle 400ms token. This one-time, small web-scale offset explains a handoff rather than moving the whole page. Initial opacity stays at least .94, with all essential content visible. IntersectionObserver disconnects each moment after entry; there is no per-scroll animation work, bouncing or parallax. Transforms do not change reserved layout geometry.

Reduced motion removes the entrance offsets and delay entirely, keeps full opacity and immediate scrolling, and changes selected-note emphasis to the 200ms opacity token. No state depends on animation. The manual native film remains opt-in, pauses offscreen/hidden and is explicitly an experimental silent motion study. The opening mark behavior is unchanged.

## Product and voice boundaries

Teacher-led, effort-focused copy uses piece, passage, take, teacher and studio. No guilt, invented success metrics, testimonials, AI features, parent account, under-13 access, pricing tiers or App Store link. Ordinary takes are private until shared; the FAQ explains the existing Performance-run exception. Free-beta, iPhone/iOS 16+, 13+ and class-code/teacher-approval claims are grounded in launch materials and the original handoff. Timestamped comment seeking is implemented in `Features/Shared/RecordingPost.swift`; the browser sample is illustrative, not a native recording or live account.

The timestamp controls are explicitly labelled a browser example with no audio. Their selected note also appears as the next practice focus; this demonstrates continuity, not native automation. The actual conversation remains the dominant feedback evidence. Checklist/timer/metronome/sharing tools, the illustrative waveform and duplicate reading navigation were removed in the bounded clarity pass. Fonts, palette, original geometry, component radii and shared token values are unchanged.

## Expressive refinement and appearance

Preserves the approved p tile, rounded system typography and semantic token map. Coral italic hero copy and quieter violet section accents distinguish the brand without extra navigation or interactive toys. Light mode uses lavender canvas, white surfaces and native light action/text colors; dark mode uses night ground and raised dark surfaces. Appearance is a labelled native select (System / Light / Dark), keyboard accessible and persisted where storage is available. System follows device changes; screenshots remain authentic historical light captures in either website appearance. Parent copy describes supporting the student’s existing plan, never a parent account or dashboard. See assets/README.md for framing investigation and review/DEPLOYMENT.md for domain preparation.
