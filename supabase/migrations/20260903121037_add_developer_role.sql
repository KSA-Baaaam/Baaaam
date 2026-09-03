alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('developer', 'admin', 'author', 'general'));

drop policy if exists "users can read their profile and admins can read all" on public.profiles;
create policy "users can read their profile and managers can read all"
  on public.profiles
  for select
  to authenticated
  using (
    id = (select auth.uid())
    or (select private.current_user_role()) in ('developer', 'admin')
  );

drop policy if exists "admins can update user roles" on public.profiles;
create policy "managers can update user roles"
  on public.profiles
  for update
  to authenticated
  using (
    (select private.current_user_role()) = 'developer'
    or (
      (select private.current_user_role()) = 'admin'
      and role <> 'developer'
    )
  )
  with check (
    (select private.current_user_role()) = 'developer'
    or (
      (select private.current_user_role()) = 'admin'
      and role <> 'developer'
    )
  );

drop policy if exists "authors can create their own posts" on public.posts;
create policy "authors can create their own posts"
  on public.posts
  for insert
  to authenticated
  with check (
    (select auth.uid()) = author_id
    and (select private.current_user_role()) in ('developer', 'admin', 'author')
  );

drop policy if exists "authors can update own posts and admins can update all" on public.posts;
create policy "authors can update own posts and managers can update all"
  on public.posts
  for update
  to authenticated
  using (
    ((select auth.uid()) = author_id and (select private.current_user_role()) = 'author')
    or (select private.current_user_role()) in ('developer', 'admin')
  )
  with check (
    ((select auth.uid()) = author_id and (select private.current_user_role()) = 'author')
    or (select private.current_user_role()) in ('developer', 'admin')
  );

drop policy if exists "admins can delete posts" on public.posts;
create policy "managers can delete posts"
  on public.posts
  for delete
  to authenticated
  using ((select private.current_user_role()) in ('developer', 'admin'));

drop policy if exists "users can delete own comments and admins can delete all" on public.comments;
create policy "users can delete own comments and managers can delete all"
  on public.comments
  for delete
  to authenticated
  using (
    (select auth.uid()) = author_id
    or (select private.current_user_role()) in ('developer', 'admin')
  );
