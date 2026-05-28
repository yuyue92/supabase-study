create table profiles (
  id uuid primary key references auth.users(id),
  nickname text,
  avatar_url text,
  created_at timestamptz default now()
);

create table posts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table comments (
  id bigint generated always as identity primary key,
  post_id bigint references posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);
