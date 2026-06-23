# DotChat — AI Interaction Pattern Library

A catalogue of the interaction states in this RAG chat product, with the design rationale for
each. The thesis: **an AI answer is only trustworthy if the interface is honest about where it
came from and how sure it is.** Every pattern below exists to make provenance and uncertainty
legible — the design craft the product roles (DeepMind, Lattice, BCG X) screen for.

## State map
| State | Trigger | What the user sees | Why |
|---|---|---|---|
| **No document** | No active doc | Dashed empty panel: "Upload and select a document to start." | Don't offer a chat that can't be grounded — remove the affordance until retrieval is possible. |
| **Ready / empty** | Doc selected, no messages | "Ask against the document." + prompt starters | Lower the blank-page cost; the starters teach what the doc-grounded model is good at. |
| **Submitted** | Query sent | Status line: "Embedding query…" (spinner) | Name the *real* step (embedding, not "thinking") so the wait is legible, not a black box. |
| **Streaming** | Tokens arriving | "Generating grounded answer…" + live text | "Grounded" in the label sets the expectation: this is from the doc, not the model's memory. |
| **Answered + cited** | Answer with `[chunk_id]` markers | Markers stripped from prose; clickable **citation pills** (filename + page + snippet) | Provenance is a first-class object, not a footnote. One click verifies the claim. |
| **Confidence: high** | Top similarity ≥ 0.70 | Green "High confidence" chip | Affirm strong retrieval without nagging — no banner, just a quiet signal. |
| **Confidence: medium** | 0.50–0.70 | Amber chip + "double-check the cited pages" | Calibrated caution: usable, but invite verification rather than implying certainty. |
| **Confidence: low** | < 0.50 | Red chip + "the document may not cover this — verify or rephrase" | The highest-value honesty moment: weak retrieval is surfaced *before* the user trusts a thin answer. |
| **Refusal** | Chunks don't contain the answer | "I couldn't find this in the uploaded document." | An explicit, designed refusal beats a confident hallucination. Failure is a state, not a bug. |
| **Error** | API/generation failure | Red banner + Dismiss + "Try {other model}" | Recovery is part of the flow — give an action (switch model), not a dead end. |
| **Compare** | "Compare" pressed | Two model answers side-by-side, each with latency/tokens + its own citations | Make model choice evidence-based: see grounding + cost differences, don't guess. |

## Principles
1. **Provenance is a UI object.** Citations are clickable pills tied to filename + page, not
   inline footnote numbers — verification is one interaction away.
2. **Uncertainty is graded and visible.** Confidence is derived from real retrieval similarity
   (best chunk) and shown as a calibrated high/medium/low signal — never hidden.
3. **Refusal is designed.** "Not in the document" is a deliberate, styled state, because an
   honest "I don't know" is more valuable than a fluent wrong answer.
4. **Name the real step.** "Embedding query" / "Generating grounded answer" — the labels
   describe what's actually happening, so the wait builds trust instead of mystery.
5. **Every failure has an exit.** Errors offer a concrete next action (dismiss, switch model).

## Where each lives
- Confidence derive: `app/api/chat/route.ts` (best chunk similarity → `confidence`).
- Confidence + refusal UI: `components/chat/message.tsx` (`confidenceMeta`, the chip + advisory).
- Citations: `components/chat/citation-pill.tsx`, `components/chat/message.tsx`.
- Streaming / progress / error / compare states: `components/chat/chat-window.tsx`.
- Refusal instruction: `lib/system-prompt-rag.ts`.

## How quality is measured
Groundedness (does every claim trace to retrieved context?) is evaluated, not assumed — see
`evals/` (`npm run evals`), mirroring the Litmus harness. A confident-but-ungrounded answer is
the failure this product is designed to avoid, so it's the thing we measure.
