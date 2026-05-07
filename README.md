# Maple Key

A Canadian K-12 educational resource discovery platform for teachers.

Single-page React app, built with Vite, deployed to GitHub Pages from
`main/docs`.

## Live site

**https://kenpeterson2112.github.io/v0-maple-key-website/**

## Stack

- React 19
- Vite 6
- Tailwind CSS v4
- Radix UI (Popover, Dialog) for primitives
- framer-motion for animation
- SWR for the static `resources.json` fetch

## Develop

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints (typically http://localhost:5173).

## Build

```bash
pnpm build
```

Outputs a static site in `dist/`. For a build with the GitHub Pages
sub-path baked in:

```bash
VITE_BASE_PATH=/v0-maple-key-website/ pnpm build
```

## Deployment

Automatic. On every push to `main`, `.github/workflows/deploy.yml`:

1. Builds with `VITE_BASE_PATH=/v0-maple-key-website/`.
2. Replaces the `docs/` folder with the new `dist/` output.
3. Commits the result back to `main` with `[skip ci]` (the marker
   prevents an infinite loop).

GitHub Pages serves from `main/docs/`.

### One-time Pages setup

In repo Settings → Pages:

- **Source:** *Deploy from a branch*
- **Branch:** `main` / `/docs`

A `.nojekyll` file is dropped into `docs/` by the workflow so GitHub
Pages bypasses Jekyll and serves the assets verbatim.
