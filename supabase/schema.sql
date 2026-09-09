-- ==============================================================================
-- BetCheck Database Schema & Row Level Security (RLS)
-- Run this in your Supabase SQL Editor to set up your tables and policies.
-- ==============================================================================

-- 1. Profiles Table (User settings, currency preference, and personal limits)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  currency text default 'NGN',
  daily_limit numeric default null,
  weekly_limit numeric default null,
  monthly_limit numeric default null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Bet Entries Table (CRUD for betting sessions)
create table if not exists public.bet_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  amount_staked numeric not null check (amount_staked >= 0),
  amount_returned numeric default 0 check (amount_returned >= 0),
  outcome text not null check (outcome in ('lost', 'won', 'cashed_out', 'pending')),
  date timestamptz not null default now(),
  platform text not null,
  bet_type text not null,
  reason text check (reason in (
    'Boredom',
    'Entertainment',
    'Pressure',
    'Trying to make quick money',
    'Trying to recover losses',
    'Friends influenced me',
    'Habit',
    'Other'
  )),
  notes text,
  created_at timestamptz default now()
);

-- Create index for performance
create index if not exists idx_bet_entries_user_date on public.bet_entries(user_id, date desc);

-- Enable RLS on bet_entries
alter table public.bet_entries enable row level security;

-- Policies for bet_entries (Strict User Isolation)
create policy "Users can view only their own bet entries"
  on public.bet_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bet entries"
  on public.bet_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bet entries"
  on public.bet_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own bet entries"
  on public.bet_entries for delete
  using (auth.uid() = user_id);

-- 3. What-If Goals Table (Life goals to compare against betting losses)
create table if not exists public.user_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  target_amount numeric not null check (target_amount > 0),
  category text default 'Savings',
  icon text default 'target',
  created_at timestamptz default now()
);

-- Enable RLS on user_goals
alter table public.user_goals enable row level security;

-- Policies for user_goals
create policy "Users can manage their own goals"
  on public.user_goals for all
  using (auth.uid() = user_id);

-- 4. Trigger to create a profile automatically upon user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, currency)
  values (new.id, new.email, 'NGN');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
