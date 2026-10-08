# Domain and deployment preparation — 2026-10-07

## Verified state

Authenticated GitHub API: `mehmetaydin3/prova-site` is public, default branch `main`; available account has admin/push permissions. `GET /repos/mehmetaydin3/prova-site/pages` returns 404: Pages is not configured. Existing repository docs target GitHub Pages from `/docs`; reuse this static host, with no form backend or new service.

Cloudflare is authoritative for `provamusic.app` (`cesar.ns.cloudflare.com`, `teagan.ns.cloudflare.com`). System resolver and independent 1.1.1.1 checks found no apex A or www CNAME. HTTPS requests to apex/www fail DNS resolution. No live URL or deployed candidate exists.

`provamusic.com` public MX is `1 smtp.google.com.`; apex SPF is `v=spf1 include:_spf.google.com ~all`. This routes inbound mail to Google and authorizes Google outbound mail; it does not verify either named mailbox, alias, or successful delivery. No public TXT answer at `_dmarc.provamusic.com` or `resend._domainkey.provamusic.com`, and no MX/TXT answer at `send.provamusic.com`. Alternate Resend domains/selectors remain possible; account verification is unavailable. Resend is available to connect but is not authenticated. Cloudflare connector/account access is unavailable and no connected browser exists. No DNS or provider settings were changed. Preserve all `.com` records, including any records not discoverable by these queries.

## Local settings prepared

- Canonical website `https://provamusic.app`; marketing Open Graph URL and canonical metadata; legal/support page canonicals.
- General contact `hello@provamusic.com`; support and legal contact `support@provamusic.com`; working mailto targets. Opening a mail client is verified structurally; receiving mail is not verified.
- No contact form exists. Existing beta actions lead to local access/joining details, with no collection or delivery path. Beta destination remains empty pending an approved endpoint.
- Build emits CNAME, sitemap and robots only after `--publish` passes. Draft builds have noindex metadata; no public hosting is enabled.
- App/legal source repository is read-only; local website legal copies were rebuilt with confirmed contact values, without editing their underlying legal language.

## Exact publication blockers

`build.py --publish` refuses: `BACKUP DAYS`, `DATE`, `EMAIL PROVIDER`, `ENTITY NAME`, `LOG DAYS`, `POSTAL ADDRESS`, `REPORT DAYS`, `STATE`.

Founder must supply entity, postal address, state and rights-request response period. Confirm Supabase backup/log retention from the actual plan/configuration. Confirm whether Resend sends the app's auth emails before filling EMAIL PROVIDER (a provider name alone does not establish actual SMTP usage). Set DATE to the actual publication date once ready. Historical app captures also need founder launch approval; browser samples have no native audio. Never enable Pages against the draft `docs/` output.

## Dashboard checklist after the gate passes

1. Rebuild with `.venv/bin/python build.py --out docs --publish`; run `node --check site.js`, `python3 tools/check-site.py`, `git diff --check`; check all legal text has no placeholders. Commit the release output. Push the chosen approved commit without merging unrelated work.
2. GitHub repository **Settings → Pages**: deploy from the approved release branch, folder `/docs`; set custom domain **provamusic.app** before pointing DNS at GitHub. The generated `docs/CNAME` contains `provamusic.app`. GitHub account **Settings → Pages → Add a domain** provides a unique ownership-verification TXT value; copy its exact generated value, never invent one.
3. Cloudflare zone **provamusic.app → DNS → Records**: add the records below, TTL Auto, **DNS only** (gray cloud). Only change website records at `@` and `www`; preserve unrelated records and all `.com` email DNS. Inspect existing A/AAAA/CNAME at these two website names for conflicts before updating.

| Type | Name | Content |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | mehmetaydin3.github.io |

These are the host's exact [GitHub Pages requirements](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), checked 2026-10-07. No Cloudflare redirect rule is necessary: GitHub Pages redirects www to the configured apex. Do not use a www CNAME to the apex or include `/prova-site` in its value.

4. Wait for GitHub's DNS/certificate checks, enable **Enforce HTTPS**, then independently request `https://provamusic.app/`, `https://www.provamusic.app/`, HTTP variants and `/privacy`, `/terms`, `/support`. Verify www redirects to apex, certificates cover both names, no mixed content, assets return 200 and the deployed commit matches the candidate. HTTPS/redirects are currently unverified, not configured.
5. Google Workspace **Directory → Users / email aliases**: confirm `hello@provamusic.com` and `support@provamusic.com` exist and receive mail (a group is also acceptable). Send a test from an external account and confirm receipt/reply in the dashboard; this task has not sent messages. Do not replace Google MX with Cloudflare routing or Resend MX.
6. Resend **Domains**: inspect the actual verified sending domain, its exact SPF/DKIM records, status, and any Receiving configuration/webhook. Resend verification establishes sending only; receiving requires separately configured inbound routing. Use the values displayed in that account; none can be determined from available access. Keep all API/SMTP credentials server-side and never put them in this static site. See [Resend domain documentation](https://resend.com/docs/dashboard/domains/introduction).
