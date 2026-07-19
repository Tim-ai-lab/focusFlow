// FocusFlow · 08-goals.js — Ziele mit Meilensteinen
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ── Ziele mit Meilensteinen ──
function renderGoals(){
  const el=document.getElementById('goals-list');if(!el)return;
  const goals=(D.vision&&D.vision.goals)||[];
  if(!goals.length){el.innerHTML='<div class="sec"><div class="empty">Noch keine Ziele. Lege oben dein erstes Ziel an 🎯<br><small>Tipp: ein Ziel, das zu deinem Fokus-Lebensbereich passt.</small></div></div>';return;}
  el.innerHTML=goals.map(g=>{
    const ms=g.milestones||[];
    const doneN=ms.filter(m=>m.done).length;
    const pct=ms.length?Math.round(doneN/ms.length*100):(g.done?100:0);
    const allDone=ms.length>0&&doneN===ms.length;
    let dl='';
    if(g.deadline){const days=Math.ceil((new Date(g.deadline+'T12:00:00').getTime()-Date.now())/864e5);dl=days<0?`<span style="color:var(--err);font-weight:700">⚠️ ${-days} Tage überfällig</span>`:`📅 ${fmtDate(g.deadline)} · noch ${days} Tag${days===1?'':'e'}`;}
    return `<div class="sec"${allDone?' style="border-color:#BBF7D0;background:#F7FEF9"':''}>
      <div class="shdr">
        <div style="flex:1;min-width:0"><div class="stitle">${allDone?'✅ ':'🎯 '}${esc(g.title)}</div>
          <div style="font-size:.76rem;color:var(--mu);margin-top:3px">${g.area?esc(LIFE_LABEL[g.area]||g.area)+' · ':''}${dl}</div></div>
        <button class="delbtn" onclick="delGoal(${g.id})">🗑</button>
      </div>
      <div class="scbar" style="margin-bottom:5px"><div class="scfill" style="width:${pct}%"></div></div>
      <div style="font-size:.74rem;color:var(--mu);font-weight:700;margin-bottom:11px">${doneN}/${ms.length} Meilensteine · ${pct}%</div>
      ${ms.map(m=>`<div style="display:flex;align-items:center;gap:9px;padding:6px 0;border-bottom:1px solid var(--bo)">
        <div class="tcb${m.done?' on':''}" onclick="toggleMilestone(${g.id},${m.id})">${m.done?'✓':''}</div>
        <span style="flex:1;font-size:.87rem;${m.done?'text-decoration:line-through;opacity:.55':''}">${esc(m.title)}</span>
        <button class="delbtn" onclick="delMilestone(${g.id},${m.id})" style="font-size:.82rem">✕</button>
      </div>`).join('')}
      <div class="row" style="margin-top:9px;margin-bottom:0"><input class="ti" id="ms-${g.id}" placeholder="Meilenstein hinzufügen..." onkeydown="if(event.key==='Enter')addMilestone(${g.id})"><button class="addbtn" onclick="addMilestone(${g.id})">+</button></div>
    </div>`;
  }).join('');
}
async function addGoal(){
  const title=gv('goal-title');if(!title){toast('Bitte Ziel eingeben!');return;}
  if(!D.vision)D.vision={};if(!D.vision.goals)D.vision.goals=[];
  D.vision.goals.unshift({id:Date.now(),title,area:gs('goal-area'),deadline:gs('goal-deadline'),milestones:[],createdAt:new Date().toISOString(),done:false});
  document.getElementById('goal-title').value='';document.getElementById('goal-deadline').value='';
  await saveProfile();renderGoals();toast('🎯 Ziel angelegt!');
}
async function delGoal(id){
  if(!(D.vision&&D.vision.goals))return;
  D.vision.goals=D.vision.goals.filter(x=>x.id!==id);
  await saveProfile();renderGoals();
}
async function addMilestone(goalId){
  const inp=document.getElementById('ms-'+goalId);const t=inp?inp.value.trim():'';if(!t){toast('Bitte Meilenstein eingeben!');return;}
  const g=(D.vision.goals||[]).find(x=>x.id===goalId);if(!g)return;
  if(!g.milestones)g.milestones=[];
  g.milestones.push({id:Date.now(),title:t,done:false});
  await saveProfile();renderGoals();
}
async function toggleMilestone(goalId,mId){
  const g=(D.vision.goals||[]).find(x=>x.id===goalId);if(!g)return;
  const m=(g.milestones||[]).find(x=>x.id===mId);if(!m)return;
  m.done=!m.done;m.doneDate=m.done?new Date().toISOString():'';
  g.done=g.milestones.length>0&&g.milestones.every(x=>x.done);
  await saveProfile();renderGoals();
  if(m.done)toast(g.done?'🏆 Ziel erreicht! Großartig!':'✓ Meilenstein erreicht!');
}
async function delMilestone(goalId,mId){
  const g=(D.vision.goals||[]).find(x=>x.id===goalId);if(!g)return;
  g.milestones=(g.milestones||[]).filter(x=>x.id!==mId);
  g.done=g.milestones.length>0&&g.milestones.every(x=>x.done);
  await saveProfile();renderGoals();
}
