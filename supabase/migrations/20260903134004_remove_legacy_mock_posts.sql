-- Remove the original twelve demo articles. Real articles always have an author
-- account, while these records were seeded with 2024 dates and no author_id.
delete from public.posts
where id between 1 and 12
  and author_id is null
  and published_at < timestamptz '2025-01-01 00:00:00+00';
