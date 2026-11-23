# AGENTS.md

## Layout & entrypoints
- Next.js 16 App Router, plain JavaScript; `jsconfig.json` maps `@/*` to `src/*`. App code is in `src/app`, components in `src/components`, data helpers in `src/lib`.
- There is no top-level `components/` directory anymore; all components live in `src/components` and imports resolve `@/components` to `src/components`.
- `README.md` is the untouched create-next-app template (points at `app/page.js` and Geist). The real layout uses `Inter` from `next/font/google`. Trust source/config over README.

## Commands
- Scripts are only `npm run dev`, `npm run build`, `npm start`, `npm run lint`. No test/codegen/pre-commit/CI setup; TypeScript is checked inside `next build`, so verify with `npm run build` (plus `npm run lint`, see below).
- `npm run lint` runs bare `eslint` using the flat config in `eslint.config.mjs` (next/core-web-vitals). It exits 0 with no errors and no warnings.
- `next.config.mjs` enables `reactCompiler: true`, pins `turbopack.root` to the repo root to avoid the out-of-repo lockfile warning, and registers `@tailwindcss/turbopack` as the loader for `*.css`. Tailwind v4 styling depends on that rule; don't remove it. Global styles are just `@import "tailwindcss"` in `src/app/globals.css`.

## Content model (no CMS)
- Site data is local Markdown: `content/events/*.md` and `content/international-competitions/*.md`, parsed with `gray-matter` in `src/lib/events.js` and `src/lib/internationalCompetitions.js`. The slug is the filename without `.md`; add a page by adding a file.
- Event/competition frontmatter: `date: "YYYY-MM-DD"` is required for correct sort/format; without a valid date use `season` (renders `Saison ...`), otherwise it shows "Date à confirmer". `images` can be plain paths or objects `{ src, alt, legend, credit }`; `src/components/Gallery.js` normalizes both and feeds event/competition lightboxes. `coverImage` feeds cards.
- `/galerie` aggregates images from events only; international-competition images are not included.
- `/sports` cards come from `listeSports` in `src/lib/sports.js`, while `/sports/[slug]` matches events on case-insensitive `sport` frontmatter. Adding a sport requires updating that list and adding matching event content.
- International-competition slugs are validated against `^[a-z0-9-]+$`; event detail routes read `content/events/<slug>.md` directly and render an in-page "Événement non trouvé" instead of calling `notFound()`.
- Image paths are plain strings under `public/images`, not imports. The `/images/placeholder.jpg` fallback was missing; fallbacks now use `DEFAULT_OG_IMAGE` from `src/lib/seo.js`. One filename contains a non-ASCII `è` (`aubinèsimo-lions.jpg`) and its content reference matches exactly — copy the string verbatim when editing. Verify paths against `public/images` when adding content.
- UI copy and content are French; keep new copy in French.

## Sportifs de la semaine
- Entries live in `src/lib/sportifsSemaine.js`; photos are read server-side with `fs` from `public/images/sportifs-semaine/<id>/` (`.jpg/.jpeg/.png/.webp`, sorted). The first file is the home card cover, all files feed `/sportifs-semaine/[id]` and its client lightbox. To add a portrait, add an entry plus a folder with the same `id`; an empty/missing folder falls back to `DEFAULT_OG_IMAGE`.
- `src/components/SportifsDeLaSemaine.js` renders the home section and links cards to the portrait page (not straight to the event). The portrait page back link targets `/#sportifs-semaine`, the section id.

## SEO
- Site URL/canonical defaults and `pageMetadata()` live in `src/lib/seo.js`; per-route metadata inherits the `%s | Bilderfassung` template from `src/app/layout.js`.
- `src/app/sitemap.ts` and `src/app/robots.ts` are the only TypeScript files, hence `tsconfig.json` and the `@types/*` devDependencies in an otherwise JS project. Sitemap URLs for sports come from `listeSports` in `src/lib/sports.js`, shared with `/sports`.

## Operational
- `/contact` posts to Formspree from the client form in `src/app/contact/ContactForm.js`; `src/app/contact/page.js` stays a server component for metadata. `.env*` is gitignored.
- Vercel is the deploy target (per git history); there are no deploy configs or workflows in the repo.
