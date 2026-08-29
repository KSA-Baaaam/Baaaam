create table if not exists public.posts (
  id bigint generated always as identity primary key,
  seed_key text unique,
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

insert into public.posts (
  seed_key,
  title,
  category_id,
  content,
  image_url,
  video_url,
  author,
  is_recommended,
  view_count,
  published_at
)
values
  ('p01', '분수의 덧셈, 그림으로 이해하기', 'math', '분모가 다른 분수를 더할 땐 먼저 분모를 같게 맞춰야 해요. 피자 조각을 그려서 크기를 맞춰보면 왜 통분이 필요한지 한눈에 이해할 수 있어요. 오늘은 색칠한 그림으로 1/2와 1/3을 더하는 과정을 차근차근 따라가 봅시다.', 'baaaam-math-fractions', null, '김도현 선생님', true, 1204, '2024-05-02T00:00:00+09:00'),
  ('p02', '구구단을 빨리 외우는 나만의 방법', 'math', '구구단은 무작정 외우기보다 규칙을 찾으면 훨씬 쉬워져요. 9단은 손가락을 접어서 확인할 수 있고, 곱셈은 순서를 바꿔도 같다는 사실만 알아도 절반은 저절로 외워져요. 규칙을 찾는 눈으로 구구단표를 다시 살펴봐요.', 'baaaam-math-times-table', null, '박서연 선생님', false, 862, '2024-04-18T00:00:00+09:00'),
  ('p03', '도형의 넓이, 쪼개서 구하기', 'math', '복잡하게 생긴 도형도 삼각형이나 직사각형으로 쪼개면 넓이를 쉽게 구할 수 있어요. 오늘은 계단 모양 도형을 세 조각으로 나눠서 넓이를 더하는 방법을 알아보고, 왜 쪼개도 전체 넓이가 변하지 않는지 확인해요.', 'baaaam-math-area', null, '김도현 선생님', false, 531, '2024-03-22T00:00:00+09:00'),
  ('p04', '빛은 왜 무지개색으로 나뉠까?', 'physics', '햇빛은 사실 여러 색이 섞인 빛이에요. 프리즘을 통과하면 색마다 꺾이는 정도가 달라서 무지개처럼 펼쳐져요. 빗방울도 작은 프리즘 역할을 해서 비가 갠 뒤 하늘에 무지개가 뜨는 거예요.', 'baaaam-physics-rainbow', 'https://www.youtube-nocookie.com/embed/lVDSvGz4iJs', '이하준 선생님', true, 1532, '2024-05-10T00:00:00+09:00'),
  ('p05', '자석은 왜 서로 붙거나 밀어낼까?', 'physics', '자석에는 N극과 S극이 있는데, 다른 극끼리는 끌어당기고 같은 극끼리는 밀어내요. 이 힘은 눈에 보이지 않는 자기장 때문에 생기는데, 철가루를 뿌려보면 그 모양을 직접 볼 수 있어요.', 'baaaam-physics-magnet', null, '이하준 선생님', false, 947, '2024-04-05T00:00:00+09:00'),
  ('p06', '소리는 어떻게 귀까지 전달될까?', 'physics', '소리는 공기 알갱이가 떨리면서 옆으로 전달되는 파동이에요. 실전화기 실험을 해보면 실이 떨릴 때만 소리가 전달된다는 걸 느낄 수 있어요. 진공 속에서는 공기가 없어서 소리가 전혀 전달되지 않아요.', 'baaaam-physics-sound', null, '박서연 선생님', false, 615, '2024-03-14T00:00:00+09:00'),
  ('p07', '물이 얼음이 되면 왜 부피가 늘어날까?', 'chemistry', '대부분의 물질은 얼면 부피가 줄지만 물은 반대예요. 물 분자가 얼면서 규칙적인 육각형 구조로 배열돼 오히려 사이 공간이 늘어나기 때문이에요. 그래서 얼음이 물에 뜨고, 겨울철 수도관이 얼면 터지기도 해요.', 'baaaam-chem-ice', null, '박서연 선생님', false, 733, '2024-04-27T00:00:00+09:00'),
  ('p08', '베이킹소다와 식초, 거품의 비밀', 'chemistry', '베이킹소다와 식초를 섞으면 이산화탄소 기체가 만들어지면서 거품이 부글부글 올라와요. 두 물질이 만나 새로운 물질로 바뀌는 화학 반응의 대표적인 예로, 화산 모형 실험에도 자주 쓰여요.', 'baaaam-chem-baking-soda', 'https://www.youtube-nocookie.com/embed/uokHHArhQjc', '김도현 선생님', true, 1108, '2024-05-06T00:00:00+09:00'),
  ('p09', '식물도 숨을 쉴까? 광합성 이야기', 'biology', '식물은 햇빛을 받아 이산화탄소와 물로 양분을 만드는 광합성을 해요. 이 과정에서 우리가 숨 쉬는 데 필요한 산소가 나와요. 그런데 밤에는 식물도 우리처럼 산소를 마시고 이산화탄소를 내보내는 호흡을 해요.', 'baaaam-bio-photosynthesis', 'https://www.youtube-nocookie.com/embed/D1Ymc311XS8', '이하준 선생님', false, 890, '2024-04-12T00:00:00+09:00'),
  ('p10', '우리 몸속 세포는 몇 개일까?', 'biology', '우리 몸은 약 37조 개나 되는 아주 작은 세포로 이루어져 있어요. 세포마다 하는 일이 달라서 피부 세포, 근육 세포, 신경 세포처럼 모양과 역할이 제각각이에요. 세포 하나하나가 모여 우리 몸 전체를 이루는 거예요.', 'baaaam-bio-cell', null, '박서연 선생님', false, 704, '2024-03-29T00:00:00+09:00'),
  ('p11', '지진은 왜 일어날까?', 'earth-science', '땅속 커다란 암반들은 조금씩 움직이는 판 위에 놓여 있어요. 판과 판이 부딪히다 쌓인 힘이 한꺼번에 풀리면서 땅이 흔들리는 게 지진이에요. 우리나라도 판의 경계 근처에 있어서 가끔 약한 지진이 발생해요.', 'baaaam-earth-quake', null, '이하준 선생님', false, 668, '2024-03-08T00:00:00+09:00'),
  ('p12', '태풍은 어떻게 이름이 붙을까?', 'earth-science', '태풍은 따뜻한 바닷물이 증발하며 만든 수증기가 소용돌이치는 거대한 구름 덩어리예요. 태풍 이름은 아시아 14개국이 미리 정해둔 이름을 순서대로 돌아가며 사용하는데, 우리나라가 제안한 이름도 여럿 들어 있어요.', 'baaaam-earth-typhoon', 'https://www.youtube-nocookie.com/embed/wPDoIrGUrEc', '김도현 선생님', true, 1341, '2024-05-14T00:00:00+09:00')
on conflict (seed_key) do nothing;
