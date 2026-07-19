// FocusFlow · 14-journal.js — Wochenrückblick und Tagesjournal
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── REVIEW ──  Wochenrückblick speichern und anzeigen
// ═══════════════════════════════════════════════════════════════
async function saveReview(){
  const entry={date:new Date().toISOString().split('T')[0],good:gv('rev-good'),learn:gv('rev-learn'),vision:gv('rev-vision'),procr:gv('rev-procr'),next:gv('rev-next')};
  if(!entry.good&&!entry.learn){toast('Bitte mindestens eine Frage beantworten.');return;}
  D.reviews=D.reviews.filter(r=>r.date!==entry.date);D.reviews.unshift(entry);D.reviews=D.reviews.slice(0,12);
  await saveProfile();toast('🔄 Wochenrückblick gespeichert – zurück zu deinem Weg.');logStep('first_review');renderReviews();try{renderJourney();}catch(e){}
  ['rev-good','rev-learn','rev-vision','rev-procr','rev-next'].forEach(id=>document.getElementById(id).value='');
  routeAfterSave();
}
function renderReviews(){
  const el=document.getElementById('review-history');
  if(!D.reviews.length){el.innerHTML='<div class="empty">Noch keine Rückblicke.</div>';return;}
  el.innerHTML=D.reviews.slice(0,5).map(r=>`<div style="border:1.5px solid var(--bo);border-radius:var(--r2);padding:14px;margin-bottom:10px;background:var(--bg)">
    <div style="font-size:.78rem;font-weight:700;color:var(--p);margin-bottom:8px">KW ${getWeekNum(r.date)} – ${new Date(r.date+'T12:00:00').toLocaleDateString('de-DE',{day:'2-digit',month:'short',year:'numeric'})}</div>
    ${r.good?`<div style="font-size:.82rem;margin-bottom:5px"><strong>🏆 Gut:</strong> ${esc(r.good)}</div>`:''}
    ${r.next?`<div style="font-size:.82rem;color:#065F46;background:#DCFCE7;border-radius:6px;padding:6px 9px;margin-top:6px"><strong>🎯 Nächste Woche:</strong> ${esc(r.next)}</div>`:''}
  </div>`).join('');
}
// ═══════════════════════════════════════════════════════════════
// ── JOURNAL ──  Tagesjournal laden, speichern, anzeigen
// ═══════════════════════════════════════════════════════════════
let journalDate=new Date().toISOString().split('T')[0];
let journalCache={};
let pendingHabits=[];

