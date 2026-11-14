-- Technical Resource Hub — Supabase schema
-- Run this once in your Supabase project's SQL Editor.

-- ---------------------------------------------------------------------------
-- profiles: 1:1 with auth.users, holds display name, bio, and avatar URL.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  bio         text,
  avatar_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

revoke all on table public.profiles from public, anon;
grant select, insert, update on table public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- user_state: 1:1 with auth.users, holds streak, mastery, recent topics, etc.
-- ---------------------------------------------------------------------------
create table if not exists public.user_state (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  streak_count      integer default 0,
  streak_last       date,
  mastered          jsonb default '[]'::jsonb,
  recently_viewed   jsonb default '[]'::jsonb,
  compiler_lang     text default 'java',
  compiler_sources  jsonb default '{}'::jsonb,
  compiler_stdin    text default '',
  learning_plan    jsonb not null default '{"date": null, "completed": []}'::jsonb,
  exam_results     jsonb not null default '{}'::jsonb,
  updated_at        timestamptz default now()
);

alter table public.user_state
  add column if not exists learning_plan jsonb not null default '{"date": null, "completed": []}'::jsonb;

alter table public.user_state
  add column if not exists exam_results jsonb not null default '{}'::jsonb;

alter table public.user_state enable row level security;

drop policy if exists "user_state_select_own" on public.user_state;
drop policy if exists "user_state_insert_own" on public.user_state;
drop policy if exists "user_state_update_own" on public.user_state;

create policy "user_state_select_own"
  on public.user_state for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "user_state_insert_own"
  on public.user_state for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "user_state_update_own"
  on public.user_state for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table public.user_state from public, anon;
grant select, insert, update on table public.user_state to authenticated;

-- ---------------------------------------------------------------------------
-- avatars storage bucket — public read, owner write.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "avatars_public_read" on storage.objects;
drop policy if exists "avatars_owner_insert" on storage.objects;
drop policy if exists "avatars_owner_update" on storage.objects;
drop policy if exists "avatars_owner_delete" on storage.objects;

create policy "avatars_public_read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'avatars');

create policy "avatars_owner_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
    and array_length(storage.foldername(name), 1) = 1
  );

create policy "avatars_owner_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
    and array_length(storage.foldername(name), 1) = 1
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
    and array_length(storage.foldername(name), 1) = 1
  );

create policy "avatars_owner_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
    and array_length(storage.foldername(name), 1) = 1
  );

-- ---------------------------------------------------------------------------
-- delete_my_account: lets an authenticated user delete their own auth row,
-- which cascades to public.profiles and public.user_state.
-- Runs as SECURITY DEFINER so it can touch auth.users
-- (which the anon role normally cannot) — but only ever for auth.uid().
-- ---------------------------------------------------------------------------
create or replace function public.delete_my_account()
  returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  -- The application removes avatar files through the Storage API before
  -- calling this function; direct SQL deletes could orphan the file blobs.
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
