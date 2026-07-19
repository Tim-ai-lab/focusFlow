// FocusFlow · 10-journey.js — "Mein Weg"-Ansicht, Fokus-Karte, Tages-Empfehlung
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// Weg-Überblick: Details standardmäßig eingeklappt – der Fokus-Schritt führt.
let journeyMetaOpen=false;
function toggleJourneyMeta(){journeyMetaOpen=!journeyMetaOpen;renderJourney();}
function renderJourney(){
  const el=document.getElementById('journey-content');if(!el)return;
  const ob=D.vision&&D.vision.onboarding;
  if(!ob||!ob.done){
    // Erst-Zustand: der Test ist die EINZIGE Handlung – kein Banner, keine
    // Null-Statistik drumherum (siehe updateHomeChrome).
    el.innerHTML=`<div class="sec" style="text-align:center;padding:38px 24px">
      <div style="font-size:2.6rem;margin-bottom:10px">🧭</div>
      <div style="font-size:1.15rem;font-weight:800;margin-bottom:8px">Finde deinen persönlichen Weg</div>
      <p class="sdesc" style="max-width:430px;margin:0 auto 18px">Beantworte 8 kurze Fragen. FocusFlow erstellt daraus deinen individuellen Entwicklungsweg – immer nur ein Schritt, ohne Überforderung.</p>
      <button class="addbtn" style="padding:13px 26px;font-size:.95rem" onclick="startOnboarding()">🧭 Einstiegstest starten</button>
      <div style="font-size:.75rem;color:var(--mu);margin-top:12px">Dauert ca. 2 Minuten · Deine Antworten bleiben privat</div>
    </div>`;
    try{updateHomeChrome();}catch(e){}
    return;
  }
  const p=ob.profile||{};
  // Migration: Komfortzonen-Schritte in bereits bestehende Wege einfügen –
  // konservativ platziert, ohne den aktuellen Fokus-Schritt zu verschieben.
  if(ob.journey&&ob.journey.length&&(!ob.journey.includes('comfort_map')||!ob.journey.includes('comfort_challenge'))){
    const ins=(id,beforeId)=>{if(ob.journey.includes(id))return;const i=ob.journey.indexOf(beforeId);if(i>=0)ob.journey.splice(i,0,id);else ob.journey.push(id);};
    ins('comfort_map','first_review');
    ins('comfort_challenge','quarterly_review');
    try{saveProfile();}catch(e){}
  }
  const cat=journeyCatalog();
  const completed=computePathStats();
  const journey=(ob.journey||[]).filter(id=>cat[id]);
  const total=journey.length;
  const doneN=journey.filter(id=>completed[id]).length;
  const pct=total?Math.round((doneN/total)*100):0;
  const nextId=journey.find(id=>!stepStatus(id).done);
  const bi=BLOCKER_INFO[p.blocker]||{t:p.blocker,s:''};
  let html='';
  // ── EIN "Jetzt"-Signal: die Tages-Empfehlung (Frosch, Überfälliges, Routine …)
  //    wird als Zeile in die Fokus-Karte integriert statt darüber zu konkurrieren.
  nextActionObj=computeNextAction();
  const openSteps=journey.filter(id=>!stepStatus(id).done);
  const focusId=openSteps[0];
  const nextUpId=openSteps[1];
  // Empfehlung unterdrücken, wenn sie ohnehin auf den Fokus-Schritt zeigt
  const ACT2STEP={morning:'morning_done',evening:'evening_done',energy:'wellbeing_tracked',mitSet:'mit_used',mitDo:'mit_used',firstTask:'first_tasks',comfort:'comfort_challenge'};
  const act=(nextActionObj&&nextActionObj.key!=='journey'&&ACT2STEP[nextActionObj.key]!==focusId)?nextActionObj:null;
  const alsoRow=act?`<div style="margin-top:12px;border-top:1px dashed var(--bo);padding-top:11px;display:flex;gap:9px;align-items:center;flex-wrap:wrap">
      <div style="flex:1;min-width:160px;font-size:.8rem;color:var(--mu);line-height:1.45"><strong style="color:#92400E">⚡ Auch heute:</strong> ${act.icon} ${act.title}</div>
      <button onclick="runNextAction()" style="padding:7px 12px;border:1.5px solid #FED7AA;background:#FFF7ED;border-radius:var(--r3);color:#92400E;font-weight:700;cursor:pointer;font-size:.78rem;white-space:nowrap">${act.btn}</button>
    </div>`:'';
  const stBadge=(st)=>st.mode==='count'?`<span style="font-size:.72rem;color:var(--mu);font-weight:700;align-self:center">${st.count}/${st.target} ${st.unit}</span>`:st.mode==='daily'?`<span style="font-size:.72rem;color:var(--mu);font-weight:700;align-self:center">🔁 täglich</span>`:'';
  // ── 1) Fokus-Karte: das erste und einzige große Element des Screens ──
  if(focusId){
    const s=cat[focusId];
    html+=`<div class="sec" style="border:2px solid var(--p);box-shadow:0 6px 24px rgba(124,158,232,.16)">
      <div style="font-size:.74rem;font-weight:700;color:var(--p);text-transform:uppercase;letter-spacing:.05em;margin-bottom:7px">👉 Dein Fokus jetzt</div>
      <div style="font-size:1.02rem;font-weight:800;margin-bottom:4px">${s.icon} ${stepLabel(s.id,s)}</div>
      <div style="font-size:.85rem;color:var(--mu);line-height:1.55;margin-bottom:10px">${s.why}</div>
      <div style="font-size:.84rem;line-height:1.55;background:#EEF2FF;border:1px solid #C7D2FE;border-radius:var(--r3);padding:9px 12px;margin-bottom:12px;color:#3730A3"><strong>Warum dieser Schritt für dich:</strong> ${personalWhy(s.id,p)||s.why}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button class="addbtn" onclick="journeyGo('${s.id}')">Jetzt starten →</button>
        <button onclick="journeyAI('${s.id}')" style="padding:10px 16px;border:2px solid var(--p);background:#fff;border-radius:var(--r2);color:var(--p);font-weight:700;cursor:pointer;font-size:.86rem">🤖 Wie fange ich an?</button>
        ${stBadge(stepStatus(focusId))}
      </div>
      <div id="journey-ai-box" style="display:none;margin-top:12px"></div>
      ${alsoRow}
    </div>`;
    // Vorschau: nur der EINE nächste Schritt – mit individueller Begründung
    if(nextUpId){
      const n=cat[nextUpId];
      html+=`<div class="sec" style="opacity:.93">
        <div style="font-size:.72rem;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">🔜 Danach kommt</div>
        <div style="font-size:.92rem;font-weight:800;margin-bottom:5px">${n.icon} ${stepLabel(nextUpId,n)}</div>
        <div style="font-size:.82rem;line-height:1.55;color:var(--mu)"><strong style="color:var(--txt)">Warum das dein nächster Schritt ist:</strong> ${personalWhy(nextUpId,p)||n.why}</div>
        <div style="font-size:.74rem;color:var(--mu);margin-top:9px">🔒 Wird dein Fokus, sobald der aktuelle Schritt abgeschlossen ist.</div>
      </div>`;
    }
  }else{
    html+=`<div class="sec" style="text-align:center"><div style="font-size:2rem;margin-bottom:6px">🎉</div><div style="font-weight:800;margin-bottom:4px">Du hast für jetzt alles erledigt!</div><div style="font-size:.85rem;color:var(--mu)">Tägliche Routinen erscheinen morgen wieder. Mach den Test neu, wenn sich etwas verändert hat.</div>${alsoRow?`<div style="text-align:left">${alsoRow}</div>`:''}<div id="journey-ai-box" style="display:none;margin-top:12px"></div></div>`;
  }
  // ── 2) Standort-Check-Hinweis (falls fällig) – unterhalb des Fokus ──
  const rtj=retestInfo();
  if(rtj&&rtj.due){
    html+=`<div class="sec" style="background:linear-gradient(135deg,#FFF7ED,#FFFBEB);border:1.5px solid #FED7AA;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <div style="flex:1;min-width:180px"><strong>🔄 Zeit für deinen Standort-Check</strong><div style="font-size:.83rem;color:#92400E;margin-top:3px">Dein letzter Check ist ${Math.round(rtj.days/7)} Wochen her. Ein kurzer neuer Test macht deinen Fortschritt sichtbar und passt deinen Plan an.</div></div>
      <button class="addbtn" style="background:linear-gradient(135deg,var(--ac),#E87E3A)" onclick="startOnboarding()">Jetzt neu machen →</button>
    </div>`;
  }
  // ── 3) Weg-Überblick: kompakt; Pills, KI-Intro, Ziel & Re-Test eingeklappt ──
  html+=`<div class="sec" style="background:linear-gradient(135deg,#EEF2FF,#F4F6FB);border:1.5px solid #C7D2FE;padding:16px 20px">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
      <div class="stitle" style="font-size:.92rem">🧭 Dein Weg im Überblick</div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:.76rem;font-weight:700;color:var(--mu)">${doneN}/${total} · ${pct}%</span>
        <button onclick="toggleJourneyMeta()" style="padding:5px 11px;border:2px solid var(--bo);background:#fff;border-radius:var(--r3);cursor:pointer;font-size:.74rem;font-weight:700;color:var(--mu)">${journeyMetaOpen?'⌃ Weniger':'⌄ Details'}</button>
      </div>
    </div>
    <div style="height:8px;background:var(--bo);border-radius:5px;overflow:hidden;margin-top:9px"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--p),var(--ac));border-radius:5px;transition:width .6s"></div></div>`;
  // Etappen-Übersicht (P5): sichtbare Kapitel statt endloser Liste
  const chapters=chapterList(journey);
  if(chapters.length){
    html+=`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:11px">`+chapters.map((c,i)=>{
      const doneCh=c.done>=c.total;
      return `<span style="font-size:.72rem;font-weight:700;padding:4px 10px;border-radius:20px;border:1.5px solid ${doneCh?'#BBF7D0':'var(--bo)'};background:${doneCh?'#DCFCE7':'#fff'};color:${doneCh?'#15803D':'var(--mu)'}">${doneCh?'✓ ':''}${c.icon} Kapitel ${i+1}: ${c.name} · ${c.done}/${c.total}</span>`;
    }).join('')+`</div>`;
  }
  // Vision-Anker: die Affirmation bleibt täglich sichtbar (P8)
  const aff=D.vision&&D.vision.affirmation;
  if(aff)html+=`<div style="font-size:.84rem;font-style:italic;color:var(--txt);background:rgba(255,255,255,.65);border:1px solid var(--bo);border-radius:var(--r3);padding:8px 11px;margin-top:11px">💫 „${esc(aff)}"</div>`;
  if(journeyMetaOpen){
    html+=`<div style="margin-top:12px;display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <span class="pill-tag on" style="background:var(--p)">🎯 Fokus: ${LIFE_LABEL[p.goalArea]||p.goalArea}</span>
        <span class="pill-tag on" style="background:var(--ac)">🧱 ${bi.t}</span>
      </div>`;
    if(ob.aiIntro){
      html+=`<div style="background:var(--card);border:1.5px solid var(--bo);border-radius:var(--r2);padding:13px 15px;font-size:.88rem;line-height:1.6;display:flex;gap:10px"><div style="font-size:1.3rem;flex-shrink:0">🤖</div><div>${ob.aiIntro.replace(/\n/g,'<br>')}</div></div>`;
    }else if(bi.s){
      html+=`<div style="font-size:.86rem;color:var(--txt);line-height:1.6">${bi.s}</div>`;
    }
    const topGoal=((D.vision&&D.vision.goals)||[]).find(g=>!g.done);
    if(topGoal){
      const gms=topGoal.milestones||[];const gdn=gms.filter(m=>m.done).length;
      const gpct=gms.length?Math.round(gdn/gms.length*100):0;
      html+=`<div onclick="showTab('goals',document.getElementById('tbtn-goals'))" style="cursor:pointer;font-size:.8rem;font-weight:700;background:rgba(255,255,255,.65);border:1px solid var(--bo);border-radius:var(--r3);padding:8px 11px;display:flex;justify-content:space-between;gap:8px"><span>🎯 ${esc(topGoal.title)}</span><span style="color:var(--p);white-space:nowrap">${gpct}%</span></div>`;
    }
    html+=`<div><button onclick="startOnboarding()" style="padding:6px 12px;border:2px solid var(--bo);background:#fff;border-radius:var(--r3);cursor:pointer;font-size:.76rem;font-weight:700;color:var(--mu)">↻ Test wiederholen</button></div>
    </div>`;
  }
  html+=`</div>`;
  el.innerHTML=html;
  try{updateTopProgress();}catch(e){}
  try{updateNavVisibility();}catch(e){}
  try{updateHomeChrome();}catch(e){}
}
function journeyGo(stepId){
  const cat=journeyCatalog();const s=cat[stepId];if(!s)return;
  try{(new Function(s.action))();}catch(e){console.error('journeyGo action',e);}
  if(s.tab)closePathAndGo(s.tab);
}
async function journeyAI(stepId){
  const box=document.getElementById('journey-ai-box');if(!box)return;
  const cat=journeyCatalog();const s=cat[stepId];if(!s)return;
  const p=(D.vision&&D.vision.onboarding&&D.vision.onboarding.profile)||{};
  box.style.display='block';
  box.innerHTML='<div style="font-size:.85rem;color:var(--mu);font-style:italic">✨ FocusAI denkt nach…</div>';
  const sys=calmMode()
    ?'Du bist FocusAI, ein ruhiger, sanfter Coach. Der Nutzer ist heute erschöpft oder unmotiviert. Antworte auf Deutsch, max 110 Wörter, ohne Hype und ohne Ausrufezeichen. Schlage 1–2 winzige, leichte erste Schritte vor und würdige, dass er da ist.'
    :'Du bist FocusAI, ein konkreter, motivierender Coach. Antworte auf Deutsch, max 130 Wörter, mit 2–4 sehr konkreten ersten Mini-Schritten. Direkt und warmherzig.';
  const msg='Der Nutzer steht bei diesem Schritt seines Weges: "'+s.title+'" ('+s.why+'). Sein Profil: Ziel='+p.goal+', Fokus-Bereich='+(LIFE_LABEL[p.goalArea]||p.goalArea)+', Blockade='+p.blocker+', Energie='+p.energyBaseline+', Zeit/Tag='+p.timePerDay+(todayMoodLabel()?', heutige Stimmung='+todayMoodLabel():'')+'. Wie fängt er am besten an? Gib konkrete, sofort umsetzbare erste Schritte – zugeschnitten auf seine Blockade und verfügbare Zeit.';
  const reply=await callAI([{role:'user',content:msg}],sys,500);
  if(reply){box.innerHTML='<div style="background:var(--bg);border:1.5px solid var(--bo);border-radius:var(--r2);padding:12px 14px;font-size:.86rem;line-height:1.6;display:flex;gap:10px"><div style="font-size:1.2rem;flex-shrink:0">🤖</div><div>'+reply.replace(/\n/g,'<br>')+'</div></div>';}
  else{box.innerHTML='<div class="info-box info-orange" style="margin-top:0">⚠️ FocusAI ist gerade nicht erreichbar. Tipp: Starte mit dem allerkleinsten möglichen Schritt – 2 Minuten genügen.</div>';}
}

