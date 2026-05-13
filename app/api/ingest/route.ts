import { NextResponse } from "next/server";
import { chunkText } from "@/lib/chunk";
import { embedTexts } from "@/lib/embed";
import { parsePdf } from "@/lib/parse-pdf";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const filename = file.name || "upload.pdf";
  const contentType = file.type || "";
  const isPdf = contentType === "application/pdf" || filename.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return NextResponse.json({ error: "Only PDF supported in v1" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: doc, error: docErr } = await supabase
    .from("documents")
    .insert({ filename, size_bytes: file.size, status: "processing" })
    .select("*")
    .single();

  if (docErr || !doc) {
    return NextResponse.json({ error: docErr?.message ?? "Failed to create document" }, { status: 500 });
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const parsed = await parsePdf(buf);

    let totalChunks = 0;
    for (const p of parsed.pages) {
      const chunks = chunkText(p.text, 500, 50);
      if (!chunks.length) continue;

      const vectors = await embedTexts(chunks.map((c) => c.content));
      const rows = chunks.map((c, idx) => ({
        document_id: doc.id,
        page: p.page,
        chunk_index: totalChunks + idx,
        content: c.content,
        embedding: vectors[idx],
      }));

      const { error: chunkErr } = await supabase.from("chunks").insert(rows);
      if (chunkErr) throw new Error(chunkErr.message);

      totalChunks += chunks.length;
    }

    await supabase
      .from("documents")
      .update({ status: "ready", pages: parsed.totalPages })
      .eq("id", doc.id);

    return NextResponse.json({
      documentId: doc.id,
      chunks: totalChunks,
      pages: parsed.totalPages,
    });
  } catch (e) {
    await supabase.from("documents").update({ status: "error" }).eq("id", doc.id);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ingest failed" },
      { status: 500 },
    );
  }
}

