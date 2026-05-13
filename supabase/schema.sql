create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  size_bytes int not null,
  pages int,
  status text not null default 'processing',
  created_at timestamptz default now()
);

create table if not exists public.chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  page int,
  chunk_index int not null,
  content text not null,
  embedding vector(1024),
  created_at timestamptz default now()
);

create index if not exists chunks_embedding_idx
  on public.chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create index if not exists chunks_document_id_idx
  on public.chunks (document_id);

create index if not exists documents_created_at_idx
  on public.documents (created_at desc);

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
) language sql stable
set search_path = public
as $$
  select c.id, c.document_id, c.page, c.content,
         1 - (c.embedding <=> query_embedding) as similarity
  from public.chunks c
  where (doc_id is null or c.document_id = doc_id)
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

notify pgrst, 'reload schema';
