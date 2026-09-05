-- Structured post documents, efficient draft sync, and writer-only media access.

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posts'
      and column_name = 'content' and data_type = 'text'
  ) then
    alter table public.posts rename column content to legacy_content;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posts' and column_name = 'image_url'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posts' and column_name = 'thumbnail_url'
  ) then
    alter table public.posts rename column image_url to thumbnail_url;
  end if;
end
$$;

alter table public.posts
  add column if not exists subtitle text not null default '',
  add column if not exists slug text,
  add column if not exists content jsonb,
  add column if not exists tags text[] not null default '{}',
  add column if not exists status text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posts' and column_name = 'legacy_content'
  ) then
    execute $migration$
      update public.posts
      set content = jsonb_build_object(
        'type', 'doc',
        'content', jsonb_build_array(
          jsonb_build_object(
            'type', 'paragraph',
            'content', case
              when nullif(trim(legacy_content), '') is null then '[]'::jsonb
              else jsonb_build_array(jsonb_build_object('type', 'text', 'text', legacy_content))
            end
          )
        )
      )
      where content is null
    $migration$;
  end if;
end
$$;

update public.posts
set content = '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb
where content is null;

update public.posts
set status = 'published'
where status is null;

update public.posts
set slug = 'post-' || id::text
where status = 'published' and nullif(slug, '') is null;

alter table public.posts
  alter column content set default '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  alter column content set not null,
  alter column status set default 'draft',
  alter column status set not null,
  alter column category_id set default 'other',
  alter column published_at drop default,
  alter column published_at drop not null;

alter table public.posts drop column if exists legacy_content;

alter table public.posts drop constraint if exists posts_title_check;
alter table public.posts drop constraint if exists posts_subtitle_check;
alter table public.posts drop constraint if exists posts_slug_check;
alter table public.posts drop constraint if exists posts_content_check;
alter table public.posts drop constraint if exists posts_status_check;
alter table public.posts drop constraint if exists posts_publish_requirements_check;
alter table public.posts drop constraint if exists posts_tags_check;

create or replace function private.valid_post_tags(value text[])
returns boolean
language sql
immutable
strict
set search_path = ''
as $$
  select cardinality(value) <= 10
    and coalesce(bool_and(char_length(trim(tag)) between 1 and 20), true)
  from unnest(value) as tag;
$$;

revoke all on function private.valid_post_tags(text[]) from public, anon;
grant execute on function private.valid_post_tags(text[]) to authenticated;

alter table public.posts
  add constraint posts_title_check check (char_length(title) <= 100),
  add constraint posts_subtitle_check check (char_length(subtitle) <= 200),
  add constraint posts_slug_check check (
    slug is null or (char_length(slug) between 1 and 150 and slug !~ '[[:space:]/?#]')
  ),
  add constraint posts_content_check check (
    jsonb_typeof(content) = 'object' and content ->> 'type' = 'doc'
  ),
  add constraint posts_status_check check (status in ('draft', 'published')),
  add constraint posts_tags_check check (private.valid_post_tags(tags)),
  add constraint posts_publish_requirements_check check (
    status = 'draft'
    or (
      nullif(trim(title), '') is not null
      and nullif(trim(category_id), '') is not null
      and slug is not null
      and published_at is not null
    )
  );

create unique index if not exists posts_slug_unique_idx
  on public.posts (slug)
  where slug is not null;

create index if not exists posts_status_published_idx
  on public.posts (status, published_at desc)
  where status = 'published';

drop policy if exists "posts are publicly readable" on public.posts;
drop policy if exists "published posts are publicly readable" on public.posts;
create policy "published posts are publicly readable"
  on public.posts
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "authors can read own drafts and managers can read all" on public.posts;
create policy "authors can read own drafts and managers can read all"
  on public.posts
  for select
  to authenticated
  using (
    author_id = (select auth.uid())
    or (select private.current_user_role()) in ('developer', 'admin')
  );

drop policy if exists "authors can create their own posts" on public.posts;
create policy "authors can create their own posts"
  on public.posts
  for insert
  to authenticated
  with check (
    author_id = (select auth.uid())
    and (select private.current_user_role()) in ('developer', 'admin', 'author')
  );

drop policy if exists "authors can update own posts and managers can update all" on public.posts;
create policy "authors can update own posts and managers can update all"
  on public.posts
  for update
  to authenticated
  using (
    (author_id = (select auth.uid()) and (select private.current_user_role()) = 'author')
    or (select private.current_user_role()) in ('developer', 'admin')
  )
  with check (
    (author_id = (select auth.uid()) and (select private.current_user_role()) = 'author')
    or (select private.current_user_role()) in ('developer', 'admin')
  );

drop policy if exists "managers can delete posts" on public.posts;
drop policy if exists "authors can delete own posts and managers can delete all" on public.posts;
create policy "authors can delete own posts and managers can delete all"
  on public.posts
  for delete
  to authenticated
  using (
    (author_id = (select auth.uid()) and (select private.current_user_role()) = 'author')
    or (select private.current_user_role()) in ('developer', 'admin')
  );

update storage.buckets
set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'post-images';

drop policy if exists "writers can upload post images" on storage.objects;
create policy "writers can upload post images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = 'posts'
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
    and (select private.current_user_role()) in ('developer', 'admin', 'author')
  );

drop policy if exists "writers can delete post images" on storage.objects;
create policy "writers can delete post images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'post-images'
    and (
      (storage.foldername(name))[2] = (select auth.uid())::text
      or (select private.current_user_role()) in ('developer', 'admin')
    )
  );

grant select, insert, update, delete on public.posts to authenticated;
grant select on public.posts to anon;

alter table public.posts enable row level security;
