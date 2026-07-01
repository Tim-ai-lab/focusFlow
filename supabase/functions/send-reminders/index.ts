// ═══════════════════════════════════════════════════════════════
// FocusFlow · send-reminders (Supabase Edge Function / Deno)
// ───────────────────────────────────────────────────────────────
// Wird per Cron-Job regelmäßig (z. B. alle 15 Min) aufgerufen und
// verschickt E-Mail-Erinnerungen an Nutzer, deren Routine heute noch
// offen ist – auch wenn die App geschlossen ist.
//
// Benötigte Secrets (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY   – API-Key von https://resend.com
//   CRON_SECRET      – frei wählbares Passwort (optional, empfohlen)
// (SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY sind automatisch vorhanden.)
//
// Deploy:  supabase functions deploy send-reminders --no-verify-jwt
// ═══════════════════════════════════════════════════════════════

import { createClient } from "jsr:@supabase/supabase-js@2";

// Zeitzone, in der die vom Nutzer eingestellten Erinnerungszeiten gelten:
const TZ = "Europe/Berlin";
// Absender: Resends Test-Absender funktioniert ohne eigene Domain,
// verschickt aber NUR an deine eigene (bei Resend registrierte) E-Mail.
// Mit verifizierter Domain hier z. B. "FocusFlow <erinnerung@deinedomain.de>".
const FROM = "FocusFlow <onboarding@resend.dev>";
const APP_URL = "https://tim-ai-lab.github.io/focusFlow/";

Deno.serve(async (req) => {
  // Optionaler Schutz: wenn CRON_SECRET gesetzt ist, muss ?secret=... passen
  const secret = Deno.env.get("CRON_SECRET");
  if (secret) {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") !== secret) {
      return new Response("unauthorized", { status: 401 });
    }
  }

  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return json({ error: "RESEND_API_KEY fehlt" }, 500);

  // Aktuelles Datum + Uhrzeit in der Zielzeitzone
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const g = (t: string) => parts.find((p) => p.type === t)!.value;
  const today = `${g("year")}-${g("month")}-${g("day")}`;
  const hm = `${g("hour")}:${g("minute")}`; // "HH:MM"

  const { data: profiles, error } = await supa
    .from("profiles").select("id,vision");
  if (error) return json({ error: error.message }, 500);

  let sent = 0;
  for (const p of profiles || []) {
    const v = (p as any).vision || {};
    const rem = v.reminders;
    if (!rem || !rem.enabled) continue;
    const dl = (v.dailyLog && v.dailyLog[today]) || {};
    const slots = [
      { slot: "morning", time: rem.morning || "08:00", done: !!dl.morning,
        subject: "🌅 Deine Morgenroutine wartet",
        body: "Starte deinen Tag mit Intention, Dankbarkeit und Fokus." },
      { slot: "evening", time: rem.evening || "20:00", done: !!dl.evening,
        subject: "🌙 Zeit für deine Abendreflexion",
        body: "Schließe deinen Tag bewusst ab – 8 Minuten für Lernen & morgen." },
    ];
    for (const s of slots) {
      if (!s.time || hm < s.time || s.done) continue;
      // Doppel-Versand verhindern: pro Nutzer/Tag/Slot nur einmal
      const { error: insErr } = await supa.from("reminder_sent")
        .insert({ user_id: (p as any).id, date: today, slot: s.slot });
      if (insErr) continue; // schon versendet (Unique-Verletzung) → überspringen

      const { data: u } = await supa.auth.admin.getUserById((p as any).id);
      const email = u?.user?.email;
      if (!email) continue;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": "Bearer " + resendKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM, to: [email], subject: s.subject,
          html: `<div style="font-family:system-ui,sans-serif;max-width:480px">
            <h2 style="color:#5B7FD4">${s.subject}</h2>
            <p style="font-size:15px;line-height:1.6;color:#2D3748">${s.body}</p>
            <p><a href="${APP_URL}" style="display:inline-block;background:#7C9EE8;color:#fff;text-decoration:none;padding:11px 20px;border-radius:10px;font-weight:700">FocusFlow öffnen →</a></p>
          </div>`,
        }),
      });
      sent++;
    }
  }
  return json({ ok: true, checked: (profiles || []).length, sent });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { "Content-Type": "application/json" },
  });
}
