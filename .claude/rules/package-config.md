---
paths:
  - "package.json"
  - "bun.lock"
  - "bun.lockb"
  - "package-lock.json"
  - "eslint.config.mjs"
  - "vite.config.ts"
  - "tsconfig.json"
  - ".env*"
  - "baas-manifest.json"
  - "index.html"
---

# Package and platform configuration

- Keep exactly one valid Bun or npm lockfile and use the matching dependency and script commands.
  A deliberate migration may replace the profile when it leaves no competing lockfile.
- The template's Vite config, TypeScript alias, plugins, scripts, and entry module are defaults.
  Change them only for the requested application and keep `validate` and `build` runnable.
- Project Vite config controls the static build; platform live preview uses a separate harness.
  Verify both paths after config, alias, plugin, entry, or public asset changes.
- Do not start a dev server or use ports 3000, 8082, or 8084.
- Do not create `.env*` files except placeholder-only `.env.example`.
- While BaaS is active, synchronize the SDK skill/version/channel manifest, project meta, SDK
  script, and bootstrap. Remove them together only when the project intentionally detaches from BaaS.
