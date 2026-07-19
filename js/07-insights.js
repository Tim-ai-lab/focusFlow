// FocusFlow · 07-insights.js — KI-Analyse, Re-Test-Vergleich, Wochen-Insight, Verlauf
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ── Analyse: Erzeugung, Darstellung, Dokument, Download ──
async function generateAnalysis(p,answers){
  const sys=`Du bist FocusAI, ein erfahrener, warmherziger Coach mit fundiertem Wissen in Positiver Psychologie (Seligman), Selbstbestimmungstheorie (Deci & Ryan), ACT (Hayes), CBT und Logotherapie (Frankl). Erstelle eine persönliche, psychologisch fundierte Standortbestimmung. Sprich den Nutzer mit "du" an – warmherzig, konkret, ermutigend, ohne Fachjargon zu überladen. Nutze exakt diese Markdown-Überschriften in dieser Reihenfolge:
## Dein aktueller Standort
## Deine Stärken
## Deine Muster & Blockaden
## Was dich jetzt weiterbringt
## Dein Fokus für die nächsten Wochen
Unter den Überschriften kurze Absätze, wo sinnvoll Stichpunkte mit "- ". Insgesamt ca. 350–450 Wörter. Beziehe dich konkret auf die Antworten, aber wiederhole sie nicht bloß – deute sie psychologisch.`;
  const msg='Antworten aus dem Eingangstest (Profil + Rohantworten):\n'+JSON.stringify({profil:p,antworten:answers},null,1)+'\n\nErstelle jetzt die Analyse.';
  const text=await callAI([{role:'user',content:msg}],sys,1600);
  return text||fallbackAnalysis(p);
}
function fallbackAnalysis(p){
  const area=LIFE_LABEL[p.goalArea]||p.goalArea||'deinem Fokusbereich';
  const bi=BLOCKER_INFO[p.blocker]||{t:p.blocker,s:''};
  return `## Dein aktueller Standort
Dein Fokus liegt gerade auf **${area}**. Deine größte Herausforderung ist **${bi.t}**. ${bi.s}

## Deine Stärken
Du hast dir bewusst Zeit genommen, deinen Status ehrlich zu reflektieren – Selbstwahrnehmung ist die Grundlage jeder echten Veränderung.

## Deine Muster & Blockaden
${bi.s} Solche Muster sind erlernt – und damit auch veränderbar.

## Was dich jetzt weiterbringt
Kleine, konkrete Schritte schlagen große Vorsätze. Beginne mit dem, was heute in wenigen Minuten machbar ist, und baue darauf auf.

## Dein Fokus für die nächsten Wochen
Bleib bei deinem persönlichen Weg – ein Schritt nach dem anderen. Konsistenz schlägt Intensität.`;
}
function fmtInline(s){return esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');}
function mdToHtml(md){
  const lines=String(md||'').split(/\r?\n/);let out='',inList=false;
  const cl=()=>{if(inList){out+='</ul>';inList=false;}};
  for(const raw of lines){const line=raw.trim();
    if(!line){cl();continue;}
    if(/^###\s+/.test(line)){cl();out+='<h4>'+fmtInline(line.replace(/^###\s+/,''))+'</h4>';}
    else if(/^##\s+/.test(line)){cl();out+='<h3>'+fmtInline(line.replace(/^##\s+/,''))+'</h3>';}
    else if(/^[-*]\s+/.test(line)){if(!inList){out+='<ul>';inList=true;}out+='<li>'+fmtInline(line.replace(/^[-*]\s+/,''))+'</li>';}
    else{cl();out+='<p>'+fmtInline(line)+'</p>';}
  }
  cl();return out;
}
function fmtDateTime(iso){try{return new Date(iso).toLocaleDateString('de-DE',{day:'2-digit',month:'long',year:'numeric'});}catch(e){return '';}}
function analysisFilename(a){return 'FocusFlow-Analyse-'+String(a.date||'').slice(0,10)+'.html';}
function buildAnalysisDoc(a){
  const area=LIFE_LABEL[a.profile&&a.profile.goalArea]||(a.profile&&a.profile.goalArea)||'';
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FocusFlow Analyse</title>
<style>body{font-family:'Segoe UI',system-ui,sans-serif;background:#F4F6FB;color:#2D3748;margin:0;padding:24px}.doc{max-width:720px;margin:0 auto;background:#fff;border-radius:18px;box-shadow:0 8px 40px rgba(124,158,232,.15);overflow:hidden}.hd{background:linear-gradient(135deg,#7C9EE8,#9B8EE8);color:#fff;padding:34px 34px 28px}.hd h1{margin:0;font-size:1.6rem}.hd p{margin:7px 0 0;opacity:.9;font-size:.9rem}.bd{padding:28px 34px}.bd h3{color:#5B7FD4;font-size:1.15rem;margin:24px 0 8px}.bd h3:first-child{margin-top:0}.bd h4{font-size:1rem;margin:16px 0 6px}.bd p{line-height:1.7;font-size:.96rem;margin:0 0 12px}.bd ul{padding-left:20px}.bd li{margin-bottom:7px;line-height:1.6}.bd strong{color:#2D3748}.ft{padding:18px 34px;color:#8A97B0;font-size:.8rem;border-top:1px solid #E4EAF4}@media print{body{background:#fff;padding:0}.doc{box-shadow:none;border-radius:0}}</style></head>
<body><div class="doc"><div class="hd"><h1>🎯 Deine FocusFlow-Analyse</h1><p>${esc(fmtDateTime(a.date))}${area?' · Fokus: '+esc(area):''}</p></div><div class="bd">${mdToHtml(a.text)}</div><div class="ft">Erstellt mit FocusFlow · psychologisch fundierte Standortbestimmung · Kein Ersatz für Psychotherapie oder ärztliche Behandlung</div></div></body></html>`;
}
function downloadAnalysis(i){
  const arr=(D.vision&&D.vision.analyses)||[];const a=arr[i];if(!a)return;
  const blob=new Blob([buildAnalysisDoc(a)],{type:'text/html;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');link.href=url;link.download=analysisFilename(a);
  document.body.appendChild(link);link.click();document.body.removeChild(link);
  setTimeout(()=>URL.revokeObjectURL(url),2000);
  toast('⬇ Analyse heruntergeladen');
}
function viewAnalysis(i){
  const arr=(D.vision&&D.vision.analyses)||[];const a=arr[i];if(!a)return;
  const w=window.open('','_blank');
  if(w){w.document.write(buildAnalysisDoc(a));w.document.close();}
  else toast('Bitte Pop-ups erlauben, um die Analyse zu öffnen.');
}
// ── Wiederkehrender Test + Fortschrittsvergleich ──
function retestInfo(){
  const ob=D.vision&&D.vision.onboarding;
  if(!ob||!ob.done)return null;
  const arr=(D.vision&&D.vision.analyses)||[];
  const lastDate=(arr[0]&&arr[0].date)||ob.date;
  const days=Math.floor((Date.now()-new Date(lastDate).getTime())/864e5);
  const weeks=D.vision.retestWeeks||6;
  return {days,weeks,due:days>=weeks*7,nextInDays:Math.max(0,weeks*7-days)};
}
function setRetestWeeks(v){
  if(!D.vision)D.vision={};
  D.vision.retestWeeks=+v||6;
  saveProfile();renderMyBereich();try{renderJourney();}catch(e){}
  toast('🔄 Rhythmus: alle '+(+v||6)+' Wochen');
}
const LEVEL={low:1,mid:2,high:3};
function profileDelta(prev,cur){
  const dims=[
    {key:'visionClarity',label:'Vision-Klarheit',better:'up'},
    {key:'energyBaseline',label:'Energie',better:'up'},
    {key:'consistency',label:'Konsistenz',better:'up'},
    {key:'reflection',label:'Reflexion',better:'up'},
    {key:'selfdoubt',label:'Selbstzweifel',better:'down'}
  ];
  const lbl={1:'niedrig',2:'mittel',3:'hoch'};
  return dims.map(d=>{
    const a=LEVEL[prev&&prev[d.key]]||null,b=LEVEL[cur&&cur[d.key]]||null;
    let dir='→',color='var(--mu)';
    if(a!=null&&b!=null&&b!==a){const better=(b>a)===(d.better==='up');dir=b>a?'↑':'↓';color=better?'var(--ok)':'var(--err)';}
    return {label:d.label,from:lbl[a]||'?',to:lbl[b]||'?',dir,color,changed:a!==b};
  });
}
// ── Wochen-Insight: KI-Auswertung der letzten 7 Tage ──
function currentWeekKey(){const d=new Date();return d.getFullYear()+'-W'+getWeekNum(d.toISOString().split('T')[0]);}
async function generateWeeklyInsight(){
  const btn=document.getElementById('wi-btn');if(btn){btn.disabled=true;btn.textContent='✨ Erstelle…';}
  if(!D.vision)D.vision={};
  const wb=(D.wellbeing||[]).slice(0,7);
  const log=D.dailyLog||{};
  const days7=Object.keys(log).sort().slice(-7).map(d=>({date:d,morgenroutine:!!(log[d]&&log[d].morning),abendreflexion:!!(log[d]&&log[d].evening),stimmung:(log[d]&&log[d].mood)||''}));
  const pl=(D.vision.pathLog)||{};
  const steps7=Object.keys(pl).reduce((s,k)=>s+(pl[k]||[]).filter(ts=>(Date.now()-new Date(ts).getTime())/864e5<=7).length,0);
  const sys='Du bist FocusAI, ein warmherziger, psychologisch fundierter Coach. Schreibe einen Wochen-Insight auf Deutsch in du-Form, 120–170 Wörter, ohne Überschriften: 1) Was in den Daten auffällt, 2) welches Muster dahinterstecken könnte (vorsichtig deuten, nicht behaupten), 3) EIN konkreter, kleiner Impuls für die nächste Woche. Warm, konkret, keine Floskeln. Du darfst **fett** für 1–2 Kernstellen nutzen.';
  const msg='Meine Daten der letzten 7 Tage:\nWohlbefinden: '+JSON.stringify(wb)+'\nRoutinen/Stimmung: '+JSON.stringify(days7)+'\nAufgaben erledigt gesamt: '+(D.tasks||[]).filter(t=>t.done).length+', offen: '+(D.tasks||[]).filter(t=>!t.done).length+'\nWochen-Verteilung erledigter Aufgaben (So–Sa): '+JSON.stringify(D.weekDone)+'\nWeg-Schritte in 7 Tagen: '+steps7+'\nProfil: '+JSON.stringify((D.vision.onboarding&&D.vision.onboarding.profile)||{});
  const text=await callAI([{role:'user',content:msg}],sys,700);
  if(text){
    if(!D.vision.weeklyInsights)D.vision.weeklyInsights={};
    D.vision.weeklyInsights[currentWeekKey()]={date:new Date().toISOString(),text};
    try{await saveProfile();}catch(e){}
    renderMyBereich();toast('🧠 Wochen-Insight erstellt!');
  }else{
    if(btn){btn.disabled=false;btn.textContent='🧠 Insight erstellen';}
    toast('⚠️ FocusAI gerade nicht erreichbar – versuch es gleich nochmal.');
  }
}
// P3: Hypothesenmodell – prüfbare Annahmen aus Test + Verhalten (keine Diagnosen)
function computeHypotheses(){
  const H=[];const ob=D.vision&&D.vision.onboarding;
  if(!ob||!ob.done)return H;
  const p=ob.profile||{};
  const add=(label,evidence)=>H.push({label,evidence});
  const sc={};(D.vision.skipLog||[]).forEach(s=>{sc[s.cat]=(sc[s.cat]||0)+1;});
  if(p.blocker)add('Deine größte Hürde ist aktuell „'+((BLOCKER_INFO[p.blocker]||{}).t||p.blocker)+'"','Einstiegstest'+(ob.date?' vom '+ob.date:''));
  if(p.selfdoubt==='high')add('Ein starker innerer Kritiker könnte dich bremsen (Angst vor Bewertung / Perfektionismus)','Selbstzweifel im Test als „stark" angegeben');
  if((sc.perfekt||0)>=2)add('Perfektionismus hindert dich möglicherweise am Abschließen',sc.perfekt+'× „Perfektionismus" in Abendreflexionen');
  if((sc.angst||0)+(sc.sozial||0)>=2)add('Vermeidung aus Unsicherheit könnte ein Muster sein',((sc.angst||0)+(sc.sozial||0))+'× Angst/soziale Hürde in Abendreflexionen');
  const wb7=(D.wellbeing||[]).slice(0,7);
  if(wb7.length>=3){
    const avgS=wb7.reduce((s,w)=>s+(+w.sleep||0),0)/wb7.length;
    if(avgS<6.5)add('Deine Energie-Engpässe könnten am Schlaf liegen','Ø '+avgS.toFixed(1)+'h Schlaf in den letzten '+wb7.length+' Einträgen');
    const avgSt=wb7.reduce((s,w)=>s+(+w.stress||0),0)/wb7.length;
    if(avgSt>=7)add('Dauerstress könnte deine Umsetzungskraft dämpfen','Ø Stress '+avgSt.toFixed(1)+'/10 in den letzten Einträgen');
  }
  if((sc.energie||0)>=2)add('Fehlende Energie ist wiederkehrend – eher körperliche Ursache als Willensfrage',sc.energie+'× „zu wenig Energie" in Abendreflexionen');
  if(p.visionClarity==='low'&&!(D.vision.stepData&&Object.keys(D.vision.stepData).length))add('Eine unklare Vision könnte deine Antriebsbremse sein','Test: Vision unscharf · Vision-Prozess noch offen');
  if((sc.klarheit||0)>=2)add('Aufgaben scheitern bei dir eher an Unklarheit als an Disziplin',sc.klarheit+'× „fehlende Klarheit" in Abendreflexionen');
  if((sc.zu_gross||0)>=2)add('Deine Aufgaben sind möglicherweise zu groß geschnitten',sc.zu_gross+'× „Aufgabe zu groß" in Abendreflexionen');
  return H.slice(0,6);
}
// P7: Veränderung nicht nur zeigen, sondern erklären
async function interpretDevelopment(){
  const arr=(D.vision&&D.vision.analyses)||[];if(arr.length<2)return;
  const btn=document.getElementById('dev-int-btn');if(btn){btn.disabled=true;btn.textContent='✨ Analysiere…';}
  const key=arr[1].date+'→'+arr[0].date;
  const sys='Du bist FocusAI, ein warmherziger, psychologisch fundierter Coach. Vergleiche zwei Standort-Profile desselben Nutzers. Antworte auf Deutsch in du-Form, 120–160 Wörter, drei kurze Absätze: 1) Was hat sich verändert? 2) Was könnte das bedeuten (vorsichtig deuten, nicht behaupten)? 3) Was heißt das für den weiteren Weg? Warm, konkret, ohne Jargon. **Fett** sparsam einsetzen.';
  const msg='Vorheriges Profil ('+String(arr[1].date).slice(0,10)+'): '+JSON.stringify(arr[1].profile)+'\nAktuelles Profil ('+String(arr[0].date).slice(0,10)+'): '+JSON.stringify(arr[0].profile);
  const text=await callAI([{role:'user',content:msg}],sys,600);
  if(text){
    D.vision.devInterpret={key,text};
    try{await saveProfile();}catch(e){}
    renderMyBereich();
  }else{
    if(btn){btn.disabled=false;btn.textContent='🤖 Was bedeutet das für meinen Weg?';}
    toast('⚠️ FocusAI gerade nicht erreichbar.');
  }
}
function renderMyBereich(){
  const el=document.getElementById('me-content');if(!el)return;
  const arr=(D.vision&&D.vision.analyses)||[];
  let html=`<div class="sec"><div class="shdr"><div class="stitle">👤 Mein Bereich</div></div>
    <p class="sdesc">Deine persönlichen Analysen – dauerhaft in deinem Account gespeichert und jederzeit herunterladbar.</p>`;
  if(!arr.length){
    html+=`<div class="empty">Noch keine Analyse vorhanden.<br>Sie entsteht automatisch nach dem Eingangstest.<br><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px"><button class="addbtn" onclick="startOnboarding()">🧭 Test starten</button><button onclick="openTutorial(false)" style="padding:10px 16px;border:2px solid var(--bo);background:#fff;border-radius:var(--r2);color:var(--mu);font-weight:700;cursor:pointer;font-size:.88rem">📖 Tutorial</button></div></div></div>`;
    el.innerHTML=html;return;
  }
  const rt=retestInfo();
  html+=`<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:8px">
    <button class="addbtn" onclick="startOnboarding()">🔄 Standort-Check erneut</button>
    <button onclick="openTutorial(false)" style="padding:9px 14px;border:2px solid var(--bo);background:#fff;border-radius:var(--r2);color:var(--mu);font-weight:700;cursor:pointer;font-size:.82rem">📖 Tutorial</button>
    <button onclick="exportAllData()" title="Alle deine Daten als JSON-Backup herunterladen" style="padding:9px 14px;border:2px solid var(--bo);background:#fff;border-radius:var(--r2);color:var(--mu);font-weight:700;cursor:pointer;font-size:.82rem">⬇ Daten-Backup</button>
    <label style="font-size:.8rem;color:var(--mu);font-weight:700;display:flex;align-items:center;gap:6px">Rhythmus
      <select class="sel" onchange="setRetestWeeks(this.value)">${[4,6,8,12].map(w=>`<option value="${w}"${(D.vision.retestWeeks||6)===w?' selected':''}>alle ${w} Wo.</option>`).join('')}</select>
    </label>
    ${rt?`<span style="font-size:.78rem;color:${rt.due?'var(--ac)':'var(--mu)'};font-weight:700">${rt.due?'⏰ jetzt fällig':'nächster in '+rt.nextInDays+' Tagen'}</span>`:''}
  </div></div>`;
  if(arr.length>=2){
    const deltas=profileDelta(arr[1].profile,arr[0].profile);
    const cur=arr[0].profile||{},prev=arr[1].profile||{};
    html+=`<div class="sec"><div class="shdr"><div class="stitle">📈 Deine Entwicklung</div></div>
      <div style="font-size:.8rem;color:var(--mu);margin-bottom:12px">Vergleich: ${esc(fmtDateTime(arr[1].date))} → ${esc(fmtDateTime(arr[0].date))}</div>`;
    deltas.forEach(d=>{html+=`<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--bo)"><div style="flex:1;font-size:.85rem;font-weight:700">${d.label}</div><div style="font-size:.8rem;color:var(--mu)">${d.from} → ${d.to}</div><div style="font-size:1.1rem;font-weight:800;color:${d.color};width:22px;text-align:center">${d.dir}</div></div>`;});
    const biP=BLOCKER_INFO[prev.blocker],biC=BLOCKER_INFO[cur.blocker];
    if(prev.blocker!==cur.blocker)html+=`<div style="margin-top:10px;font-size:.84rem"><strong>🧱 Blockade:</strong> ${esc(biP?biP.t:prev.blocker||'?')} → ${esc(biC?biC.t:cur.blocker||'?')}</div>`;
    if(prev.goalArea!==cur.goalArea)html+=`<div style="margin-top:6px;font-size:.84rem"><strong>🎯 Fokus:</strong> ${esc(LIFE_LABEL[prev.goalArea]||prev.goalArea||'?')} → ${esc(LIFE_LABEL[cur.goalArea]||cur.goalArea||'?')}</div>`;
    // P7: Interpretation statt bloßer Pfeile
    const devKey=arr[1].date+'→'+arr[0].date;
    const devI=D.vision.devInterpret;
    if(devI&&devI.key===devKey){
      html+=`<div class="md-body" style="margin-top:12px;background:var(--bg);border:1px solid var(--bo);border-radius:var(--r2);padding:12px 14px">${mdToHtml(devI.text)}</div>`;
    }else{
      html+=`<button id="dev-int-btn" onclick="interpretDevelopment()" style="margin-top:12px;padding:9px 15px;border:2px solid var(--p);background:#fff;border-radius:var(--r2);color:var(--p);font-weight:700;cursor:pointer;font-size:.84rem">🤖 Was bedeutet das für meinen Weg?</button>`;
    }
    html+=`</div>`;
  }
  const latest=arr[0];
  html+=`<div class="sec"><div class="shdr"><div class="stitle">✨ Aktuelle Analyse</div>
      <button onclick="downloadAnalysis(0)" style="padding:7px 13px;border:2px solid var(--p);background:#fff;border-radius:var(--r2);color:var(--p);font-weight:700;cursor:pointer;font-size:.8rem">⬇ Als Dokument</button></div>
    <div style="font-size:.76rem;color:var(--mu);margin-bottom:12px">${esc(fmtDateTime(latest.date))}</div>
    <div class="md-body">${mdToHtml(latest.text)}</div></div>`;
  if(arr.length>1){
    html+=`<div class="sec"><div class="shdr"><div class="stitle">Frühere Analysen</div></div>`;
    arr.slice(1).forEach((a,idx)=>{
      const i=idx+1;
      html+=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--bo)">
        <div style="font-size:.86rem;font-weight:700">🗓️ ${esc(fmtDateTime(a.date))}</div>
        <div style="display:flex;gap:6px">
          <button onclick="viewAnalysis(${i})" style="padding:6px 11px;border:1.5px solid var(--bo);background:none;border-radius:var(--r3);color:var(--txt);font-weight:700;cursor:pointer;font-size:.78rem">Ansehen</button>
          <button onclick="downloadAnalysis(${i})" style="padding:6px 11px;border:1.5px solid var(--p);background:none;border-radius:var(--r3);color:var(--p);font-weight:700;cursor:pointer;font-size:.78rem">⬇</button>
        </div></div>`;
    });
    html+=`</div>`;
  }
  // Hypothesen (P3): Annahmen, keine Wahrheiten
  const hyps=computeHypotheses();
  if(hyps.length){
    html+=`<div class="sec"><div class="shdr"><div class="stitle">🔬 Annahmen über deine Muster</div></div>
      <p class="sdesc">Das sind <strong>prüfbare Annahmen</strong> aus deinem Test und deinem Verhalten – keine Diagnosen und keine Wahrheiten. Sie ändern sich, sobald deine Daten etwas anderes zeigen.</p>`;
    hyps.forEach(h=>{html+=`<div style="display:flex;gap:9px;padding:9px 0;border-bottom:1px solid var(--bo)"><div style="flex-shrink:0">🔍</div><div style="flex:1"><div style="font-size:.87rem;font-weight:700;line-height:1.45">${esc(h.label)}</div><div style="font-size:.75rem;color:var(--mu);margin-top:2px">Anhaltspunkt: ${esc(h.evidence)}</div></div></div>`;});
    html+=`</div>`;
  }
  // Weg-Anpassungsprotokoll (P9): jede Neukalibrierung nachvollziehbar
  const adj=(D.vision.pathAdjustLog||[]);
  if(adj.length){
    html+=`<div class="sec"><div class="shdr"><div class="stitle">🧭 Weg-Anpassungen</div><span style="font-size:.72rem;color:var(--mu);font-weight:700">${adj.length}</span></div>
      <p class="sdesc">Wenn dein Weg neu kalibriert wird, steht hier warum – nachvollziehbar statt Blackbox.</p>`;
    adj.slice(0,5).forEach(a2=>{
      html+=`<div style="border:1.5px solid var(--bo);border-radius:var(--r2);padding:12px 14px;margin-bottom:9px;background:var(--bg)">
        <div style="font-size:.74rem;color:var(--mu);font-weight:700;margin-bottom:5px">${esc(fmtDateTime(a2.date))}</div>
        <div style="font-size:.83rem;line-height:1.65"><strong>Auslöser:</strong> ${esc(a2.trigger||'')}<br><strong>Alte Annahme:</strong> ${esc(a2.oldA||'')}<br><strong>Neue Annahme:</strong> ${esc(a2.newA||'')}${a2.focus?`<br><strong>Neuer Fokus:</strong> ${esc(a2.focus)}`:''}</div>
      </div>`;
    });
    html+=`</div>`;
  }
  // Wochen-Insight
  const wk=currentWeekKey();
  const wi=(D.vision.weeklyInsights||{})[wk];
  const wiPrev=Object.keys(D.vision.weeklyInsights||{}).filter(k=>k!==wk).sort().reverse()[0];
  html+=`<div class="sec"><div class="shdr"><div class="stitle">🧠 Wochen-Insight</div><span style="font-size:.72rem;color:var(--mu);font-weight:700">${esc(wk)}</span></div>`;
  if(wi){
    html+=`<div class="md-body">${mdToHtml(wi.text)}</div><div style="font-size:.72rem;color:var(--mu);margin-top:8px">Erstellt am ${esc(fmtDateTime(wi.date))} · nächster Insight ab nächster Woche</div>`;
  }else{
    html+=`<p class="sdesc">FocusAI wertet deine letzten 7 Tage aus (Wohlbefinden, Routinen, Aufgaben) und gibt dir einen konkreten Impuls für die nächste Woche.</p><button class="addbtn" id="wi-btn" onclick="generateWeeklyInsight()">🧠 Insight erstellen</button>`;
    if(wiPrev)html+=`<div style="margin-top:14px;border-top:1px solid var(--bo);padding-top:12px"><div style="font-size:.72rem;font-weight:700;color:var(--mu);margin-bottom:6px">Letzter Insight (${esc(wiPrev)})</div><div class="md-body" style="opacity:.75">${mdToHtml(D.vision.weeklyInsights[wiPrev].text)}</div></div>`;
  }
  html+=`</div>`;
  // Erinnerungen
  const rem=getReminders();
  const notifState=('Notification'in window)?Notification.permission:'unsupported';
  html+=`<div class="sec"><div class="shdr"><div class="stitle">🔔 Erinnerungen</div></div>
    <p class="sdesc">Sanfte Erinnerungen an deine Routinen – solange FocusFlow im Browser geöffnet ist.</p>
    <label style="display:flex;align-items:center;gap:9px;margin-bottom:13px;cursor:pointer"><input type="checkbox" ${rem.enabled?'checked':''} onchange="toggleReminders(this.checked)" style="width:18px;height:18px;accent-color:var(--p)"><span style="font-weight:700;font-size:.9rem">Erinnerungen aktivieren</span></label>
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <label style="font-size:.8rem;font-weight:700;color:var(--mu);display:flex;flex-direction:column;gap:4px">🌅 Morgenroutine<input type="time" class="sel" value="${rem.morning||'08:00'}" onchange="setReminderTime('morning',this.value)"></label>
      <label style="font-size:.8rem;font-weight:700;color:var(--mu);display:flex;flex-direction:column;gap:4px">🌙 Abendreflexion<input type="time" class="sel" value="${rem.evening||'20:00'}" onchange="setReminderTime('evening',this.value)"></label>
    </div>
    <button onclick="testReminder()" style="margin-top:13px;padding:8px 14px;border:2px solid var(--bo);background:#fff;border-radius:var(--r2);color:var(--mu);font-weight:700;cursor:pointer;font-size:.82rem">🔔 Test-Benachrichtigung</button>
    ${notifState==='denied'?'<div class="info-box info-orange" style="margin-top:12px">⚠️ Benachrichtigungen sind im Browser blockiert. Du bekommst Erinnerungen dann nur als Hinweis in der App. In den Browser-Einstellungen kannst du sie erlauben.</div>':''}
    <div class="info-box info-blue" style="margin-top:12px">💡 Für Erinnerungen auch bei <strong>geschlossener</strong> App wäre E-Mail nötig (Supabase-Cron + Mailversand). Sag Bescheid, wenn du das einrichten willst.</div>
  </div>`;
  // Verlauf: erledigte Schritte inkl. Inhalte
  html+=renderStepTimeline();
  el.innerHTML=html;
}
function stepEventContent(stepId,dateStr){
  const dl=(D.dailyLog&&D.dailyLog[dateStr])||null;
  const short=(s,n=160)=>{s=String(s||'').trim();return s.length>n?s.slice(0,n)+'…':s;};
  const P=[];
  if(stepId==='morning_done'&&dl&&dl.morning){const m=dl.morning;if(m.intention)P.push('🌟 '+m.intention);if(m.focus)P.push('🎯 '+m.focus);if(m.gratitude)P.push('🙏 '+m.gratitude);}
  else if(stepId==='evening_done'&&dl&&dl.evening){const e=dl.evening;if(e.wins)P.push('🏆 '+e.wins);if(e.learnings)P.push('📚 '+e.learnings);if(e.tomorrow)P.push('🌙 '+e.tomorrow);}
  else if(stepId==='wellbeing_tracked'){const w=(D.wellbeing||[]).find(x=>x.date===dateStr);if(w){P.push(`😴 ${w.sleep}h · ⚡ ${w.energy}/10 · 😰 ${w.stress}/10 · 🏃 ${w.move}min`);if(w.note)P.push(w.note);}}
  else if(stepId==='first_review'){const r=(D.reviews||[]).find(x=>x.date===dateStr);if(r){if(r.good)P.push('🏆 '+r.good);if(r.next)P.push('🎯 '+r.next);}}
  else if((stepId==='quarterly_review'||stepId==='beliefs_revisited')&&D.vision&&D.vision.reflections&&D.vision.reflections[stepId]){
    const ref=D.vision.reflections[stepId].find(x=>String(x.date).slice(0,10)===dateStr)||D.vision.reflections[stepId].slice(-1)[0];
    if(ref&&ref.data)Object.values(ref.data).filter(Boolean).slice(0,3).forEach(v=>P.push(v));
  }
  else if(stepId==='vision_process'&&D.vision&&D.vision.stepData){const v=Object.values(D.vision.stepData).filter(Boolean)[0];if(v)P.push(v);}
  return P.map(x=>esc(short(x))).join('<br>');
}
function renderStepTimeline(){
  const log=(D.vision&&D.vision.pathLog)||{};
  const cat=journeyCatalog();
  const events=[];
  Object.keys(log).forEach(stepId=>{(log[stepId]||[]).forEach(ts=>events.push({ts,stepId}));});
  events.sort((a,b)=>String(b.ts).localeCompare(String(a.ts)));
  let h=`<div class="sec"><div class="shdr"><div class="stitle">🗂️ Verlauf – erledigte Schritte</div><span style="font-size:.74rem;color:var(--mu);font-weight:700">${events.length}</span></div>`;
  if(!events.length){h+=`<div class="empty">Noch keine abgeschlossenen Schritte. Sobald du Sequenzen abschließt, erscheinen sie hier mit ihren Inhalten.</div></div>`;return h;}
  const todayStr=new Date().toISOString().slice(0,10);
  events.slice(0,40).forEach(ev=>{
    const s=cat[ev.stepId]||{icon:'✓'};const content=stepEventContent(ev.stepId,String(ev.ts).slice(0,10));
    const isToday=String(ev.ts).slice(0,10)===todayStr;
    h+=`<div style="display:flex;gap:11px;padding:11px 0;border-bottom:1px solid var(--bo)">
      <div style="font-size:1.3rem;flex-shrink:0">${s.icon||'✓'}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><div style="font-size:.88rem;font-weight:700">${stepLabel(ev.stepId,s)}</div><div style="display:flex;gap:7px;align-items:center"><span style="font-size:.74rem;color:var(--mu);white-space:nowrap">${esc(fmtDateTime(ev.ts))}</span>${isToday?`<button onclick="undoStep('${ev.stepId}')" title="Heutigen Eintrag zurücknehmen" style="padding:3px 8px;border:1.5px solid var(--bo);background:none;color:var(--mu);border-radius:var(--r3);font-weight:700;cursor:pointer;font-size:.7rem">↩</button>`:''}</div></div>
        ${content?`<div style="font-size:.8rem;color:var(--mu);line-height:1.5;margin-top:4px">${content}</div>`:''}
      </div>
    </div>`;
  });
  if(events.length>40)h+=`<div style="text-align:center;font-size:.76rem;color:var(--mu);margin-top:10px">… und ${events.length-40} weitere</div>`;
  h+=`</div>`;return h;
}
