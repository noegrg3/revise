-- Synchronisation de la progression (cartes, listes perso, stats, objectifs)
create table if not exists public.user_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
alter table public.user_state enable row level security;
drop policy if exists "etat perso" on public.user_state;
create policy "etat perso" on public.user_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
