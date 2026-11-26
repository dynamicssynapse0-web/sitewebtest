-- Publicité / sponsors administrables depuis /admin + compteur de page vues.
-- À exécuter dans le SQL Editor Supabase avant la première campagne.

-- 1. Emplacements publicitaires -------------------------------------------------
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  title text not null check (btrim(title) <> ''),
  advertiser text not null default '',
  slug text not null unique,
  -- accueil | carte | partenaires | evenement | competition
  placement text not null check (
    placement in ('accueil', 'carte', 'partenaires', 'evenement', 'competition')
  ),
  link_url text not null default '',
  image text not null default '',
  alt text not null default '',
  date_debut date,
  date_fin date,
  active boolean not null default true,
  ordre integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ads_placement_actif_ordre_idx
  on public.ads (placement, active, ordre);

alter table public.ads enable row level security;

drop policy if exists "Publicites - lecture publique" on public.ads;
create policy "Publicites - lecture publique"
  on public.ads for select
  to anon, authenticated
  using (active = true
    and (date_debut is null or date_debut <= current_date)
    and (date_fin is null or date_fin >= current_date));

drop policy if exists "Publicites - ecriture admin" on public.ads;
create policy "Publicites - ecriture admin"
  on public.ads for all
  to authenticated
  using (true)
  with check (true);

-- 2. Clics sur les publicités ---------------------------------------------------
create table if not exists public.ad_clicks (
  id bigint generated always as identity primary key,
  ad_id uuid not null,
  placement text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists ad_clicks_ad_id_created_at_idx
  on public.ad_clicks (ad_id, created_at desc);

alter table public.ad_clicks enable row level security;

-- Insert public : le clic est tracé depuis le navigateur avec la clé publishable.
drop policy if exists "Clics publicites - insertion publique" on public.ad_clicks;
create policy "Clics publicites - insertion publique"
  on public.ad_clicks for insert
  to anon, authenticated
  with check (true);

-- Lecture pour l'admin (les chiffres de campagne restent dans /admin).
drop policy if exists "Clics publicites - lecture admin" on public.ad_clicks;
create policy "Clics publicites - lecture admin"
  on public.ad_clicks for select
  to authenticated
  using (true);

-- 3. Pages vues (statistiques first-party, sans cookie) -------------------------
create table if not exists public.site_pageviews (
  id bigint generated always as identity primary key,
  path text not null,
  created_at timestamptz not null default now()
);

create index if not exists site_pageviews_created_at_idx
  on public.site_pageviews (created_at desc);

alter table public.site_pageviews enable row level security;

drop policy if exists "Pages vues - insertion publique" on public.site_pageviews;
create policy "Pages vues - insertion publique"
  on public.site_pageviews for insert
  to anon, authenticated
  with check (true);

-- Le kit média /annonceurs affiche le nombre de vues des 30 derniers jours.
drop policy if exists "Pages vues - lecture publique" on public.site_pageviews;
create policy "Pages vues - lecture publique"
  on public.site_pageviews for select
  to anon, authenticated
  using (true);
