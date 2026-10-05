#!/usr/bin/env python3
"""Build the Prova legal site (privacy, terms, support) from the legal markdown.

    python3 build.py --values values.json --out docs [--publish]
    python3 build.py --values values.json --out preview --preview

- Sources are src/privacy-policy.md and src/terms-of-service.md (copies of
  docs/legal/ in the app repo). Every HTML comment is stripped first: the app
  repo's copies carry counsel and reviewer notes that must never be published.
- [PLACEHOLDERS] are filled from values.json. Without --publish, a missing value
  stays visible and every page carries a "Draft" banner. With --publish, any
  missing value is an error and nothing is written.
- --preview writes the same pages for a single-origin preview: links use .html
  and the landing page omits its document wrapper (the preview host adds one).
- Styling follows the Prova design-pass spec (2026-10-05): Prova colour tokens
  in light and dark, the system font, 17px/1.55 body, one 68ch column, 16px
  gutters, semibold sentence-case headings, the app icon at 64px.
"""
import argparse, html, json, pathlib, re, sys

import markdown

HERE = pathlib.Path(__file__).resolve().parent
PLACEHOLDERS = ["ENTITY NAME", "SUPPORT EMAIL", "POSTAL ADDRESS", "WEBSITE", "REGION",
                "BACKUP DAYS", "REPORT DAYS", "LOG DAYS", "EMAIL PROVIDER", "STATE",
                "COPYRIGHT AGENT", "DATE"]
PLACEHOLDER_RE = re.compile(r"\[(" + "|".join(re.escape(p) for p in PLACEHOLDERS) + r")\]")

SUPPORT_MD = """\
# Support

Questions, problems, or something that doesn't feel right? Email us at
[SUPPORT EMAIL]. Tell us which device you're on and what happened, and we'll
take it from there. You can get back to this page from the app at any time:
**Profile → Contact support**.

## Common questions

### I forgot my password

On the sign-in screen, enter your email and tap **Forgot your password?** We'll
email you a link that opens Prova so you can choose a new one.

### How do I join my teacher?

Go to **Profile → Join a teacher** and enter the code your teacher gave you.
You can also use Prova on your own, without a teacher.

### Someone sent me something that isn't OK

Press and hold the message or comment and choose **Report**. Reports come to
us, not to the person you reported, and we review every one within 24 hours.
You can also block them from the same menu. If someone is in immediate danger,
contact emergency services first.

### How do I delete my account?

Go to **Profile → Delete account**. It removes your account and everything in
it, including your recordings, straight away. The
[privacy policy](privacy) lists exactly what's deleted.

### Who can use Prova?

Prova is for people aged 13 and over.

## More

- [Privacy policy](privacy)
- [Terms of service](terms)
"""

INDEX_MD = """\
# The week between lessons

Prova helps music students practise and helps their teachers guide them.

- [Privacy policy](privacy)
- [Terms of service](terms)
- [Support](support)
"""

DARK = ("--bg:#131019;--text:#F4F2FA;--text2:#ABA6BC;--link:#9992FC;--rule:rgba(244,242,250,.14);"
        "--draft-bg:#3A2E0A;--draft-text:#FFE7A8;--draft-rule:#6B5512;color-scheme:dark")
CSS = """
:root{--bg:#F7F6FB;--text:#1A1726;--text2:#5B566E;--link:#473CDD;--rule:rgba(26,23,38,.12);--draft-bg:#FFF4D6;--draft-text:#5A3E00;--draft-rule:#E8C871;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){%(dark)s}}
:root[data-theme="dark"]{%(dark)s}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%%}
body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:17px;line-height:1.55;overflow-wrap:break-word}
main,header,footer{max-width:68ch;margin:0 auto;padding-inline:16px}
header{padding-top:32px}
header a{display:inline-flex;align-items:center;gap:12px;color:var(--text);text-decoration:none;font-weight:600}
header img{width:64px;height:64px;border-radius:22%%;display:block}
h1,h2,h3{font-weight:600;line-height:1.25;text-wrap:balance}
h1{font-size:2rem;margin:24px 0 8px}
h2{font-size:1.35rem;margin:40px 0 8px}
h3{font-size:1.1rem;margin:28px 0 4px}
strong{font-weight:600}
a{color:var(--link);text-underline-offset:2px}
a:focus-visible{outline:2px solid var(--link);outline-offset:2px;border-radius:2px}
em{color:var(--text2);font-style:normal}
hr{border:0;border-top:1px solid var(--rule);margin:32px 0}
.table{overflow-x:auto}
table{border-collapse:collapse;width:100%%;font-size:.95em}
th,td{text-align:left;vertical-align:top;padding:8px 12px 8px 0;border-bottom:1px solid var(--rule)}
th{font-weight:600}
th:first-child,td:first-child{width:36%%}
footer{color:var(--text2);padding-bottom:48px;margin-top:48px}
footer a{color:var(--text2)}
footer p{font-size:.9em;margin:0;padding-top:24px;border-top:1px solid var(--rule)}
.draft{background:var(--draft-bg);color:var(--draft-text);border-bottom:1px solid var(--draft-rule);padding:10px 16px;text-align:center;font-weight:600}
""" % {"dark": DARK}

