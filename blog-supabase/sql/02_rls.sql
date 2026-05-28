alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;

create policy "profile_select"
on profiles
for select
using (true);

create policy "profile_insert"
on profiles
for insert
with check (auth.uid() = id);

create policy "profile_update"
on profiles
for update
using (auth.uid() = id);

create policy "posts_select"
on posts
for select
using (true);

create policy "posts_insert"
on posts
for insert
with check (auth.uid() = user_id);

create policy "posts_update"
on posts
for update
using (auth.uid() = user_id);

create policy "posts_delete"
on posts
for delete
using (auth.uid() = user_id);

create policy "comments_select"
on comments
for select
using (true);

create policy "comments_insert"
on comments
for insert
with check (auth.uid() = user_id);

create policy "comments_delete"
on comments
for delete
using (auth.uid() = user_id);
