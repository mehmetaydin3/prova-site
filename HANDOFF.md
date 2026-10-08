# Prova — focused finesse candidate

Branch: `site/direction-a-expressive`. This pass starts from committed `c9d63af`, with a clean worktree. Preserves the approved direction, section order, main benefit copy, authentic assets, semantic token map, light/dark themes and contact/domain preparation. No app edits, new features, dependencies, native build, merge or publication. User requests visual review before any deployment of this candidate.

Preview: **http://127.0.0.1:8087/docs/** (existing server confirmed HTTP 200). Root `index.html`, `site.css`, `site.js` remain canonical; `.venv/bin/python build.py --out docs` generates draft output.

## Five highest-impact issues, found before editing

Fresh before renders of desktop/mobile in both themes and the viewer are retained in `review/finesse/before/`. Measurements confirmed 32/64/80px desktop gutters and differing column ratios. The viewer scrolled its whole container, clipped its bottom content, and left the document scrollable. Chrome's native Escape focus return already worked; this pass makes all closing paths explicit and consistent.

1. **Layout rhythm and optical alignment.** One shared equal-column grid and fluid 40–64px gutter across the practice story, hero and beta; centered hero phone; consistent mobile phone corners. Feedback's section label no longer inherits the larger body style. Selected reply/next-focus space stays reserved, avoiding subsequent section movement.
2. **Control states and sizing.** Central semantic-token hover, pressed and focus styles for existing links, buttons, select, FAQ and viewer controls. Hover treatments are limited to pointer devices; selected sample reply has violet wash plus coral underline. Brand home links now meet the 44px hit minimum. No animated hover targets.
3. **Screenshot viewer.** Stable responsive shell, fixed toolbar/caption and keyboard-scrollable image region. Locks page scrolling with stable scrollbar geometry; resets image position on each opening. Keyboard cycle, Close/Escape/backdrop and focus return are explicit. Outside dismissal requires both press and release on the backdrop. Opening uses a short 8px/250ms settlement; closing uses the quick 150ms token. Reduced motion uses opening opacity only and immediate closing. Rapid reopening and queued close events are handled. Enlargement links retain authentic image URLs when JavaScript/dialog enhancement is absent or a new tab is requested. Existing loading/error/retry presentation stays inside reserved viewer space.
4. **Coordinated entrances.** Only explanation and evidence groups animate. Desktop waits for the explanation and settles the pair, with 150ms evidence stagger; copy 8px/250ms, product 12px/400ms. On mobile each group waits for its own visibility with no delay. Initial opacity is .96, so content remains readable if enhancement fails. Observers detach after settlement; scrolling stays native. OS/manual reduction removes all offsets/delays/transitions, even for offscreen groups. Existing sample emphasis remains a brief opacity change.
5. **Action clarity.** Enlargement links consistently say “View full screen”; beta entry links say “Beta details” with downward arrows, and the FAQ link says “How to join.” Sample labels are shorter while preserving “browser example, no audio.” Native fragment targets receive keyboard focus below the sticky header. JavaScript-only controls remain unavailable until enhancement succeeds, with their geometry reserved; screenshot links, joining details, FAQ and essential content still work without JavaScript.

## Verification and evidence

Final matching renders: `review/finesse/{light,dark}-{desktop,mobile}-{hero,full}.png`, desktop 1440×1000 viewport and mobile 390×844 viewport. Section/viewer captures are in the same folder. Final paired-motion assertions and the full interaction report are in `review/finesse/checks.json`.

Installed headless Chrome used an isolated temporary profile because the connected browser runtime was unavailable. Both themes inspected before and after editing. Bounds checked at 320/390/600/900/1440px: no horizontal overflow, clipped headings/navigation/phones or missing images; no browser JS errors. Theme switching preserves layout geometry, explicit choice survives reload and System responds to emulated device changes. Native anchor activation transfers focus to the intended destination.

Viewer checks in both themes and desktop/mobile: keyboard opening, Tab cycle, Close/Escape/backdrop, explicit focus return, no horizontal layout shift, retained document scroll position, internal scrolling and reset on reopening. Local request interception verified image failure/retry without modifying assets. Emulated touch opens/closes the same viewer and has no hover state. Keyboard sample selection updates both reply and next focus; visible focus/selected styles and stable next-section height verified. OS/manual reduced motion and opacity-only viewer opening verified. With JavaScript disabled, essential copy remains visible and full-image links navigate to authentic assets.

`node --check site.js`, draft build, `python3 tools/check-site.py` and `git diff --check` pass. Reuse unaffected claim/provenance, legal/contact, contrast, publication-refusal and native-film evidence from `c9d63af`; original screenshots and shared tokens/prototypes remain unchanged. No claim of Safari, real-device, screen-reader or measured performance/CLS validation.

## Remaining visual limitations

Historical native demo captures contain older styling and inconsistent musical details; they remain untouched. The hero's partially clipped calendar control is authentic capture scroll state. Approved current launch captures and native timestamp audio remain absent. Browser samples stay illustrative. Safari, real iPhone, VoiceOver, zoom and throttled performance remain unverified. Final visual approval is pending.

## Deployment status and next action

Public website DNS missing; HTTPS/redirects cannot be verified. GitHub account admin access confirmed. Cloudflare account unavailable; Resend integration available but not connected. No records/settings mutated. `.com` MX routes to Google, with Google SPF; named mailbox receipt and Resend sending/receiving remain unverified. All email records preserved.

Publication requires ENTITY NAME, POSTAL ADDRESS, STATE, REPORT DAYS, BACKUP DAYS, LOG DAYS, EMAIL PROVIDER and actual publication DATE. Founder must confirm the legal/retention values and actual auth-email provider; DATE can be set when the release is ready. Exact host DNS values, dashboard instructions, and receiving-mail checks are in [review/DEPLOYMENT.md](review/DEPLOYMENT.md).

Historical native captures have inconsistent musical data/older styling and need launch approval/replacement; native timestamp audio is absent. Approved beta request endpoint remains absent. Safari, real iPhone, VoiceOver, zoom and throttled performance remain untested. No service purchase, transfer, email sending, merge or publication.
