import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";

const BASE_URL = process.env.SEED_BASE_URL ?? "http://localhost:3000";

async function ingestFile(path: string) {
  const buf = await readFile(path);
  const file = new File([buf], basename(path), { type: "application/pdf" });

  const fd = new FormData();
  fd.set("file", file);

  const res = await fetch(`${BASE_URL}/api/ingest`, { method: "POST", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json)}`);
  return json as { documentId: string; chunks: number; pages: number };
}

async function main() {
  const dir = join(process.cwd(), "public", "seed-docs");
  const files = ["handbook.pdf", "product-manual.pdf", "security-policy.pdf"].map((f) => join(dir, f));

  for (const f of files) {
    // eslint-disable-next-line no-console
    console.log(`Ingesting ${f}...`);
    const out = await ingestFile(f);
    // eslint-disable-next-line no-console
    console.log(`✓ ${out.documentId} (${out.pages} pages, ${out.chunks} chunks)`);
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

