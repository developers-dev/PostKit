-- PostKit Initial Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Companies table
create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  industry text,
  size text check (size in ('startup', 'small', 'medium', 'large', 'enterprise')),
  owner_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null
);

-- Postings table
create table if not exists postings (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  title text not null,
  description text,
  requirements text,
  tech_stack text[] default '{}',
  salary_min int,
  salary_max int,
  location text,
  employment_type text default 'full-time' check (employment_type in ('full-time', 'part-time', 'contract', 'internship')),
  status text default 'draft' check (status in ('draft', 'active', 'closed')),
  platform_post_ids jsonb default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Applicants table (stores only scoring results, not resume content)
create table if not exists applicants (
  id uuid primary key default uuid_generate_v4(),
  posting_id uuid references postings(id) on delete cascade not null,
  name text not null,
  apply_platform text check (apply_platform in ('jobkorea', 'saramin', 'wanted', 'jumpit', 'direct')),
  total_score int check (total_score >= 0 and total_score <= 100),
  skill_score int check (skill_score >= 0 and skill_score <= 100),
  culture_score int check (culture_score >= 0 and culture_score <= 100),
  career_score int check (career_score >= 0 and career_score <= 100),
  strengths text[] default '{}',
  risks text[] default '{}',
  recommended_questions text[] default '{}',
  stage text default 'applied' check (stage in ('applied', 'screening', 'interview1', 'interview2', 'final', 'hired', 'rejected')),
  memo text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Pipeline logs table
create table if not exists pipeline_logs (
  id uuid primary key default uuid_generate_v4(),
  applicant_id uuid references applicants(id) on delete cascade not null,
  from_stage text,
  to_stage text not null,
  memo text,
  created_at timestamptz default now() not null
);

-- Indexes for performance
create index if not exists idx_companies_owner_id on companies(owner_id);
create index if not exists idx_postings_company_id on postings(company_id);
create index if not exists idx_postings_status on postings(status);
create index if not exists idx_applicants_posting_id on applicants(posting_id);
create index if not exists idx_applicants_stage on applicants(stage);
create index if not exists idx_applicants_total_score on applicants(total_score desc);
create index if not exists idx_pipeline_logs_applicant_id on pipeline_logs(applicant_id);

-- Updated at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger update_postings_updated_at
  before update on postings
  for each row
  execute function update_updated_at_column();

create trigger update_applicants_updated_at
  before update on applicants
  for each row
  execute function update_updated_at_column();

-- Row Level Security (RLS)
alter table companies enable row level security;
alter table postings enable row level security;
alter table applicants enable row level security;
alter table pipeline_logs enable row level security;

-- RLS Policies for companies
create policy "Users can view their own companies"
  on companies for select
  using (auth.uid() = owner_id);

create policy "Users can create companies"
  on companies for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own companies"
  on companies for update
  using (auth.uid() = owner_id);

create policy "Users can delete their own companies"
  on companies for delete
  using (auth.uid() = owner_id);

-- RLS Policies for postings
create policy "Users can view postings of their companies"
  on postings for select
  using (
    exists (
      select 1 from companies
      where companies.id = postings.company_id
      and companies.owner_id = auth.uid()
    )
  );

create policy "Users can create postings for their companies"
  on postings for insert
  with check (
    exists (
      select 1 from companies
      where companies.id = postings.company_id
      and companies.owner_id = auth.uid()
    )
  );

create policy "Users can update postings of their companies"
  on postings for update
  using (
    exists (
      select 1 from companies
      where companies.id = postings.company_id
      and companies.owner_id = auth.uid()
    )
  );

create policy "Users can delete postings of their companies"
  on postings for delete
  using (
    exists (
      select 1 from companies
      where companies.id = postings.company_id
      and companies.owner_id = auth.uid()
    )
  );

-- RLS Policies for applicants
create policy "Users can view applicants of their postings"
  on applicants for select
  using (
    exists (
      select 1 from postings
      join companies on companies.id = postings.company_id
      where postings.id = applicants.posting_id
      and companies.owner_id = auth.uid()
    )
  );

create policy "Users can create applicants for their postings"
  on applicants for insert
  with check (
    exists (
      select 1 from postings
      join companies on companies.id = postings.company_id
      where postings.id = applicants.posting_id
      and companies.owner_id = auth.uid()
    )
  );

create policy "Users can update applicants of their postings"
  on applicants for update
  using (
    exists (
      select 1 from postings
      join companies on companies.id = postings.company_id
      where postings.id = applicants.posting_id
      and companies.owner_id = auth.uid()
    )
  );

create policy "Users can delete applicants of their postings"
  on applicants for delete
  using (
    exists (
      select 1 from postings
      join companies on companies.id = postings.company_id
      where postings.id = applicants.posting_id
      and companies.owner_id = auth.uid()
    )
  );

-- RLS Policies for pipeline_logs
create policy "Users can view pipeline logs of their applicants"
  on pipeline_logs for select
  using (
    exists (
      select 1 from applicants
      join postings on postings.id = applicants.posting_id
      join companies on companies.id = postings.company_id
      where applicants.id = pipeline_logs.applicant_id
      and companies.owner_id = auth.uid()
    )
  );

create policy "Users can create pipeline logs for their applicants"
  on pipeline_logs for insert
  with check (
    exists (
      select 1 from applicants
      join postings on postings.id = applicants.posting_id
      join companies on companies.id = postings.company_id
      where applicants.id = pipeline_logs.applicant_id
      and companies.owner_id = auth.uid()
    )
  );
