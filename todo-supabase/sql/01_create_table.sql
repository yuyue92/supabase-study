create table todos (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  is_done boolean default false,
  created_at timestamptz default now()
);
