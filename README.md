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
Copy `.env.example` to `.env.local` and fill in the values:

```bash
# Kimi K2.6 / Moonshot
MOONSHOT_API_KEY=sk-...
MOONSHOT_BASE_URL=https://api.moonshot.ai/v1
MOONSHOT_MODEL=kimi-k2.6

# DeepSeek V4 Pro
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-v4-pro

# Retrieval embeddings / reranking
EMBED_API_KEY=sk-...
EMBED_BASE_URL=https://api.deepseek.com/v1
EMBED_MODEL=deepseek-embedding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

### 2) Supabase schema
Run `supabase/schema.sql` in Supabase Studio (SQL Editor). The schema enables pgvector, creates `documents` and `chunks`, and adds the `match_chunks` RPC used by `/api/chat`.

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
