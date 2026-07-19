// FocusFlow · 12-tasks.js — Aufgaben, Tagesziele (MIT), Pomodoro & Fokus-Modus
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── TASKS ──  Aufgaben hinzufügen, toggling, löschen, rendern
// ═══════════════════════════════════════════════════════════════
async function addTask(){
  const name=gv('tn');if(!name){toast('Bitte Aufgabe eingeben!');return;}
  const start=gs('tstart'),end=gs('tend'),startTime=gs('tstart-time'),endTime=gs('tend-time'),dep=gs('tdep');
  if(start&&end&&end<start){toast('Enddatum muss nach Startdatum liegen!');return;}
  const btn=document.getElementById('add-task-btn');btn.disabled=true;
  const id=Date.now();
  const task={id,name,prio:gs('tprio'),diff:gs('tdiff'),special:gs('tsp'),lifeArea:gs('tlife'),recurring:gs('trec'),start,end,startTime,endTime,dep:dep||'',done:false};
  const r=await sbFetch('/rest/v1/tasks',{method:'POST',body:JSON.stringify({id,user_id:UID,name,prio:task.prio,diff:task.diff,special:task.special,life_area:task.lifeArea||null,recurring:task.recurring||null,start_date:start||null,end_date:end||null,start_time:startTime||null,end_time:endTime||null,dep:dep||null,done:false})});
  btn.disabled=false;
  if(!r.ok){toast('❌ Fehler beim Speichern.');return;}
  if(task.special==='2min')toast('⚡ 2-Minuten-Regel: Starte JETZT!');
  if(task.lifeArea)logStep('first_tasks');
  if(start||end)logStep('cal_used');
  D.tasks.unshift(task);document.getElementById('tn').value='';
  renderTasks();renderStats();updateDepSelect();renderLifeGrid();
}
function generateRecurring(){
  const today=new Date().toISOString().split('T')[0];
  const dow=new Date().getDay();
  D.tasks.forEach(t=>{
    if(!t.recurring||t.done)return;
    const exists=D.tasks.some(x=>x.id!==t.id&&x.name===t.name+'_rec_'+today);
    if(exists)return;
    if(t.recurring==='daily'||(t.recurring==='weekly'&&dow===1)||(t.recurring==='monthly'&&new Date().getDate()===1)){
      const clone={...t,id:Date.now()+Math.random(),done:false,start:today,end:today,name:t.name+'_rec_'+today,recurring:''};
      D.tasks.unshift(clone);
    }
  });
}
async function toggleTask(id){
  const t=D.tasks.find(x=>x.id===id);if(!t)return;
  if(!t.done&&t.dep){const dep=D.tasks.find(x=>x.id==t.dep);if(dep&&!dep.done){toast('⚠️ Erst "'+dep.name+'" erledigen!');return;}}
  t.done=!t.done;
  const pts=t.diff==='hard'?30:t.diff==='medium'?20:10;
  if(t.done){D.todayDone++;D.todayScore+=pts;D.weekDone[new Date().getDay()]++;toast(QUOTES[Math.floor(Math.random()*QUOTES.length)]);if(D.todayDone%5===0)showRw(D.todayDone);}
  else{D.todayDone=Math.max(0,D.todayDone-1);D.todayScore=Math.max(0,D.todayScore-pts);}
  await sbFetch('/rest/v1/tasks?id=eq.'+id,{method:'PATCH',body:JSON.stringify({done:t.done})});
  saveStats();renderTasks();renderStats();renderLifeGrid();
}
async function delTask(id){
  D.tasks=D.tasks.filter(x=>x.id!==id);
  await sbFetch('/rest/v1/tasks?id=eq.'+id,{method:'DELETE'});
  renderTasks();updateDepSelect();renderLifeGrid();
}
async function editTask(id){
  const t=D.tasks.find(x=>x.id===id);if(!t)return;
  const cur=t.name.replace(/_rec_\d{4}-\d{2}-\d{2}$/,'');
  const name=window.prompt('Aufgabe umbenennen:',cur);
  if(name===null)return;
  const nn=name.trim();if(!nn||nn===cur)return;
  t.name=nn;
  await sbFetch('/rest/v1/tasks?id=eq.'+id,{method:'PATCH',body:JSON.stringify({name:nn})});
  renderTasks();updateDepSelect();renderLifeGrid();toast('✏️ Aufgabe aktualisiert');
}
// Komplettes Daten-Backup als JSON (Datenhoheit des Nutzers)
function exportAllData(){
  const data={app:'FocusFlow',exportedAt:new Date().toISOString(),tasks:D.tasks,mitTasks:D.mitTasks,mitDone:D.mitDone,diary:D.diary,vision:D.vision,lifeAreas:D.lifeAreas,wellbeing:D.wellbeing,reviews:D.reviews,dailyLog:D.dailyLog,stats:{streak:D.streak,pomoSess:D.pomoSess,todayDone:D.todayDone,todayScore:D.todayScore,weekDone:D.weekDone}};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='FocusFlow-Backup-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),2000);
  toast('⬇ Backup heruntergeladen');
}
function isOverdue(t){if(!t.end||t.done)return false;return new Date(t.end)<new Date(new Date().toDateString());}
function updateDepSelect(){
  const sel=document.getElementById('tdep');const cur=sel.value;
  sel.innerHTML='<option value="">Keine</option>';
  D.tasks.forEach(t=>sel.innerHTML+=`<option value="${t.id}">${esc(t.name.slice(0,28))}</option>`);
  sel.value=cur;
}
function renderTasks(){
  const list=document.getElementById('tlist');
  const sorted=[...D.tasks].sort((a,b)=>{if(a.special==='frog'&&b.special!=='frog')return -1;if(b.special==='frog'&&a.special!=='frog')return 1;const p={high:0,normal:1,low:2};return p[a.prio]-p[b.prio];});
  document.getElementById('frogtip').style.display=sorted.some(t=>t.special==='frog'&&!t.done)?'flex':'none';
  document.getElementById('task-counter').textContent=D.tasks.filter(t=>!t.done).length+' offen · '+D.tasks.filter(t=>t.done).length+' erledigt';
  if(!sorted.length){list.innerHTML='<div class="empty">Noch keine Aufgaben 🚀<br><small>Füge deine erste Aufgabe hinzu!</small></div>';return;}
  list.innerHTML=sorted.map(t=>{
    const ov=isOverdue(t);
    const depT=t.dep?D.tasks.find(x=>x.id==t.dep):null;
    let dateTxt='';
    if(t.start&&t.end)dateTxt=fmtDate(t.start)+(t.startTime?' '+fmtTime(t.startTime):'')+' → '+fmtDate(t.end)+(t.endTime?' '+fmtTime(t.endTime):'');
    else if(t.end)dateTxt='Bis '+fmtDate(t.end);
    const isRec=t.recurring&&t.recurring!=='';
    return `<div class="titem${t.done?' done':''}${t.special==='frog'?' frog':''}${ov?' overdue':''}${isRec?' recurring':''}">
      <div class="tcb${t.done?' on':''}" onclick="toggleTask(${t.id})">${t.done?'✓':''}</div>
      <div style="flex:1;min-width:0">
        <div class="tname">${esc(t.name.replace(/_rec_\d{4}-\d{2}-\d{2}$/,''))}${ov?' <span style="color:var(--err);font-size:.7rem">⚠️ Überfällig</span>':''}</div>
        ${dateTxt?`<div class="tmeta">📅 ${dateTxt}</div>`:''}
        ${depT?`<div class="tmeta">🔗 Benötigt: ${esc(depT.name.slice(0,22))}</div>`:''}
        <div class="badges">
          <span class="badge b-${t.prio}">${t.prio==='high'?'🔴 Hoch':t.prio==='low'?'⚪ Niedrig':'🔵 Normal'}</span>
          <span class="badge b-${t.diff}">${t.diff==='easy'?'😊 Leicht':t.diff==='hard'?'😰 Schwer':'😐 Mittel'}</span>
          ${t.special==='frog'?'<span class="badge b-frog">🐸 Frog</span>':''}
          ${t.special==='2min'?'<span class="badge b-2min">⚡ 2 Min</span>':''}
          ${t.lifeArea?`<span class="badge" style="background:var(--bg);border:1.5px solid var(--bo)">${LA_BADGE[t.lifeArea]||''} ${t.lifeArea}</span>`:''}
          ${isRec?`<span class="badge b-rec">${REC_LBL[t.recurring]||'🔁'}</span>`:''}
          ${depT?'<span class="badge b-dep">🔗 Abhängig</span>':''}
        </div>
      </div>
      <button class="delbtn" onclick="openEmotionCheck(${t.id})" title="Emotions-Check" style="color:var(--p)">⚡</button>
      <button class="delbtn" onclick="editTask(${t.id})" title="Umbenennen">✏️</button>
      <button class="delbtn" onclick="delTask(${t.id})">🗑</button>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
// ── MIT ──  Most Important Tasks – Tagesziele
// ═══════════════════════════════════════════════════════════════
function renderMIT(){
  document.getElementById('mitslots').innerHTML=['1️⃣','2️⃣','3️⃣'].map((n,i)=>{
    const v=D.mitTasks[i]||'',done=D.mitDone[i];
    return `<div class="mitslot${v?' filled':''}${done?' done':''}">
      <div class="mitcb${done?' on':''}" onclick="togMIT(${i})">${done?'✓':''}</div>
      <span>${n}</span>
      <input value="${esc(v)}" placeholder="Wichtigste Aufgabe ${i+1}..." oninput="D.mitTasks[${i}]=this.value" onblur="saveMIT()">
    </div>`;
  }).join('');
}
async function togMIT(i){D.mitDone[i]=!D.mitDone[i];if(D.mitDone[i]){D.todayScore+=25;toast('🎯 Hauptaufgabe erledigt! +25 Punkte');saveStats();logStep('mit_used');}await saveMIT();renderMIT();renderStats();}

// ═══════════════════════════════════════════════════════════════
// ── ROUTINES (Pomodoro) ──  Timer, Fokus-Modus
// ═══════════════════════════════════════════════════════════════
let pTmr=null,pSec=0,pTot=0,pBrk=false,pRun=false;
const gW=()=>+document.getElementById('pw').value*60;
const gSh=()=>+document.getElementById('ps').value*60;
const gLn=()=>+document.getElementById('pl').value*60;
const fmt=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
function startPomo(){
  if(pRun)return;if(pSec===0){pSec=gW();pTot=gW();}pRun=true;
  pTmr=setInterval(async()=>{
    pSec--;updPomo();
    if(document.getElementById('focmod').style.display==='flex')document.getElementById('ftime').textContent=fmt(pSec);
    if(pSec<=0){clearInterval(pTmr);pRun=false;if(!pBrk){D.pomoSess++;D.todayScore+=15;await saveStats();logStep('pomodoro_used');renderStats();toast('🍅 Pomodoro fertig! Verdiente Pause!');pBrk=true;pSec=D.pomoSess%4===0?gLn():gSh();pTot=pSec;}else{pBrk=false;pSec=gW();pTot=gW();toast('⏰ Pause vorbei! Weiter!');}updPomo();}
  },1000);
}
function stopPomo(){clearInterval(pTmr);pRun=false;}
function resetPomo(){stopPomo();pSec=0;pBrk=false;pTot=gW();updPomo();}
function updPomo(){
  const s=pSec||gW();
  document.getElementById('potime').textContent=fmt(s);
  document.getElementById('potime').className='potime'+(pBrk?' brk':'');
  document.getElementById('polbl').textContent=pBrk?'☕ Pause':'🎯 Fokus-Zeit';
  document.getElementById('pobar').style.width=Math.round((s/(pTot||gW()))*100)+'%';
  if(D)document.getElementById('posess').textContent='Sitzungen heute: '+D.pomoSess;
}
function openFocus(){const frog=D.tasks.find(t=>t.special==='frog'&&!t.done);document.getElementById('ftask').textContent=frog?'🐸 '+frog.name:'Fokussiere dich auf deine wichtigste Aufgabe!';document.getElementById('ftime').textContent=fmt(pSec||gW());const fv=document.getElementById('focus-vision');if(fv){const aff=D.vision&&D.vision.affirmation;fv.textContent=aff?'💫 „'+aff+'"':'';}document.getElementById('focmod').style.display='flex';}
function closeFocus(){document.getElementById('focmod').style.display='none';}
// Ablenkungs-Parkplatz: Gedanken als Aufgabe für später sichern, Fokus halten
async function parkDistraction(){
  const inp=document.getElementById('park-input');
  const name=(inp&&inp.value||'').trim();if(!name)return;
  const id=Date.now();
  const r=await sbFetch('/rest/v1/tasks',{method:'POST',body:JSON.stringify({id,user_id:UID,name,prio:'low',diff:'easy',special:'',life_area:null,recurring:null,start_date:null,end_date:null,start_time:null,end_time:null,dep:null,done:false})});
  if(!r.ok){toast('❌ Konnte nicht speichern.');return;}
  D.tasks.unshift({id,name,prio:'low',diff:'easy',special:'',lifeArea:'',recurring:'',start:'',end:'',startTime:'',endTime:'',dep:'',done:false});
  inp.value='';
  try{renderTasks();updateDepSelect();}catch(e){}
  toast('📥 Geparkt für später – zurück zum Fokus!');
}

