# Vue 3 + Supabase Enterprise Starter

A scalable, production-ready starter built with **Vue 3**, **Supabase**, **Pinia**, **Vue Router**, and **TailwindCSS**.

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase project credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

Find these in your [Supabase dashboard](https://supabase.com/dashboard) under **Project Settings → API**.

### 3. Set up the database

Run this SQL in your Supabase SQL editor to create the required tables and RLS policies:

```sql
-- Projects table
CREATE TABLE projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  title       text NOT NULL,
  description text,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row-Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own rows
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE USING (auth.uid() = user_id);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
```

### 4. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173).

---

## Architecture overview

```
src/
├── lib/supabase.ts              # Singleton Supabase client
├── composables/
│   ├── useAuth.ts               # Auth: signIn, signOut, magic link, session init
│   ├── useRealtime.ts           # Generic realtime channel factory
│   └── features/
│       └── useProjects.ts       # Projects CRUD + realtime subscription
├── stores/
│   ├── auth.store.ts            # Pinia: session & user state
│   └── projects.store.ts        # Pinia: Map-based project cache
├── router/index.ts              # Routes + auth guard
├── layouts/                     # AuthLayout, DefaultLayout
├── views/                       # LoginView, RegisterView, ProjectsView, etc.
└── types/                       # database.types.ts, app.types.ts
```

**Key design rules:**
- Components only call composables and read from stores. They never import the Supabase client.
- Composables own all Supabase logic and push results into stores.
- Stores are pure in-memory caches — no Supabase calls inside them.
- Realtime channels are subscribed in `onMounted` and removed in `onUnmounted` to prevent memory leaks.

---

## Regenerate TypeScript types

After changing your Supabase schema, regenerate types:

```bash
npm run types:supabase
# (replace YOUR_PROJECT_ID in package.json first)
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend framework | Vue 3 + Composition API (`<script setup>`) |
| Build tool | Vite |
| Type safety | TypeScript |
| State management | Pinia |
| Routing | Vue Router 4 |
| Styling | TailwindCSS |
| Backend / BaaS | Supabase (Auth, PostgreSQL, Realtime) |
