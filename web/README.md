# Manifold Lab — web

SvelteKit + Svelte 5 + Threlte app. See the [repository README](../README.md)
for the project as a whole; this file covers only commands specific to this
package.

```bash
npm install
npm run dev -- --open   # dev server
npm run check            # typecheck
npm run lint              # prettier + eslint
npm test                  # vitest (unit) + playwright (e2e)
npm run build              # static build, written to build/
```

`BASE_PATH` controls the deployed base path (set to `/manifold-lab` by CI when
building for GitHub Pages; empty for local dev and preview).
