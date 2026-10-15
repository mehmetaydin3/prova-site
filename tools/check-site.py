#!/usr/bin/env python3
"""Static release checks for source and built entry points; no browser substitute."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import json
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.ids, self.headings = [], set(), []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, 'duplicate id: ' + attrs['id']
            self.ids.add(attrs['id'])
        if tag in ('h1', 'h2', 'h3'):
            self.headings.append(tag)
        for key in ('href', 'src', 'poster'):
            if key in attrs:
                self.links.append(attrs[key])
        if tag == 'img':
            assert 'alt' in attrs, 'image needs alt text'
            assert 'width' in attrs and 'height' in attrs, 'image needs reserved geometry'
        if tag == 'video':
            assert 'autoplay' not in attrs, 'no automatic media download or playback'
            assert attrs.get('preload') == 'none', 'native media is opt-in'

for path in (ROOT / 'index.html', ROOT / 'docs/index.html'):
    page = Page()
    text = path.read_text()
    assert '<html lang="en"' in text
    page.feed(text)
    assert page.headings.count('h1') == 1
    for href in page.links:
        url = urlparse(href)
        if url.scheme or url.netloc:
            continue
        if url.path:
            assert (path.parent / unquote(url.path)).exists(), f'{path}: missing {href}'
        elif url.fragment:
            assert url.fragment in page.ids, f'{path}: missing anchor {href}'
    assert 'fonts.googleapis.com' not in text and '@font-face' not in text
    print(f'{path.relative_to(ROOT)}: links, anchors, semantics, media, image geometry OK')

for name in ('site.css', 'site.js'):
    assert (ROOT / name).read_bytes() == (ROOT / 'docs' / name).read_bytes()
assert (ROOT / 'shared/tokens.css').read_bytes() == (ROOT / 'prototypes/shared/tokens.css').read_bytes()
subprocess.run(['git', 'diff', '--exit-code', 'bc79c17', '--', 'prototypes'], cwd=ROOT, check=True)
print('Built source matches; A/B/C prototypes and the original token map preserved')

def luminance(hex_color):
    channels = [int(hex_color[i:i+2], 16) / 255 for i in (1, 3, 5)]
    linear = [c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4 for c in channels]
    return sum(c * weight for c, weight in zip(linear, (.2126, .7152, .0722)))

def contrast(a, b):
    high, low = sorted((luminance(a), luminance(b)), reverse=True)
    return (high + .05) / (low + .05)

pairs = [
    ('light body on canvas', '#1A1726', '#F7F6FB', 4.5),
    ('light secondary on canvas', '#6B6780', '#F7F6FB', 4.5),
    ('light CTA', '#FFFFFF', '#473CDD', 4.5),
    ('light link on canvas', '#473CDD', '#F7F6FB', 4.5),
    ('light warm text on canvas', '#C63D30', '#F7F6FB', 4.5),
    ('light field on canvas', '#8F8CA1', '#F7F6FB', 3),
    ('body on night', '#F4F2FA', '#060511', 4.5),
    ('secondary on raised', '#9A95AD', '#272235', 4.5),
    ('CTA', '#FFFFFF', '#675FE3', 4.5),
    ('CTA pressed', '#FFFFFF', '#574FD0', 4.5),
    ('link on raised', '#9992FC', '#272235', 4.5),
    ('control edge on raised', '#726C89', '#272235', 3),
    ('HC secondary on raised', '#B4B1C4', '#272235', 7),
    ('HC CTA', '#FFFFFF', '#4338DC', 7),
    ('HC control edge on raised', '#8F8AA3', '#272235', 4.5)
]
for name, a, b, floor in pairs:
    ratio = contrast(a, b)
    assert ratio >= floor, f'{name}: {ratio:.2f}:1 below {floor}:1'
    print(f'{name}: {ratio:.2f}:1')

with tempfile.TemporaryDirectory(prefix='prova-site-gate-') as directory:
    target = Path(directory) / 'output'
    values = json.loads((ROOT / 'values.json').read_text())
    values['ENTITY NAME'] = None
    gate_values = Path(directory) / 'incomplete-values.json'
    gate_values.write_text(json.dumps(values))
    gate = subprocess.run([str(ROOT / '.venv/bin/python'), 'build.py', '--out', str(target), '--values', str(gate_values), '--publish'], cwd=ROOT, capture_output=True, text=True)
    assert gate.returncode != 0 and 'refusing to publish, unfilled:' in gate.stderr
    assert not target.exists()
print('Publication gate refuses unfilled legal values before writing output')

for name, canonical in (("index", "/"), ("privacy", "/privacy"), ("terms", "/terms"), ("support", "/support")):
    text = (ROOT / "docs" / (name + ".html")).read_text()
    assert f'rel="canonical" href="https://provamusic.app{canonical}"' in text
assert 'href="mailto:hello@provamusic.app"' in (ROOT / "docs/index.html").read_text()
assert 'href="mailto:support@provamusic.app"' in (ROOT / "docs/support.html").read_text()
print("Canonical URLs and brief-approved .app contact targets OK")
