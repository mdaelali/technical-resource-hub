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
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

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
  updated_at        timestamptz default now()
);

alter table public.user_state enable row level security;

drop policy if exists "user_state_select_own" on public.user_state;
drop policy if exists "user_state_insert_own" on public.user_state;
drop policy if exists "user_state_update_own" on public.user_state;

create policy "user_state_select_own"
  on public.user_state for select
  using (auth.uid() = user_id);

create policy "user_state_insert_own"
  on public.user_state for insert
  with check (auth.uid() = user_id);

create policy "user_state_update_own"
  on public.user_state for update
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- avatars storage bucket — public read, owner write.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
drop policy if exists "avatars_owner_insert" on storage.objects;
drop policy if exists "avatars_owner_update" on storage.objects;
drop policy if exists "avatars_owner_delete" on storage.objects;

create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- delete_my_account: lets an authenticated user nuke their own auth row,
-- which cascades to public.profiles, public.user_state, and triggers the
-- avatar storage cleanup. Runs as SECURITY DEFINER so it can touch auth.users
-- (which the anon role normally cannot) — but only ever for auth.uid().
-- ---------------------------------------------------------------------------
create or replace function public.delete_my_account()
  returns void
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  -- Drop any leftover storage rows under this user's avatar folder. The
  -- actual file blobs are removed asynchronously by Supabase Storage.
  delete from storage.objects
    where bucket_id = 'avatars'
      and (storage.foldername(name))[1] = uid::text;

  -- Cascade deletes on the foreign keys handle public.profiles and
  -- public.user_state for us.
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
