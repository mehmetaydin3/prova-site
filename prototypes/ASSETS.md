# Site assets: recordings and stills from the app

What the marketing site needs from the brand-forward app, in the order the page uses them. The
recorder (Release & QA lead, on the simulator lock, after the current P0s) follows this list; the
site lead does not take the lock. Everything here is captured from a **real build** or the DEBUG
showcases that already exist (`score`, `reviewsheet`, `weekpage`, `lessondetail`, `celebrate`),
checked against the real screen first, as `docs/launch-materials.md` §2 "Staging" says.

**Capture settings (every item)**
- iPhone 6.9-inch (1320 × 2868 portrait), default text size, status bar `9:41`, battery full
  (`xcrun simctl status_bar <udid> override --time 9:41 --batteryState charged --batteryLevel 100`).
- Light **and** dark. Reduce Motion **off** for the clips (plus one Reduce Motion clip of the launch).
- Hidden features out of frame: Studio feed, parent portal, pitch/rhythm/melody trainers, Apple and
  Google sign-in (`docs/launch-materials.md`, "What's hidden").
- Secrets: build from a copy with placeholder secrets.
- Demo data: the `app-review-demo.sql` pair plus a few student accounts. Student **Maya Rivera**,
  Violin; piece **Minuet in G**; the comments at **0:18** "Let the half note ring its full value" and
  **0:41** "Lovely dynamics here, keep that"; quick response "So much better".
- Clips: screen recording at 60 fps, H.264 `.mp4` **and** `.webm` (VP9), no audio track, 8–15 s,
  trimmed to start on the settled screen and end on the settled screen (the site loops them muted).
  Target under 1.5 MB each; the site serves them with `preload="none"` and a poster.
- Stills: PNG, straight from `simctl io screenshot`; the site converts to JPEG/WebP itself.
- Naming: `<screen>-<mode>.<ext>`, for example `review-dark.mp4`, `today-light.png`. Put them in
  `prototypes/shared/footage/` on the site branch (the site lead will wire them in).

## Clips (8), in page order

| # | Screen | What happens in the clip | Showcase / staging | Site use |
|---|---|---|---|---|
| 1 | **The Downbeat** (launch) | Tap the icon on the home screen; iOS zoom; the "p" drops into its place on Today (signed in). One clip with Reduce Motion on too (the cross-fade). | branch `design/launch-handoff` (#54), on a device, Release build | Direction A hero (concept material until #54 merges; labelled) |
| 2 | **New assignment** → Send | Title filled; the checklist, tempo 92, the YouTube link and the PDF visible; tap Assign to, Select all, tap Send; the sent state. | seeded teacher account | the loop, step 1 |
| 3 | **Score practice** | Score as the hero; the docked strip (timer around 12:00 · record · metronome 92); the teacher's note in view; the checklist "2 of 4 · Bars 9–16 hands together". | `score` | the loop, step 2 |
| 4 | **The recorder** | Open the recorder sheet, record about 20 s (the waveform live), stop, "Share with <teacher>?" → share. | seeded student account | the loop, step 3 |
| 5 | **Take review** | Play Maya's take, stop at 0:18, pin the comment, tap "So much better", send. Then tap the 0:18 stamp so the playhead jumps. | `reviewsheet` | the loop, step 4; the feedback hero |
| 6 | **This Week** | The queue with 4 takes to hear, Maya first; listen, quick response, next student. | `weekpage` | "Walk in knowing the week" |
| 7 | **Since last lesson** | Open a lesson; the card with 5 of 7 days, time on two pieces, 1 new take, the last note. | `lessondetail` | "Walk in knowing the week" |
| 8 | **Level up** | "Level 5", the Apprentice chip, confetti mid-burst, settling. | `celebrate` | Direction C's reward moment |

## Stills (10), light and dark

Today (signed in, two assignments, one with the coral new-note badge) · New assignment (as clip 2,
before Send) · Score practice (as clip 3) · The recorder at 0:19 · Take review (playhead between the
two pins, quick responses in frame) · This Week · Since last lesson · Dashboard (15 students, the
"needs you" group first) · Students (roster with Approve all visible) · Profile.

The two stills already in use (`today-max-light.jpg`, `today-max-dark.jpg`, sign-in) came from the
launch studies at 440 × 956 pt; replace them with the same frames at 1320 × 2868 from this pass.

## Not needed

No photography, no stock imagery, no illustration. The site shows the product and its words.
