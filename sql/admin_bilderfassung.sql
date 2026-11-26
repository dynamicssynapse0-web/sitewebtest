-- Table dédiée aux administrateurs de Bilderfassung.
-- À exécuter dans le SQL Editor Supabase. L'ancienne table `profiles` est
-- conservée comme secours : le code lit d'abord `admin_bilderfassung`, puis
-- retombe sur `profiles` si aucune ligne d'admin n'y est trouvée.

-- 1. Nouvelle table ------------------------------------------------------------
create table if not exists public.admin_bilderfassung (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  prenom text not null default '',
  nom text not null default '',
  media text not null default '',
  numero_carte text,
  carte_path text,
  statut text not null default 'actif',
  role text not null default 'admin',
  motif_refus text,
  nouvelle_soumission boolean not null default false,
  ville text not null default '',
  pays text not null default '',
  telephone text,
  decide_par uuid,
  decide_le timestamptz,
  demande_le timestamptz,
  created_at timestamptz not null default now(),
  photo_path text
);

create index if not exists admin_bilderfassung_role_statut_idx
  on public.admin_bilderfassung (role, statut);

alter table public.admin_bilderfassung enable row level security;

-- Un utilisateur connecté peut lire sa propre fiche admin (par id ou email).
drop policy if exists "Admin Bilderfassung - lecture du propre profil"
  on public.admin_bilderfassung;
create policy "Admin Bilderfassung - lecture du propre profil"
  on public.admin_bilderfassung for select
  to authenticated
  using (
    id = auth.uid()
    or (
      coalesce(email, '') <> ''
      and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

-- Aucune policy d'écriture pour les clients publics : la table est gérée depuis
-- le SQL Editor / Dashboard Supabase (service role).

-- 2. Migration des admins depuis l'ancienne table `profiles` -------------------
insert into public.admin_bilderfassung (
  id, email, prenom, nom, media, numero_carte, carte_path, statut, role,
  motif_refus, nouvelle_soumission, ville, pays, telephone, decide_par,
  decide_le, demande_le, created_at, photo_path
)
select
  id,
  email,
  coalesce(prenom, ''),
  coalesce(nom, ''),
  coalesce(media, ''),
  numero_carte,
  carte_path,
  coalesce(statut, 'actif'),
  coalesce(role, 'admin'),
  motif_refus,
  coalesce(nouvelle_soumission, false),
  coalesce(ville, ''),
  coalesce(pays, ''),
  telephone,
  decide_par,
  decide_le,
  demande_le,
  created_at,
  photo_path
from public.profiles
where lower(coalesce(role, '')) in ('admin', 'administrateur', 'administrator')
  and lower(coalesce(statut, '')) in ('actif', 'active', 'oui', 'true', '1')
on conflict (id) do update set
  email = excluded.email,
  prenom = excluded.prenom,
  nom = excluded.nom,
  media = excluded.media,
  numero_carte = excluded.numero_carte,
  carte_path = excluded.carte_path,
  statut = excluded.statut,
  role = excluded.role,
  motif_refus = excluded.motif_refus,
  nouvelle_soumission = excluded.nouvelle_soumission,
  ville = excluded.ville,
  pays = excluded.pays,
  telephone = excluded.telephone,
  decide_par = excluded.decide_par,
  decide_le = excluded.decide_le,
  demande_le = excluded.demande_le,
  photo_path = excluded.photo_path;
