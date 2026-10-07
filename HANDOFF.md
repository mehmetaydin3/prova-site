# Direction A — bounded clarity refinement

Branch: `site/direction-a-implementation`. This pass starts from `f8dea31`, preserving Direction A and all original native assets. No app edits, native builds, production connection, merge or publication. B/C and shared tokens remain unchanged. Independent Claude review remains pending.

Preview: **http://127.0.0.1:8087/docs/**. Canonical source is root `index.html`, `site.css`, `site.js`; `build.py --out docs` copies the marketing page alongside draft legal pages. No new dependencies.

## What changed

Removed the sticky five-step navigation and secondary header links, overture, orbit labels, repetitive transition links/captions, duplicate checklist, timer, metronome, sharing simulator, waveform, duplicate teacher letter and teacher-review tabs. The metronome was accurate but distracted from the instruction. Retired code and built script were removed, not merely hidden.

| Step | Clear benefit | Supporting authentic evidence | Interaction |
|---|---|---|---|
| Assignment | Know exactly what to practice | Actual passage, instruction and checklist | Enlarge screenshot |
| Practice | Focus on the passage needing attention | Magnified actual teacher note and next checklist step | See full practice screen |
| Recording | Capture progress for the teacher to hear | Actual 38-second shared take beside the piece | See full recording screen |
| Feedback | Understand what to improve and where | Readable actual teacher/student question and reply | Select one of two illustrative timestamped replies |
| Next practice | Return with a clear next step | Selected sample note; actual teacher preparation with sessions and practice note | See full teacher review |

On mobile, authentic feedback precedes its small browser example. One short sentence supports each dominant benefit. The sample is explicitly not native audio or a production account. Ordinary private-until-shared behavior remains explained accurately in the FAQ, including the Performance-run exception.

Benefits were rechecked against `Features/Student/PracticeModeView.swift` (instruction, next item and teacher note beside practice) and `Features/Shared/RecordingPost.swift` (timestamped comments and seeking), plus existing authentic captures and prior claim verification. No new functionality/outcome claim. See [design mapping](DESIGN-MAPPING.md) and [provenance](assets/README.md).

## Motion

Once-only entrances settle the heading 8px over the standard 250ms, followed by the product 150ms later, settling 12px over 250ms. Content is always readable (.94 minimum opacity); transforms preserve layout. No scroll hijacking/parallax. Reduced motion removes movement/delay and uses full opacity; selected replies retain a 200ms opacity emphasis. Native film stays manual and pauses offscreen.

## Verification

Actual Chrome desktop (1440px) and mobile (390px) views inspected for every moment; final screenshots use `review/refined-*`. Responsive bounds checked at 320/390/600/900/1440px, with no horizontal overflow or out-of-bounds headings/product frames. Native images loaded. Mobile scroll handoff inspected, and manual reduced motion confirmed with immediate scrolling. Keyboard reply selection updates the next focus. Enlargement/correct sources, close/Escape and focus return checked; film controls retain manual play/pause.

`node --check site.js`, build, `tools/check-site.py`, and `git diff --check` pass. Original token/prototype preservation, contrast, links/anchors, media reserved geometry and publication refusal checked. Unaffected legal/FAQ/media failure and brand evidence reused from prior passes. No platform/VoiceOver/Lighthouse claims.

## Remaining gaps

Historical demo screens contain inconsistent musical details and older styling; replace with one approved current fictional studio before publication. Timestamped native audio/capture remains missing. Approved beta request destination and legal values remain missing. Safari/real iPhone/VoiceOver/device preferences, zoom and throttled performance remain untested. Prior induced image-recovery test was blocked by permission review and remains unverified. No simulator was opened; build lock availability was not confirmed. See [critical review](review/REVIEW.md).
