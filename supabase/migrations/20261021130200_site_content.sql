-- Aşama 3: editable home page and corporate texts.
-- site_settings holds one JSON document per section (hero, reasons, strengths, showcase, about, services, kvkk,
-- contact); the shape of each is validated in the app (src/components/sites/teknosem/settings.ts).

create table public.site_settings (
  key text primary key check (key in ('hero', 'reasons', 'strengths', 'showcase', 'about', 'services', 'kvkk', 'contact')),
  value jsonb not null,
  updated_at timestamptz not null default now()
);
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

create table public.reference_logos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  name text not null default '',
  sort integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
alter table public.reference_logos enable row level security;

create policy "read site settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admins insert site settings" on public.site_settings for insert to authenticated with check ((select private.is_admin()));
create policy "admins update site settings" on public.site_settings for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete site settings" on public.site_settings for delete to authenticated using ((select private.is_admin()));

create policy "read published logos" on public.reference_logos
  for select to anon, authenticated using (published or (select private.is_admin()));
create policy "admins insert logos" on public.reference_logos for insert to authenticated with check ((select private.is_admin()));
create policy "admins update logos" on public.reference_logos for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete logos" on public.reference_logos for delete to authenticated using ((select private.is_admin()));

grant select on public.site_settings, public.reference_logos to anon, authenticated;
grant insert, update, delete on public.site_settings, public.reference_logos to authenticated;
