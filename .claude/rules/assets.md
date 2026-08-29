---
paths:
  - "src/**/*.{ts,tsx,js,jsx,css,scss}"
  - "src/assets/**"
  - "static/**"
---

# Asset contract

- Prefer importing bundled assets from `src/assets/**`.
- The template serves public files from `static/`, commonly `static/image/**` and
  `static/other/**`. Use `import.meta.env.BASE_URL` when constructing their runtime URLs.
- An intentional alternative asset layout is allowed only when platform live preview and the
  final static build both resolve the files correctly.
- Artifact metadata belongs at `.mbaas/artifacts-manifest.json`, outside the public asset tree.