// ── Jetzt sofort: konkrete nächste Handlung (regelbasiert, KI auf Klick) ──
let nextActionObj=null;
function computeNextAction(){
  const today=new Date().toISOString().split('T')[0];
  const hour=new Date().getHours();
  const p=(D.vision&&D.vision.onboarding&&D.vision.onboarding.profile)||{};
  const clean=n=>(n||'').replace(/_rec_\d{4}-\d{2}-\d{2}$/,'');
  const open=(D.tasks||[]).filter(t=>!t.done);
  const frog=open.find(t=>t.special==='frog');
  const overdue=open.filter(t=>isOverdue(t));
  const hasWb=(D.wellbeing||[]).some(w=>w.date===today);
  const hasMorning=D.dailyLog&&D.dailyLog[today]&&D.dailyLog[today].morning;
  const hasEvening=D.dailyLog&&D.dailyLog[today]&&D.dailyLog[today].evening;
  const mitSet=(D.mitTasks||[]).some(t=>t&&t.trim());
  const mitFirstUndone=(D.mitTasks||[]).findIndex((t,i)=>t&&t.trim()&&!(D.mitDone&&D.mitDone[i]));
  const A=(icon,title,why,btn,run,ctx)=>({icon,title,why,btn,run,ctx});
  const acts={};
  acts.frog = frog ? A('🐸','Iss den Frosch: „'+clean(frog.name).slice(0,40)+'"','Deine schwerste Aufgabe gibt dir die meiste Energie, wenn du sie zuerst erledigst. Starte 25 fokussierte Minuten.','🔲 Fokus-Modus starten',()=>{startPomo();openFocus();},'Frog-Aufgabe „'+clean(frog.name)+'" als Erstes mit Fokus-Modus erledigen') : null;
  acts.overdue = overdue.length ? A('⚠️',overdue.length+' überfällige Aufgabe'+(overdue.length>1?'n':'')+' – starte mit „'+clean(overdue[0].name).slice(0,32)+'"','Überfälliges erzeugt unbewussten Stress, auch wenn du nicht daran denkst. Eine davon jetzt anzugehen entlastet sofort.','Zu den Aufgaben →',()=>closePathAndGo('tasks'),overdue.length+' überfällige Aufgaben, zuerst „'+clean(overdue[0].name)+'"') : null;
  acts.energy = (!hasWb && hour<16) ? A('⚡','Erfasse kurz deine Energie (1 Min)','Mit deinem Energie-Level empfiehlt dir die App die passenden Aufgaben – und du erkennst mit der Zeit deine Muster.','Energie erfassen →',()=>closePathAndGo('wellbeing'),'Wohlbefinden/Energie für heute eintragen') : null;
  acts.morning = (!hasMorning && hour<14) ? A('🌅','Starte deine Morgenroutine (7 Min)','Intention, Dankbarkeit und Fokus-Aufgabe setzen den Ton für den ganzen Tag.','Morgenroutine starten →',()=>openMorningRoutine(),'Morgenroutine durchführen') : null;
  acts.mitSet = (!mitSet && open.length>0) ? A('🎯','Setze deine 3 wichtigsten Aufgaben für heute','Maximal 3 – das verhindert Überforderung und schafft klare Priorität.','Tagesziele setzen →',()=>closePathAndGo('mit'),'die 3 MIT-Aufgaben für heute festlegen') : null;
  acts.mitDo = (mitFirstUndone>=0) ? A('🎯','Erledige deine Hauptaufgabe: „'+D.mitTasks[mitFirstUndone].slice(0,40)+'"','Diese Aufgabe trägt heute am meisten zu deinem Ziel bei – sie zuerst.','Zu den Tageszielen →',()=>closePathAndGo('mit'),'MIT-Aufgabe „'+D.mitTasks[mitFirstUndone]+'" erledigen') : null;
  acts.topTask = open.length ? (()=>{const top=open.slice().sort((a,b)=>{const pr={high:0,normal:1,low:2};return pr[a.prio]-pr[b.prio];})[0];return A('▶️','Starte mit „'+clean(top.name).slice(0,40)+'"','Deine wichtigste offene Aufgabe – 25 Minuten Pomodoro bringen dich ins Tun.','▶ Pomodoro starten',()=>{closePathAndGo('pomo');startPomo();},'Aufgabe „'+clean(top.name)+'" mit Pomodoro starten');})() : null;
  acts.evening = (hour>=17 && !hasEvening) ? A('🌙','Schließe den Tag mit der Abendreflexion ab','Was nicht reflektiert wird, wiederholt sich. 8 Minuten für Lernen & Vorbereitung auf morgen.','Abendreflexion starten →',()=>openEveningRoutine(),'Abendreflexion durchführen') : null;
  const cch=D.vision&&D.vision.comfort&&D.vision.comfort.current;
  acts.comfort = (cch&&cch.date===today) ? A('🧗','Deine heutige Challenge: „'+esc(cch.text.slice(0,40))+(cch.text.length>40?'…':'')+'"','Mut wächst nur durch Handeln – ein kleiner Schritt über die Grenze, heute.','Challenge ansehen →',()=>openComfortChallenge(),'die angenommene Komfortzonen-Challenge umsetzen: „'+cch.text+'"') : null;
  acts.journey = (()=>{const ob=D.vision&&D.vision.onboarding;if(!(ob&&ob.done&&ob.journey))return null;const cat=journeyCatalog();const completed=computePathStats();const nid=ob.journey.find(id=>cat[id]&&!completed[id]);if(!nid)return null;const s=cat[nid];return A(s.icon,stepLabel(nid,s),s.why,'Jetzt starten →',()=>journeyGo(nid),stepLabel(nid,s)+' angehen');})();
  acts.firstTask = A('➕','Lege deine erste Aufgabe an','Jede große Veränderung beginnt mit einer konkreten ersten Aufgabe.','Aufgabe anlegen →',()=>closePathAndGo('tasks'),'die erste Aufgabe anlegen');
  // Reihenfolge – je nach Haupt-Blockade leicht angepasst
  let order=['frog','overdue','energy','morning','comfort','mitSet','mitDo','topTask','evening','journey','firstTask'];
  if(p.blocker==='lowenergy')order=['energy','morning','overdue','frog','mitDo','mitSet','comfort','topTask','evening','journey','firstTask'];
  else if(p.blocker==='overwhelm')order=['mitSet','mitDo','frog','overdue','energy','morning','comfort','topTask','evening','journey','firstTask'];
  else if(p.blocker==='distraction'||p.blocker==='procrastination')order=['frog','topTask','overdue','mitDo','mitSet','comfort','energy','morning','evening','journey','firstTask'];
  // Tages-Stimmung übersteuert: bei Müde/Unmotiviert sanfter Einstieg statt
  // schwerster Aufgabe (das Versprechen der Stimmungs-Auswahl wird eingelöst)
  if(calmMode())order=['energy','morning','mitDo','mitSet','overdue','topTask','comfort','evening','journey','firstTask','frog'];
  else if(todayMoodLabel()==='Fokussiert')order=['frog','topTask','overdue','mitDo','comfort','mitSet','energy','morning','evening','journey','firstTask'];
  for(const k of order){if(acts[k])return Object.assign({key:k},acts[k]);}
  return Object.assign({key:'firstTask'},acts.firstTask);
}
function runNextAction(){if(nextActionObj&&nextActionObj.run){try{nextActionObj.run();}catch(e){console.error('runNextAction',e);}}}

