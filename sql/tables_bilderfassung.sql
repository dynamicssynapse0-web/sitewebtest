-- Tables dédiées à Bilderfassung pour les rubriques déjà en production.
-- À exécuter dans le SQL Editor Supabase.
--
-- `event_bilderfassung` et `admin_bilderfassung` ne sont PAS concernés : ils
-- sont déjà migrés et restent inchangés. Les anciennes tables sont conservées
-- en secours ; le code les utilise automatiquement si une table ci-dessous
-- n'existe pas encore.

-- 1. Images Sport --------------------------------------------------------------
create table if not exists public.images_sport_bilderfassung (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text default '',
  cover_image text default '',
  images jsonb not null default '[]'::jsonb,
  ordre integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  alt text default '',
  description text default ''
);

alter table public.images_sport_bilderfassung enable row level security;

drop policy if exists "Images Sport Bilderfassung - lecture publique" on public.images_sport_bilderfassung;
create policy "Images Sport Bilderfassung - lecture publique"
  on public.images_sport_bilderfassung for select to anon, authenticated using (true);

drop policy if exists "Images Sport Bilderfassung - ecriture" on public.images_sport_bilderfassung;
create policy "Images Sport Bilderfassung - ecriture"
  on public.images_sport_bilderfassung for all to authenticated using (true) with check (true);

insert into public.images_sport_bilderfassung (
  id, slug, title, cover_image, images, ordre, created_at, updated_at, alt, description
)
select
  id, slug, title, cover_image,
  coalesce(nullif(images::text, ''), '[]')::jsonb,
  ordre, created_at, updated_at, alt, description
from public.images_sport
on conflict (id) do nothing;

-- 2. Catégories de sport -------------------------------------------------------
create table if not exists public.categories_sport_bilderfassung (
  id uuid primary key default gen_random_uuid(),
  discipline text default '',
  sous_discipline text default '',
  slug text unique,
  cover_image text default '',
  images jsonb not null default '[]'::jsonb,
  ordre integer default 0,
  created_at timestamptz not null default now()
);

alter table public.categories_sport_bilderfassung enable row level security;

drop policy if exists "Categories Sport Bilderfassung - lecture publique" on public.categories_sport_bilderfassung;
create policy "Categories Sport Bilderfassung - lecture publique"
  on public.categories_sport_bilderfassung for select to anon, authenticated using (true);

drop policy if exists "Categories Sport Bilderfassung - ecriture" on public.categories_sport_bilderfassung;
create policy "Categories Sport Bilderfassung - ecriture"
  on public.categories_sport_bilderfassung for all to authenticated using (true) with check (true);

insert into public.categories_sport_bilderfassung (
  id, discipline, sous_discipline, slug, cover_image, images, ordre, created_at
)
select
  id, discipline, sous_discipline, slug, cover_image,
  coalesce(nullif(images::text, ''), '[]')::jsonb,
  ordre, created_at
from public.categories_sport
on conflict (id) do nothing;

-- 3. Sportifs de la semaine ----------------------------------------------------
create table if not exists public.sportifs_semaine_bilderfassung (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text default '',
  player_name text default '',
  position text default '',
  competition text default '',
  discipline text default '',
  quote text default '',
  event_slug text default '',
  fallback_label text default '',
  cta text default '',
  featured boolean not null default false,
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  image text default '',
  cover_image text default '',
  updated_at timestamptz not null default now()
);

alter table public.sportifs_semaine_bilderfassung enable row level security;

drop policy if exists "Sportifs Bilderfassung - lecture publique" on public.sportifs_semaine_bilderfassung;
create policy "Sportifs Bilderfassung - lecture publique"
  on public.sportifs_semaine_bilderfassung for select to anon, authenticated using (true);

drop policy if exists "Sportifs Bilderfassung - ecriture" on public.sportifs_semaine_bilderfassung;
create policy "Sportifs Bilderfassung - ecriture"
  on public.sportifs_semaine_bilderfassung for all to authenticated using (true) with check (true);

insert into public.sportifs_semaine_bilderfassung (
  id, slug, title, player_name, position, competition, discipline, quote,
  event_slug, fallback_label, cta, featured, images, created_at, image,
  cover_image, updated_at
)
select
  id, slug, title, player_name, position, competition, discipline, quote,
  event_slug, fallback_label, cta, coalesce(featured, false),
  coalesce(nullif(images::text, ''), '[]')::jsonb,
  created_at, image, cover_image, updated_at
from public.sportifs_semaine
on conflict (id) do nothing;

