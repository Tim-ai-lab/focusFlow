-- ═══════════════════════════════════════════════════════════════
-- FocusFlow · E-Mail-Erinnerungen: Datenbank-Setup
-- Im Supabase SQL-Editor ausführen (nachdem die Edge Function deployt ist).
-- ═══════════════════════════════════════════════════════════════

-- 1) Tabelle, die verhindert, dass eine Erinnerung mehrfach am Tag rausgeht
create table if not exists public.reminder_sent (
  user_id uuid not null,
  date    date not null,
  slot    text not null,
  sent_at timestamptz not null default now(),
  primary key (user_id, date, slot)
);

-- RLS an, KEINE Policy: nur die Edge Function (Service-Role) darf schreiben,
-- normale Nutzer haben keinen Zugriff.
alter table public.reminder_sent enable row level security;

-- 2) Erweiterungen für zeitgesteuerte HTTP-Aufrufe
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 3) Cron-Job: ruft die Edge Function alle 15 Minuten auf.
--    >>> WICHTIG: dein-cron-geheimnis durch denselben Wert wie das
--        Secret CRON_SECRET ersetzen (oder ?secret-Teil weglassen,
--        wenn du CRON_SECRET nicht gesetzt hast).
select cron.schedule(
  'focusflow-reminders',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := 'https://flhkddgfhxlonhvgavgi.supabase.co/functions/v1/send-reminders?secret=dein-cron-geheimnis',
    headers := '{"Content-Type":"application/json"}'::jsonb
  );
  $$
);

-- Nützlich zum Prüfen/Entfernen:
--   select * from cron.job;                       -- laufende Jobs anzeigen
--   select cron.unschedule('focusflow-reminders'); -- Job wieder entfernen
