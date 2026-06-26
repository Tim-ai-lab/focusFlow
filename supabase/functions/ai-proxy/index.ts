// ═══════════════════════════════════════════════════════════════
// FocusFlow · AI-Proxy (Supabase Edge Function / Deno)
// ───────────────────────────────────────────────────────────────
// Diese Funktion läuft auf Supabase – NICHT im Browser.
// Sie hält die API-Keys als Secrets und leitet Anfragen an
// Anthropic (Claude) oder OpenAI (GPT) weiter.
//
// Der Browser ruft sie auf mit:
//   POST /functions/v1/ai-proxy
//   Authorization: Bearer <user-access-token>
//   { provider, system, messages, max_tokens }
//
// Secrets setzen (einmalig, per Terminal):
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//   supabase secrets set OPENAI_API_KEY=sk-...
// Deployen:
//   supabase functions deploy ai-proxy
// ═══════════════════════════════════════════════════════════════

// Modelle – bei Bedarf hier zentral ändern.
// Claude Opus 4.8 ist das stärkste Modell; für günstigere Kosten
// kann auf "claude-sonnet-4-6" gewechselt werden.
const ANTHROPIC_MODEL = "claude-opus-4-8";
const OPENAI_MODEL = "gpt-4o";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

// Prüft, dass der Aufrufer ein eingeloggter Nutzer ist (nicht nur der
// öffentliche anon-Key). Verhindert, dass Fremde die Funktion missbrauchen
// und deine API-Credits verbrauchen.
function isAuthenticatedUser(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return payload.role === "authenticated" && !!payload.sub;
  } catch {
    return false;
  }
}

async function callAnthropic(
  system: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number,
): Promise<Response> {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, 500);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.warn("Anthropic error:", res.status, data);
    return json({ error: data?.error?.message || "Anthropic-Fehler" }, 502);
  }
  const text = Array.isArray(data.content)
    ? data.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("")
    : "";
  return json({ text });
}

async function callOpenAI(
  system: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number,
): Promise<Response> {
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) return json({ error: "OPENAI_API_KEY nicht konfiguriert" }, 500);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.warn("OpenAI error:", res.status, data);
    return json({ error: data?.error?.message || "OpenAI-Fehler" }, 502);
  }
  const text = data?.choices?.[0]?.message?.content || "";
  return json({ text });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Nur POST erlaubt" }, 405);

  if (!isAuthenticatedUser(req.headers.get("authorization"))) {
    return json({ error: "Nicht autorisiert – bitte einloggen." }, 401);
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Ungültiger Request-Body" }, 400);
  }

  const provider = payload.provider === "openai" ? "openai" : "anthropic";
  const system = typeof payload.system === "string" ? payload.system : "";
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const maxTokens = Math.min(Math.max(Number(payload.max_tokens) || 1000, 1), 4000);

  if (!messages.length) return json({ error: "Keine Nachrichten übergeben" }, 400);

  try {
    return provider === "openai"
      ? await callOpenAI(system, messages, maxTokens)
      : await callAnthropic(system, messages, maxTokens);
  } catch (e) {
    console.warn("Proxy error:", e);
    return json({ error: "Verbindung zum KI-Anbieter fehlgeschlagen" }, 502);
  }
});
