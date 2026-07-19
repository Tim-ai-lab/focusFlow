// FocusFlow · 17-ui.js — Tabs, Navigation, Toast, Heute-Leiste, Render-Verteiler
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── UI ──  Tabs, Toast, Modals, Render-Helfer, Stats
// ═══════════════════════════════════════════════════════════════
function renderStats(){
  document.getElementById('st0').textContent=D.todayDone;
  document.getElementById('st1').textContent=D.streak+'🔥';
  document.getElementById('st2').textContent=D.todayScore;
  document.getElementById('st3').textContent=D.pomoSess;
  // Strecken-Status live mitziehen (Aufgaben, MIT, Pomodoro …)
  try{renderJourney();}catch(e){}
  try{updateTopProgress();}catch(e){}
}

function goHome(){const b=document.getElementById('tbtn-journey');if(b)showTab('journey',b);}
// Nach einem abgeschlossenen Schritt sanft zurück zu "Mein Weg" (nächster Schritt).
// Kurze Verzögerung, damit die Speicher-Bestätigung noch wahrgenommen wird.
function routeAfterSave(){setTimeout(()=>{try{goHome();}catch(e){}},650);}

// ── HEUTE-LEISTE ──  Kompakte Tageszeile statt Banner + Statistik.
// Der Screen hat damit genau EIN großes Element: "Dein Fokus jetzt".
// Details (Stimmung, Routine-Buttons, Zahlen) öffnen sich auf Wunsch.
// Vor abgeschlossenem Einstiegstest bleibt alles verborgen – der Test
// ist die einzige erste Handlung.
let todayOpen=false;
function onboardingDone(){return !!(D&&D.vision&&D.vision.onboarding&&D.vision.onboarding.done);}
function toggleToday(){todayOpen=!todayOpen;updateHomeChrome();}
function todayStripState(){
  const today=new Date().toISOString().split('T')[0];
  const h=new Date().getHours();
  const dl=(D.dailyLog&&D.dailyLog[today])||{};
  if(!dl.morning&&h<15)return{label:'🌅 Tag starten',run:'flow'};
  if(!dl.evening&&h>=17)return{label:'🌙 Tag abschließen',run:'evening'};
  if(!dl.morning)return{label:'🌅 Morgenroutine',run:'morning'};
  return null;
}
function todayStripAction(){
  const s=todayStripState();if(!s)return;
  if(s.run==='evening'){openEveningRoutine();return;}
  if(s.run==='flow'){try{openDailyFlow();return;}catch(e){}}
  openMorningRoutine();
}
function updateTodayStrip(){
  const g=document.getElementById('ts-greet'),st=document.getElementById('ts-status'),ab=document.getElementById('ts-action');
  if(!g||!st||!ab)return;
  const h=new Date().getHours();
  g.textContent=h<12?'☀️ Guten Morgen!':h<18?'🌤️ Guten Tag!':'🌙 Guten Abend!';
  const today=new Date().toISOString().split('T')[0];
  const dl=(D.dailyLog&&D.dailyLog[today])||{};
  const bits=[];
  if(dl.mood)bits.push(dl.mood.split(' ')[0]);
  if(dl.morning)bits.push('✓ Routine');
  if(dl.evening)bits.push('✓ Reflexion');
  bits.push((D.todayDone||0)+' erledigt');
  if(D.streak)bits.push(D.streak+'🔥');
  st.textContent=bits.join(' · ');
  const s=todayStripState();
  ab.style.display=s?'':'none';
  if(s)ab.textContent=s.label;
}
function updateHomeChrome(){
  const strip=document.getElementById('today-strip'),det=document.getElementById('today-detail');
  if(!strip||!det)return;
  const ob=onboardingDone();
  strip.style.display=ob?'block':'none';
  det.style.display=(ob&&todayOpen)?'block':'none';
  const tg=document.getElementById('ts-toggle');
  if(tg)tg.textContent=todayOpen?'⌃ Weniger':'⌄ Mehr';
  if(ob)updateTodayStrip();
  try{updateMoodButtons();}catch(e){}
  // Einmaliger Hinweis auf die Modul-Navigation (Entdeckbarkeit hinter ☰)
  if(ob&&D.vision&&!D.vision.navHintSeen){
    D.vision.navHintSeen=true;try{saveProfile();}catch(e){}
    setTimeout(()=>{try{toast('💡 Tipp: Alle Bereiche findest du oben unter „☰ Module".');}catch(e){}},2500);
  }
}
function toggleNav(){
  const n=document.getElementById('tnav');if(!n)return;
  const opening=(n.style.display==='none'||!n.style.display);
  if(opening)updateNavVisibility();
  n.style.display=opening?'flex':'none';
  // Wer die Navigation selbst entdeckt hat, braucht den Ersthinweis nicht mehr
  if(opening&&D&&D.vision&&!D.vision.navHintSeen){D.vision.navHintSeen=true;try{saveProfile();}catch(e){}}
}
// Aufgaben-Formular: Zusatzfelder (Priorität, Termin …) nur auf Wunsch
let taskDetailsOpen=false;
function toggleTaskDetails(){
  taskDetailsOpen=!taskDetailsOpen;
  const d=document.getElementById('task-details');if(d)d.style.display=taskDetailsOpen?'block':'none';
  const b=document.getElementById('task-details-btn');if(b)b.textContent=taskDetailsOpen?'⌃ Weniger':'⌄ Details';
}
// Kuratierte Navigation: es erscheinen nur Kern-Tabs + Module der noch offenen
// Weg-Schritte. Keine Feature-Bibliothek – der Rest bleibt hinter "alle Module".
let navShowAll=false;
function toggleNavAll(){navShowAll=!navShowAll;updateNavVisibility();}
function updateNavVisibility(){
  const nav=document.getElementById('tnav');if(!nav)return;
  const rel=new Set(['journey','goals','me','tasks']);
  const ob=D&&D.vision&&D.vision.onboarding;
  if(ob&&ob.done){
    const cat=journeyCatalog();
    (ob.journey||[]).forEach(id=>{const s=cat[id];if(s&&s.tab&&!stepStatus(id).done)rel.add(s.tab);});
  }
  nav.querySelectorAll('.tbtn').forEach(b=>{
    if(b.id==='tbtn-more'){b.textContent=navShowAll?'‹ nur mein Weg':'⋯ alle Module';return;}
    const m=(b.getAttribute('onclick')||'').match(/showTab\('([^']+)'/);
    const tab=m?m[1]:'';
    b.style.display=(navShowAll||rel.has(tab))?'':'none';
  });
}
function updateTopProgress(){
  const wrap=document.getElementById('top-progress-wrap');if(!wrap)return;
  const ob=D.vision&&D.vision.onboarding;
  if(!ob||!ob.done){wrap.style.display='none';return;}
  const cat=journeyCatalog();const journey=(ob.journey||[]).filter(id=>cat[id]);
  const total=journey.length;const done=journey.filter(id=>stepStatus(id).done).length;
  const pct=total?Math.round(done/total*100):0;
  wrap.style.display='block';
  document.getElementById('top-progress-pct').textContent=done+'/'+total+' · '+pct+'%';
  document.getElementById('top-progress-bar').style.width=pct+'%';
}
function showTab(name,btn){
  document.querySelectorAll('.tpanel').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.tbtn').forEach(b=>b.classList.remove('on'));
  document.getElementById('tab-'+name).classList.add('on');btn.classList.add('on');
  if(name==='journey')renderJourney();
  if(name==='me')renderMyBereich();
  if(name==='goals')renderGoals();
  if(name==='path')renderPath();
  if(name==='mit')renderMIT();
  if(name==='vision')renderVision();
  if(name==='cal'){if(calView==='month')renderCal();else renderDayView();}
  if(name==='gantt')renderGantt();
  if(name==='wellbeing')renderWellbeing();
  if(name==='review')renderReviews();
  if(name==='diary'){journalDate=new Date().toISOString().split('T')[0];renderJournal();}
  if(name==='analytics')renderAnalytics();
}

