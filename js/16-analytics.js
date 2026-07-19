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
  try{renderUsagePanel();}catch(e){console.error('usagePanel',e);}
}
function completeAnalytics(){completeStep('analytics_checked');try{renderAnalytics();}catch(e){}}



// ── NUTZUNGS-METRIKEN ──  Lokale Wirksamkeits-Daten (im eigenen Profil,
// D.vision.metrics). Grundlage für ehrliche Produkt-Entscheidungen:
// Kommt der Nutzer wieder? Hält er die Routinen? Wo bricht er ab?
function metricsData(){
  if(!D.vision)D.vision={};
  if(!D.vision.metrics)D.vision.metrics={opens:{},ob:{}};
  if(!D.vision.metrics.opens)D.vision.metrics.opens={};
  if(!D.vision.metrics.ob)D.vision.metrics.ob={};
  return D.vision.metrics;
}
function trackAppOpen(){
  const m=metricsData();
  const today=new Date().toISOString().split('T')[0];
  const isNewDay=!m.opens[today];
  m.opens[today]=(m.opens[today]||0)+1;
  if(!m.firstSeen)m.firstSeen=today;
  // Auf 90 Tage begrenzen, damit das Profil klein bleibt
  const keys=Object.keys(m.opens).sort();
  while(keys.length>90)delete m.opens[keys.shift()];
  if(isNewDay){try{saveProfile();}catch(e){}}
}
function trackObStart(){const m=metricsData();m.ob.lastStart=new Date().toISOString();m.ob.starts=(m.ob.starts||0)+1;}
function trackObDone(){
  const m=metricsData();
  m.ob.lastDone=new Date().toISOString();m.ob.completions=(m.ob.completions||0)+1;
  if(m.ob.lastStart)m.ob.lastDurationSec=Math.max(0,Math.round((Date.now()-new Date(m.ob.lastStart).getTime())/1000));
  m.ob.lastQuestionCount=(obQuestions||[]).length;
}
function computeUsageStats(){
  const m=metricsData();
  const today=new Date();
  const dayKey=d=>d.toISOString().split('T')[0];
  const openDays=Object.keys(m.opens);
  const inLast=n=>{let c=0;for(let i=0;i<n;i++){const d=new Date(today);d.setDate(d.getDate()-i);if(m.opens[dayKey(d)])c++;}return c;};
  // Aktueller Tages-Streak der App-Öffnungen
  let openStreak=0;for(let i=0;;i++){const d=new Date(today);d.setDate(d.getDate()-i);if(m.opens[dayKey(d)])openStreak++;else break;}
  // Routinen-Quote über die letzten 14 aktiven Tage
  let mor=0,eve=0,denom=0;
  for(let i=0;i<14;i++){
    const d=new Date(today);d.setDate(d.getDate()-i);const k=dayKey(d);
    if(!m.opens[k])continue;
    denom++;
    const dl=(D.dailyLog&&D.dailyLog[k])||{};
    if(dl.morning)mor++;if(dl.evening)eve++;
  }
  // Weg-Schritte: Abschlüsse der letzten 7 Tage aus dem pathLog
  const week=Date.now()-7*864e5;
  let steps7=0;
  const pl=(D.vision&&D.vision.pathLog)||{};
  Object.values(pl).forEach(arr=>(arr||[]).forEach(ts=>{if(new Date(ts).getTime()>=week)steps7++;}));
  // Brems-Ursachen (skipLog) als Verteilung
  const skips={};((D.vision&&D.vision.skipLog)||[]).forEach(s=>{skips[s.cat]=(skips[s.cat]||0)+1;});
  const topSkips=Object.entries(skips).sort((a,b)=>b[1]-a[1]).slice(0,3);
  // Stimmungsverteilung der letzten 14 Tage
  const moods={};
  for(let i=0;i<14;i++){
    const d=new Date(today);d.setDate(d.getDate()-i);
    const dl=(D.dailyLog&&D.dailyLog[dayKey(d)])||{};
    if(dl.mood){const l=dl.mood.split(' ')[1]||dl.mood;moods[l]=(moods[l]||0)+1;}
  }
  return{
    totalDays:openDays.length,active7:inLast(7),active30:inLast(30),openStreak,
    morningRate:denom?Math.round(mor/denom*100):0,eveningRate:denom?Math.round(eve/denom*100):0,denom,
    steps7,topSkips,moods,
    challenges:((D.vision&&D.vision.comfort&&D.vision.comfort.log)||[]).length,
    obDuration:m.ob.lastDurationSec||0,obQuestions:m.ob.lastQuestionCount||0
  };
}
function renderUsagePanel(){
  const el=document.getElementById('usage-panel');if(!el)return;
  const s=computeUsageStats();
  const fmtDur=sec=>sec>=60?Math.round(sec/60)+' Min':sec+' Sek';
  const stat=(v,l)=>`<div style="text-align:center;background:var(--bg);border:1px solid var(--bo);border-radius:var(--r2);padding:10px 6px"><div style="font-size:1.15rem;font-weight:800;color:var(--p)">${v}</div><div style="font-size:.7rem;color:var(--mu);font-weight:700;margin-top:2px">${l}</div></div>`;
  const skipLine=s.topSkips.length
    ?s.topSkips.map(([cat,n])=>`${(SKIP_CATS.find(c=>c.v===cat)||{label:cat}).label} (${n}×)`).join(' · ')
    :'Noch keine erfasst – gut so oder noch zu wenig Daten.';
  const moodLine=Object.keys(s.moods).length
    ?Object.entries(s.moods).sort((a,b)=>b[1]-a[1]).map(([l,n])=>`${l} ${n}×`).join(' · ')
    :'Noch keine Stimmungen gewählt.';
  el.innerHTML=`
    <div class="stitle" style="margin-bottom:4px">📊 Deine Nutzung & Wirksamkeit</div>
    <p class="sdesc" style="margin-bottom:12px">Ehrliche Zahlen statt Gefühl: Dranbleiben ist der stärkste Prädiktor für echte Veränderung.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:8px;margin-bottom:12px">
      ${stat(s.active7+'/7','Aktive Tage (Woche)')}
      ${stat(s.active30+'/30','Aktive Tage (Monat)')}
      ${stat(s.openStreak,'Tage-Serie')}
      ${stat(s.steps7,'Weg-Schritte (7 Tage)')}
      ${stat(s.morningRate+'%','Morgenroutine-Quote')}
      ${stat(s.eveningRate+'%','Reflexions-Quote')}
      ${stat(s.challenges,'Komfort-Challenges')}
      ${stat(s.obDuration?fmtDur(s.obDuration):'–','Test-Dauer')}
    </div>
    <div style="font-size:.8rem;line-height:1.6;color:var(--txt)"><strong>🧱 Häufigste Brems-Ursachen:</strong> ${skipLine}</div>
    <div style="font-size:.8rem;line-height:1.6;color:var(--txt);margin-top:4px"><strong>🙂 Stimmung (14 Tage):</strong> ${moodLine}</div>
    <div style="font-size:.72rem;color:var(--mu);margin-top:10px">🔒 Diese Daten liegen nur in deinem eigenen Profil und verlassen dein Konto nicht.</div>`;
}
