// FocusFlow · 01-config.js — Supabase-Konfiguration, Konstanten, Lookup-Tabellen
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── CONFIG ──  Supabase-Schlüssel, Konstanten, Lookup-Tabellen
// ═══════════════════════════════════════════════════════════════
const SB_URL='https://flhkddgfhxlonhvgavgi.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaGtkZGdmaHhsb25odmdhdmdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjA5NzYsImV4cCI6MjA5NTE5Njk3Nn0.ZidiOVEffq6rN7vPY3tBIf36oz3DJIK_y5XFdBJnmfs';
const FETCH_TIMEOUT=10000;

const QUOTES=['💡 Der beste Zeitpunkt anzufangen war gestern. Der zweitbeste ist jetzt.','🚀 Du musst nicht perfekt sein – du musst nur anfangen.','🎯 Kleine Schritte führen zu großen Zielen.','💪 Disziplin schlägt Motivation jeden Tag.','🌟 Erfolg ist die Summe kleiner Anstrengungen.','⚡ Starte jetzt. Verbessere später.','🔥 Jede erledigte Aufgabe ist ein Sieg.','🧠 Prokrastination lügt. Du kannst anfangen.','⏰ Gut genug und gestartet schlägt perfekt und nie.','🌈 Du bist produktiver als du denkst!','🎯 Deine Vision zieht dich an – lass sie zu.','💎 Konsistenz schlägt Intensität immer.'];
const CATLBLS={handy:'📱 Handy',aufschieben:'📋 Aufschieben',ablenkung:'🎮 Ablenkung',essen:'🍕 Essen',sozial:'💬 Soziale Medien',sonstiges:'📌 Sonstiges'};
const LIFE_AREAS=[{id:'career',icon:'💼',name:'Karriere',desc:'Beruf & Wachstum'},{id:'health',icon:'💪',name:'Gesundheit',desc:'Körper & Geist'},{id:'relations',icon:'❤️',name:'Beziehungen',desc:'Familie & Freunde'},{id:'finance',icon:'💰',name:'Finanzen',desc:'Geld & Sicherheit'},{id:'personal',icon:'🧠',name:'Persönlichkeit',desc:'Lernen & Entwicklung'},{id:'meaning',icon:'✨',name:'Sinn & Zweck',desc:'Werte & Vision'}];
const LA_BADGE={career:'💼',health:'💪',relations:'❤️',finance:'💰',personal:'🧠',meaning:'✨'};
const REC_LBL={daily:'🔁 Täglich',weekly:'📅 Wöchentlich',monthly:'📆 Monatlich'};
const RWS=[{e:'🏆',t:'Fantastisch!',m:'5 Aufgaben erledigt!'},{e:'🌟',t:'Superstar!',m:'10 Aufgaben – unaufhaltbar!'},{e:'🚀',t:'Rakete!',m:'15 Aufgaben – keine Grenzen!'},{e:'🎉',t:'Champion!',m:'20 Aufgaben – Rekord!'}];

