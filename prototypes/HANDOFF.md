# Codex review handoff: Prova site, three directions

**Branch** `site/directions` in `prova-site`, local only (not pushed; GitHub Pages stays off; the
founder approves any publication). Commit: see `git log -1` on the branch. Uncommitted work: none
after this commit. Owner: the site lead session; no simultaneous edits to these files, please.

## What is here

| Path | What |
|---|---|
| `shared/tokens.css` | The app-to-web token map as CSS (light + dark, the night stage, the lockup, components, motion) |
| `TOKENS.md` | The mapping with source references and every web adaptation justified. **Baseline for the review.** |
| `a/index.html` | Direction A "Night ground": dark by design, the Downbeat drops the mark into the nav once per session, one pinned phone whose screen swaps per loop step, a scroll-linked take |
| `b/index.html` | Direction B "The week": light-first editorial, Saturday-to-Saturday spine that fills as you scroll, product moments as note cards |
| `c/index.html` | Direction C "Bar 12": the take as the hero on the night stage, the loop as four cards, one celebration moment, safety as a receipt |
| `shared/*.jpg`, `brandmark.png`, `*.mp4` | Real Today and sign-in stills from the current build (440×956pt); the BrandMark crop and Downbeat films are **concept material** from branch `design/launch-handoff` (#54, unmerged) |
| `ASSETS.md` | The recording and still list for the Release & QA lead |
| `screenshots/` | Headless Chrome renders (see "Known issues") |

## Preview

```sh
cd prova-site/prototypes && python3 -m http.server 8080
# open http://localhost:8080/a/  /b/  /c/
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

## Known issues and what is left

- **Screenshots are incomplete.** The session's usage limit cut the sequential render; only
  `a-desktop-light.png` is current, and it predates the approved pricing/parent lines. Re-run the
  `shot` loop in this file's history (sequential, fresh `--user-data-dir`, `#still`, `data-theme`
  copies under `/tmp/pv/{light,dark}`) to produce the 18 renders.
- The four loop screens (A), six cards (B) and four cards (C) are **schematic**; `ASSETS.md` lists the
  real recordings that replace them. Captions say so on each page.
- The invite form and class-code form have no backend; they show the support route.
- The private review page (competitive teardown, best-in-class patterns, narrative, stack
  recommendation, the founder's pick) was not yet published; the research is complete and in the
  session transcript. Stack recommendation in short: stay static in this repo (GitHub Pages, free;
  or Cloudflare Pages, free and unmetered) and hand-write the motion; Framer Basic ($10/mo) only if the
  founder wants a no-code editor.
- Direction A pins dark values in both themes on purpose (`TOKENS.md` §7); confirm with the founder.
- Links to `../../docs/*.html` assume the legal pages are built in `docs/`.
