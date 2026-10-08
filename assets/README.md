# Product asset provenance

All screenshot and film evidence is actual native app capture of fictional demo data. No production account, personal student information, or new simulator capture was used.

| Website asset | Original local source | Treatment |
|---|---|---|
| `product/today-plan.jpg` | `~/prova/.claude/journey-audit/shots/s-13-today-assignments.png` | Existing full native capture, resized to 880×1913; no compositing or erased content |
| `product/today.jpg` | `prototypes/shared/today-max-dark.jpg` | Unchanged; 880×1912 |
| `downbeat.mp4` | `prototypes/shared/downbeat-max-today-dark.mp4` | Native concept launch recording; silent, manual playback. Experimental `design/launch-handoff`, not evidence of released animation |
| `brandmark.png` | `prototypes/shared/brandmark.png` | Resized to 192px high; preserves original geometry and color |
| `favicon.png` | Approved app `Assets.xcassets/AppIcon.appiconset` icon | 128px derivative |
| `product/assignment.jpg` | `~/prova/.claude/journey-audit/shots/s-14-assignment-top.png` | 880px wide, JPEG quality 82 |
| `product/practice.jpg` | `~/prova/.claude/journey-audit/shots/after2-17-practice.png` | Same conversion |
| `product/conversation.jpg` | `~/prova/.claude/journey-audit/shots/s-15-assignment-2.png` | Same conversion; CSS crops expose the recording and question/reply; full image remains available |
| `product/review.jpg` | `~/prova/.claude/journey-audit/shots/t15-08-assignment-review-2.png` | Same conversion |

Journey-audit demo provenance was checked against `~/prova/.claude/journey-audit/wt/Prova/Prova/Core/Repositories/ShowcaseStudio.swift`: fixed fictional identities and seeded studio, no network account. The archive is `archive/journey-audit-wt-4b69437` (`3e30e37`). These are historical captures, not freshly approved launch captures. Inconsistent seeded musical details and older navigation/daily-goal/gradient treatments remain authentic; they must not be mistaken for approved final app styling or advertised features.

The only browser sample uses two illustrative timestamped replies, explicitly labelled “browser example, no audio.” These are not comments extracted from the actual conversation. No waveform or synthetic audio is presented. Screenshot crops highlight genuine app details; full screenshots remain available.

## Exact replacement captures needed

Use a current approved fictional demo studio with the app build lock coordinated before opening Xcode or a simulator:

1. Teacher assignment for Minuet bars 12–16: piece, instruction and four-step checklist; then student Today with the same next step.
2. Current practice screen with score/instruction, timer and metronome; short manual start/pause recording.
3. Recorder: capture a take, show it private, then explicitly share with the teacher; short recording and both resting states.
4. Teacher take review with a loaded waveform and two timestamped comments at 18 and 31 seconds in a 38-second sample; student taps each comment and hears that moment. Provide cleared demo audio rights, or a silent UI recording.
5. Current teacher preparation screen / Since last lesson, with the same student's sessions, practice note and shared take.
6. If Downbeat is retained for launch: approved current native launch capture, clearly separated from the concept film.

No build lock availability was confirmed, so no native build or simulator was started. See `prototypes/ASSETS.md` for the original broader capture request.

## Tab-bar framing investigation

The original Today image contains Assignments text below the translucent native tab bar. This is in the source capture, not a website overflow artifact. Read-only TodayView.swift uses a ScrollView inside StudentRootView.swift’s TabView. The replacement shows the scrolled assignment plan with a clear bottom edge. Its clipped Add to Calendar control at the top is authentic scroll state, retained rather than retouched. The old source remains the manual experimental film poster. A fresh approved resting-state capture is still needed before launch.
