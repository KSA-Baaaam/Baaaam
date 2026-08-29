create or replace function private.current_auth_method()
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce((select auth.jwt()) -> 'amr' -> 0 ->> 'method', '');
$$;

revoke all on function private.current_auth_method() from public, anon, authenticated;
grant execute on function private.current_auth_method() to authenticated;

drop policy if exists "users can read their profile and admins can read all" on public.profiles;
drop policy if exists "verified users can read their profile and admins can read all" on public.profiles;
create policy "verified users can read their profile and admins can read all"
  on public.profiles
  for select
  to authenticated
  using (
    (select private.current_auth_method()) = 'otp'
    and (
      id = (select auth.uid())
      or (select private.current_user_role()) = 'admin'
    )
  );

drop policy if exists "admins can update user roles" on public.profiles;
drop policy if exists "verified admins can update user roles" on public.profiles;
create policy "verified admins can update user roles"
  on public.profiles
  for update
  to authenticated
  using (
    (select private.current_auth_method()) = 'otp'
    and (select private.current_user_role()) = 'admin'
  )
  with check (
    (select private.current_auth_method()) = 'otp'
    and (select private.current_user_role()) = 'admin'
  );

drop policy if exists "authors can create their own posts" on public.posts;
drop policy if exists "verified authors can create their own posts" on public.posts;
create policy "verified authors can create their own posts"
  on public.posts
  for insert
  to authenticated
  with check (
    (select private.current_auth_method()) = 'otp'
    and (select auth.uid()) = author_id
    and (select private.current_user_role()) in ('author', 'admin')
  );

drop policy if exists "authors can update own posts and admins can update all" on public.posts;
drop policy if exists "verified authors can update own posts and admins can update all" on public.posts;
create policy "verified authors can update own posts and admins can update all"
  on public.posts
  for update
  to authenticated
  using (
    (select private.current_auth_method()) = 'otp'
    and (
      ((select auth.uid()) = author_id and (select private.current_user_role()) = 'author')
      or (select private.current_user_role()) = 'admin'
    )
  )
  with check (
    (select private.current_auth_method()) = 'otp'
    and (
      ((select auth.uid()) = author_id and (select private.current_user_role()) = 'author')
      or (select private.current_user_role()) = 'admin'
    )
  );

drop policy if exists "admins can delete posts" on public.posts;
drop policy if exists "verified admins can delete posts" on public.posts;
create policy "verified admins can delete posts"
  on public.posts
  for delete
  to authenticated
  using (
    (select private.current_auth_method()) = 'otp'
    and (select private.current_user_role()) = 'admin'
  );

drop policy if exists "users can create their own comments" on public.comments;
drop policy if exists "verified users can create their own comments" on public.comments;
create policy "verified users can create their own comments"
  on public.comments
  for insert
  to authenticated
  with check (
    (select private.current_auth_method()) = 'otp'
    and (select auth.uid()) = author_id
  );

drop policy if exists "users can delete own comments and admins can delete all" on public.comments;
drop policy if exists "verified users can delete own comments and admins can delete all" on public.comments;
create policy "verified users can delete own comments and admins can delete all"
  on public.comments
  for delete
  to authenticated
  using (
    (select private.current_auth_method()) = 'otp'
    and (
      (select auth.uid()) = author_id
      or (select private.current_user_role()) = 'admin'
    )
  );
