# prova-site

The selected Direction A website is implemented in `index.html`, `site.css`,
`site.js`, and the existing mapped `shared/tokens.css`. No JavaScript dependencies.
Original A, B and C remain preserved in `prototypes/`.

Local review:

```sh
.venv/bin/python build.py --out docs
python3 -m http.server 8087 --bind 127.0.0.1
# http://127.0.0.1:8087/docs/
node --check site.js
python3 tools/check-site.py
```

See [HANDOFF.md](HANDOFF.md), [DESIGN-MAPPING.md](DESIGN-MAPPING.md),
[asset provenance](assets/README.md), and [critical review](review/REVIEW.md).
Beta request configuration is intentionally empty until an approved destination
is supplied (`meta[name="prova-beta-url"]` in `index.html`). Default actions
explain beta access without collecting information.


The public privacy policy, terms of service and support page for the Prova app,
prepared for GitHub Pages from `docs/` at https://provamusic.app.
The app links to `/privacy`, `/terms` and `/support` (`AppLinks.website`).

**Status: draft.** GitHub Pages is off until every placeholder is filled:
the founder's legal values, the email provider (SMTP) and the Supabase plan's
backup and log retention. `null` in `values.json` means not filled yet.

## Before the App Store release

- Register a DMCA designated agent with the US Copyright Office. Until then the
  terms say "our copyright agent" at the support email.
- Replace the historical native demo captures with approved current captures before publication.

## Editing

- `src/privacy-policy.md`, `src/terms-of-service.md`: the legal text. The
  canonical copies, with review notes, live in the app repo under `docs/legal/`;
  these copies have the notes removed. Keep the two in step.
- `values.json`: the placeholder values (`[ENTITY NAME]`, `[SUPPORT EMAIL]`,
  `[POSTAL ADDRESS]`, `[WEBSITE]`, `[REGION]`, `[BACKUP DAYS]`, `[REPORT DAYS]`,
  `[LOG DAYS]`, `[EMAIL PROVIDER]`, `[STATE]`, `[COPYRIGHT AGENT]`, `[DATE]`).
- The support and legal page wrapper are written in `build.py`; the marketing entry point is root `index.html`.
- `src/index.html` + `src/assets/`: the alternative landing page ("the week, with the take",
  `prototypes/d`, the site lead's recorded default), built to `docs/the-week/` beside the entry
  point until the founder settles which page is the front door. `prototypes/` holds the three
  directions, `TOKENS.md` (the app-to-web token map), `ASSETS.md` (recordings to capture),
  `HANDOFF.md` (the review handoff) and `tools/shoot.mjs` (renders at real phone and desktop viewports).

## Building

```sh
python3 -m venv .venv && .venv/bin/pip install markdown
.venv/bin/python build.py --out docs            # draft: banner, placeholders visible
.venv/bin/python build.py --out docs --publish  # refuses while any placeholder is unfilled
```

Domain/contact preparation and exact dashboard steps: [review/DEPLOYMENT.md](review/DEPLOYMENT.md). Hosting remains disabled until the publication gate passes. General contact: hello@provamusic.com; support: support@provamusic.com.
