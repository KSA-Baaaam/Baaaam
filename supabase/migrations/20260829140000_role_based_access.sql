create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null check (char_length(display_name) between 1 and 80),
  role text not null default 'general' check (role in ('admin', 'author', 'general')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

insert into public.profiles (id, email, display_name, role)
select
  users.id,
  coalesce(users.email, ''),
  coalesce(nullif(trim(users.raw_user_meta_data ->> 'full_name'), ''), users.email, 'Baaaam 사용자'),
  'general'
from auth.users as users
on conflict (id) do nothing;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), new.email, 'Baaaam 사용자'),
    'general'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    display_name = excluded.display_name,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email, raw_user_meta_data on auth.users
  for each row execute function private.handle_new_user();

create or replace function private.current_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select profiles.role
  from public.profiles as profiles
  where profiles.id = (select auth.uid());
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;
revoke all on function private.current_user_role() from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.current_user_role() to authenticated;

alter table public.profiles enable row level security;

drop policy if exists "users can read their profile and admins can read all" on public.profiles;
create policy "users can read their profile and admins can read all"
  on public.profiles
  for select
  to authenticated
  using (
    id = (select auth.uid())
    or (select private.current_user_role()) = 'admin'
  );

drop policy if exists "admins can update user roles" on public.profiles;
create policy "admins can update user roles"
  on public.profiles
  for update
  to authenticated
  using ((select private.current_user_role()) = 'admin')
  with check ((select private.current_user_role()) = 'admin');

drop policy if exists "users can create their own posts" on public.posts;
drop policy if exists "users can update their own posts" on public.posts;

create policy "authors can create their own posts"
  on public.posts
  for insert
  to authenticated
  with check (
    (select auth.uid()) = author_id
    and (select private.current_user_role()) in ('author', 'admin')
  );

create policy "authors can update own posts and admins can update all"
  on public.posts
  for update
  to authenticated
  using (
    ((select auth.uid()) = author_id and (select private.current_user_role()) = 'author')
    or (select private.current_user_role()) = 'admin'
  )
  with check (
    ((select auth.uid()) = author_id and (select private.current_user_role()) = 'author')
    or (select private.current_user_role()) = 'admin'
  );

drop policy if exists "admins can delete posts" on public.posts;
create policy "admins can delete posts"
  on public.posts
  for delete
  to authenticated
  using ((select private.current_user_role()) = 'admin');

drop policy if exists "users can delete their own comments" on public.comments;
create policy "users can delete own comments and admins can delete all"
  on public.comments
  for delete
  to authenticated
  using (
    (select auth.uid()) = author_id
    or (select private.current_user_role()) = 'admin'
  );

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (role, updated_at) on public.profiles to authenticated;
grant delete on public.posts to authenticated;
