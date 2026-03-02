-- Empire.AI Database Schema
-- Run this in the Supabase SQL Editor

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  stripe_customer_id text unique,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'starter', 'empire_builder', 'enterprise')),
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive', 'past_due', 'canceled')),
  stripe_subscription_id text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- USER PROFILES (onboarding/psychological data)
-- ============================================
create table public.user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  risk_tolerance text check (risk_tolerance in ('low', 'medium', 'high')),
  skills text[] default '{}',
  interests text[] default '{}',
  budget_range text,
  time_commitment text,
  experience_level text check (experience_level in ('none', 'beginner', 'intermediate', 'expert')),
  preferred_industries text[] default '{}',
  personality_type text,
  goals text,
  strengths text,
  weaknesses text,
  location text,
  current_occupation text,
  work_style text check (work_style in ('solo', 'team', 'either')),
  income_goal text,
  timeline text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_profiles enable row level security;
create policy "Users can view own user_profile" on user_profiles for select using (auth.uid() = user_id);
create policy "Users can insert own user_profile" on user_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own user_profile" on user_profiles for update using (auth.uid() = user_id);

-- ============================================
-- TRENDS
-- ============================================
create table public.trends (
  id uuid default gen_random_uuid() primary key,
  keyword text not null,
  search_volume integer,
  category text,
  source text not null check (source in ('google_trends', 'news_api', 'manual')),
  region text default 'US',
  trend_date date default current_date,
  interest_over_time jsonb,
  related_queries jsonb,
  raw_data jsonb,
  created_at timestamptz default now(),
  constraint trends_keyword_date_unique unique (keyword, trend_date)
);

alter table public.trends enable row level security;
create policy "Authenticated users can read trends" on trends for select to authenticated using (true);

create index idx_trends_keyword on trends (keyword);
create index idx_trends_date on trends (trend_date desc);
create index idx_trends_category on trends (category);

-- ============================================
-- BUSINESS IDEAS
-- ============================================
create table public.business_ideas (
  id uuid default gen_random_uuid() primary key,
  trend_id uuid references trends(id) on delete set null,
  title text not null,
  description text not null,
  target_market text,
  revenue_model text,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  estimated_startup_cost text,
  required_skills text[] default '{}',
  tags text[] default '{}',
  ai_confidence_score numeric(3,2),
  view_count integer default 0,
  like_count integer default 0,
  save_count integer default 0,
  created_at timestamptz default now()
);

alter table public.business_ideas enable row level security;
create policy "Authenticated users can read ideas" on business_ideas for select to authenticated using (true);

create index idx_ideas_trend on business_ideas (trend_id);
create index idx_ideas_created on business_ideas (created_at desc);
create index idx_ideas_difficulty on business_ideas (difficulty);

-- ============================================
-- USER BUSINESSES
-- ============================================
create table public.user_businesses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  idea_id uuid references business_ideas(id) on delete set null,
  business_name text not null,
  stage text default 'planning' check (stage in ('planning', 'legal', 'banking', 'website', 'operations', 'marketing', 'funding', 'launched')),
  business_plan jsonb,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_businesses enable row level security;
create policy "Users can manage own businesses" on user_businesses for all using (auth.uid() = user_id);

create index idx_businesses_user on user_businesses (user_id);

-- ============================================
-- BUSINESS DOCUMENTS
-- ============================================
create table public.business_documents (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references user_businesses(id) on delete cascade not null,
  doc_type text not null check (doc_type in ('business_plan', 'operating_agreement', 'articles_of_org', 'bylaws', 'pitch_deck', 'marketing_plan', 'financial_projection')),
  content text not null default '',
  status text default 'draft' check (status in ('draft', 'final')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.business_documents enable row level security;
create policy "Users can manage own documents" on business_documents for all
  using (
    exists (
      select 1 from user_businesses
      where user_businesses.id = business_documents.business_id
      and user_businesses.user_id = auth.uid()
    )
  );

create index idx_docs_business on business_documents (business_id);

-- ============================================
-- USER INTERACTIONS
-- ============================================
create table public.user_interactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  idea_id uuid references business_ideas(id) on delete cascade not null,
  interaction_type text not null check (interaction_type in ('view', 'like', 'save', 'dismiss')),
  created_at timestamptz default now(),
  unique(user_id, idea_id, interaction_type)
);

alter table public.user_interactions enable row level security;
create policy "Users can manage own interactions" on user_interactions for all using (auth.uid() = user_id);

create index idx_interactions_user on user_interactions (user_id);
create index idx_interactions_idea on user_interactions (idea_id);