HEAD = """<title>{title}</title>
<meta name="description" content="{description}">
<link rel="icon" href="icon.png">
<style>{css}</style>"""
BODY = """{draft}<header><a href="./"><img src="icon.png" alt="" width="64" height="64">Prova</a></header>
<main>
{body}
</main>
<footer>
<p><a href="privacy">Privacy policy</a> · <a href="terms">Terms of service</a> · <a href="support">Support</a><br>
© {year} {entity}</p>
</footer>"""
DOCUMENT = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{head}
</head>
<body>
{body}
</body>
</html>
"""

PAGES = [
    # (output name, source, H1, <title>, description)
    ("privacy.html", "privacy-policy.md", "Privacy policy", "Prova privacy policy",
     "What information Prova collects, who can see it, and how to delete it."),
    ("terms.html", "terms-of-service.md", "Terms of service", "Prova terms of service",
     "The agreement between you and Prova."),
    ("support.html", None, None, "Prova support", "How to get help with Prova."),
    ("index.html", None, None, "Prova", "Prova, the music-practice app for students and teachers."),
]


def fill(md, values):
    website = values.get("WEBSITE", "").rstrip("/")
    email = values.get("SUPPORT EMAIL")
    if website:
        md = md.replace("([WEBSITE]/", f"({website}/")  # inside a markdown link target
        md = re.sub(r"\[WEBSITE\](/[a-z]+)?",
                    lambda m: f'<a href="{website}{m.group(1) or ""}">{website}{m.group(1) or ""}</a>', md)
    if email:
        md = md.replace("[SUPPORT EMAIL]", f'<a href="mailto:{email}">{email}</a>')
    for key, val in values.items():
        if key not in ("WEBSITE", "SUPPORT EMAIL"):
            md = md.replace(f"[{key}]", html.escape(str(val)))
    return md, sorted(set(PLACEHOLDER_RE.findall(md)))


def render(md):
    out = markdown.markdown(md, extensions=["tables", "sane_lists"], output_format="html")
    return out.replace("<table>", '<div class="table"><table>').replace("</table>", "</table></div>")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=str(HERE / "src"))
    ap.add_argument("--values", default=str(HERE / "values.json"))
    ap.add_argument("--icon", default=str(HERE / "src" / "icon.png"))
    ap.add_argument("--out", required=True)
    mode = ap.add_mutually_exclusive_group()
    mode.add_argument("--publish", action="store_true")
    mode.add_argument("--preview", action="store_true")
    a = ap.parse_args()

    values = {k: v for k, v in json.loads(pathlib.Path(a.values).read_text()).items() if v not in (None, "")}
    website = values.get("WEBSITE", "").rstrip("/")
    date = values.get("DATE", "")
    year = date[:4] if re.match(r"\d{4}", date) else "2026"
    entity = html.escape(values.get("ENTITY NAME", "[ENTITY NAME]"))

    pages, all_missing = [], set()
    for name, src, h1, title, desc in PAGES:
        if src:
            md = pathlib.Path(a.src, src).read_text()
            md = re.sub(r"<!--.*?-->", "", md, flags=re.S)  # never publish review notes
            md = re.sub(r"^# .*$", f"# {h1}", md, count=1, flags=re.M)
        else:
            md = SUPPORT_MD if name == "support.html" else INDEX_MD
        md, missing = fill(md, values)
        all_missing |= set(missing)
        pages.append((name, title, desc, render(md)))

    if a.publish and all_missing:
        sys.exit(f"refusing to publish, unfilled: {', '.join(sorted(all_missing))}")

    out = pathlib.Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    draft = "" if a.publish else '<div class="draft">Draft — not published</div>\n'
    for name, title, desc, body in pages:
        if a.preview and name == "index.html":
            title = "Prova legal site"
        head = HEAD.format(title=title, description=desc, css=CSS)
        page_body = BODY.format(draft=draft, body=body, year=year, entity=entity)
        doc = head + "\n" + page_body + "\n" if (a.preview and name == "index.html") else \
            DOCUMENT.format(head=head, body=page_body)
        if a.preview:
            doc = re.sub(r'href="(privacy|terms|support)"', r'href="\1.html"', doc).replace('href="./"', 'href="index.html"')
            if website:
                doc = re.sub(r'href="' + re.escape(website) + r'/(privacy|terms|support)"', r'href="\1.html"', doc)
        assert "<!--" not in doc, f"comment leaked into {name}"
        (out / name).write_text(doc)
    (out / "icon.png").write_bytes(pathlib.Path(a.icon).read_bytes())
    if not a.preview:
        (out / ".nojekyll").write_text("")
    kind = "publish" if a.publish else "preview" if a.preview else "draft"
    print(f"built {len(pages)} pages into {out} ({kind})")
    if all_missing:
        print("unfilled:", ", ".join(sorted(all_missing)))


if __name__ == "__main__":
    main()
