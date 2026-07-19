// FocusFlow · 16-analytics.js — Analytics und Statistiken
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── ANALYTICS ──  Lebensbereich-Statistiken, Wochenchart
// ═══════════════════════════════════════════════════════════════
function renderAnalytics(){
  const lifeStats=LIFE_AREAS.map(la=>{
    const total=D.tasks.filter(t=>t.lifeArea===la.id).length;
    const done=D.tasks.filter(t=>t.lifeArea===la.id&&t.done).length;
    return{...la,total,done,pct:total?Math.round((done/total)*100):0};
  });
  const catColors={career:'#7C9EE8',health:'#6DC98A',relations:'#F4A96A',finance:'#F4D06A',personal:'#B08EE8',meaning:'#E87C9B'};
  document.getElementById('ana-grid').innerHTML=`
    <div class="ana-card">
      <div class="ana-title">Fortschritt pro Lebensbereich</div>
      ${lifeStats.map(la=>`<div class="ana-bar-row">
        <div class="ana-bar-label">${la.icon} ${la.name}</div>
        <div class="ana-bar-wrap"><div class="ana-bar-fill" style="width:${la.pct}%;background:${catColors[la.id]}"></div></div>
        <div class="ana-bar-num">${la.pct}%</div>
      </div>`).join('')}
    </div>
    <div class="ana-card">
      <div class="ana-title">Aufgaben nach Lebensbereich</div>
      ${lifeStats.filter(la=>la.total>0).map(la=>`<div class="ana-bar-row">
        <div class="ana-bar-label">${la.icon} ${la.name}</div>
        <div class="ana-bar-wrap"><div class="ana-bar-fill" style="width:${Math.round((la.total/Math.max(...lifeStats.map(x=>x.total),1))*100)}%;background:${catColors[la.id]}"></div></div>
        <div class="ana-bar-num">${la.total}</div>
      </div>`).join('')||'<div class="empty">Noch keine Aufgaben mit Lebensbereichen.</div>'}
    </div>`;
  const sc=Math.min(100,Math.round((D.todayScore/100)*100));
  document.getElementById('spct').textContent=sc+'%';document.getElementById('sfill').style.width=sc+'%';
  const days=['So','Mo','Di','Mi','Do','Fr','Sa'],dow=new Date().getDay();
  const mx=Math.max(1,...D.weekDone);
  document.getElementById('wchart').innerHTML=D.weekDone.map((v,i)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px"><div style="font-size:.68rem;color:var(--mu);font-weight:700">${v||''}</div><div style="width:100%;height:${Math.max(4,Math.round((v/mx)*66))}px;background:${i===dow?'linear-gradient(180deg,var(--p),var(--pd))':'var(--bo)'};border-radius:5px 5px 0 0;transition:height .4s"></div></div>`).join('');
  document.getElementById('wlbls').innerHTML=days.map((d,i)=>`<div style="flex:1;text-align:center;font-size:.68rem;color:${i===dow?'var(--p)':'var(--mu)'};font-weight:${i===dow?800:600}">${d}</div>`).join('');
  document.getElementById('qbox').textContent=QUOTES[Math.floor(Math.random()*QUOTES.length)];
  // Schritt gilt erst als erledigt, wenn der Nutzer ihn aktiv fertigstellt
  const ac=document.getElementById('ana-complete');
  if(ac){
    ac.innerHTML=stepStatus('analytics_checked').done
      ?'<span class="badge b-2min">✓ Schritt „Analytics ansehen" erledigt</span>'
      :'<button class="addbtn" style="width:100%" onclick="completeAnalytics()">✓ Insights angesehen – Schritt fertigstellen</button>';
  }
}
function completeAnalytics(){completeStep('analytics_checked');try{renderAnalytics();}catch(e){}}

