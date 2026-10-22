-- is_admin() is used by RLS policies only; keep it out of the exposed API schema (no /rest/v1/rpc/is_admin).
-- (Applied 2026-10-21.)
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()));
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

do $$
declare
  t text;
begin
  foreach t in array array['categories', 'groups', 'products'] loop
    execute format('alter policy "read published %1$s" on public.%1$I using (published or (select private.is_admin()))', t);
    execute format('alter policy "admins insert %1$s" on public.%1$I with check ((select private.is_admin()))', t);
    execute format('alter policy "admins update %1$s" on public.%1$I using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format('alter policy "admins delete %1$s" on public.%1$I using ((select private.is_admin()))', t);
  end loop;
end $$;

alter policy "read images of published products" on public.product_images using (
  (select private.is_admin()) or exists (select 1 from public.products p where p.id = product_id and p.published)
);
alter policy "admins insert product images" on public.product_images with check ((select private.is_admin()));
alter policy "admins update product images" on public.product_images using ((select private.is_admin())) with check ((select private.is_admin()));
alter policy "admins delete product images" on public.product_images using ((select private.is_admin()));

alter policy "admins upload media" on storage.objects with check (bucket_id = 'media' and (select private.is_admin()));
alter policy "admins update media" on storage.objects using (bucket_id = 'media' and (select private.is_admin())) with check (bucket_id = 'media' and (select private.is_admin()));
alter policy "admins delete media" on storage.objects using (bucket_id = 'media' and (select private.is_admin()));

revoke execute on function public.is_admin() from anon, authenticated;
