-- Catégories / sous-disciplines sportives administrables depuis /admin.
-- À exécuter dans le SQL Editor Supabase avant la première publication.

create table if not exists public.categories_sport (
  id uuid primary key default gen_random_uuid(),
  discipline text not null check (
    discipline in (
      'Football',
      'Basketball',
      'Boxe',
      'Volleyball',
      'Athlétisme',
      'Arts martiaux'
    )
  ),
  sous_discipline text not null check (btrim(sous_discipline) <> ''),
  -- Slug composite unique : discipline-sous-discipline (ex. football-mtn-elite-one).
  slug text not null unique,
  cover_image text not null,
  -- 4 images secondaires maximum (contrôlé aussi par les Server Actions).
  images jsonb not null default '[]'::jsonb,
  ordre integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists categories_sport_discipline_ordre_idx
  on public.categories_sport (discipline, ordre);

alter table public.categories_sport enable row level security;

-- Lecture publique : le site utilise la clé publishable (anon).
drop policy if exists "Categories sport - lecture publique" on public.categories_sport;
create policy "Categories sport - lecture publique"
  on public.categories_sport for select
  to anon, authenticated
  using (true);

-- Écriture réservée aux sessions authentifiées. Les Server Actions vérifient
-- elles-mêmes role = admin et statut = actif avant toute insertion/modification.
-- Si ta table de profils est normalisée, tu peux remplacer `using (true)` par un
-- test auth.uid() sur cette table (le nom varie selon ton installation).
drop policy if exists "Categories sport - ecriture admin" on public.categories_sport;
create policy "Categories sport - ecriture admin"
  on public.categories_sport for all
  to authenticated
  using (true)
  with check (true);
