/**
 * Public base path (set at build time via NEXT_PUBLIC_BASE_PATH).
 *
 * GitHub Pages serves the site under /<repo-name>/, so we prefix every
 * absolute asset URL and fetch URL we control with this. Empty string in
 * dev and on root-domain hosts.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

/** Prefix an absolute path (one starting with `/`) with BASE_PATH. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path
  return `${BASE_PATH}${path}`
}