-- 4. Vitrine (moments forts / portraits exclusifs) -----------------------------
create table if not exists public.vitrine_items_bilderfassung (
  id uuid primary key default gen_random_uuid(),
  section text default '',
  title text default '',
  subtitle text default '',
  image_url text default '',
  alt text default '',
  ordre integer default 0,
  created_at timestamptz not null default now(),
  image text default '',
  images jsonb not null default '[]'::jsonb,
  slug text,
  legend text default '',
  credit text default '',
  sport text default '',
  competition text default '',
  featured boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.vitrine_items_bilderfassung enable row level security;

drop policy if exists "Vitrine Bilderfassung - lecture publique" on public.vitrine_items_bilderfassung;
create policy "Vitrine Bilderfassung - lecture publique"
  on public.vitrine_items_bilderfassung for select to anon, authenticated using (true);

drop policy if exists "Vitrine Bilderfassung - ecriture" on public.vitrine_items_bilderfassung;
create policy "Vitrine Bilderfassung - ecriture"
  on public.vitrine_items_bilderfassung for all to authenticated using (true) with check (true);

insert into public.vitrine_items_bilderfassung (
  id, section, title, subtitle, image_url, alt, ordre, created_at, image,
  images, slug, legend, credit, sport, competition, featured, updated_at
)
select
  id, section, title, subtitle, image_url, alt, ordre, created_at, image,
  coalesce(nullif(images::text, ''), '[]')::jsonb,
  slug, legend, credit, sport, competition, coalesce(featured, false), updated_at
from public.vitrine_items
on conflict (id) do nothing;

-- 5. Publicités ----------------------------------------------------------------
create table if not exists public.ads_bilderfassung (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  advertiser text not null default '',
  slug text not null unique,
  placement text not null default 'accueil',
  link_url text not null default '',
  image text not null default '',
  alt text not null default '',
  date_debut date,
  date_fin date,
  active boolean not null default true,
  ordre integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ads_bilderfassung_placement_idx
  on public.ads_bilderfassung (placement, active, ordre);

alter table public.ads_bilderfassung enable row level security;

drop policy if exists "Publicites Bilderfassung - lecture publique" on public.ads_bilderfassung;
create policy "Publicites Bilderfassung - lecture publique"
  on public.ads_bilderfassung for select to anon, authenticated
  using (active = true
    and (date_debut is null or date_debut <= current_date)
    and (date_fin is null or date_fin >= current_date));

drop policy if exists "Publicites Bilderfassung - ecriture" on public.ads_bilderfassung;
create policy "Publicites Bilderfassung - ecriture"
  on public.ads_bilderfassung for all to authenticated using (true) with check (true);

insert into public.ads_bilderfassung (
  id, title, advertiser, slug, placement, link_url, image, alt,
  date_debut, date_fin, active, ordre, created_at
)
select
  id, title, advertiser, slug, placement, link_url, image, alt,
  date_debut, date_fin, coalesce(active, true), ordre, created_at
from public.ads
on conflict (id) do nothing;

-- 6. Clics sur les publicités ---------------------------------------------------
create table if not exists public.ad_clicks_bilderfassung (
  id bigint generated by default as identity primary key,
  ad_id uuid not null,
  placement text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists ad_clicks_bilderfassung_ad_id_idx
  on public.ad_clicks_bilderfassung (ad_id, created_at desc);

alter table public.ad_clicks_bilderfassung enable row level security;

drop policy if exists "Clics Bilderfassung - insertion" on public.ad_clicks_bilderfassung;
create policy "Clics Bilderfassung - insertion"
  on public.ad_clicks_bilderfassung for insert to anon, authenticated with check (true);

drop policy if exists "Clics Bilderfassung - lecture" on public.ad_clicks_bilderfassung;
create policy "Clics Bilderfassung - lecture"
  on public.ad_clicks_bilderfassung for select to authenticated using (true);

insert into public.ad_clicks_bilderfassung (id, ad_id, placement, created_at)
select id, ad_id, placement, created_at
from public.ad_clicks
on conflict (id) do nothing;

select setval(
  pg_get_serial_sequence('public.ad_clicks_bilderfassung', 'id'),
  greatest(coalesce((select max(id) from public.ad_clicks_bilderfassung), 1), 1),
  true
);

-- 7. Pages vues ----------------------------------------------------------------
create table if not exists public.site_pageviews_bilderfassung (
  id bigint generated by default as identity primary key,
  path text not null,
  created_at timestamptz not null default now()
);

create index if not exists site_pageviews_bilderfassung_created_at_idx
  on public.site_pageviews_bilderfassung (created_at desc);

alter table public.site_pageviews_bilderfassung enable row level security;

drop policy if exists "Pages vues Bilderfassung - insertion" on public.site_pageviews_bilderfassung;
create policy "Pages vues Bilderfassung - insertion"
  on public.site_pageviews_bilderfassung for insert to anon, authenticated with check (true);

drop policy if exists "Pages vues Bilderfassung - lecture" on public.site_pageviews_bilderfassung;
create policy "Pages vues Bilderfassung - lecture"
  on public.site_pageviews_bilderfassung for select to anon, authenticated using (true);

insert into public.site_pageviews_bilderfassung (id, path, created_at)
select id, path, created_at
from public.site_pageviews
on conflict (id) do nothing;

select setval(
  pg_get_serial_sequence('public.site_pageviews_bilderfassung', 'id'),
  greatest(coalesce((select max(id) from public.site_pageviews_bilderfassung), 1), 1),
  true
);
