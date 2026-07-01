# FocusFlow – E-Mail-Erinnerungen einrichten

Erinnerungen **auch bei geschlossener App**. Drei Bausteine:
1. **Resend** – verschickt die E-Mails
2. **Edge Function `send-reminders`** – entscheidet, wer eine Mail bekommt
3. **Cron-Job** – ruft die Function alle 15 Minuten auf

> ⏱️ Aufwand: ~20–30 Min. Etwas technischer als die bisherigen Schritte.

---

## 1. Resend-Konto + API-Key
1. Auf https://resend.com kostenlos registrieren.
2. **API Keys → Create API Key** → Key kopieren (beginnt mit `re_...`).

> **Wichtig ohne eigene Domain:** Mit dem Test-Absender `onboarding@resend.dev`
> kannst du E-Mails **nur an deine eigene** (bei Resend registrierte) Adresse
> senden – für dich als Einzelnutzer reicht das. Willst du an beliebige Nutzer
> senden, musst du in Resend eine **Domain verifizieren** und in
> `send-reminders/index.ts` die Zeile `FROM = ...` auf deine Domain ändern.

---

## 2. Secrets in Supabase setzen
Supabase-Dashboard → **Edge Functions → Secrets → Add new secret**:
- `RESEND_API_KEY` = dein `re_...`-Key
- `CRON_SECRET` = ein selbst ausgedachtes Passwort (z. B. `ff-8x2k...`) — schützt die Function vor fremden Aufrufen

(`SUPABASE_URL` und `SUPABASE_SERVICE_ROLE_KEY` sind automatisch da.)

---

## 3. Edge Function anlegen & deployen
**Dashboard-Weg (wie bei ai-proxy):**
- **Edge Functions → Deploy a new function → Via Editor**
- Name: **`send-reminders`**
- Inhalt aus `supabase/functions/send-reminders/index.ts` komplett einfügen
- **Deploy**
- Danach: **Function → Settings → „Verify JWT" ausschalten** (der Cron ruft ohne Login-Token auf; Schutz übernimmt `CRON_SECRET`).

**CLI-Weg (Alternative):**
```bash
supabase functions deploy send-reminders --no-verify-jwt
```

---

## 4. Datenbank + Cron einrichten
Supabase → **SQL Editor → New query** → Inhalt aus `supabase/reminders-setup.sql` einfügen.
**Vorher** im Skript `dein-cron-geheimnis` durch **denselben Wert wie `CRON_SECRET`** ersetzen. Dann **Run**.

Das legt die Dedup-Tabelle an und plant den Aufruf alle 15 Minuten.

---

## 5. In der App aktivieren
App → **👤 Mein Bereich → 🔔 Erinnerungen → aktivieren**, Zeiten für Morgen/Abend setzen. Diese Einstellungen liegen im Profil und werden vom Cron gelesen.

---

## 6. Testen
- Setze die Abend-Erinnerung testweise auf **1–2 Minuten in der Zukunft** und mach die Abendreflexion heute **nicht**.
- Warte auf den nächsten Cron-Lauf (max. 15 Min) – oder rufe die Function einmal manuell auf:
  `https://flhkddgfhxlonhvgavgi.supabase.co/functions/v1/send-reminders?secret=DEIN-CRON-SECRET`
- Es sollte **eine** E-Mail kommen (und kein zweites Mal am selben Tag).

---

## Wichtige Hinweise
- **Zeitzone:** Die Erinnerungszeiten gelten in `Europe/Berlin` (oben in `index.ts` einstellbar).
- **Logs bei Problemen:** Edge Functions → `send-reminders` → **Logs** (zeigt `sent`-Anzahl und Fehler).
- **Keine Mail?** Prüfen: RESEND_API_KEY korrekt? Absender-Beschränkung (nur eigene Adresse ohne Domain)? Erinnerungen in der App aktiviert? Routine heute wirklich noch offen?
- **Kosten:** Resend Free-Tier reicht für persönliche Nutzung locker.
