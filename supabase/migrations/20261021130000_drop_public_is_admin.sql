-- Replaced by private.is_admin(); no policy references the public copy any more.
drop function if exists public.is_admin();

-- Manuals reach 14 MB; leave room for larger revisions (the Free plan caps a single upload at 50 MB).
update storage.buckets set file_size_limit = 52428800 where id = 'media';
