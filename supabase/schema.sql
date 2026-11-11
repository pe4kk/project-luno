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
