# DocChat - RAG over your PDFs

DocChat is a portfolio RAG demo that lets users upload a PDF, ask questions, and receive grounded answers with source citations. The product story is model routing: Kimi K2.6 handles the primary chat experience, while DeepSeek V4 Pro supports retrieval, embeddings, and side-by-side comparison.

Live demo target: `https://docchat-demo.vercel.app`

Built by [Anil Pervaiz](https://anilpervaiz.com) - full-stack AI architect for SMBs and agencies.

## Tech stack

- Next.js 16 App Router + TypeScript
- Tailwind v4 tokens in `app/globals.css`
- Vercel AI SDK v6 + `@ai-sdk/openai-compatible`
- Kimi K2.6 / Moonshot for primary chat
- DeepSeek V4 Pro for retrieval support and comparison
- Supabase Postgres + pgvector
- `pdf-parse` for PDF extraction

## How it works

```text
PDF upload
  -> /api/ingest
  -> pdf-parse extracts page text
  -> tiktoken chunks text into ~500-token windows
  -> DeepSeek-compatible embedding endpoint creates vectors
  -> Supabase stores documents + chunks in pgvector

User question
  -> /api/chat
  -> query embedding
  -> match_chunks RPC returns top document chunks
  -> Kimi generates a cited answer from retrieved context
  -> UI renders citation pills with source snippets

Compare mode
  -> /api/compare
  -> same retrieved chunks
  -> Kimi and DeepSeek answer in parallel
  -> UI shows latency, token usage, and citations side by side
```

## Why two models

Most demos wire one model and stop. DocChat demonstrates a better production pattern:

- **Kimi K2.6**: primary answer model for long-context reasoning and higher-quality document responses.
- **DeepSeek V4 Pro**: retrieval support and comparison model for fast grounded analysis.
- **Supabase pgvector**: simple, affordable vector storage without adding Pinecone or LangChain.

## Setup

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
MOONSHOT_API_KEY=sk-...
MOONSHOT_BASE_URL=https://api.moonshot.ai/v1
MOONSHOT_MODEL=kimi-k2.6

DEEPSEEK_API_KEY=sk-...
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-v4-pro

EMBED_API_KEY=sk-...
EMBED_BASE_URL=https://api.deepseek.com/v1
EMBED_MODEL=deepseek-embedding

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

Do not commit `.env.local`. It is ignored by Git.

### 2. Supabase schema

Create a Supabase project, then run `supabase/schema.sql` in Supabase Studio SQL Editor. The schema enables pgvector, creates the `documents` and `chunks` tables, and adds the `match_chunks` RPC used by retrieval.

Confirm your embedding model dimension before production deploy. The checked-in schema uses `vector(1024)` because the original build plan assumed DeepSeek-compatible 1024-dimensional embeddings.

### 3. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`, upload a PDF, select it, and chat.

## Scripts

```bash
npm run build
npm run start
```

Optional seed script:

```bash
pnpm tsx scripts/seed-docs.ts
```

The seed script expects PDFs in `public/seed-docs/`:

- `handbook.pdf`
- `product-manual.pdf`
- `security-policy.pdf`

## Routes

- `/` - landing page + live upload/chat demo
- `/admin` - demo analytics dashboard
- `/api/ingest` - PDF ingestion pipeline
- `/api/documents` - document list
- `/api/chat` - streaming RAG chat
- `/api/compare` - Kimi vs DeepSeek comparison

## Business CTA

Want one for your business? Book a 15-minute call:

https://calendly.com/anilpervaiz/15min
