// FocusFlow · 13-calendar.js — Einplanen (Zeitblöcke) + Wohlbefinden
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── EINPLANEN ──  Schlanke Zeitblock-Planung (ersetzt Monats-/Tagesansicht).
// Zeitblock = Commitment-Praktik: Geplantes wird seltener aufgeschoben.
// ═══════════════════════════════════════════════════════════════
function cleanTaskName(n){return (n||'').replace(/_rec_\d{4}-\d{2}-\d{2}$/,'');}
function renderCal(){
  // Aufgaben-Auswahl (offene Aufgaben) + Default-Datum heute
  const sel=document.getElementById('cal-plan-task');
  if(sel){
    const open=(D.tasks||[]).filter(t=>!t.done);
    sel.innerHTML=open.length
      ? open.map(t=>`<option value="${t.id}">${esc(cleanTaskName(t.name).slice(0,50))}</option>`).join('')
      : '<option value="">Erst eine Aufgabe anlegen…</option>';
  }
  const dEl=document.getElementById('cal-plan-date');
  if(dEl&&!dEl.value)dEl.value=new Date().toISOString().split('T')[0];
  renderUpcoming();
}
function inDay(t,ds){if(t.start&&t.end)return ds>=t.start&&ds<=t.end;if(t.end)return t.end===ds;if(t.start)return t.start===ds;return false;}
function upcomingRow(t,over){
  const time=(t.startTime||t.endTime)?((fmtTime(t.startTime)||'')+(t.endTime?' – '+fmtTime(t.endTime):'')):'ganztägig';
  return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--bo)">
    <div class="tcb${t.done?' on':''}" onclick="toggleTaskCal(${t.id})" style="flex-shrink:0">${t.done?'✓':''}</div>
    <div style="flex:1;min-width:0"><div style="font-size:.86rem;font-weight:700;${t.done?'text-decoration:line-through;opacity:.6':''}">${esc(cleanTaskName(t.name))}</div>
      <div style="font-size:.73rem;color:${over?'#991B1B':'var(--mu)'}">${over?'war fällig · ':''}⏱ ${time}</div></div>
    <button class="delbtn" title="Termin entfernen" onclick="unscheduleTask(${t.id})">✕</button>
  </div>`;
}
function renderUpcoming(){
  const el=document.getElementById('cal-upcoming');if(!el)return;
  const today=new Date().toISOString().split('T')[0];
  const overdue=(D.tasks||[]).filter(t=>!t.done&&(t.end||t.start)&&((t.end||t.start)<today));
  let html='';
  if(overdue.length){
    html+=`<div style="font-size:.78rem;font-weight:800;color:#991B1B;margin:0 0 4px">⚠️ Überfällig geplant</div>`
      +overdue.map(t=>upcomingRow(t,true)).join('')+`<div style="height:14px"></div>`;
  }
  let any=false;
  for(let i=0;i<7;i++){
    const d=new Date();d.setDate(d.getDate()+i);const ds=d.toISOString().split('T')[0];
    const tasks=(D.tasks||[]).filter(t=>inDay(t,ds));
    if(!tasks.length)continue;
    any=true;
    const label=i===0?'Heute':i===1?'Morgen':d.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'short'});
    html+=`<div style="font-size:.78rem;font-weight:800;color:var(--p);margin:10px 0 2px">${label}</div>`+tasks.map(t=>upcomingRow(t,false)).join('');
  }
  if(!overdue.length&&!any)html='<div class="empty">Noch nichts eingeplant. Plane oben deine erste Aufgabe in einen Zeitblock.</div>';
  el.innerHTML=html;
}
async function planTask(){
  const id=+gs('cal-plan-task');const date=gs('cal-plan-date');
  if(!id){toast('Bitte eine Aufgabe wählen.');return;}
  if(!date){toast('Bitte ein Datum wählen.');return;}
  const t=(D.tasks||[]).find(x=>x.id===id);if(!t)return;
  const startTime=gs('cal-plan-start'),endTime=gs('cal-plan-end');
  t.start=date;t.end=date;t.startTime=startTime;t.endTime=endTime;
  const r=await sbFetch('/rest/v1/tasks?id=eq.'+id,{method:'PATCH',body:JSON.stringify({start_date:date,end_date:date,start_time:startTime||null,end_time:endTime||null})});
  if(!r.ok){toast('❌ Fehler beim Einplanen.');return;}
  logStep('cal_used');
  toast('📅 Eingeplant – ein Zeitblock ist ein Versprechen an dich selbst.');
  renderCal();try{renderTasks();renderStats();}catch(e){}
}
async function toggleTaskCal(id){await toggleTask(id);renderUpcoming();}
async function unscheduleTask(id){
  const t=(D.tasks||[]).find(x=>x.id===id);if(!t)return;
  t.start='';t.end='';t.startTime='';t.endTime='';
  const r=await sbFetch('/rest/v1/tasks?id=eq.'+id,{method:'PATCH',body:JSON.stringify({start_date:null,end_date:null,start_time:null,end_time:null})});
  if(!r.ok){toast('❌ Fehler.');return;}
  toast('Termin entfernt.');renderCal();try{renderTasks();}catch(e){}
}

// ─── Wellbeing (Speichern & Rendern) ───
async function saveWellbeing(){
  const btn=document.getElementById('wb-save-btn');btn.disabled=true;
  const entry={date:new Date().toISOString().split('T')[0],sleep:+gs('wb-sleep'),energy:+gs('wb-energy'),stress:+gs('wb-stress'),move:+gs('wb-move'),note:gv('wb-note')};
  D.wellbeing=D.wellbeing.filter(e=>e.date!==entry.date);
  D.wellbeing.unshift(entry);
  D.wellbeing=D.wellbeing.slice(0,30);
  await saveProfile();btn.disabled=false;toast('🧘 Wohlbefinden gespeichert – zurück zu deinem Weg.');logStep('wellbeing_tracked');renderWellbeing();try{renderJourney();}catch(e){}
  routeAfterSave();
}
function renderWellbeing(){
  const el=document.getElementById('wb-history');
  if(!D.wellbeing.length){el.innerHTML='<div class="empty">Noch keine Einträge.</div>';return;}
  el.innerHTML=D.wellbeing.slice(0,7).map(e=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--bo);flex-wrap:wrap">
    <div style="font-size:.78rem;font-weight:700;color:var(--mu);min-width:70px">${new Date(e.date+'T12:00:00').toLocaleDateString('de-DE',{day:'2-digit',month:'short'})}</div>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <span style="font-size:.78rem;font-weight:700">😴 ${e.sleep}h</span>
      <span style="font-size:.78rem;font-weight:700">⚡ ${e.energy}/10</span>
      <span style="font-size:.78rem;font-weight:700">😰 ${e.stress}/10</span>
      <span style="font-size:.78rem;font-weight:700">🏃 ${e.move}min</span>
    </div>
    ${e.note?`<div style="font-size:.78rem;color:var(--mu);font-style:italic;width:100%">${esc(e.note)}</div>`:''}
  </div>`).join('');
}

