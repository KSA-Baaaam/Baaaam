create table if not exists public.posts (
  id bigint generated always as identity primary key,
  author_id uuid references auth.users (id) on delete set null,
  title text not null check (char_length(title) between 1 and 160),
  category_id text not null check (
    category_id in ('math', 'physics', 'chemistry', 'biology', 'earth-science', 'other')
  ),
  content text not null check (char_length(content) between 1 and 30000),
  image_url text not null default '',
  video_url text,
  author text not null check (char_length(author) between 1 and 80),
  is_recommended boolean not null default false,
  view_count bigint not null default 0 check (view_count >= 0),
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_category_published_idx
  on public.posts (category_id, published_at desc);

create index if not exists posts_author_published_idx
  on public.posts (author_id, published_at desc)
  where author_id is not null;

create index if not exists posts_recommended_published_idx
  on public.posts (is_recommended, published_at desc)
  where is_recommended is true;

create table if not exists public.comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  author text not null check (char_length(author) between 1 and 80),
  content text not null check (char_length(content) between 1 and 2000),
  is_question boolean not null default true,
  in_reply_to bigint references public.comments (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_created_idx
  on public.comments (post_id, created_at);

create index if not exists comments_author_created_idx
  on public.comments (author_id, created_at desc);

create index if not exists comments_reply_idx
  on public.comments (in_reply_to)
  where in_reply_to is not null;

alter table public.posts enable row level security;
alter table public.comments enable row level security;

drop policy if exists "posts are publicly readable" on public.posts;
create policy "posts are publicly readable"
  on public.posts
  for select
  to anon, authenticated
  using (true);

drop policy if exists "users can create their own posts" on public.posts;
create policy "users can create their own posts"
  on public.posts
  for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

drop policy if exists "users can update their own posts" on public.posts;
create policy "users can update their own posts"
  on public.posts
  for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

drop policy if exists "comments are publicly readable" on public.comments;
create policy "comments are publicly readable"
  on public.comments
  for select
  to anon, authenticated
  using (true);

drop policy if exists "users can create their own comments" on public.comments;
create policy "users can create their own comments"
  on public.comments
  for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

drop policy if exists "users can delete their own comments" on public.comments;
create policy "users can delete their own comments"
  on public.comments
  for delete
  to authenticated
  using ((select auth.uid()) = author_id);

revoke all on public.posts, public.comments from anon, authenticated;
grant select on public.posts, public.comments to anon, authenticated;
grant insert, update on public.posts to authenticated;
grant insert, delete on public.comments to authenticated;
grant usage, select on sequence public.posts_id_seq to authenticated;
grant usage, select on sequence public.comments_id_seq to authenticated;

-- Supabase 프로젝트 생성 시 추가된 자동 RLS 트리거 함수는 직접 호출할 필요가 없다.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
