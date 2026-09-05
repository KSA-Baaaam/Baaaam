insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'writers can upload post images'
  ) then
    create policy "writers can upload post images"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'post-images'
        and (storage.foldername(name))[1] = (select auth.uid())::text
        and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
        and (select private.current_user_role()) in ('developer', 'admin', 'author')
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'writers can delete post images'
  ) then
    create policy "writers can delete post images"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'post-images'
        and (
          (storage.foldername(name))[1] = (select auth.uid())::text
          or (select private.current_user_role()) in ('developer', 'admin')
        )
      );
  end if;
end
$$;
