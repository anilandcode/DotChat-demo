# DocChat — Chat with your documents (RAG)

Upload PDFs, ask questions, and get **streaming answers with cited sources**. Built as a clean “production-style” demo of a RAG pipeline.

## Tech stack
- Next.js (App Router) + TypeScript
- Tailwind v4 tokens in `app/globals.css` (no `tailwind.config.*`)
- Vercel AI SDK (`ai`) + `@ai-sdk/openai-compatible`
- Supabase Postgres + pgvector

## Why two models
DocChat is designed to be a sellable demo of **model routing**:
- **DeepSeek**: fast, retrieval-grounded answers
- **Kimi**: long-context fallback / deeper reasoning

The UI includes a **Model** selector so visitors can A/B responses.

## Setup
### 1) Environment variables
Create `.env.local`:

```bash
# Kimi
MOONSHOT_API_KEY=sk-...
MOONSHOT_BASE_URL=https://api.moonshot.ai/v1
MOONSHOT_MODEL=...

# DeepSeek
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=...

# Embeddings
EMBED_API_KEY=sk-...
EMBED_BASE_URL=https://api.deepseek.com/v1
EMBED_MODEL=...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

### 2) Supabase schema
Run this SQL in Supabase Studio (SQL Editor):

```sql
create extension if not exists vector;

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  size_bytes int not null,
  pages int,
  status text default 'processing',
  created_at timestamptz default now()
);

create table if not exists chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  page int,
  chunk_index int not null,
  content text not null,
  embedding vector(1024),
  created_at timestamptz default now()
);

create index on chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace function match_chunks(
  query_embedding vector(1024),
  match_count int default 5,
  doc_id uuid default null
) returns table (
  id uuid,
  document_id uuid,
  page int,
  content text,
  similarity float
) language sql stable as $$
  select c.id, c.document_id, c.page, c.content,
         1 - (c.embedding <=> query_embedding) as similarity
  from chunks c
  where (doc_id is null or c.document_id = doc_id)
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
```

### 3) Run locally
```bash
pnpm dev
```

Open `http://localhost:3000`, upload a PDF, select it, and chat.

## Optional: seed docs
Place PDFs into `public/seed-docs/` named:
- `handbook.pdf`
- `product-manual.pdf`
- `security-policy.pdf`

Then run:

```bash
pnpm tsx scripts/seed-docs.ts
```

## Admin
Demo admin dashboard at `/admin`.

## Build notes
- PDF parsing runs in Node runtime (`/api/ingest`).
- Chat runs in Edge runtime (`/api/chat`) and streams UI message parts (including custom citation data parts).
