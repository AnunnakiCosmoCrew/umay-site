# Self-hosted fonts

Served by umayconnect.org itself; no font service and no request to another host. The same
files luvita.tr serves (`luvita-web/src/assets/fonts/`), copied unmodified on 2026-11-17.

| File | Family | Subset | Source |
| --- | --- | --- | --- |
| `bricolage-grotesque-latin-wght.woff2` | Bricolage Grotesque, variable weight 200–800 | Latin | `@fontsource-variable/bricolage-grotesque` 5.3.0 (Google Fonts build, unmodified) |
| `bricolage-grotesque-latin-ext-wght.woff2` | same | Latin Extended (Turkish ğ ı İ ş) | same |
| `ibm-plex-mono-latin-400.woff2` | IBM Plex Mono, 400 | Latin | `@fontsource/ibm-plex-mono` 5.3.0 (Google Fonts build, unmodified) |
| `ibm-plex-mono-latin-ext-400.woff2` | same | Latin Extended | same |

Licences (checked in each font's own repository on 2026-11-16 for luvita.tr):

- Bricolage Grotesque: SIL Open Font License 1.1, https://github.com/ateliertriay/bricolage
  (`OFL-bricolage-grotesque.txt`).
- IBM Plex Mono: SIL Open Font License 1.1 with Reserved Font Name "Plex",
  https://github.com/IBM/plex (`OFL-ibm-plex-mono.txt`). The files are redistributed
  unmodified; do not re-subset or edit them under the Plex name.

`fonts.css` holds the `@font-face` rules; the landing pages and `demo.html` link it.
`call.html` and `embed.js` use the system font (the embed runs on a customer's own site).
