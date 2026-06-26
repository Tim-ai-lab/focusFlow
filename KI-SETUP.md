# FocusFlow – KI einrichten (Anthropic / OpenAI)

Die KI-Funktionen (FocusAI-Chat, Vision-Prozess, Schritt-Zusammenfassungen)
laufen über eine **Supabase Edge Function** namens `ai-proxy`. Die API-Keys
liegen als **Supabase-Secrets** auf dem Server – sie landen **nie** im Browser
und damit auch nicht im öffentlichen GitHub-Pages-Code.

In der App gibt es im Tab **🤖 FocusAI** oben rechts einen Umschalter
zwischen **Claude (Anthropic)** und **GPT (OpenAI)**.

---

## Voraussetzungen (einmalig)

1. **Supabase CLI installieren**
   - Windows (mit Scoop): `scoop install supabase`
   - oder siehe https://supabase.com/docs/guides/cli

2. **Einloggen & Projekt verknüpfen** (im Projektordner `App/`):
   ```bash
   supabase login
   supabase link --project-ref flhkddgfhxlonhvgavgi
   ```
   (Die `project-ref` ist der Teil deiner Supabase-URL vor `.supabase.co`.)

---

## 1. API-Keys als Secrets hinterlegen

Du brauchst nur den/die Key(s) für die Anbieter, die du nutzen willst.

```bash
# Für Claude (Anthropic) – Key von https://console.anthropic.com/
supabase secrets set ANTHROPIC_API_KEY=sk-ant-DEIN-KEY

# Für GPT (OpenAI) – Key von https://platform.openai.com/api-keys
supabase secrets set OPENAI_API_KEY=sk-DEIN-KEY
```

> Du kannst die Keys auch im Supabase-Dashboard setzen:
> **Project Settings → Edge Functions → Secrets**.

---

## 2. Edge Function deployen

```bash
supabase functions deploy ai-proxy
```

Fertig. Die Function ist jetzt erreichbar unter
`https://flhkddgfhxlonhvgavgi.supabase.co/functions/v1/ai-proxy`
und wird von der App automatisch aufgerufen.

---

## Wie es funktioniert (Sicherheit)

- Der Browser ruft **nur** die Edge Function auf und schickt dabei das
  **Login-Token des Nutzers** mit (kein API-Key).
- Die Function prüft, dass der Aufrufer ein **eingeloggter Nutzer** ist
  (nicht nur der öffentliche anon-Key) – so kann niemand Fremdes deine
  KI-Credits verbrauchen.
- Erst die Function fügt den echten API-Key hinzu und ruft Anthropic bzw.
  OpenAI auf. Der Key verlässt den Server nie.

---

## Modell ändern (optional)

Die verwendeten Modelle stehen oben in
`supabase/functions/ai-proxy/index.ts`:

```ts
const ANTHROPIC_MODEL = "claude-opus-4-8";  // stärkstes Modell
const OPENAI_MODEL = "gpt-4o";
```

Für günstigere Kosten bei Claude kannst du z. B. auf
`"claude-sonnet-4-6"` wechseln. Nach einer Änderung erneut
`supabase functions deploy ai-proxy` ausführen.

---

## Fehlersuche

- **„KI momentan nicht erreichbar"** in der App → meist fehlt der Secret
  oder die Function ist noch nicht deployt. Logs ansehen:
  ```bash
  supabase functions logs ai-proxy
  ```
- **401 „Nicht autorisiert"** → der Nutzer ist nicht eingeloggt, oder das
  Token ist abgelaufen (neu anmelden).
- **502-Fehler** → der API-Key ist ungültig oder das Anbieter-Kontingent
  ist aufgebraucht. Die Logs zeigen die genaue Anbieter-Meldung.
