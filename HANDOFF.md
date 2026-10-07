# Direction A implementation candidate

Branch: `site/direction-a-implementation`, based on Claude's latest committed candidate `bc79c17` (`site/directions`). No newer shared committed work existed at inspection. The worktree began clean. Claude's checkout and the app were read-only; no merge, push, production connection, native build, or public deployment occurred. Independent Claude review remains pending because Claude is unavailable.

## Preview and source

Running local preview: **http://127.0.0.1:8087/docs/** (Python server bound to loopback on port 8087).

Root `index.html` / `site.css` / `site.js` / `metronome.js` are canonical; `shared/tokens.css` is the unchanged original app-to-web mapping. `build.py --out docs` copies this page and local assets alongside the existing draft legal pages. `--publish` still refuses missing legal values. `--preview` retains the previous legal-artifact behavior. No new site runtime dependencies. `prototypes/` preserves A, B and C unchanged.

## What changed

Direction A's dark stage, expressive p, aurora and Downbeat language remain. The replacement is a coherent five-movement story with varied editorial compositions and actual native evidence, rather than schematic screen swaps. Typography, spacing, phone framing, captions, controls, footers and mobile pacing were refined. Each screenshot can be enlarged. The native launch concept film is manual-play only, explicitly a silent motion study.

| Moment | Who / recognized problem | Prova's value / authentic evidence | Useful next action |
|---|---|---|---|
| Opening | Teacher: the lesson ends, practice becomes distant | Clear work and connection; actual Today capture | Explore beta readiness or follow the week |
| Assignment | Teacher → student: “practice this” is vague | Piece, passage, instruction, checklist; actual assignment | Check sample steps; next focus changes in the practice preview |
| Practice | Student: uncertain where to put attention | Instruction with timer/metronome; actual native practice screen | Start/pause/reset a sample timer; explore tempo, subdivisions and tap tempo; move to a take |
| Take | Student → teacher: wants help with a specific passage | Actual shared take beside its assignment | Explore private→shared sample state; follow the shared take into feedback |
| Reply | Teacher → student: a general comment misses the moment | Timestamped comment behavior verified in app code; actual assignment conversation visible alongside the illustrative timeline | Seek either note with buttons/keyboard; carry selected feedback back to practice |
| Next lesson | Teacher and student: reconstructing the week | Sessions, practice note, shared take in an actual teacher review | Focus the real capture on practice or the shared take; explore joining with a studio |
| Beta | Teacher, student, parent: eligibility and sharing questions | Grounded class-code, age/device and privacy explanations | Read native FAQ disclosures; approved request link can be configured |

The checklist, timer, sharing choice and feedback are labelled browser demonstrations; nothing is uploaded, recorded, saved to an account, or connected to production. Only the reduced-motion preference persists locally. The selected note → practice transition explains a relationship; it does not promise new native automation.

## Verification

- Rendered Chrome desktop and mobile review; responsive widths 320, 390, 600, 900 and 1440px: no horizontal overflow or out-of-bounds key components, no broken loaded images.
- Sample checklist completion and changed next focus, timer advancement/pause/reset/offscreen pause, share/reset, timestamp buttons, slider End key, feedback→practice focus transfer and note propagation verified in the rendered page.
- Native film opt-in play, pause, end/replay and poster restoration verified; failure handling preserves the screenshot (code reviewed, failed-network branch not induced).
- Screenshot enlargement, correct image source, Escape dismissal, native disclosure controls and legal links checked. Keyboard focus uses mapped visible rings; controls use 44px minimum targets, checkbox labels 48px. Manual reduced-motion toggle persists through reload and changes scrolling to auto.
- `node --check site.js`, `node --check metronome.js`, `.venv/bin/python build.py --out docs`, and `python3 tools/check-site.py` pass. Static checks cover source/built equality, anchors/local assets, single H1, alt/reserved image geometry, manual/preload-none media, original token/prototype preservation, contrast pairings and publication refusal.
- No page-script console errors observed. A browser-extension message-port warning was excluded as extension infrastructure, not attributed to the website.
- No third-party scripts/fonts/data requests, no autoplay or video preload, lazy lower-page screenshots, reserved media dimensions. Total product/brand/media assets approximately 1.3MB; native film ~453KB is opt-in. No Lighthouse score, throttled-network LCP/CLS measurement or real-device performance claim.

Screenshots in `review/`: desktop hero/assignment/practice/feedback, mobile hero/assignment/take/feedback, and complete mobile page. These screenshots document candidate `283d363`, before the second refinement. Updated screenshots and a website motion recording could not be captured: both documented browser screenshot surfaces repeatedly timed out. Do not use the earlier images as verification of the latest composition. The supplied native film in `assets/downbeat.mp4` is genuine concept footage, not a recording of this website.

## Remaining gaps

See the prioritized [critical review](review/REVIEW.md). Before publication: approved beta request destination, refreshed coherent native capture set including loaded timestamped feedback/audio, founder legal values, and independent review. Historical captures are identified in [asset provenance](assets/README.md); exact replacement states are listed there. The build lock was not confirmed available, so no Xcode or simulator was opened.

Device reduced-motion/media changes, high-contrast OS rendering, VoiceOver, Safari, real iPhones, 200% browser zoom and throttled-network performance were not exercised. Manual reduced-motion follows the same rendering state and mapped CSS, but that does not substitute for these platform checks. The intended fully audible feedback moment currently remains a no-audio browser explanation until cleared native sample media exists.

## Second refinement

Added a five-moment reading navigation; replaced the wide feedback panel with a waveform and editorial teacher reply; made the actual teacher review explorable at readable scale; tightened mobile hero and section pacing. The illustrative timeline now matches the native capture’s 38-second duration, with example notes at 18 and 31 seconds. Sharing reveals a useful link into the teacher’s answer. Feedback returns keyboard focus to the visible instruction, rather than an offscreen timer. Screenshot dialogs reserve geometry and provide loading/retry states.

The optional metronome follows the native source’s 40–240 BPM range, subdivisions 1–4, recent three-second tap average and decaying sine click. Web Audio starts only on Play, stops offscreen/hidden/on tool closure, and never records. Rendered tests verified bounds, single-step adjustment, 245→240 clamping, tap tempo, selection of subdivisions 2/3, Play/Stop and offscreen stop. Acoustic fidelity was not independently listened to.

Final DOM checks confirmed the 38-second End-key position, sharing→feedback link, teacher-review focus labels/caption, enlargement with the correct review source, and mobile feedback→visible instruction focus. The 64-bar waveform has no internal overflow at 320px. Earlier rendered responsive checks covered 320/390/600/900/1440px. The final visual pass is incomplete because screenshot capture timed out; newer magnified crops and choreography still need visual confirmation. Device/platform limitations above remain.

Browser permission review rejected the separate localhost fault-test origin because permission was declined. It was not retried through another route. The temporarily held image was restored; induced image-recovery testing remains unverified.
