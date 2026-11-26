-- Table dédiée aux articles événementiels de Bilderfassung.
-- À exécuter dans le SQL Editor Supabase. Elle remplace `articles` pour les
-- rubriques Événements et Grandes compétitions ; `articles` est conservé en
-- secours (le code retombe dessus si cette table n'existe pas encore).

-- 1. Nouvelle table ------------------------------------------------------------
create table if not exists public.event_bilderfassung (
  id uuid primary key default gen_random_uuid(),
  auteur_id uuid,
  titre text,
  type text not null default 'event' check (type in ('event', 'international')),
  title text,
  slug text not null unique,
  competition text,
  categorie text,
  sport text,
  date text,
  season text,
  location text,
  resume text,
  excerpt text,
  contenu text,
  content text,
  image_path text,
  image_alt text,
  cover_image text,
  image text,
  images jsonb not null default '[]'::jsonb,
  statut text not null default 'publie',
  publie_le timestamptz,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists event_bilderfassung_type_date_idx
  on public.event_bilderfassung (type, date desc);

alter table public.event_bilderfassung enable row level security;

-- Lecture publique : mêmes contenus que ceux exposés aujourd'hui par `articles`.
drop policy if exists "Événements Bilderfassung - lecture publique"
  on public.event_bilderfassung;
create policy "Événements Bilderfassung - lecture publique"
  on public.event_bilderfassung for select
  to anon, authenticated
  using (true);

-- Les Server Actions vérifient le rôle admin avant toute écriture.
drop policy if exists "Événements Bilderfassung - insertion" on public.event_bilderfassung;
create policy "Événements Bilderfassung - insertion"
  on public.event_bilderfassung for insert
  to authenticated
  with check (true);

drop policy if exists "Événements Bilderfassung - modification" on public.event_bilderfassung;
create policy "Événements Bilderfassung - modification"
  on public.event_bilderfassung for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Événements Bilderfassung - suppression" on public.event_bilderfassung;
create policy "Événements Bilderfassung - suppression"
  on public.event_bilderfassung for delete
  to authenticated
  using (true);

-- 2. Migration depuis `articles` -----------------------------------------------
insert into public.event_bilderfassung (
  id, auteur_id, titre, type, title, slug, competition, categorie, sport,
  date, season, location, resume, excerpt, contenu, content, image_path,
  image_alt, cover_image, image, images, statut, publie_le, featured,
  created_at, updated_at
)
select
  id, auteur_id, titre,
  coalesce(type, 'event'), title, slug, competition, categorie, sport,
  date, season, location, resume, excerpt, contenu, content, image_path,
  image_alt, cover_image, image, coalesce(images::jsonb, '[]'::jsonb), statut,
  publie_le, coalesce(featured, false), created_at, updated_at
from public.articles
on conflict (id) do update set
  auteur_id = excluded.auteur_id,
  titre = excluded.titre,
  type = excluded.type,
  title = excluded.title,
  slug = excluded.slug,
  competition = excluded.competition,
  categorie = excluded.categorie,
  sport = excluded.sport,
  date = excluded.date,
  season = excluded.season,
  location = excluded.location,
  resume = excluded.resume,
  excerpt = excluded.excerpt,
  contenu = excluded.contenu,
  content = excluded.content,
  image_path = excluded.image_path,
  image_alt = excluded.image_alt,
  cover_image = excluded.cover_image,
  image = excluded.image,
  images = excluded.images,
  statut = excluded.statut,
  publie_le = excluded.publie_le,
  featured = excluded.featured,
  updated_at = excluded.updated_at;
