# Prova V9 local explorations

Based on preserved V7 commit `df96dd6`, branch `feat/prova-creative-explorations-v9`.

From this worktree, run:

```sh
python3 -m http.server 8099 --bind 127.0.0.1
```

Open http://localhost:8099/explorations/ (directions at `a/` and `b/`). No build or dependencies needed. Existing V7 remains at `/cinematic/`.

Both directions use authentic historical demo screenshots from `assets/product/`, explicitly identified as an earlier app design. The original editorial score, marks, waveform and camera transitions illustrate the product story; they are not app recordings. Beta CTA uses the existing site's interim email contact.

Generated HTML and score source: `tools/v9/build-explorations.py`. Shared styling and scroll choreography: `explorations/shared/`. Run the generator only when changing its source; CSS and JS are independent.

Browser captures and verification: `review/v9/`. Motion previews are silent animated PNGs assembled from 36 browser frames each. Reduced-motion visitors receive static compositions and all five workflow steps without the long sticky scroll.
