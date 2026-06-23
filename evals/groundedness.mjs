import { readFileSync, writeFileSync } from "node:fs";

/*
 * Groundedness eval for DotChat answers — mirrors the Litmus harness
 * (github.com/anilandcode/litmus). For each fixture, an LLM judge scores how
 * well the ANSWER is supported by the CONTEXT. Runs keyless via a deterministic
 * mock judge; set GEMINI_API_KEY to judge with a real model. No extra deps.
 *
 *   node evals/groundedness.mjs   (or: npm run evals)
 */

const fixtures = JSON.parse(readFileSync(new URL("./fixtures.json", import.meta.url), "utf8"));

async function judge(context, answer) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    // Deterministic stand-in: grounded if any 4+ char answer word appears in context.
    const ctx = context.join(" ").toLowerCase();
    const words = answer.toLowerCase().match(/[a-z]{4,}/g) ?? [];
    return words.some((w) => ctx.includes(w)) ? 1 : 0.2;
  }
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: 'Score how grounded the ANSWER is in the CONTEXT. Return JSON {"score":0..1}. JSON only.' }],
        },
        contents: [{ role: "user", parts: [{ text: `CONTEXT:\n${context.join("\n")}\n\nANSWER:\n${answer}` }] }],
        generationConfig: { temperature: 0, responseMimeType: "application/json", maxOutputTokens: 64 },
      }),
    }
  );
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  try {
    return Math.max(0, Math.min(1, Number(JSON.parse(text).score) || 0));
  } catch {
    return 0;
  }
}

const rows = [];
for (const f of fixtures) {
  rows.push({ id: f.id, score: await judge(f.context, f.answer), grounded: f.grounded });
}

const mean = rows.reduce((s, r) => s + r.score, 0) / (rows.length || 1);
const passRate = rows.filter((r) => r.score >= 0.7).length / (rows.length || 1);

const md = [
  "# EVAL_SUMMARY — docchat groundedness",
  "",
  `_${rows.length} fixtures · judge: ${process.env.GEMINI_API_KEY ? "gemini-2.0-flash" : "deterministic mock"}_`,
  "",
  `- **meanGroundedness: ${mean.toFixed(3)}**`,
  `- **passRate (>=0.7): ${passRate.toFixed(3)}**`,
  "",
  "| id | score | expected grounded |",
  "|---|---:|:--:|",
  ...rows.map((r) => `| ${r.id} | ${r.score.toFixed(2)} | ${r.grounded ? "yes" : "no"} |`),
  "",
].join("\n");

writeFileSync(new URL("./EVAL_SUMMARY.md", import.meta.url), md);
console.log(md);
