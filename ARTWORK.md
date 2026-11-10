# Profile artwork

Original profile direction for **Rymbek Nazerke — AI Engineer**: a lavender night-time AI atelier, mint signal accents, and a contribution-calendar trail.

## Assets

- `assets/ai-atelier.webp`: 960 × 320, 80 frames, 8-second seamless loop. The source illustration was created with the built-in Codex ImageGen tool; the loop adds gentle star twinkles and a travelling neural signal.
- `assets/ai-atelier-static.webp`: reduced-motion cover.
- `assets/focus*.svg`: rotating focus labels and a static alternative.
- `assets/stack-*.svg`: theme-aware toolkit panels, with a separate mobile layout.
- `assets/activity/*`: animated and static contribution calendars in both themes and sizes; the dated JSON snapshot contains the underlying values.

All illustration and SVG layouts were prepared for this profile. No artwork, contacts, projects, or identity details were copied from another profile. These are decorative animations, not live training or model-performance displays.

## Activity data

The generator reads the publicly visible GitHub contribution calendar for `nazek52`. It records 26 complete Sunday–Saturday weeks and excludes the current partial week. It fails on missing dates or unrecognized counts instead of inventing data. Dates use Asia/Qyzylorda for the refresh cutoff. A weekly GitHub Actions job updates the assets, and can also be run manually.

## Rebuild

Node.js 20 or newer is sufficient for the calendar; it has no package dependencies:

```sh
node scripts/build-profile.mjs
```

To recreate the cover animation from the original generated PNG:

```sh
npm ci
node scripts/build-banner.mjs /path/to/ai-atelier-source.png
```

The full-resolution source is kept with the local design files. Only the optimized cover assets are published here.

## ImageGen prompt

Generated with the built-in image tool (not the API/CLI fallback):

Use case: stylized-concept. Create one original pixel-art illustration for a GitHub profile cover of an AI engineer named Rymbek Nazerke. Extra-wide landscape 3:1 composition, ideally 1536x512. A serene futuristic night-time research studio viewed in side elevation, with a large panoramic window onto a distant small city and a starry lavender sky. A tidy desk with two screens displaying abstract neural-network nodes and tiny charts (no readable text), softly glowing turquoise electronics, a small houseplant and a few pale lily flowers as a personal accent. No people. Crisp intentional 16-bit game pixel-art, consistent block pixels and restricted palette, sophisticated and detailed rather than childish. Deep midnight navy, muted lavender, dusty rose, subtle turquoise and warm amber lights. Moon near upper right, open dark sky/window area in the upper half for subtle animated twinkles added later; furnishings concentrated in the lower half, desk slightly left of centre. Wide cinematic calm composition, strong silhouettes, beautiful layered depth. Make a complete single scene, no grid, no frames, no text, no titles, no letters, no brands, no watermark. Do not reproduce an existing medieval game or another user's banner; this is an original modern AI atelier.
