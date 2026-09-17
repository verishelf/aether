create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  profile_visible boolean not null default true,
  searchable boolean not null default true,
  net_worth_verified boolean not null default false,
  net_worth_range text,
  plaid_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plaid_items (
  user_id uuid primary key references auth.users(id) on delete cascade,
  encrypted_access_token text not null,
  item_id text not null,
  institution_name text,
  updated_at timestamptz not null default now()
);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (char_length(category) between 1 and 80),
  title text not null check (char_length(title) between 1 and 160),
  description text,
  year integer,
  maker text,
  visibility text not null default 'private' check (visibility in ('public', 'circles', 'private')),
  image_paths text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.plaid_items enable row level security;
alter table public.verification_requests enable row level security;
alter table public.assets enable row level security;

create policy "profiles are visible to authenticated members" on public.profiles for select to authenticated using (true);
create policy "users can update their profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "users can read their subscription" on public.subscriptions for select to authenticated using (auth.uid() = user_id);
create policy "users can read their own verification request" on public.verification_requests for select to authenticated using (auth.uid() = user_id);
create policy "users can create their verification request" on public.verification_requests for insert to authenticated with check (auth.uid() = user_id);
create policy "public assets are visible to members" on public.assets for select to authenticated using (visibility = 'public' or auth.uid() = user_id);
create policy "owners can manage assets" on public.assets for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('asset-images', 'asset-images', false) on conflict (id) do nothing;
create policy "owners can manage asset images" on storage.objects for all to authenticated using (bucket_id = 'asset-images' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'asset-images' and (storage.foldername(name))[1] = auth.uid()::text);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, username) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), split_part(new.email, '@', 1)) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
