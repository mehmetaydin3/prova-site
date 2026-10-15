import puppeteer from "puppeteer-core";
const CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const root = process.env.SITE_ROOT ?? new URL("../..", import.meta.url).pathname.replace(/\/$/, "");
const out = `${root}/prototypes/screenshots`;
const targets = [
  ["a", `file://${root}/prototypes/a/index.html#still`], ["b", `file://${root}/prototypes/b/index.html#still`],
  ["c", `file://${root}/prototypes/c/index.html#still`], ["d", `file://${root}/prototypes/d/index.html#still`],
  ["site-index", `file://${root}/docs/index.html#still`], ["site-privacy", `file://${root}/docs/privacy.html`], ["site-week", `file://${root}/docs/the-week/index.html#still`],
];
const browser = await puppeteer.launch({ executablePath: CH, headless: true, args: ["--disable-gpu", "--hide-scrollbars"] });
const page = await browser.newPage();
for (const [name, url] of targets) for (const scheme of ["light", "dark"]) for (const [dev, vp] of [["desktop", { width: 1440, height: 900, deviceScaleFactor: 1 }], ["mobile", { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
  await page.setViewport(vp);
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
  await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: `${out}/${name}-${dev}-${scheme}.png` });
  if (scheme === "light") {
    // scroll through once so scroll-linked state (the spine, the playhead) reflects a read page, then capture whole
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } scrollTo(0, 0); });
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: `${out}/${name}-${dev}-full-light.png`, fullPage: true });
  }
  const w = await page.evaluate(() => [innerWidth, document.documentElement.scrollWidth]);
  console.log(name, dev, scheme, "viewport", w[0], "scrollWidth", w[1], w[1] > w[0] ? "OVERFLOW" : "ok");
}
await browser.close();
