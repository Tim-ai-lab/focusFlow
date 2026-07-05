# 🎯 FocusFlow

**Baue die App nicht als Feature-Sammlung, sondern als adaptiven, geschlossenen Entwicklungsweg: Diagnose → Vision → personalisierter Plan → tägliche Umsetzung → Abendreflexion → Mustererkennung → Re-Test → Weganpassung.**

Das ist der Kern dieser App – und der Maßstab für jede Änderung.

## Produktlogik

FocusFlow bietet dem Nutzer nicht viele Funktionen an, sondern wählt aus einem großen internen Methodenkatalog den **individuell wirksamsten nächsten Schritt** aus, **erklärt** ihn („Warum dieser Schritt für dich"), **begleitet** ihn (FocusAI-Coach), **reflektiert** ihn (adaptive Abendreflexion, Brems-Ursachen) und **kalibriert** den Weg anhand neuer Daten kontinuierlich neu (Hypothesen, Re-Test, Weg-Anpassungsprotokoll).

Der geschlossene Kreislauf:

1. **Diagnose** – psychologisch fundierter Eingangstest (16 Fragen + adaptive Vertiefung) → Analyse
2. **Vision** – 6-stufiger KI-begleiteter Vision-Prozess, Affirmation als täglicher Anker
3. **Personalisierter Plan** – „Mein Weg" in 5 Kapiteln; nur der nächste Schritt sichtbar, keine Feature-Bibliothek
4. **Tägliche Umsetzung** – Tagesziele (MIT), Fokus-Modus mit Ablenkungs-Parkplatz, Pomodoro
5. **Abendreflexion** – adaptiv & leichtgewichtig; Nicht-Erledigtes wird als Ursache kategorisiert (Diagnostik, kein Fehler)
6. **Mustererkennung** – prüfbare Hypothesen (keine Diagnosen), Wochen-Insight
7. **Re-Test** – Standort-Check im Rhythmus, Entwicklungsvergleich mit Interpretation
8. **Weganpassung** – automatische Neukalibrierung mit nachvollziehbarem Protokoll

## Technik

- Single-File-Web-App (`index.html`), PWA (installierbar), gehostet auf GitHub Pages
- Backend: Supabase (Auth, Postgres mit RLS, Edge Functions)
- KI: Supabase Edge Function `ai-proxy` (Anthropic/OpenAI, Keys als Server-Secrets)
- E-Mail-Erinnerungen: `supabase/functions/send-reminders` + `supabase/reminders-setup.sql` (siehe `MAIL-ERINNERUNGEN-SETUP.md`)

## Verantwortung

FocusFlow ist ein Coaching-Werkzeug und **ersetzt keine Psychotherapie oder ärztliche Behandlung**. Bei Krisensignalen verweist die App auf professionelle Hilfe (Telefonseelsorge 0800 111 0 111, Notruf 112) und setzt keine normalen Entwicklungsaufgaben fort.
