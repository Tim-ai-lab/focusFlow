// FocusFlow · 13-calendar.js — Kalender (Monat/Tag) und Gantt
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── CALENDAR ──  Monats- und Tagesansicht, Gantt
// ═══════════════════════════════════════════════════════════════
function setCalView(view,btn){
  calView=view;document.querySelectorAll('.cal-vtab').forEach(b=>b.classList.remove('on'));btn.classList.add('on');
  document.getElementById('cal-month-view').style.display=view==='month'?'block':'none';
  document.getElementById('cal-day-view').style.display=view==='day'?'block':'none';
  if(view==='month')renderCal();else renderDayView();
}
function renderCal(){
  const mn=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  document.getElementById('cal-title').textContent=mn[calMonth]+' '+calYear;
  const grid=document.getElementById('cal-grid');grid.innerHTML='';
  ['Mo','Di','Mi','Do','Fr','Sa','So'].forEach(d=>{const el=document.createElement('div');el.className='cal-dow';el.textContent=d;grid.appendChild(el);});
  const startDow=(new Date(calYear,calMonth,1).getDay()+6)%7;
  const days=new Date(calYear,calMonth+1,0).getDate();
  const today=new Date();
  for(let i=0;i<startDow;i++){const el=document.createElement('div');el.className='cal-day other-month';grid.appendChild(el);}
  for(let d=1;d<=days;d++){
    const ds=calYear+'-'+String(calMonth+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const dayTasks=D.tasks.filter(t=>{if(t.start&&t.end)return ds>=t.start&&ds<=t.end;if(t.end)return t.end===ds;if(t.start)return t.start===ds;return false;});
    const isToday=today.getFullYear()===calYear&&today.getMonth()===calMonth&&today.getDate()===d;
    const el=document.createElement('div');
    el.className='cal-day'+(isToday?' today':'')+(dayTasks.length?' has-tasks':'');
    el.innerHTML=`<div class="cal-dn">${d}</div>`+dayTasks.slice(0,3).map(t=>`<div class="cal-task-chip ${t.done?'chip-done':'chip-'+t.prio}">${esc(t.name.replace(/_rec_\d{4}-\d{2}-\d{2}$/,'').slice(0,10))}</div>`).join('')+(dayTasks.length>3?`<div style="font-size:.6rem;color:var(--mu);font-weight:700">+${dayTasks.length-3}</div>`:'');
    el.onclick=()=>openDayModalForDate(ds);grid.appendChild(el);
  }
}
function calMove(dir){calMonth+=dir;if(calMonth>11){calMonth=0;calYear++;}if(calMonth<0){calMonth=11;calYear--;}renderCal();}
function renderDayView(){
  const dt=new Date(dayViewDate+'T12:00:00');
  document.getElementById('day-view-title').textContent=dt.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const timesEl=document.getElementById('day-times');const eventsEl=document.getElementById('day-events');
  const nowLine=document.getElementById('day-now-line');timesEl.innerHTML='';eventsEl.innerHTML='';eventsEl.appendChild(nowLine);
  for(let h=0;h<24;h++){
    const ts=document.createElement('div');ts.className='day-time-slot';ts.textContent=String(h).padStart(2,'0')+':00';timesEl.appendChild(ts);
    const ln=document.createElement('div');ln.className='day-hour-line';ln.style.top=(h*60)+'px';eventsEl.appendChild(ln);
    const hl=document.createElement('div');hl.className='day-hour-line half';hl.style.top=(h*60+30)+'px';eventsEl.appendChild(hl);
  }
  D.tasks.filter(t=>{if(!t.start&&!t.end)return false;const ds=dayViewDate;if(t.start&&t.end)return ds>=t.start&&ds<=t.end;if(t.end)return t.end===ds;if(t.start)return t.start===ds;return false;}).forEach(t=>{
    const sm=t.startTime?timeToMin(t.startTime):0;const em=t.endTime?timeToMin(t.endTime):sm+60;
    const ev=document.createElement('div');
    ev.className='day-event '+(t.done?'ev-done':t.prio==='high'?'ev-high':t.prio==='low'?'ev-low':'ev-normal');
    ev.style.top=sm+'px';ev.style.height=Math.max(22,em-sm)+'px';
    ev.innerHTML=`<div class="day-event-name">${esc(t.name.replace(/_rec_\d{4}-\d{2}-\d{2}$/,''))}</div><div class="day-event-time">${t.startTime?fmtTime(t.startTime):''}${t.endTime?' – '+fmtTime(t.endTime):''}</div>`;
    ev.onclick=()=>openDayModalForDate(dayViewDate);eventsEl.appendChild(ev);
  });
  const isToday=dayViewDate===new Date().toISOString().split('T')[0];
  nowLine.style.display=isToday?'block':'none';
  if(isToday){updateNowLine();if(nowLineInterval)clearInterval(nowLineInterval);nowLineInterval=setInterval(updateNowLine,60000);}
  setTimeout(()=>eventsEl.parentElement&&(eventsEl.parentElement.scrollTop=(isToday?Math.max(0,(new Date().getHours()-1)*60):8*60)),50);
}
function timeToMin(t){if(!t)return 0;const[h,m]=t.split(':').map(Number);return h*60+m;}
function updateNowLine(){const now=new Date();document.getElementById('day-now-line').style.top=(now.getHours()*60+now.getMinutes())+'px';}
function dayMove(dir){const dt=new Date(dayViewDate+'T12:00:00');dt.setDate(dt.getDate()+dir);dayViewDate=dt.toISOString().split('T')[0];renderDayView();}
function openDayModalForDate(ds){
  activeDayStr=ds;
  const dt=new Date(ds+'T12:00:00');
  document.getElementById('day-title').textContent='📅 '+dt.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'});
  document.getElementById('day-new-task').value='';document.getElementById('day-new-start-time').value='';document.getElementById('day-new-end-time').value='';
  renderDayTasks(D.tasks.filter(t=>{if(t.start&&t.end)return ds>=t.start&&ds<=t.end;if(t.end)return t.end===ds;if(t.start)return t.start===ds;return false;}));
  document.getElementById('daymod').style.display='flex';
  setTimeout(()=>document.getElementById('day-new-task').focus(),100);
}
function renderDayTasks(tasks){
  const el=document.getElementById('day-tasks');
  if(!tasks.length){el.innerHTML='<div style="text-align:center;color:var(--mu);padding:10px;font-size:.86rem">Keine Aufgaben – füge unten eine hinzu!</div>';return;}
  el.innerHTML=tasks.map(t=>`<div class="daytask">
    <div class="tcb${t.done?' on':''}" onclick="toggleTaskCal(${t.id})">${t.done?'✓':''}</div>
    <div style="flex:1"><div style="font-size:.87rem;font-weight:700;${t.done?'text-decoration:line-through;opacity:.6':''}">${esc(t.name.replace(/_rec_\d{4}-\d{2}-\d{2}$/,''))}</div>
    <div style="font-size:.73rem;color:var(--mu)">${t.startTime||t.endTime?(fmtTime(t.startTime)||'')+(t.endTime?' – '+fmtTime(t.endTime):''):'Kein Zeitraum definiert'}</div></div>
    <span class="badge b-${t.prio}">${t.prio==='high'?'🔴':t.prio==='low'?'⚪':'🔵'}</span>
    <button class="delbtn" onclick="delTaskCal(${t.id})">🗑</button>
  </div>`).join('');
}
async function toggleTaskCal(id){await toggleTask(id);refreshCalDay();}
async function delTaskCal(id){await delTask(id);refreshCalDay();}
function refreshCalDay(){
  const tasks=D.tasks.filter(t=>{if(t.start&&t.end)return activeDayStr>=t.start&&activeDayStr<=t.end;if(t.end)return t.end===activeDayStr;if(t.start)return t.start===activeDayStr;return false;});
  renderDayTasks(tasks);if(calView==='month')renderCal();else renderDayView();
}
async function addTaskFromCal(){
  const name=document.getElementById('day-new-task').value.trim();if(!name){toast('Bitte Aufgabe eingeben!');return;}
  const id=Date.now();const startTime=gs('day-new-start-time'),endTime=gs('day-new-end-time');
  const task={id,name,prio:gs('day-new-prio'),diff:gs('day-new-diff'),special:'',lifeArea:'',recurring:'',start:activeDayStr,end:activeDayStr,startTime,endTime,dep:'',done:false};
  const r=await sbFetch('/rest/v1/tasks',{method:'POST',body:JSON.stringify({id,user_id:UID,name,prio:task.prio,diff:task.diff,special:'',life_area:null,recurring:null,start_date:activeDayStr,end_date:activeDayStr,start_time:startTime||null,end_time:endTime||null,dep:null,done:false})});
  if(!r.ok){toast('❌ Fehler.');return;}
  D.tasks.unshift(task);document.getElementById('day-new-task').value='';
  logStep('cal_used');toast('✅ Aufgabe hinzugefügt!');refreshCalDay();renderTasks();renderStats();updateDepSelect();
}

// ─── Gantt ───
function renderGantt(){
  const zoom=gs('gantt-zoom'),flt=gs('gantt-filter');
  const today=new Date();today.setHours(0,0,0,0);
  const days=zoom==='week'?7:zoom==='2week'?14:30;
  const startD=new Date(today);startD.setDate(startD.getDate()-Math.floor(days/4));
  let tasks=D.tasks.filter(t=>t.start&&t.end);
  if(flt==='open')tasks=tasks.filter(t=>!t.done);if(flt==='done')tasks=tasks.filter(t=>t.done);
  const wrap=document.getElementById('gantt-wrap');
  if(!tasks.length){wrap.innerHTML='<div class="empty" style="padding:28px">Keine Aufgaben mit Start- und Enddatum vorhanden.</div>';return;}
  const CELL=Math.max(24,Math.floor(660/days));
  let hdr='<tr><th style="min-width:140px;text-align:left;padding:6px 10px">Aufgabe</th>';
  for(let i=0;i<days;i++){const d=new Date(startD);d.setDate(d.getDate()+i);const isT=d.toDateString()===today.toDateString();const lbl=d.getDate()===1||i===0?d.toLocaleDateString('de-DE',{day:'numeric',month:'short'}):d.getDate()%5===0?d.getDate():'';hdr+=`<th style="width:${CELL}px;min-width:${CELL}px;${isT?'color:var(--ac)':''}">${lbl}</th>`;}
  hdr+='</tr>';
  const rows=tasks.map(t=>{
    const ts=new Date(t.start);ts.setHours(0,0,0,0);const te=new Date(t.end);te.setHours(0,0,0,0);
    const bc=t.done?'gbar-done':t.prio==='high'?'gbar-high':t.prio==='low'?'gbar-low':'gbar-normal';
    let cells='';
    for(let i=0;i<days;i++){const d=new Date(startD);d.setDate(d.getDate()+i);const isT=d.toDateString()===today.toDateString();const isS=d.toDateString()===ts.toDateString();cells+=`<td class="gbar-cell" style="${isT?'background:rgba(244,169,106,.07)':''}">${isS?`<div class="gbar ${bc}" style="width:${Math.max(1,Math.round((te-ts)/864e5)+1)*CELL-4}px;left:2px">${esc(t.name.replace(/_rec_\d{4}-\d{2}-\d{2}$/,'').slice(0,12))}</div>`:''} ${isT?'<div class="gantt-today-line"></div>':''}</td>`;}
    return `<tr><td class="gtask-name" title="${esc(t.name)}">${t.done?'✅ ':''}${LA_BADGE[t.lifeArea]||''} ${esc(t.name.replace(/_rec_\d{4}-\d{2}-\d{2}$/,''))}<div style="font-size:.7rem;color:var(--mu);font-weight:600;margin-top:1px">${fmtDate(t.start)} – ${fmtDate(t.end)}</div></td>${cells}</tr>`;
  }).join('');
  wrap.innerHTML=`<table class="gantt-table"><thead>${hdr}</thead><tbody>${rows}</tbody></table>`;
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

