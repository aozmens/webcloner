-- Aşama 2: downloadable files (user manuals). One row per file version.
-- The product page shows the newest published version of each product; İndirmeler lists every published row,
-- so older versions are shown or hidden there with `published`.

create table public.downloads (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete set null,
  title text not null check (length(trim(title)) > 0),
  model text not null default '',
  version text not null default '',
  release_date date,
  -- Internal remark shown only in the panel (e.g. "file name says V1.11, pages say V1.1").
  note text not null default '',
  storage_path text not null unique,
  size_bytes bigint not null check (size_bytes > 0),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index downloads_product_id_idx on public.downloads (product_id);
create trigger downloads_updated_at before update on public.downloads for each row execute function public.set_updated_at();

alter table public.downloads enable row level security;

create policy "read published downloads" on public.downloads
  for select to anon, authenticated using (published or (select private.is_admin()));
create policy "admins insert downloads" on public.downloads for insert to authenticated with check ((select private.is_admin()));
create policy "admins update downloads" on public.downloads for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete downloads" on public.downloads for delete to authenticated using ((select private.is_admin()));

grant select on public.downloads to anon, authenticated;
grant insert, update, delete on public.downloads to authenticated;
