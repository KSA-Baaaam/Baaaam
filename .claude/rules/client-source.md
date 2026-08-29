---
paths:
  - "src/**/*.{ts,tsx,js,jsx}"
---

# Client source contract

- Use the regular Vite browser pipeline. The template's `@/` alias, React/Tailwind setup,
  project-local `src/components/ui` Radix facade, and TanStack Query packages are available
  defaults, not a fixed source structure.
- Let the actual live transform, typecheck, lint, and static build determine dependency and
  bundler compatibility; do not preserve constraints from the legacy in-browser/WASM renderer.
- BrowserRouter basename must derive from `import.meta.env.BASE_URL`.
- While BaaS is active, keep its bootstrap synchronized and use only `window.BaasSDK` for BaaS
  browser features; do not use raw BaaS `fetch` or axios calls.