async function loadJournalEntry(date){
  if(journalCache[date])return journalCache[date];
  const r=await sbFetch('/rest/v1/journal?user_id=eq.'+UID+'&date=eq.'+date);
  if(r.ok&&r.data&&r.data.length){journalCache[date]=r.data[0];return r.data[0];}
  return null;
}
async function saveJournalEntry(){
  const today=new Date().toISOString().split('T')[0];
  if(journalDate!==today){toast('Du kannst nur den heutigen Eintrag bearbeiten.');return;}
  const entry=await buildTodayEntry();
  entry.free_note=document.getElementById('j-note').value.trim();
  const existing=await loadJournalEntry(today);
  const id=existing?.id||(UID+'_'+today);
  const payload={id,user_id:UID,date:today,...entry,updated_at:new Date().toISOString()};
  const r=await sbFetch('/rest/v1/journal?id=eq.'+id,{method:'POST',headers:{'Prefer':'resolution=merge-duplicates'},body:JSON.stringify(payload)});
  if(r.ok){journalCache[today]={...payload};logStep('journal_7days');toast('📓 Tageseintrag gespeichert!');renderJournal();}
  else toast('❌ Fehler beim Speichern.');
}
async function autoSaveJournal(){
  const today=new Date().toISOString().split('T')[0];
  const entry=await buildTodayEntry();
  const existing=await loadJournalEntry(today);
  const id=existing?.id||(UID+'_'+today);
  const freeNote=existing?.free_note||'';
  const payload={id,user_id:UID,date:today,...entry,free_note:freeNote,updated_at:new Date().toISOString()};
  await sbFetch('/rest/v1/journal?id=eq.'+id,{method:'POST',headers:{'Prefer':'resolution=merge-duplicates'},body:JSON.stringify(payload)});
  journalCache[today]={...payload};
}
async function buildTodayEntry(){
  const today=new Date().toISOString().split('T')[0];
  const doneTasks=D.tasks.filter(t=>t.done).map(t=>({name:t.name.replace(/_rec_\d{4}-\d{2}-\d{2}$/,''),lifeArea:t.lifeArea||'',diff:t.diff,pts:t.diff==='hard'?30:t.diff==='medium'?20:10}));
  const morning=D.dailyLog?.[today]?.morning||null;
  const evening=D.dailyLog?.[today]?.evening||null;
  const mood=D.dailyLog?.[today]?.mood||'';
  const wb=D.wellbeing?.find(w=>w.date===today)||null;
  const existing=await loadJournalEntry(today);
  const habits=existing?.habits||pendingHabits;
  return{morning,evening,mood,wellbeing:wb,tasks_done:doneTasks,pomo_count:D.pomoSess,habits,score:D.todayScore};
}
function addHabitToJournal(){
  const habit=document.getElementById('j-habit').value.trim();
  const strategy=document.getElementById('j-strategy').value.trim();
  if(!habit){toast('Bitte Angewohnheit beschreiben!');return;}
  if(!strategy){toast('Bitte Gegenstrategie beschreiben!');return;}
  pendingHabits.push({cat:gs('j-hcat'),habit,trigger:document.getElementById('j-trigger').value.trim(),strategy});
  document.getElementById('j-habit').value='';
  document.getElementById('j-trigger').value='';
  document.getElementById('j-strategy').value='';
  saveJournalEntry();
  toast('✅ Angewohnheit zum Journal hinzugefügt!');
}
function journalMove(dir){
  const dt=new Date(journalDate+'T12:00:00');dt.setDate(dt.getDate()+dir);
  journalDate=dt.toISOString().split('T')[0];
  renderJournal();
}
function journalGoToday(){journalDate=new Date().toISOString().split('T')[0];renderJournal();}
async function renderJournal(){
  const today=new Date().toISOString().split('T')[0];
  const isToday=journalDate===today;
  const dt=new Date(journalDate+'T12:00:00');
  document.getElementById('journal-date-label').textContent=dt.toLocaleDateString('de-DE',{weekday:'short',day:'numeric',month:'long',year:'numeric'});
  document.getElementById('journal-today-form').style.display=isToday?'block':'none';
  const disp=document.getElementById('journal-display');
  disp.innerHTML='<div class="empty" style="padding:16px">⏳ Lade Eintrag...</div>';
  // Auto-save today before displaying
  if(isToday)await autoSaveJournal();
  const entry=await loadJournalEntry(journalDate);
  if(!entry&&!isToday){disp.innerHTML='<div class="empty">Kein Eintrag für diesen Tag.</div>';return;}
  if(!entry){disp.innerHTML='<div class="empty">Noch kein Eintrag für heute. Starte mit der Morgenroutine! 🌅</div>';return;}
  const CATLBLS2={handy:'📱 Handy',aufschieben:'📋 Aufschieben',ablenkung:'🎮 Ablenkung',essen:'🍕 Essen',sozial:'💬 Soziale Medien',sonstiges:'📌 Sonstiges'};
  const LA2={career:'💼',health:'💪',relations:'❤️',finance:'💰',personal:'🧠',meaning:'✨'};
  let html='<div style="display:flex;flex-direction:column;gap:14px;margin-top:14px">';

  // HEADER
  html+=`<div style="background:linear-gradient(135deg,var(--p),var(--pd));border-radius:var(--r2);padding:14px 16px;color:#fff;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
    <div><div style="font-size:1rem;font-weight:800">${dt.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
    <div style="font-size:.82rem;opacity:.85;margin-top:2px">${entry.mood?'Stimmung: '+entry.mood:''}</div></div>
    <div style="text-align:right"><div style="font-size:1.4rem;font-weight:800">${entry.score||0} Pkt</div><div style="font-size:.72rem;opacity:.8">${(entry.tasks_done||[]).length} Aufgaben · ${entry.pomo_count||0} Pomodoros</div></div>
  </div>`;

  // MORNING
  if(entry.morning&&entry.morning.gratitude){
    html+=`<div style="border:1.5px solid #FDE68A;border-radius:var(--r2);padding:14px;background:#FFFBEB">
      <div style="font-size:.78rem;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px">🌅 Morgenroutine</div>
      ${entry.morning.gratitude?`<div style="margin-bottom:7px"><div style="font-size:.73rem;color:#92400E;font-weight:700">🙏 Dankbarkeit</div><div style="font-size:.87rem;margin-top:2px">${esc(entry.morning.gratitude)}</div></div>`:''}
      ${entry.morning.intention?`<div style="margin-bottom:7px"><div style="font-size:.73rem;color:#92400E;font-weight:700">🌟 Intention</div><div style="font-size:.87rem;margin-top:2px">${esc(entry.morning.intention)}</div></div>`:''}
      ${entry.morning.focus?`<div style="margin-bottom:7px"><div style="font-size:.73rem;color:#92400E;font-weight:700">🎯 Fokus-Aufgabe</div><div style="font-size:.87rem;margin-top:2px">${esc(entry.morning.focus)}</div></div>`:''}
      ${entry.morning.affirmation?`<div style="font-style:italic;font-size:.84rem;color:#92400E;background:rgba(251,191,36,.2);border-radius:8px;padding:7px 10px;margin-top:4px">💫 ${esc(entry.morning.affirmation)}</div>`:''}
    </div>`;
  }

  // WELLBEING
  if(entry.wellbeing){
    const wb=entry.wellbeing;
    html+=`<div style="border:1.5px solid #BBF7D0;border-radius:var(--r2);padding:14px;background:#F0FDF4">
      <div style="font-size:.78rem;font-weight:700;color:#065F46;text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px">🧘 Wohlbefinden</div>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <span style="font-size:.87rem;font-weight:700">😴 ${wb.sleep}h Schlaf</span>
        <span style="font-size:.87rem;font-weight:700">⚡ Energie: ${wb.energy}/10</span>
        <span style="font-size:.87rem;font-weight:700">😰 Stress: ${wb.stress}/10</span>
        <span style="font-size:.87rem;font-weight:700">🏃 ${wb.move}min Bewegung</span>
      </div>
      ${wb.note?`<div style="font-size:.84rem;color:var(--mu);margin-top:8px;font-style:italic">${esc(wb.note)}</div>`:''}
    </div>`;
  }

  // TASKS
  if(entry.tasks_done&&entry.tasks_done.length){
    html+=`<div style="border:1.5px solid var(--bo);border-radius:var(--r2);padding:14px;background:var(--bg)">
      <div style="font-size:.78rem;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px">✅ Erledigte Aufgaben (${entry.tasks_done.length})</div>
      <div style="display:flex;flex-direction:column;gap:5px">
        ${entry.tasks_done.map(t=>`<div style="display:flex;align-items:center;gap:8px;font-size:.86rem">
          <span style="color:var(--ok);font-weight:700">✓</span>
          <span style="flex:1">${esc(t.name)}</span>
          ${t.lifeArea?`<span style="font-size:.72rem">${LA2[t.lifeArea]||''}</span>`:''}
          <span style="font-size:.72rem;font-weight:700;color:var(--ok)">+${t.pts}Pkt</span>
        </div>`).join('')}
      </div>
    </div>`;
  }

  // HABITS
  if(entry.habits&&entry.habits.length){
    html+=`<div style="border:1.5px solid #FEE2E2;border-radius:var(--r2);padding:14px;background:#FFF5F5">
      <div style="font-size:.78rem;font-weight:700;color:#991B1B;text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px">😬 Schlechte Angewohnheiten & Gegenstrategien</div>
      ${entry.habits.map(h=>`<div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #FEE2E2;last-child:border-0">
        <div style="font-size:.73rem;font-weight:700;color:#991B1B;background:#FEE2E2;display:inline-block;padding:2px 7px;border-radius:20px;margin-bottom:5px">${CATLBLS2[h.cat]||h.cat}</div>
        <div style="font-size:.86rem;margin-bottom:3px"><strong>😔</strong> ${esc(h.habit)}</div>
        ${h.trigger?`<div style="font-size:.82rem;color:var(--mu);font-style:italic;margin-bottom:3px">⚡ ${esc(h.trigger)}</div>`:''}
        <div style="font-size:.86rem;color:#065F46;background:#DCFCE7;border-radius:6px;padding:6px 9px;margin-top:4px">✅ ${esc(h.strategy)}</div>
      </div>`).join('')}
    </div>`;
  }

  // EVENING
  if(entry.evening&&entry.evening.wins){
    html+=`<div style="border:1.5px solid #EDE9FE;border-radius:var(--r2);padding:14px;background:#FAF5FF">
      <div style="font-size:.78rem;font-weight:700;color:#6D28D9;text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px">🌙 Abendreflexion</div>
      ${entry.evening.wins?`<div style="margin-bottom:7px"><div style="font-size:.73rem;color:#6D28D9;font-weight:700">🏆 Erfolge</div><div style="font-size:.87rem;margin-top:2px">${esc(entry.evening.wins)}</div></div>`:''}
      ${entry.evening.learnings?`<div style="margin-bottom:7px"><div style="font-size:.73rem;color:#6D28D9;font-weight:700">📚 Lernmomente</div><div style="font-size:.87rem;margin-top:2px">${esc(entry.evening.learnings)}</div></div>`:''}
      ${entry.evening.procr?`<div style="margin-bottom:7px"><div style="font-size:.73rem;color:#6D28D9;font-weight:700">😬 Prokrastination</div><div style="font-size:.87rem;margin-top:2px">${esc(entry.evening.procr)}</div></div>`:''}
      ${entry.evening.gratitude_eve?`<div style="margin-bottom:7px"><div style="font-size:.73rem;color:#6D28D9;font-weight:700">🙏 Dankbarkeit</div><div style="font-size:.87rem;margin-top:2px">${esc(entry.evening.gratitude_eve)}</div></div>`:''}
      ${entry.evening.tomorrow?`<div style="font-style:italic;font-size:.84rem;color:#6D28D9;background:rgba(139,92,246,.1);border-radius:8px;padding:7px 10px;margin-top:4px">🌙 Morgen: ${esc(entry.evening.tomorrow)}</div>`:''}
    </div>`;
  }

  // FREE NOTE
  if(entry.free_note){
    html+=`<div style="border:1.5px solid var(--bo);border-radius:var(--r2);padding:14px;background:var(--bg)">
      <div style="font-size:.78rem;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px">📝 Notizen</div>
      <div style="font-size:.87rem;line-height:1.6;white-space:pre-wrap">${esc(entry.free_note)}</div>
    </div>`;
  }

  html+='</div>';
  disp.innerHTML=html;

  // Pre-fill form with saved data
  if(isToday&&entry.free_note)document.getElementById('j-note').value=entry.free_note;
  if(isToday&&entry.habits)pendingHabits=[...entry.habits];
}

