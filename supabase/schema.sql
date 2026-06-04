create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key,
  name text not null,
  email text not null unique
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  content_html text not null default '<p></p>',
  owner_id uuid not null references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_shares (
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (document_id, user_id)
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists documents_set_updated_at on public.documents;
create trigger documents_set_updated_at before update on public.documents
for each row execute function public.set_updated_at();

insert into public.users (id, name, email) values
  ('11111111-1111-4111-8111-111111111111', 'Maya Chen', 'maya@ajaia.demo'),
  ('22222222-2222-4222-8222-222222222222', 'Noah Williams', 'noah@ajaia.demo'),
  ('33333333-3333-4333-8333-333333333333', 'Priya Shah', 'priya@ajaia.demo')
on conflict (id) do update set name = excluded.name, email = excluded.email;

alter table public.users enable row level security;
alter table public.documents enable row level security;
alter table public.document_shares enable row level security;

-- The application uses the server-only service role and performs authorization
-- in API routes. No browser client is granted direct database access.
