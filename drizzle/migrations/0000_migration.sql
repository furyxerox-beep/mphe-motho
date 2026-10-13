
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'New member',
  gender text,
  interested_in text,
  birthdate date,
  bio text default '',
  job text default '',
  province text,
  city text default '',
  interests text[] not null default '{}',
  avatar_path text,
  lat double precision,
  lng double precision,
  last_active timestamptz not null default now(),
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Members can view profiles" on public.profiles for select to authenticated using (true);
create policy "Users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

create table public.private_details (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  phone text not null,
  created_at timestamptz not null default now()
);
grant select, update on public.private_details to authenticated;
grant all on public.private_details to service_role;
alter table public.private_details enable row level security;
create policy "Own private details" on public.private_details for select to authenticated using (auth.uid() = user_id);
create policy "Update own private details" on public.private_details for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.validate_sa_phone() returns trigger language plpgsql set search_path = public as $$
begin
  if new.phone is null or new.phone !~ '^\+27[6-8][0-9]{8}$' then
    raise exception 'Only South African mobile numbers (+27) are allowed';
  end if;
  return new;
end $$;
create trigger trg_validate_phone before insert or update on public.private_details for each row execute function public.validate_sa_phone();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'New member'));
  insert into public.private_details (user_id, phone) values (new.id, new.raw_user_meta_data->>'phone');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.likes (
  liker uuid not null references public.profiles(id) on delete cascade,
  liked uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (liker, liked)
);
grant select, insert, delete on public.likes to authenticated;
grant all on public.likes to service_role;
alter table public.likes enable row level security;
create policy "See likes involving me" on public.likes for select to authenticated using (auth.uid() = liker or auth.uid() = liked);
create policy "Like as myself" on public.likes for insert to authenticated with check (auth.uid() = liker and liker <> liked);
create policy "Unlike my likes" on public.likes for delete to authenticated using (auth.uid() = liker);

create or replace function public.is_match(a uuid, b uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from likes where liker = a and liked = b) and exists(select 1 from likes where liker = b and liked = a)
$$;

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender uuid not null references public.profiles(id) on delete cascade,
  receiver uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.messages (sender, receiver, created_at);
grant select, insert, update on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;
create policy "Read my messages" on public.messages for select to authenticated using (auth.uid() = sender or auth.uid() = receiver);
create policy "Message matches only" on public.messages for insert to authenticated with check (auth.uid() = sender and public.is_match(sender, receiver));
create policy "Mark received read" on public.messages for update to authenticated using (auth.uid() = receiver) with check (auth.uid() = receiver);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  region text not null,
  starts_at timestamptz not null,
  capacity int not null default 20
);
grant select on public.events to authenticated;
grant all on public.events to service_role;
alter table public.events enable row level security;
create policy "Members view events" on public.events for select to authenticated using (true);

create table public.event_rsvps (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);
grant select, insert, delete on public.event_rsvps to authenticated;
grant all on public.event_rsvps to service_role;
alter table public.event_rsvps enable row level security;
create policy "View rsvps" on public.event_rsvps for select to authenticated using (true);
create policy "RSVP myself" on public.event_rsvps for insert to authenticated with check (auth.uid() = user_id);
create policy "Cancel my rsvp" on public.event_rsvps for delete to authenticated using (auth.uid() = user_id);

insert into public.events (title, region, starts_at, capacity) values
 ('3-Minute Video Speed Dating', 'Gauteng', now() + interval '3 days', 30),
 ('Wine & Words Mixer', 'Western Cape', now() + interval '4 days', 20),
 ('Durban Beach Sundowner', 'KwaZulu-Natal', now() + interval '6 days', 25);

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.likes;
alter publication supabase_realtime add table public.event_rsvps;

create policy "Members read avatars" on storage.objects for select to authenticated using (bucket_id = 'avatars');
create policy "Upload own avatar" on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Update own avatar" on storage.objects for update to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
