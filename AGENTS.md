# AGENTS.md

## Layout & entrypoints
- Next.js 16 App Router, plain JavaScript; `jsconfig.json` maps `@/*` to `src/*`. App code is in `src/app`, components in `src/components`, data helpers in `src/lib`.
- There is no top-level `components/` directory anymore; all components live in `src/components` and imports resolve `@/components` to `src/components`.
- `README.md` is the untouched create-next-app template (points at `app/page.js` and Geist). The real layout uses `Inter` from `next/font/google`. Trust source/config over README.

## Commands
- Scripts are only `npm run dev`, `npm run build`, `npm start`, `npm run lint`. No test/codegen/pre-commit/CI setup; TypeScript is checked inside `next build`, so verify with `npm run build` (plus `npm run lint`).
- `npm run lint` runs bare `eslint` using the flat config in `eslint.config.mjs` (next/core-web-vitals). It should exit 0 with no errors and no warnings.
- `next.config.mjs` enables `reactCompiler: true`, pins `turbopack.root` to the repo root, registers `@tailwindcss/turbopack` for `*.css`, and allows remote `next/image` sources from `loqsvylndmyfntuaecxd.supabase.co` (`/storage/v1/object/public/**`). Don't remove the CSS loader rule.

## Content model (Markdown + Supabase)
- Local Markdown still lives in `content/events/*.md` and `content/international-competitions/*.md`, parsed with `gray-matter`. The slug is the filename without `.md`.
- `src/lib/events.js` and `src/lib/internationalCompetitions.js` now export **async** helpers (`getAllEvents`, `getEventBySlug`, `getAllInternationalCompetitions`, `getInternationalCompetitionBySlug`). They merge local Markdown with Supabase rows from `articles` (`type: 'event'` / `type: 'international'`). All callers must `await` them.
- `src/lib/sportifsSemaine.js` is async too (`getAllSportifs`, `getSportifById`); the static `portraits` export remains only for `generateStaticParams()`. It merges local entries + folder photos with `sportifs_semaine` rows.
- `src/lib/vitrine.js` exposes `getMomentsForts()` (`vitrine_items.section = 'moment_fort'`) and `getPortraitsExclusifs()` (`section = 'portrait_exclusif'`), merging local fallbacks with Supabase rows ordered by `ordre`. `src/components/ExclusivePortraits.js` receives them via the `items` prop.
- `src/lib/gallery.js` → `getGalleryImages()` aggregates events, international competitions, weekly portraits, moments forts and exclusive portraits. `/galerie` uses it, so every new admin item appears automatically.
- `src/lib/supabase/records.js` normalizes images (`src/url/path`, `alt`, `legend`, `credit`), decodes JSON columns, slugifies titles and merges collections by slug (local first, remote overrides).
- Date frontmatter: `date: "YYYY-MM-DD"` renders as a long French date; without it use `season` (`Saison ...`) or get "Date à confirmer". Preserve the non-ASCII filename `aubinèsimo-lions.jpg` verbatim.
- Public data pages set `revalidate = 3600`; `sitemap.ts` is async and lists every merged slug. `/admin` is `noindex` via layout metadata and disallowed in `robots.ts`.

