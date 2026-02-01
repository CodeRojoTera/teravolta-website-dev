-- Create electrical_boards table for Efficiency 2.0
create table if not exists public.electrical_boards (
  id uuid default gen_random_uuid() primary key,
  appointment_id uuid references public.appointments(id) on delete cascade not null,
  name text not null,
  system_type text not null, -- 'monophase_120_240', 'triphase_208_120', etc (Checked in app)
  has_neutral boolean not null,
  emporia_classification text not null, -- 'standard', 'adjustments', 'incompatible'
  incompatibility_reason text, -- 'no_neutral', 'mv', 'space', etc
  ct_status text not null, -- 'fits', 'no_fit'
  ct_issue text, -- 'cable_thick', 'busbars', 'no_space'
  recommended_solution text not null, -- 'standard', 'special_cts', 'industrial'
  observations text,
  photos jsonb default '[]'::jsonb, -- Array of URL strings
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.electrical_boards enable row level security;

-- Policies
-- Admins: Full Access
create policy "Admins can view all boards"
  on public.electrical_boards for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('admin', 'super_admin')
    )
  );

create policy "Admins can insert boards"
  on public.electrical_boards for insert
  with check (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('admin', 'super_admin')
    )
  );

create policy "Admins can update boards"
  on public.electrical_boards for update
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('admin', 'super_admin')
    )
  );

create policy "Admins can delete boards"
  on public.electrical_boards for delete
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('admin', 'super_admin')
    )
  );

-- Technicians: Access via Linked Appointment
-- View: If I am the assigned technician for this appointment
create policy "Technicians can view boards for their assessments"
  on public.electrical_boards for select
  using (
    exists (
      select 1 from public.appointments a
      join public.technicians t on t.uid = auth.uid()
      where a.id = electrical_boards.appointment_id
      and a.technician_id = t.id
    )
  );

-- Insert: If I am the assigned technician
create policy "Technicians can insert boards for their assessments"
  on public.electrical_boards for insert
  with check (
    exists (
      select 1 from public.appointments a
      join public.technicians t on t.uid = auth.uid()
      where a.id = appointment_id
      and a.technician_id = t.id
    )
  );

-- Update: If I am the assigned technician
create policy "Technicians can update boards for their assessments"
  on public.electrical_boards for update
  using (
    exists (
      select 1 from public.appointments a
      join public.technicians t on t.uid = auth.uid()
      where a.id = electrical_boards.appointment_id
      and a.technician_id = t.id
    )
  );

-- Delete: If I am the assigned technician
create policy "Technicians can delete boards for their assessments"
  on public.electrical_boards for delete
  using (
    exists (
      select 1 from public.appointments a
      join public.technicians t on t.uid = auth.uid()
      where a.id = electrical_boards.appointment_id
      and a.technician_id = t.id
    )
  );

-- Clients: NO ACCESS (Internal technical data)
-- Admins communicate findings via Proposals, not raw board data.
