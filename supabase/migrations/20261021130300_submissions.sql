-- Aşama 4: Teklif Al, Servis Talebi and İletişim form submissions.
-- Visitors may only insert (never read). The site writes through a server action that also applies the
-- honeypot and the per-IP limit; only a keyed hash of the IP is stored, never the address itself.

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('quote', 'service', 'contact')),
  name text not null check (length(trim(name)) between 1 and 200),
  company text not null default '' check (length(company) <= 200),
  phone text not null default '' check (length(phone) <= 50),
  email text not null default '' check (length(email) <= 200),
  subject text not null default '' check (length(subject) <= 200),
  product_slug text not null default '' check (length(product_slug) <= 200),
  message text not null default '' check (length(message) <= 5000),
  ip_hash text not null default '',
  status text not null default 'new' check (status in ('new', 'seen', 'done')),
  note text not null default '' check (length(note) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index submissions_created_at_idx on public.submissions (created_at desc);
create index submissions_ip_hash_created_at_idx on public.submissions (ip_hash, created_at);
create trigger submissions_updated_at before update on public.submissions for each row execute function public.set_updated_at();

alter table public.submissions enable row level security;

create policy "anyone submits a new form" on public.submissions
  for insert to anon, authenticated with check (status = 'new' and note = '');
create policy "admins read submissions" on public.submissions for select to authenticated using ((select private.is_admin()));
create policy "admins update submissions" on public.submissions for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete submissions" on public.submissions for delete to authenticated using ((select private.is_admin()));

grant insert on public.submissions to anon, authenticated;
grant select, update, delete on public.submissions to authenticated;
