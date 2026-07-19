// FocusFlow · 18-init.js — Start: Service Worker registrieren, Session wiederherstellen
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ── INIT ──
if('serviceWorker' in navigator){try{navigator.serviceWorker.register('sw.js');}catch(e){console.warn('SW',e);}}
(async()=>{
  let recovery=false;
  try{recovery=checkRecovery();}catch(e){console.error('checkRecovery',e);}
  if(recovery)return; // Passwort-Reset hat Vorrang
  try{await tryRestoreSession();}catch(e){console.error('restoreSession',e);loading(false);}
})();
