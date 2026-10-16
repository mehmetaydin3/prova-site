# Capture provenance: V10 page

Every phone screen on the V10 page is a capture of the Prova iOS app, built from **prova `main` at 2d7ac10**
(Merge PR #142, the tip of `main` on 2026-10-16). Debug build, iPhone 17 Pro simulator (402 × 874 pt, 3×),
status bar overridden to 9:41, launched into the app's own DEBUG showcases (`PROVA_SHOWCASE`, showcase data:
the studio of Alex Morgan, teacher, and Maya Rivera, student). Placeholder Secrets: the network goes to a
local stub on 127.0.0.1, **never the live backend**. Builds and simulator time ran under the app repo's
`tools/lock.sh` at docs priority.

The PNGs (1206 × 2622) were resampled to 1000 px wide JPEGs (quality 80) for the page. Nothing in the app's
interface was edited.

| File | App commit | How | Appearance | Captured |
|---|---|---|---|---|
| `markup-student-both-dark.jpg` | 2d7ac10 | PROVA_SHOWCASE=markup | dark | 2026-10-16T12:04:12-07:00 |
| `markup-student-theirs-dark.jpg` | 2d7ac10 | PROVA_SHOWCASE=markup-theirs | dark | 2026-10-16T12:04:19-07:00 |
| `markup-teacher-both-dark.jpg` | 2d7ac10 | PROVA_SHOWCASE=markupteacher | dark | 2026-10-16T12:04:01-07:00 |
| `markup-teacher-mine-dark.jpg` | 2d7ac10 | PROVA_SHOWCASE=markupteacher-mine | dark | 2026-10-16T12:04:05-07:00 |
| `markup-teacher-theirs-dark.jpg` | 2d7ac10 | PROVA_SHOWCASE=markupteacher-theirs | dark | 2026-10-16T12:04:08-07:00 |
| `recorder-dark.jpg` | 2d7ac10 | PROVA_SHOWCASE=recorder | dark | 2026-10-16T12:03:33-07:00 |
| `review-commented-dark.jpg` | 2d7ac10 | UI test, review-commented | dark | 2026-10-16T13:49:16-07:00 |
| `review-compose-dark.jpg` | 2d7ac10 | UI test, review-compose | dark | 2026-10-16T13:49:08-07:00 |
| `review-inbox-dark.jpg` | 2d7ac10 | PROVA_SHOWCASE=review | dark | 2026-10-16T12:03:39-07:00 |
| `review-playing-dark.jpg` | 2d7ac10 | UI test, review-playing | dark | 2026-10-16T13:49:18-07:00 |
| `review-sheet-dark.jpg` | 2d7ac10 | PROVA_SHOWCASE=reviewsheet | dark | 2026-10-16T12:03:43-07:00 |
| `score-dark.jpg` | 2d7ac10 | PROVA_SHOWCASE=score | dark | 2026-10-16T12:03:54-07:00 |
| `student-recordings-dark.jpg` | 2d7ac10 | UI test, student-recordings | dark | 2026-10-16T13:49:24-07:00 |
| `take-feedback-dark.jpg` | 2d7ac10 | UI test, take-feedback | dark | 2026-10-16T13:49:53-07:00 |
| `today-dark.jpg` | 2d7ac10 | PROVA_SHOWCASE=student | dark | 2026-10-16T12:03:22-07:00 |

## What the local stub served

- `review-inbox` and `review-sheet` are the first capture run, before any comment existed.
- One synthesised take (the Menuet's melody, bars 1–16 twice, 48 s, generated for these captures) for any
  recording, so the take review and the take detail decode and draw a real waveform.
- For the timed-comment screens (`review-compose`, `review-commented`, `review-playing`, `student-recordings`,
  `take-feedback*`, the "UI test" rows above): one comment on the take, at **0:18**, by the showcase
  teacher Alex Morgan: "So much steadier — lovely! Let that last G ring for all three beats." The app fetched
  it as it fetches any comment (`recording_comments`), and drew it: the waveform marker, the feedback timeline,
  the student's comment row with "Play from 00:18". The composing screen is the app's real Drop comment flow,
  driven by a capture-only UI test (`SiteLeadV10CaptureTests`, never committed), which played the take,
  stopped at 0:18 and typed the comment.

## The score

The showcase draws a placeholder page (dots on staves) in Mark up and in practice. On this page, that page's
rectangle (measured on each capture: practice 12, 138, 378 × 489 pt; Mark up 5, 212, 392 × 507 pt, or
5, 254.7, 392 × 506.7 pt with the other person's layer chosen) carries **a real engraving** instead:
`assets/v10/minuet-part.svg`, the Mutopia Project's public-domain edition of the Menuet in G, BWV Anh. 114
(typeset with LilyPond by Allen Garvin, Mutopia-2017/01/19-75). Each system's melody staff is used exactly as
engraved and stacked as a single-staff part on the app's page shape (the student plays violin in the showcase);
the bass staff is left out. No note was drawn or moved.

The marks on the score (Alex's red circle around the ornament in bar 13, Maya's bracket under bars 14–15) are
drawn by the site in the part's coordinates, in the style of the app's pen, so the same marks sit on the phone
and on the large sheet. The layer control in each capture (Mine / Student or Teacher / Both, pens shown or
hidden) is the app's own, captured in that state; the marks shown match it.

## Verified in the app's code (prova main 2d7ac10)

- The take review pins a comment to a second of the take (`RecordingReviewSheet`: Drop comment pins the
  playhead; "drag the pin to fine-tune"; the timeline row seeks and plays). There is no region selection.
- The student's take detail shows the teacher's comments pinned on the waveform and a "Play from m:ss" stamp
  (`RecordingPost`, `reviewMode`).
- Mark up has Mine / Teacher (student) or Student (teacher) / Both; with only the other person's layer shown,
  the pens are hidden. Marks reach the other person when saved (save-then-see), not live while drawing.
