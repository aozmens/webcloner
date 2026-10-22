-- Teknosem catalog: categories > groups > products > product_images, plus admin_users.
-- (Applied 2026-10-21. Kept here so the schema can be recreated in a new project.)

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(trim(title)) > 0),
  sort integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(trim(title)) > 0),
  sort integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index groups_category_id_idx on public.groups (category_id);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  legacy_slug text,
  name text not null check (length(trim(name)) > 0),
  short_name text not null default '',
  group_id uuid not null references public.groups (id) on delete restrict,
  sort integer not null default 0,
  short_description text not null default '',
  description_html text not null default '',
  specs jsonb not null default '[]'::jsonb check (jsonb_typeof(specs) = 'array'),
  faq_title text not null default 'Sıkça Sorulan Sorular',
  faq jsonb not null default '[]'::jsonb check (jsonb_typeof(faq) = 'array'),
  videos text[] not null default '{}',
  published boolean not null default false,
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_group_id_idx on public.products (group_id);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  alt text not null default '',
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, storage_path)
);

create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger groups_updated_at before update on public.groups for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();

-- Row level security: visitors read published rows only; only admins write.
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.groups enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

create policy "admins read own admin row" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create policy "read published categories" on public.categories
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admins insert categories" on public.categories for insert to authenticated with check ((select public.is_admin()));
create policy "admins update categories" on public.categories for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete categories" on public.categories for delete to authenticated using ((select public.is_admin()));

create policy "read published groups" on public.groups
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admins insert groups" on public.groups for insert to authenticated with check ((select public.is_admin()));
create policy "admins update groups" on public.groups for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete groups" on public.groups for delete to authenticated using ((select public.is_admin()));

create policy "read published products" on public.products
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admins insert products" on public.products for insert to authenticated with check ((select public.is_admin()));
create policy "admins update products" on public.products for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete products" on public.products for delete to authenticated using ((select public.is_admin()));

create policy "read images of published products" on public.product_images
  for select to anon, authenticated using (
    (select public.is_admin())
    or exists (select 1 from public.products p where p.id = product_id and p.published)
  );
create policy "admins insert product images" on public.product_images for insert to authenticated with check ((select public.is_admin()));
create policy "admins update product images" on public.product_images for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete product images" on public.product_images for delete to authenticated using ((select public.is_admin()));

grant select on public.categories, public.groups, public.products, public.product_images to anon, authenticated;
grant insert, update, delete on public.categories, public.groups, public.products, public.product_images to authenticated;
grant select on public.admin_users to authenticated;

-- Storage: one public bucket for site media. Public read by URL; writes only by admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 20971520, array['image/webp', 'image/png', 'image/jpeg', 'application/pdf'])
on conflict (id) do nothing;

create policy "admins upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "admins update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin())) with check (bucket_id = 'media' and (select public.is_admin()));
create policy "admins delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
