// deno-lint-ignore-file no-explicit-any
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY")!;
const PINECONE_API_KEY = Deno.env.get("PINECONE_API_KEY")!;
const PINECONE_INDEX_HOST = Deno.env.get("PINECONE_INDEX_HOST")!;

const normalizeHost = (h: string) => h.startsWith("http") ? h : `https://${h}`;

async function embed(text: string): Promise<number[]> {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/text-embedding-3-small",
      input: text,
      dimensions: 1024,
    }),
  });
  if (!res.ok) {
    throw new Error(`Embedding failed ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  return json.data[0].embedding as number[];
}

function buildOrderText(o: any): string {
  return [
    `Auftragsnummer: ${o.number}`,
    `Artikel: ${o.article}`,
    `Kunde: ${o.customer}`,
    `Menge: ${o.qty} ${o.unit}`,
    `Status: ${o.status}`,
    `Priorität: ${o.priority}`,
    `Fortschritt: ${o.progress}%`,
    `Verantwortlich: ${o.owner_name}`,
    `Ressource: ${o.resource_id}`,
    `Start: ${o.start_at}`,
    `Ende: ${o.end_at}`,
    `Fällig: ${o.due_at}`,
    `Lastaufwand: ${o.load_hours}h`,
  ].join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { action, order, id } = body;
    const host = normalizeHost(PINECONE_INDEX_HOST);

    if (action === "delete") {
      const res = await fetch(`${host}/vectors/delete`, {
        method: "POST",
        headers: {
          "Api-Key": PINECONE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [id] }),
      });
      if (!res.ok) throw new Error(`Pinecone delete ${res.status}: ${await res.text()}`);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "upsert" && order) {
      const text = buildOrderText(order);
      const values = await embed(text);
      const res = await fetch(`${host}/vectors/upsert`, {
        method: "POST",
        headers: {
          "Api-Key": PINECONE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vectors: [{
            id: order.id,
            values,
            metadata: {
              number: order.number,
              article: order.article,
              customer: order.customer,
              status: order.status,
              priority: order.priority,
              owner_name: order.owner_name,
              resource_id: order.resource_id,
              progress: order.progress,
              qty: order.qty,
              unit: order.unit,
              start_at: order.start_at,
              end_at: order.end_at,
              due_at: order.due_at,
              text,
            },
          }],
        }),
      });
      if (!res.ok) throw new Error(`Pinecone upsert ${res.status}: ${await res.text()}`);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("sync-order-pinecone error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});