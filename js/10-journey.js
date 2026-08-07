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
  // ── 0) Selbstvergebung nach Serien-Riss: einmalig entlasten (nur am Riss-Tag) ──
  try{html+=lapseCardHtml();}catch(e){}
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
        <button onclick="journeyStart('${s.id}')" style="padding:10px 16px;border:2px solid var(--p);background:#fff;border-radius:var(--r2);color:var(--p);font-weight:700;cursor:pointer;font-size:.86rem">💡 Wie fange ich an?</button>
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
  // Impuls des Tages: rotierender Anker bzw. Affirmation, mit Beweis-Kopplung
  // und 1-Tap-Wirksamkeits-Signal (P8 + Anker-Destillation)
  try{html+=impulseHtml();}catch(e){}
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
// ── „So fängst du an" – kuratiert & deterministisch, kein KI-Aufruf ──
// Substanz je Schritt (konkrete erste Mini-Schritte) + profilabhängige
// Rahmung (Blockade, Zeit). Sofort, konsistent, ausfallsicher, offline,
// null Grenzkosten – die richtige Form für ein Mehrnutzer-Produkt.
const STEP_START={
  vision_process:['Öffne den Vision-Prozess und lies nur die erste Frage.','Antworte in Stichworten – kein perfekter Text nötig.','Ein Satz genügt, um den ersten Schritt zu machen.'],
  life_areas:['Wähle den EINEN Lebensbereich, der dir gerade am wichtigsten ist.','Schreib in einem Satz, wie er in 3 Jahren aussehen soll.','Die übrigen Bereiche kannst du später ergänzen.'],
  beliefs_done:['Denk an eine Situation, in der du dich selbst gebremst hast.','Schreib wortwörtlich den Satz auf, den dein innerer Kritiker dabei sagt.','Mehr braucht der erste Schritt nicht.'],
  comfort_map:['Öffne „Komfortzone kartieren".','Beantworte nur die erste Frage: Was gehört zu deiner Komfortzone?','Ehrlich statt vollständig – das reicht.'],
  first_tasks:['Denk an eine konkrete Sache, die du diese Woche erledigen willst.','Leg sie als Aufgabe an und ordne ihr einen Lebensbereich zu.','Eine Aufgabe genügt für den Anfang.'],
  mit_used:['Frag dich: Was ist HEUTE das Wichtigste?','Trag es in den ersten Tagesziel-Slot ein.','Maximal 3 – lieber weniger.'],
  cal_used:['Nimm eine offene Aufgabe.','Gib ihr einen festen Zeitblock im Kalender – heute oder morgen.','Ein Termin mit dir selbst ist ein Versprechen.'],
  morning_done:['Starte die Morgenroutine.','Beantworte nur die erste Frage (Dankbarkeit) – ein Stichwort reicht.','7 Minuten oder weniger.'],
  pomodoro_used:['Wähle eine Aufgabe, vor der du dich drückst.','Starte einen 25-Minuten-Timer und leg sofort los.','Nach dem Klingeln darfst du aufhören.'],
  evening_done:['Öffne die Abendreflexion.','Nenne einen Erfolg von heute – auch ein kleiner zählt.','Die App führt dich durch den Rest.'],
  wellbeing_tracked:['Öffne Wohlbefinden.','Schätze Schlaf, Energie und Stress kurz ein – Bauchgefühl genügt.','Dauert unter einer Minute.'],
  profile_depth:['Öffne „Profil vertiefen".','Beantworte die kurzen Zusatzfragen ehrlich.','Danach wird dein Weg noch genauer.'],
  first_review:['Öffne den Wochenrückblick.','Beantworte nur: Was lief diese Woche gut?','Ein Satz reicht, um zu starten.'],
  journal_7days:['Öffne das Journal für heute.','Halte einen Gedanken oder eine Beobachtung fest.','Konsistenz schlägt Länge.'],
  analytics_checked:['Öffne Analytics.','Schau dir eine Zahl an, die dich überrascht.','Frag dich, was sie über dich verrät.'],
  comfort_challenge:['Öffne die Komfortzonen-Challenge.','Wähle EINE Mutprobe für heute.','Herausfordernd, aber sicher – du entscheidest.'],
  ai_coach_used:['Öffne FocusAI.','Stell die Frage, die dich gerade wirklich beschäftigt.','Es gibt keine falsche erste Nachricht.'],
  quarterly_review:['Öffne den Quartals-Review.','Beantworte nur: Stimmt meine Richtung noch?','Ehrlich statt ausführlich.'],
  beliefs_revisited:['Öffne die Glaubenssatz-Prüfung.','Erinnere dich an einen alten bremsenden Satz.','Frag dich: Glaube ich das heute noch?']
};
// Profilabhängige Rahmung – senkt die Einstiegshürde je nach Haupt-Blockade.
const BLOCKER_REFRAME={
  overwhelm:'🧱 Bei Überforderung zählt nur der erste Punkt. Alles andere darfst du jetzt bewusst ignorieren.',
  unclarity:'🤔 Klarheit entsteht beim Tun, nicht davor. Fang an, auch wenn noch nicht alles klar ist.',
  lowenergy:'😴 Wenig Energie? Mach nur den allerersten Mini-Schritt – mehr ist heute nicht nötig.',
  fear:'😰 Fang so klein an, dass es sich sicher anfühlt. Ein Versuch zählt schon als Erfolg.',
  distraction:'🎮 Leg das Handy für die nächsten Minuten weg. Ein kurzer, geschützter Moment genügt.',
  procrastination:'⏳ Der Start ist die einzige echte Hürde. Mach die erste Handlung so klein, dass Anfangen leichter ist als Aufschieben.'
};
// Profilspezifische Varianten – NUR für Schritte, bei denen sich der erste
// Schritt je Blockade wirklich unterscheidet (bewusst schlank, keine 19×6-Matrix).
// Fehlt eine Kombination, greift STEP_START (Basis) + BLOCKER_REFRAME.
const STEP_START_BY_BLOCKER={
  first_tasks:{
    overwhelm:['Denk an die EINE Sache, die dich gerade am meisten beschäftigt.','Leg nur sie als Aufgabe an – sonst nichts.','Der Rest darf warten, bis diese erledigt ist.'],
    fear:['Wähle etwas Kleines, das sich sicher anfühlt.','Leg es als Aufgabe an – niemand sieht es außer dir.','Ein erster, risikoloser Eintrag genügt.'],
    procrastination:['Nimm die Aufgabe, die du am längsten vor dir herschiebst.','Zerleg sie in einen Schritt, der nur 2 Minuten dauert.','Leg genau diesen 2-Minuten-Schritt an.']
  },
  mit_used:{
    overwhelm:['Wähle nur EINE Aufgabe für heute – nicht drei.','Trag sie in den ersten Slot ein, lass die anderen leer.','Eine erledigte Sache schlägt drei angefangene.'],
    fear:['Wähle die am wenigsten bedrohliche wichtige Aufgabe.','Trag sie als erstes Tagesziel ein.','Mut wächst, wenn du klein anfängst.'],
    procrastination:['Wähle die Aufgabe, vor der du dich am meisten drückst – deinen „Frosch".','Setz sie auf Platz 1 der Tagesziele.','Ist sie erledigt, wird der Rest des Tages leicht.']
  },
  pomodoro_used:{
    fear:['Wähle eine Aufgabe und stell den Timer auf nur 10 Minuten statt 25.','Sag dir: Nach 10 Minuten darf ich aufhören.','Meist willst du dann weitermachen – musst aber nicht.'],
    lowenergy:['Stell den Timer auf 10 Minuten statt 25.','Ein kurzer Block ist besser als gar keiner.','Nach dem Klingeln entscheidest du neu.'],
    distraction:['Leg das Handy außer Reichweite.','Stell den 25-Minuten-Timer und schließe alle anderen Tabs/Apps.','Für diese 25 Minuten existiert nur die eine Aufgabe.']
  },
  beliefs_done:{
    fear:['Sei sanft mit dir – das hier ist keine Prüfung.','Denk an eine Situation, in der du dich klein gefühlt hast.','Schreib nur den einen Satz auf, den dein Kritiker dabei sagt.'],
    unclarity:['Denk an einen Moment, in dem du gezögert hast, obwohl du wolltest.','Frag dich: Welcher Gedanke hat mich zurückgehalten?','Schreib ihn in einem Satz auf – das genügt.']
  },
  vision_process:{
    unclarity:['Erwarte noch keine fertige Vision – sie entsteht beim Schreiben.','Öffne den Prozess und lies nur die erste Frage.','Schreib den ersten Gedanken auf, der kommt – ungefiltert.'],
    fear:['Es gibt keine falsche Antwort, und niemand liest mit.','Öffne den Prozess und lies nur die erste Frage.','Ein ehrlicher Halbsatz ist ein voller erster Schritt.']
  }
};
function journeyStart(stepId){
  const box=document.getElementById('journey-ai-box');if(!box)return;
  // Zweiter Klick schließt die Anleitung wieder (reine Anzeige, kein Aufruf)
  if(box.style.display==='block'){box.style.display='none';box.innerHTML='';return;}
  const p=(D.vision&&D.vision.onboarding&&D.vision.onboarding.profile)||{};
  // Bei müder Tagesstimmung wie "lowenergy" behandeln, sonst die Test-Blockade
  const key=calmMode()?'lowenergy':p.blocker;
  const variant=STEP_START_BY_BLOCKER[stepId]&&STEP_START_BY_BLOCKER[stepId][key];
  const steps=variant||STEP_START[stepId]||['Öffne den Schritt und mach den kleinstmöglichen ersten Schritt – 2 Minuten genügen.'];
  // Rahmung nur bei Basis-Schritten – die Variante trägt die Anpassung schon in sich
  const reframe=variant?'':(BLOCKER_REFRAME[key]||'');
  const timeNote=p.timePerDay==='low'
    ?'<div style="font-size:.78rem;color:var(--mu);margin-top:9px">⏱️ Du hast wenig Zeit eingeplant – der erste Schritt allein reicht für heute völlig.</div>':'';
  box.style.display='block';
  box.innerHTML=`<div style="background:var(--bg);border:1.5px solid var(--bo);border-radius:var(--r2);padding:12px 14px">
    <div style="font-size:.8rem;font-weight:800;color:var(--p);margin-bottom:8px">👉 So fängst du an</div>
    <ol style="margin:0;padding-left:18px;font-size:.86rem;line-height:1.7">${steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
    ${reframe?`<div style="font-size:.82rem;line-height:1.5;background:#FFF7ED;border:1px solid #FED7AA;border-radius:var(--r3);padding:8px 11px;margin-top:10px;color:#92400E">${reframe}</div>`:''}
    ${timeNote}
  </div>`;
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

