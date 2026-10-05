# prova-site

The public privacy policy, terms of service and support page for the Prova app,
served by GitHub Pages from `docs/` at https://mehmetaydin3.github.io/prova-site.
The app links to `/privacy`, `/terms` and `/support` (`AppLinks.website`).

**Status: draft.** GitHub Pages is off until every placeholder is filled.

## Editing

- `src/privacy-policy.md`, `src/terms-of-service.md`: the legal text. The
  canonical copies, with review notes, live in the app repo under `docs/legal/`;
  these copies have the notes removed. Keep the two in step.
- `values.json`: the placeholder values (`[ENTITY NAME]`, `[SUPPORT EMAIL]`,
  `[POSTAL ADDRESS]`, `[WEBSITE]`, `[REGION]`, `[BACKUP DAYS]`, `[REPORT DAYS]`,
  `[LOG DAYS]`, `[EMAIL PROVIDER]`, `[STATE]`, `[COPYRIGHT AGENT]`, `[DATE]`).
- The support and landing pages are written in `build.py`.

## Building

```sh
python3 -m venv .venv && .venv/bin/pip install markdown
.venv/bin/python build.py --out docs            # draft: banner, placeholders visible
.venv/bin/python build.py --out docs --publish  # refuses while any placeholder is unfilled
```
