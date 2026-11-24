-- Championnats / sous-catégories par sport.
-- À exécuter dans le SQL Editor de Supabase avant de publier la rubrique.
create extension if not exists pgcrypto;

create table if not exists public.championnats (
  id uuid primary key default gen_random_uuid(),
  sport text not null,                 -- slug canonique : football, basketball, boxe...
  title text not null,                 -- ex. MTN Elite One
  slug text not null,                  -- ex. football-mtn-elite-one
  description text,
  cover_image text,
  images jsonb not null default '[]'::jsonb,
  ordre integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists championnats_slug_unique
  on public.championnats (slug);

create index if not exists championnats_sport_ordre_idx
  on public.championnats (sport, ordre);

alter table public.championnats enable row level security;

-- Lecture publique : le site utilise la clé publishable (anon).
drop policy if exists "Championnats - lecture publique" on public.championnats;
create policy "Championnats - lecture publique"
  on public.championnats for select
  to anon, authenticated
  using (true);

-- Écriture : les Server Actions vérifient déjà role = admin et statut = actif.
-- Si tes autres tables utilisent une policy plus stricte, remplace using (true)
-- par un test sur ta table de profils (auth.uid() / role / statut).
drop policy if exists "Championnats - ecriture admin" on public.championnats;
create policy "Championnats - ecriture admin"
  on public.championnats for all
  to authenticated
  using (true)
  with check (true);