let tTO;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('on');clearTimeout(tTO);tTO=setTimeout(()=>t.classList.remove('on'),3300);}
function showRw(done){const r=RWS[Math.min(Math.floor(done/5)-1,RWS.length-1)];document.getElementById('rwe').textContent=r.e;document.getElementById('rwt').textContent=r.t;document.getElementById('rwm').textContent=r.m;document.getElementById('rwmodal').style.display='flex';}
function closeRw(){document.getElementById('rwmodal').style.display='none';}

function renderAll(){
  try{renderTasks();}catch(e){console.error('renderTasks',e);}
  try{renderMIT();}catch(e){console.error('renderMIT',e);}
  try{renderStats();}catch(e){console.error('renderStats',e);}
  try{renderVision();}catch(e){console.error('renderVision',e);}
  try{renderWellbeing();}catch(e){console.error('renderWellbeing',e);}
  try{renderReviews();}catch(e){console.error('renderReviews',e);}
  try{updPomo();}catch(e){console.error('updPomo',e);}
  try{updateDepSelect();}catch(e){console.error('updateDepSelect',e);}
  try{showMorningSummary();}catch(e){console.error('showMorningSummary',e);}
  try{checkEveningPrompt();}catch(e){console.error('checkEveningPrompt',e);}
  try{renderPath();}catch(e){console.error('renderPath',e);}
  try{renderJourney();}catch(e){console.error('renderJourney',e);}
  try{renderMyBereich();}catch(e){console.error('renderMyBereich',e);}
  try{renderGoals();}catch(e){console.error('renderGoals',e);}
}

function checkEveningPrompt(){
  const h=new Date().getHours();
  const today=new Date().toISOString().split('T')[0];
  const hasEvening=D.dailyLog?.[today]?.evening;
  const hasMorning=D.dailyLog?.[today]?.morning;
  const hasWb=D.wellbeing?.some(w=>w.date===today);
  // Flow btn status
  const flowBtn=document.getElementById('flow-btn');
  const completedToday=([hasMorning,hasWb,hasEvening||h<17].filter(Boolean).length);
  if(completedToday===0)flowBtn.textContent='⚡ Tages-Flow starten';
  else if(completedToday===3||( completedToday===2&&h<17))flowBtn.textContent='⚡ Tages-Flow ✓';
  else flowBtn.textContent=`⚡ Tages-Flow (${completedToday}/3)`;
  if(h>=19&&!hasEvening){
    document.getElementById('evening-btn').style.background='rgba(255,200,100,.4)';
    document.getElementById('evening-btn').style.border='1.5px solid rgba(255,220,150,.6)';
    document.getElementById('evening-btn').textContent='🌙 Abendreflexion (jetzt!)';
  } else if(hasEvening){
    document.getElementById('evening-btn').textContent='🌙 Reflexion ✓';
    document.getElementById('evening-btn').style.background='rgba(176,142,232,.4)';
  }
}

