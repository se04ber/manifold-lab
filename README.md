# Manifold Lab

Interactive toy models of dimensional compactification and effective
lower-dimensional physics — built up step by step from a compact circle to
Kaluza–Klein towers.

This is **not** a string-theory simulator. Every visualization is a
schematic, dimensionally-reduced picture built to develop intuition for how
compactified geometry gives rise to effective lower-dimensional fields,
charges, and spectra.

## How it's built

```text
Julia (physics/)                 SvelteKit + Threlte (web/)
  reference geometry,      -->      TypeScript physics engine
  Kaluza–Klein reduction,           (same formulas, browser-side)
  geodesics, KK spectra                    |
  validated with GLMakie                   v
        |                          3D scene, equations, projection plot
        v
  fixtures/reference/*.json  <-->  reproduced by TypeScript tests
```

Julia is the scientific source of truth, not a runtime dependency of the
site: it derives and validates the physics and writes deterministic
reference fixtures; the deployed app only ever runs the TypeScript
`PhysicsEngine`, checked against those fixtures. Visitors never download
Julia, and GitHub Pages needs no server.

## Repository layout

```text
web/        SvelteKit + Svelte 5 app (Threlte/Three.js, KaTeX), deployed
            statically to GitHub Pages
physics/    Julia reference implementation + GLMakie visual validation
fixtures/   Deterministic reference data shared between the two
docs/       Physics background notes
```

## Developing

```bash
cd web
npm install
npm run dev -- --open
```

```bash
julia --project=physics
julia --project=physics test/runtests.jl
```

## Status

Early build-out, following an internal implementation plan milestone by
milestone (bootstrap → shared physics contract → reference model →
fixtures → experiments 01–04). Not yet deployed.
