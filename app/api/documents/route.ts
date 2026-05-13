import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "edge";

export async function GET() {
  const supabase = (() => {
    try {
      return getSupabaseAdmin();
    } catch (e) {
      return e instanceof Error ? e : new Error("Supabase is not configured");
    }
  })();

  if (supabase instanceof Error) {
    return NextResponse.json({ error: supabase.message }, { status: 500 });
  }

  const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ documents: data ?? [] });
}
