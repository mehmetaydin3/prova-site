# V10 native product capture manifest

Last freshness check: **2026-10-21**. The latest approved app revision verified for this pass is `origin/main` at `9ea94652ce4af6c6f9ee5304987a00a0835927b8` (`9ea9465`). Website work is on `feat/prova-authentic-feedback-v10-end-to-end`; captures were made from a separate detached app worktree at that exact SHA. No production accounts, private user content, or private library data were accessed.

## Capture environment

- App repository: `/Users/mehmetaydin/prova`; isolated capture checkout: `/private/tmp/prova-ios-v10-latest` (detached at `9ea9465`). The app checkout was clean of tracked changes; an ignored `Secrets.swift` containing only repository-documented CI placeholder values was used for the local build and is not part of captured product content.
- Scheme/configuration: `ProvaShots`, Debug, simulator UI-test/showcase build.
- Device: iPhone 17 Pro Simulator, UDID `D9A3DA41-D976-4AFB-A132-228C03FC4FB6`, light appearance, native screenshot resolution 1206 × 2622.
- Capture date: 2026-10-19 (local). Captures used the repository's `tools/ipad-shots.sh` and UI-test workflow while holding the shared Xcode lock normally; lock was released normally afterward.
- Feature flags: `listeningRecognition=false`, `parentRole=false`, `parentLink=false`; other compile-time values are those in the pinned app revision.
- Fixture: deterministic `PROVA_SHOWCASE` data. The recording test creates a synthetic local clip. It cancels at the native share-confirmation step; the share was not delivered to a teacher. Teacher review and student take are seeded showcase states, not a server-backed exchange. The assignment, teacher take, and student take are distinct fixture screens; the site does not claim they are one verified end-to-end performance.

## Customer-facing native screen mapping

All listed images are unmodified SwiftUI screenshots. Website framing and scroll transitions are editorial; no app interface or waveform is recreated in HTML.

| Website use | Native asset | App screen / capture method | Data and limits |
|---|---|---|---|
| Hero, student focal screen | `assets/v10/captures-9ea9465/today__se__light.png` | Student Today via `tools/ipad-shots.sh` route `today` | Seeded Maya Rivera assignment, Minuet in G bars 12–16, left hand alone. Not a production account. |
| Hero, teacher background screen | `assets/v10/captures-9ea9465/teacher-review__se__light.png` | Teacher `TakeShowcaseView(.teacher)` via route `reviewsheet` | Seeded Minuet in G bars 5–8 take and comments. Not the same assignment/take as the hero Today fixture. |
| Student recording and share decision | `assets/v10/captures-9ea9465/interaction/share-confirmation.png` | `ShareQuestionTests` UI test: records a short local synthetic clip, captures native share confirmation, cancels | Real native interaction in simulator; no teacher/backend receives the clip. |
| Teacher opens/listens | `assets/v10/captures-9ea9465/interaction/teacher-review-listening.png` | `TimedCommentsUITests.testCaptureForTheDesignReview`, `reviewsheet-light-default-3lit.png` | Native seeded 80-second review fixture at its 0:42 comment. Synthetic waveform and seeded content, not a real performance. |
| Teacher selects a timestamp and composes a comment | `assets/v10/captures-9ea9465/interaction/teacher-comment-composer.png` | Same UI test, `reviewsheet-light-default-4composing.png` | Native composer opened at 0:56; screenshot shows an unposted draft. No feedback delivery is implied. |
| Student reviews comments on a take | `assets/v10/captures-9ea9465/interaction/student-take-feedback.png` | Native route `takepost` / `TakeShowcaseView(.student)` | Seeded Minuet in G bars 5–8 take with teacher and student comments. Separate showcase state, not a synced backend result. |

Hero and section transitions preserve image aspect ratios and use CSS framing only. Current website customer copy labels these as current native seeded showcase states and explicitly discloses that there is no backend handoff depicted.

## Score-loading investigation and editorial fallback — 2026-10-21

The existing application supports PDF documents: `PieceMaterialsEditor.swift:56` imports from Files, `ScorePracticeView.swift:530` loads the attachment through a signed URL, and `SharedScoreMarkupSheet` renders a PDFDocument with PencilKit layers. The available showcase cannot carry an imported score through this workflow: `AttachmentRepository.swift:62` skips storing PDF bytes and `:150` throws `fileDoesNotExist` for showcase signed URLs. `SharedScoreMarkupSheet.swift:617` hard-codes `ScorePracticeShowcase.score()`, whose generator draws placeholder notation. No supported launch argument or local document-loading override was found for those teacher/student showcase routes.

Therefore authentic teacher/student states on a valid score remain blocked in this capture setup, not by lack of PDF rendering support in the app. They require an authenticated test assignment with a valid PDF, or a separately approved demo-fixture improvement. No app source, architecture, accounts, or backend were changed; no native build was needed.

The website restores the existing editorial piano study as `assets/v10/editorial-score.svg`, with separate illustrative violet teacher and coral student marks. The camera starts inside a phrase and pulls back to the whole page. Mine / Teacher / Both are website illustration controls, not native UI. Persistent labels identify this throughout. The closing typography card is editorial. Audio timestamps are not mapped to score positions.

## Stable baseline review — 2026-10-21

Branch: `feat/prova-v10-stable-review`. Checkout: `/private/tmp/prova-v10-stable-review`. Recovered from recorded V10 base `12fffbe` plus the surviving end-to-end V10 files; the original temporary directory had lost its Git link. Original files and unrelated workspace files were preserved.

Preview: http://127.0.0.1:8105/ . Desktop/mobile review galleries: `review/v10/baseline/authentic-full-{desktop,mobile}.html`. Captures cover hero, all five recording chapters, score close-up/teacher/wide states, and closing at 1440×980 and 390×844. The isolated headless Chrome review checks image loading, horizontal overflow, full desktop native-screen bounds, camera progression, layer switching, reduced-motion chapter navigation, and JavaScript exceptions. Syntax and whitespace checks plus local asset/link resolution also pass. Safari, physical devices and actual backend delivery are not verified.

Significant defects fixed: obsolete placeholder CSS displaced native recording screens beyond the viewport; mobile hero framing cut off the front phone; scroll-driven chapter updates could reposition the document through `scrollIntoView`. Existing visual language is retained.

Process inspection found no old V10 HTTP servers, capture scripts, browser-debugging sessions, or Xcode builds running. The UI's historical ten terminals were not independently enumerable. Unrelated agents and services were untouched. The temporary review browser is closed after verification; one preview server remains.

Highest-impact follow-ups: (1) native teacher/student score captures using a valid test PDF; (2) a verified teacher/student exchange using one consistent assignment and take; (3) Safari and physical-iPhone motion/reading review.

## Freshness

Fetched app main once on 2026-10-21: it still resolves to `9ea94652ce4af6c6f9ee5304987a00a0835927b8`, matching the existing native captures. These are seeded simulator screenshots, not proof of a connected production exchange.
