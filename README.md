# Maple Key website

A Canadian K-12 educational resource discovery platform for teachers. Static
Next.js site, hosted on GitHub Pages.

## Live site

**https://kenpeterson2112.github.io/v0-maple-key-website/**

Deployed automatically by `.github/workflows/deploy.yml` on every push to
`main`.

## Develop locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Build

```bash
pnpm build
```

Produces a static export in `out/`. For production builds intended for
GitHub Pages, set `NEXT_PUBLIC_BASE_PATH=/v0-maple-key-website` so absolute
asset URLs and `fetch("/resources.json")` resolve correctly under the repo
sub-path. The CI workflow already does this.

## Notes

- The app is fully client-side: it loads `public/resources.json` via SWR and
  filters in the browser. No server runtime required.
- Asset paths use the `withBasePath()` helper in `lib/base-path.ts` so the
  same code works under a sub-path on GitHub Pages and at the root in dev.
