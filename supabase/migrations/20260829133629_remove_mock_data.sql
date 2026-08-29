do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'posts'
      and column_name = 'seed_key'
  ) then
    execute 'delete from public.posts where seed_key is not null';
  end if;
end
$$;

alter table public.posts drop column if exists seed_key;