## Admin (Supabase)
- `.env.local` (gitignored) must define `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; the checked-in file contains a placeholder key and must be replaced with the real publishable key, then the server restarted.
- `src/lib/supabase/{config,client,publicClient,server,admin,content,records}.js` hold the SSR/browser/public clients and mappers. `isSupabaseConfigured` rejects placeholder/short keys so the public site still renders from Markdown when Supabase isn't set up.
- `/admin/login` signs in with `supabase.auth.signInWithPassword`; `/admin/page.js` then requires a profile with `role: admin` and `statut: actif`. Profile lookup tries configured tables then `utilisateurs`, `users`, `profiles`, `user_profiles`, `admin_users`, matching `id`/`auth_user_id`/`user_id`/`uid` or `email`/`user_email`/`mail`. Unauthorized users get an "Accès refusé" screen, not the dashboard.
- `/admin` is mobile-first: 5 large rubric buttons → dedicated form + published list with edit/delete. Sections: international competitions and events (`articles`), sportifs de la semaine (`sportifs_semaine`), moments forts and portrait exclusif (`vitrine_items`).
- Files are uploaded directly from the browser to Supabase Storage bucket **`media`** as `<section>/aubin-simo-bilderfassung-<slug du titre>-<timestamp>.<ext>`. The timestamp comes from `getUploadTimestamp()` in `src/lib/upload.js` via the server `uploadTimestamp` prop, so no impure `Date.now()` runs during a React render. An empty alt field falls back to `Aubin Simo - Bilderfassung <titre>`; credit is always `Aubin Simo`. Vitrine rows store the public URL in both `image` and `image_url`, plus `alt`.
- All writes go through `src/app/admin/actions.js` server actions (`'use server'`), which re-check admin authorization and whitelist the three tables before insert/update/delete. A discreet `Admin` link sits in the footer.

## Médias & performances
- Before upload, `src/lib/imageCompression.js` → `compressImageForUpload()` resizes each photo client-side with a Canvas to a max width of **1600 px** (ratio preserved) and encodes it as **WebP quality 0.82**, falling back to JPEG when WebP isn't supported. GIF/SVG/AVIF and unreadable images are uploaded unchanged. The SEO filename `aubin-simo-bilderfassung-<slug>-<timestamp>.<ext>` uses the compressed blob's extension (`webp`/`jpg`), not the original one.
- `uploadFileBase()` in `src/lib/upload.js` slugifies the title without accents/spaces; `getUploadTimestamp()` supplies the timestamp server-side to avoid impure `Date.now()` in React renders.
- Deleting a row in `/admin` removes its images from the `media` bucket **after** the database delete, via `removeUnusedMedia()` in `actions.js`. Sources are collected from `images`, `image`, `image_url`, `cover_image`, `photos`, `image_urls`; public URLs are converted back to relative storage paths. Images still referenced by another allowed table are kept. Storage errors never block or roll back the content deletion.
- Galleries are paginated client-side in chunks of **18**: `src/components/GalerieGrid.js` (used by `/galerie`, with a counter and « Charger plus de photos (n) » button) and `src/components/Gallery.js` (event/competition lightbox grids). Only the visible slice renders `next/image` elements; the lightbox still receives the full slide list.

## Sportifs de la semaine
- Local photos are read server-side with `fs` from `public/images/sportifs-semaine/<id>/` (`.jpg/.jpeg/.png/.webp`, sorted). First file is the cover; empty/missing folders fall back to `DEFAULT_OG_IMAGE`.
- `src/components/SportifsDeLaSemaine.js` is a client component fed by `getAllSportifs()`. Below `md`: scroll-snap carousel, swipe hint and dynamic pagination. From `md`: grid; at `lg` the featured card spans 7 columns and the two secondary cards stack vertically in the remaining 5 columns via an inner `lg:grid lg:grid-cols-1` wrapper. Cards link to `/sportifs-semaine/[id]`, show badge + photo count and `nom - poste - competition`; CTA links to `/galerie`.

## SEO
- Site URL/canonical defaults and `pageMetadata()` live in `src/lib/seo.js`; per-route metadata inherits the `%s | Bilderfassung` template from `src/app/layout.js`.
- `src/app/sitemap.ts` and `src/app/robots.ts` are the only TypeScript files, hence `tsconfig.json` and the `@types/*` devDependencies. Sitemap URLs for sports come from `listeSports` in `src/lib/sports.js`, shared with `/sports`.

## Operational
- `/contact` posts to Formspree from the client form in `src/app/contact/ContactForm.js`; `src/app/contact/page.js` stays a server component for metadata.
- UI copy and content are French; keep new copy in French. The exact Navbar/Footer order lives in `src/lib/navigation.js`. Contact details use `bilderfassung@gmail.com`, `Aubin Simo`, `Bilderfassung - L'œil du sport`, and WhatsApp `+237 676 978 878`.
- Vercel is the deploy target (per git history); there are no deploy configs or workflows in the repo.
