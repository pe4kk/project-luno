-- Table de synchronisation de Luno, à exécuter une fois dans Supabase (SQL Editor → New query → Run).
-- Une ligne par compte : toutes ses données (contenu) et l'heure du dernier envoi (maj, en ms).

create table if not exists public.donnees (
  user_id uuid primary key references auth.users (id) on delete cascade,
  contenu jsonb not null,
  maj bigint not null
);

-- Chacun ne peut lire et écrire que sa propre ligne.
alter table public.donnees enable row level security;

create policy "lire ses données" on public.donnees
  for select using (auth.uid() = user_id);
create policy "créer ses données" on public.donnees
  for insert with check (auth.uid() = user_id);
create policy "modifier ses données" on public.donnees
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Les autres appareils sont prévenus en direct d'un changement.
alter publication supabase_realtime add table public.donnees;

-- Demandes à Claude (leçons, cours) : écrites par le site, traitées par une tâche
-- planifiée qui y dépose la réponse (`reponse`, au format Lecon ou ChapitrePublie).
create table if not exists public.demandes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('lecon', 'cours')),
  titre text not null,
  texte text not null,
  meta jsonb not null default '{}'::jsonb,
  statut text not null default 'en_attente' check (statut in ('en_attente', 'prete', 'erreur')),
  reponse jsonb,
  erreur text,
  cree timestamptz not null default now(),
  traite timestamptz
);

alter table public.demandes enable row level security;

create policy "lire ses demandes" on public.demandes
  for select using (auth.uid() = user_id);
create policy "créer ses demandes" on public.demandes
  for insert with check (auth.uid() = user_id and statut = 'en_attente' and reponse is null);
create policy "supprimer ses demandes" on public.demandes
  for delete using (auth.uid() = user_id);

alter publication supabase_realtime add table public.demandes;

-- Photos jointes aux demandes et type « erreurs » (évaluations corrigées), 2026-11-11.
alter table public.demandes drop constraint if exists demandes_type_check;
alter table public.demandes add constraint demandes_type_check
  check (type in ('lecon', 'cours', 'erreurs'));

-- Stockage privé : chaque compte n'écrit et ne lit que son dossier `<compte>/…`.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('demandes', 'demandes', false, 5242880, array['image/jpeg'])
on conflict (id) do nothing;

create policy "envoyer ses photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'demandes' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "voir ses photos" on storage.objects for select to authenticated
  using (bucket_id = 'demandes' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "supprimer ses photos" on storage.objects for delete to authenticated
  using (bucket_id = 'demandes' and (storage.foldername(name))[1] = auth.uid()::text);
