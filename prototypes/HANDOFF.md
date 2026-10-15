# Codex review handoff: Prova site, three directions

**Branch** `site/directions` in `prova-site`, local only (not pushed; GitHub Pages stays off; the
founder approves any publication). Commit: see `git log -1` on the branch. Uncommitted work: none
after this commit. Owner: the site lead session; no simultaneous edits to these files, please.

## Decisions so far

- **Stack (founder, 2026-10-13): the recommended one.** Static HTML, CSS and a little JS in this repo on
  the shared token sheet, built by `build.py` alongside the legal pages, served by GitHub Pages behind the
  existing publish gate. Clips as MP4 + WebM with posters and `preload="none"`. No Framer, no Webflow,
  nothing monthly; the only spend is the domain, which the founder buys.
- **Founder's recorded default (via the orchestrator, 2026-10-13):** Direction B "The week" with C's take as
  the hero, the system type stack, domain **provamusic.app** (#87; support@provamusic.app). Draft D is built on
  that default and stands until he picks otherwise.
- **Brand exports (app main, #78, `docs/brand/`):** `prova-mark.png` (the exact "p", 626×766, night ground only),
  `prova-mark.svg` (the same raster in an SVG), `prova-tile.svg` (the icon tile, the default logo on the website).
  `prova-mark-flat.DRAFT.svg` is **not approved**; it is not used. The nav uses `shared/brand/prova-mark-160.png`,
  a resize of the approved PNG (no redraw), inside a CSS tile at the icon's corner ratio. No wordmark file exists;
  "Prova" is live text in the system rounded stack, as the brand README says.

## Rebased onto the founder's main (2026-10-15, after PR #2)

The founder's own page (root `index.html`, `site.css`, `site.js`) is the entry point and is live at
https://provamusic.app via Cloudflare Pages, so a merge to main is a publish. Draft D now builds to
**`docs/the-week/`** beside it (own assets, legal links relative), so both pages exist until he settles
the front door. Merger fixes on #3 applied: legal pages link to our own pages relatively (`build.py`
`fill()`); one support placeholder `[SUPPORT EMAIL]` everywhere on our page; internal notes stripped
from `src/index.html` and the review-aid rule from the token sheet. Not touched: his `shared/tokens.css`
(the same sheet, his copy), his legal text, his page.

## The site build (2026-10-15)

Draft D is now the real landing page: `src/index.html` (hand-written HTML, built by `build.py` with the
legal pages into `docs/`), `src/assets/` (the token sheet, the brand mark, the Today still, copied to
`docs/assets/`). The legal pages carry the lockup instead of the 64px icon. `build.py --publish` still
refuses while the legal values are null; `--preview` writes the artifact copy. Preview locally:

```sh
python3 -m venv .venv && .venv/bin/pip install markdown
.venv/bin/python build.py --out docs && (cd docs && python3 -m http.server 8080)
```

## What is here

| Path | What |
|---|---|
| `shared/tokens.css` | The app-to-web token map as CSS (light + dark, the night stage, the lockup, components, motion) |
| `TOKENS.md` | The mapping with source references and every web adaptation justified. **Baseline for the review.** |
| `a/index.html` | Direction A "Night ground": dark by design, the Downbeat drops the mark into the nav once per session, one pinned phone whose screen swaps per loop step, a scroll-linked take |
| `b/index.html` | Direction B "The week": light-first editorial, Saturday-to-Saturday spine that fills as you scroll, product moments as note cards |
| `d/index.html` | **Draft D, the current candidate**: B's week with C's take on the night stage as the hero, the Downbeat on the lockup, the real Today screen in a For students section, provamusic.app links in the published copy |
| `c/index.html` | Direction C "Bar 12": the take as the hero on the night stage, the loop as four cards, one celebration moment, safety as a receipt |
| `shared/*.jpg`, `brandmark.png`, `*.mp4` | Real Today and sign-in stills from the current build (440×956pt); the BrandMark crop and Downbeat films are **concept material** from branch `design/launch-handoff` (#54, unmerged) |
| `ASSETS.md` | The recording and still list for the Release & QA lead |
| `screenshots/` | Headless Chrome renders (see "Known issues") |

## Preview

```sh
cd prova-site/prototypes && python3 -m http.server 8080
# open http://localhost:8080/d/  (the candidate), /a/ /b/ /c/ (the three directions)
```
Append `#replay` to Direction A to replay the Downbeat; `#still` skips it. Each footer has a
"Type: system / display face" toggle: the site ships on the system rounded stack (brand system,
approved 2026-10-06); the display faces (Geist, Fraunces, Bricolage Grotesque) are an exploration per
direction, off by default. Dark mode follows the OS or `data-theme` on the root.

## Design intent and token sources

Every value comes from `prova/Prova/Prova/DesignSystem/ProvaDesignSystem.swift`, `docs/DESIGN-SYSTEM.md`,
`docs/design-philosophy.md` (main `2f42439`) and the approved brand system (night stage: `#060511` in
both appearances, aurora capped at 24%, 2px signature line, words on night only; the lockup; the
Downbeat spring m 1 / k 420 / c 35). `TOKENS.md` §7 lists the web-only adaptations.

Copy is from `docs/launch-materials.md` v3 (direction A, "The week between lessons"), corrected per the
orchestrator's read-only claim check on 2026-10-06 (YouTube link, scan with the camera or a PDF from
Files, "to one student or all of them", "together, with the teacher's note in view", under-13 consent
phrased as a plan). The founder approved the parent-view line and the pricing sentence "Free during
the beta. When pricing arrives, teachers pay; students and parents never do."

## Verification performed

- Rendered in headless Chrome at 1440×900 and 390×844; the first pass caught and fixed: the Downbeat
  frozen under virtual time (now skipped for `navigator.webdriver` and `#still`), light renders
  following the Mac's dark theme (renders now force `data-theme`), Direction C's headline column
  collapsing (`ch` measured on the body size).
- Reduce Motion: every scroll-linked effect has a static resting state (the playhead at 0:18, the
  spine full, the celebration settled); `tokens.css` collapses every motion token to 200 ms.
- Contrast: pairings are the app's pinned ones; new web pairings are listed in `TOKENS.md` §1.
- No build step, no JS libraries, no fonts loaded unless the display toggle is on.

## Private previews (artifacts, private to the founder's account)

| Page | URL |
|---|---|
| Review page (the deliverable) | https://claude.ai/artifact/HAegYk3CTHsBcTRMrDEE4f |
| Direction A · Night ground | https://claude.ai/artifact/1YwDy3XLsHxPcZpkStuMis |
| Direction B · The week | https://claude.ai/artifact/SFdEJkS2cXjWi6oMDENFcx |
| Direction C · Bar 12 | https://claude.ai/artifact/TpL15PqXJWZ2irGBL714KW |
| **Draft D · the week, with the take** | https://claude.ai/artifact/Tb8rUtUfHUqh1tZPD2GCLg |

The artifact copies are built by the loop in this file's commit (`.publish/`, gitignored): the
doctype and meta lines dropped, `../shared/` flattened to `shared/`, legal links pointed at the
GitHub Pages URL. The repo files are the source.

## Screenshots

`screenshots/<page>-<desktop|mobile>-<light|dark>.png` (the first viewport at 1440×900 and at a real
390×844 phone viewport, DPR 2) and `<page>-<desktop|mobile>-full-light.jpg` (the whole page after one
scroll through, so the spine and the playhead show a read page). Pages: the four prototypes, the built
`site-index` and `site-privacy`. Rendered by `tools/shoot.mjs` (puppeteer-core on the installed Chrome,
`prefers-color-scheme` emulated, `#still` holds the Downbeat); it also asserts no horizontal overflow at
either width. Run it with `cd prototypes/tools && npm i puppeteer-core@23 && node shoot.mjs`.

Note for reviewers: plain headless Chrome (`--screenshot --window-size=390,…`) lays pages out at a
500px minimum and crops, which looks like a phone overflow and is not one; use the script.

## Known issues and what is left

- The four loop screens (A), six cards (B) and four cards (C) are **schematic**; `ASSETS.md` lists the
  real recordings that replace them. Captions say so on each page.
- The invite form and class-code form have no backend; they show the support route.
- Direction A pins dark values in both themes on purpose (`TOKENS.md` §7); the founder decides.
- Links to `../../docs/*.html` assume the legal pages are built in `docs/` (the artifact copies link
  to the GitHub Pages URL, which is off until the legal values are filled).
- Google Fonts links stay in the pages for the display-face toggle; the font files load only when the
  toggle is on. Drop the links if the founder keeps the system stack.
