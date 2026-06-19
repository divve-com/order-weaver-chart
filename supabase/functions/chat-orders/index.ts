// deno-lint-ignore-file no-explicit-any
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY")!;
const PINECONE_API_KEY = Deno.env.get("PINECONE_API_KEY")!;
const PINECONE_INDEX_HOST = Deno.env.get("PINECONE_INDEX_HOST")!;
const MODEL = "google/gemini-2.5-flash";

const normalizeHost = (h: string) => h.startsWith("http") ? h : `https://${h}`;

async function embed(text: string): Promise<number[]> {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "openai/text-embedding-3-small", input: text }),
  });
  if (!res.ok) throw new Error(`Embed ${res.status}: ${await res.text()}`);
  const j = await res.json();
  return j.data[0].embedding as number[];
}

async function pineconeQuery(values: number[], topK = 6) {
  const host = normalizeHost(PINECONE_INDEX_HOST);
  const res = await fetch(`${host}/query`, {
    method: "POST",
    headers: { "Api-Key": PINECONE_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ vector: values, topK, includeMetadata: true }),
  });
  if (!res.ok) throw new Error(`Pinecone query ${res.status}: ${await res.text()}`);
  return await res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lastUser = [...messages].reverse().find((m: any) => m.role === "user");
    const query = lastUser?.content ?? "";

    let contextBlock = "";
    if (query) {
      try {
        const vec = await embed(query);
        const result = await pineconeQuery(vec, 6);
        const matches = (result.matches ?? []) as any[];
        contextBlock = matches.map((m, i) => {
          const md = m.metadata ?? {};
          return `--- Treffer ${i + 1} (Score ${m.score?.toFixed(3)}) ---\n${md.text ?? JSON.stringify(md)}`;
        }).join("\n\n");
      } catch (e) {
        console.error("retrieval failed", e);
      }
    }

    const system = `Du bist ein hilfreicher Assistent für Produktionsaufträge. Beantworte Fragen ausschließlich anhand des bereitgestellten Auftragskontexts. Wenn die Information nicht im Kontext steht, sage das ehrlich.\n\nAuftragskontext:\n${contextBlock || "(keine Treffer)"}`;

    const orPayload = {
      model: MODEL,
      stream: true,
      messages: [
        { role: "system", content: system },
        ...messages.map((m: any) => ({ role: m.role, content: m.content })),
      ],
    };

    const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orPayload),
    });

    if (!orRes.ok || !orRes.body) {
      const errText = await orRes.text();
      return new Response(JSON.stringify({ error: errText }), {
        status: orRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Re-stream OpenRouter SSE as plain text deltas
    const stream = new ReadableStream({
      async start(controller) {
        const reader = orRes.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (data === "[DONE]") { controller.close(); return; }
              try {
                const j = JSON.parse(data);
                const delta = j.choices?.[0]?.delta?.content;
                if (delta) controller.enqueue(new TextEncoder().encode(delta));
              } catch { /* ignore parse */ }
            }
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    console.error("chat-orders error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});