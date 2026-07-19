// FocusFlow · 05-path.js — Entwicklungspfad, Schritt-Log (Erledigt-Modell), Reflexionen, Komfortzone
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── PATH ──  Persönlicher Entwicklungspfad (5 Stufen)
// ═══════════════════════════════════════════════════════════════
const PATH_STAGES=[
  {
    id:'self',icon:'🔍',name:'Stufe 1 – Selbsterkenntnis',
    desc:'Wer bin ich? Was will ich wirklich?',
    color:'#7C9EE8',badge:'Fundament',
    why:'Ohne Selbstkenntnis keine echte Vision. Diese Stufe legt das psychologische Fundament für alles andere.',
    steps:[
      {id:'vision_process',title:'Vision-Prozess durchführen',why:'Der 6-Schritte-Prozess führt dich von der Sterbebett-Frage zur fertigen Affirmation – psychologisch fundiert und KI-begleitet.',time:'60-90 Min',tab:'vision',action:'startVisionProcess()'},
      {id:'life_areas',title:'Lebensbereiche definieren',why:'Ohne klare Lebensbereiche fehlt die Struktur für Ziele. Du brauchst Klarheit in welchen Feldern du wachsen willst.',time:'20-30 Min',tab:'vision',action:'showTab("vision",document.querySelectorAll(".tbtn")[3])'},
      {id:'beliefs_done',title:'Glaubenssätze pro Lebensbereich notiert',why:'Limitierende Glaubenssätze sind die unsichtbare Bremse. Wer sie kennt, kann sie transformieren.',time:'15 Min',tab:'vision',action:'showTab("vision",document.querySelectorAll(".tbtn")[3])'},
      {id:'comfort_map',title:'Komfortzone kartieren',why:'Wachstum passiert am Rand der Komfortzone. Wer seine Grenzen kennt, kann sie bewusst und sicher erweitern – statt zufällig an ihnen zu scheitern.',time:'10 Min',tab:'journey',action:"openReflection('comfort_map')"},
    ]
  },
  {
    id:'align',icon:'🎯',name:'Stufe 2 – Ausrichtung',
    desc:'Wie bringe ich meinen Alltag in Einklang mit meiner Vision?',
    color:'#F4A96A',badge:'Struktur',
    why:'Vision ohne Ausrichtung bleibt ein Traum. Diese Stufe macht die Vision alltagstauglich.',
    steps:[
      {id:'first_tasks',title:'Erste Aufgaben mit Lebensbereich anlegen',why:'Wenn jede Aufgabe einem Lebensbereich zugeordnet ist, bekommt Arbeit automatisch mehr Sinn – das stärkste Anti-Prokrastinations-Werkzeug.',time:'10 Min',tab:'tasks',action:'showTab("tasks",document.querySelectorAll(".tbtn")[0])'},
      {id:'mit_used',title:'MIT-Methode 3 Tage angewendet',why:'Die 3 wichtigsten Aufgaben pro Tag auswählen verhindert Überforderung und schafft tägliche Erfolgserlebnisse.',time:'2 Min/Tag',tab:'mit',action:'showTab("mit",document.querySelectorAll(".tbtn")[1])'},
      {id:'cal_used',title:'Kalender mit Zeitblöcken genutzt',why:'Aufgaben ohne Zeitplan werden 3x häufiger aufgeschoben. Zeit einplanen = Commitment.',time:'5 Min',tab:'cal',action:'showTab("cal",document.querySelectorAll(".tbtn")[4])'},
    ]
  },
  {
    id:'energy',icon:'⚡',name:'Stufe 3 – Energie & Rhythmus',
    desc:'Wie erzeuge ich täglich Energie und Fokus?',
    color:'#6DC98A',badge:'Energie',
    why:'Energie ist keine Ressource die man hat – sie wird täglich erzeugt durch Rituale und Rhythmus.',
    steps:[
      {id:'morning_done',title:'Erste Morgenroutine abgeschlossen',why:'Die Morgenroutine ist der stärkste Energiegenerator des Tages. Sie aktiviert Intention, Dankbarkeit und Fokus in 7 Minuten.',time:'7 Min',tab:'pomo',action:'openMorningRoutine()'},
      {id:'pomodoro_used',title:'Pomodoro-Technik 3x genutzt',why:'25-Minuten-Sprints überwinden den Startwiderstand. Das Gehirn prokrastiniert bei großen Aufgaben, nicht bei kleinen Zeitblöcken.',time:'25 Min/Block',tab:'pomo',action:'showTab("pomo",document.querySelectorAll(".tbtn")[3])'},
      {id:'evening_done',title:'Erste Abendreflexion abgeschlossen',why:'Der Abschluss-Loop ist entscheidend. Was nicht reflektiert wird, wiederholt sich. Abendreflexion schafft Lernschleifen.',time:'8 Min',tab:'diary',action:'openEveningRoutine()'},
      {id:'wellbeing_tracked',title:'Wohlbefinden 3 Tage getrackt',why:'Energie hat körperliche Ursachen. Wer Schlaf, Stress und Bewegung trackt, erkennt seine persönlichen Energie-Muster.',time:'2 Min/Tag',tab:'wellbeing',action:'showTab("wellbeing",document.querySelectorAll(".tbtn")[6])'},
    ]
  },
  {
    id:'reflect',icon:'🔄',name:'Stufe 4 – Reflexion & Muster',
    desc:'Wie lerne ich aus meinen Erfahrungen?',
    color:'#B08EE8',badge:'Wachstum',
    why:'Wachstum entsteht nicht durch Erfahrung – sondern durch reflektierte Erfahrung.',
    steps:[
      {id:'profile_depth',title:'Profil vertiefen',why:'Dein Einstiegstest war bewusst kurz. Ein paar Zusatzfragen zu Schlaf, Stress, Struktur und innerem Kritiker machen deinen Weg ab hier präziser.',time:'3 Min',tab:'journey',action:'startProfileDepth()'},
      {id:'first_review',title:'Ersten Wochenrückblick durchgeführt',why:'Der Wochenrückblick ist das mächtigste Werkzeug gegen Prokrastination. Er macht Muster sichtbar bevor sie sich verfestigen.',time:'20 Min',tab:'review',action:'showTab("review",document.querySelectorAll(".tbtn")[7])'},
      {id:'journal_7days',title:'Journal 7 Tage geführt',why:'Das Journal verbindet alle Bereiche zu einem ganzheitlichen Tagesprotokoll. Nach 7 Tagen werden erste Muster sichtbar.',time:'Auto-befüllt',tab:'diary',action:'showTab("diary",document.querySelectorAll(".tbtn")[8])'},
      {id:'analytics_checked',title:'Analytics-Insights angeschaut',why:'Daten über dich selbst sind Gold. Wann bist du produktiv? Was korreliert mit deiner Energie? Diese Einblicke verändern Verhalten.',time:'5 Min',tab:'analytics',action:'showTab("analytics",document.querySelectorAll(".tbtn")[10])'},
    ]
  },
  {
    id:'master',icon:'🌱',name:'Stufe 5 – Integration & Meisterschaft',
    desc:'Alle Systeme greifen ineinander – der Weg wird persönlicher.',
    color:'#E87C9B',badge:'Meisterschaft',
    why:'Ab hier wird die App zu deinem persönlichsten Werkzeug. KI-Coach, Quartals-Review und tiefe Muster-Arbeit.',
    steps:[
      {id:'comfort_challenge',title:'Komfortzone 3× bewusst verlassen',why:'Selbstvertrauen entsteht durch Beweise, nicht durch Nachdenken. Jede gemeisterte Challenge erweitert deine Komfortzone dauerhaft.',time:'5-30 Min',tab:'journey',action:'openComfortChallenge()'},
      {id:'ai_coach_used',title:'FocusAI für tiefe Reflexion genutzt',why:'Der KI-Coach kennt deine Vision, Glaubenssätze und Muster. Tiefe Gespräche bringen Erkenntnisse die alleine schwer erreichbar sind.',time:'10-20 Min',tab:'ai',action:'showTab("ai",document.querySelectorAll(".tbtn")[9])'},
      {id:'quarterly_review',title:'Ersten Quartals-Review durchgeführt',why:'Alle 90 Tage: Stimmt meine Vision noch? Was hat sich verändert? Dieser Review verhindert dass man fleißig in die falsche Richtung läuft.',time:'30 Min',tab:'journey',action:"openReflection('quarterly_review')"},
      {id:'beliefs_revisited',title:'Glaubenssätze nach 30 Tagen überprüft',why:'Glaubenssätze verändern sich durch Erfahrung. Nach 30 Tagen zeigen sich neue Schichten – und neue Möglichkeiten zur Transformation.',time:'20 Min',tab:'journey',action:"openReflection('beliefs_revisited')"},
    ]
  }
];

// ── Strecken-Fortschritt: explizit & geloggt ──
// Ein Schritt wird erst durch aktives Abschließen erledigt; jeder Abschluss landet
// mit Datum im Log (D.vision.pathLog). Tägliche Routinen gelten nur für heute,
// Zähl-Schritte (z. B. "3 Tage") summieren ihre Log-Tage.
const STEP_CFG={
  vision_process:{mode:'once'},life_areas:{mode:'once'},beliefs_done:{mode:'once'},
  first_tasks:{mode:'once'},cal_used:{mode:'once'},first_review:{mode:'once'},
  analytics_checked:{mode:'once'},ai_coach_used:{mode:'once'},quarterly_review:{mode:'once'},
  beliefs_revisited:{mode:'once'},comfort_map:{mode:'once'},profile_depth:{mode:'once'},
  comfort_challenge:{mode:'count',target:3,unit:'Challenges'},
  morning_done:{mode:'daily'},evening_done:{mode:'daily'},
  mit_used:{mode:'count',target:3,unit:'Tage'},
  wellbeing_tracked:{mode:'count',target:3,unit:'Tage'},
  journal_7days:{mode:'count',target:7,unit:'Tage'},
  pomodoro_used:{mode:'count',target:3,unit:'Sitzungen'}
};
function pathLogArr(id){return (D.vision&&D.vision.pathLog&&D.vision.pathLog[id])||[];}
function stepStatus(id){
  const cfg=STEP_CFG[id]||{mode:'once'};
  const arr=pathLogArr(id);
  const today=new Date().toISOString().slice(0,10);
  const days=new Set(arr.map(ts=>String(ts).slice(0,10)));
  if(cfg.mode==='daily'){
    const doneToday=arr.some(ts=>String(ts).slice(0,10)===today);
    return {mode:'daily',done:doneToday,doneToday,total:days.size};
  }
  if(cfg.mode==='count'){
    const count=cfg.unit==='Sitzungen'?arr.length:days.size;
    return {mode:'count',done:count>=cfg.target,count,target:cfg.target,unit:cfg.unit};
  }
  return {mode:'once',done:arr.length>0};
}
// Etappen (P5): Schritte gehören zu Kapiteln mit klarem Abschluss-Erlebnis.
const STAGE_META={self:{icon:'🔍',name:'Selbsterkenntnis'},align:{icon:'🎯',name:'Ausrichtung'},energy:{icon:'⚡',name:'Energie & Rhythmus'},reflect:{icon:'🔄',name:'Reflexion & Muster'},master:{icon:'🌱',name:'Integration'}};
function stepStageId(stepId){for(const st of PATH_STAGES){if(st.steps.some(s=>s.id===stepId))return st.id;}return null;}
// "Jemals gemeistert" – tägliche Schritte zählen fürs Kapitel ab dem 1. Abschluss
function stepEverDone(id){
  const cfg=STEP_CFG[id]||{mode:'once'};
  const arr=pathLogArr(id);
  if(cfg.mode==='count'){
    const days=new Set(arr.map(ts=>String(ts).slice(0,10)));
    return (cfg.unit==='Sitzungen'?arr.length:days.size)>=cfg.target;
  }
  return arr.length>0;
}
function chapterList(journey){
  return PATH_STAGES.map(st=>{
    const ids=(journey||[]).filter(id=>stepStageId(id)===st.id);
    return {id:st.id,icon:STAGE_META[st.id].icon,name:STAGE_META[st.id].name,total:ids.length,done:ids.filter(stepEverDone).length};
  }).filter(c=>c.total>0);
}
function chapterDoneMap(){
  const ob=D.vision&&D.vision.onboarding;
  const j=(ob&&ob.journey)||Object.keys(STEP_CFG);
  const m={};chapterList(j).forEach(c=>{m[c.id]=c.done>=c.total;});return m;
}
function logStep(id){
  if(!UID)return false;
  const cfg=STEP_CFG[id]||{mode:'once'};
  if(!D.vision)D.vision={};
  if(!D.vision.pathLog)D.vision.pathLog={};
  const arr=D.vision.pathLog[id]||(D.vision.pathLog[id]=[]);
  const today=new Date().toISOString().slice(0,10);
  if(cfg.mode==='once'&&arr.length)return false;
  if((cfg.mode==='daily'||(cfg.mode==='count'&&cfg.unit!=='Sitzungen'))&&arr.some(ts=>String(ts).slice(0,10)===today))return false;
  const before=chapterDoneMap();
  arr.push(new Date().toISOString());
  saveProfile();
  // Kapitel-Abschluss feiern (Erfolgserlebnis pro Etappe)
  try{
    const after=chapterDoneMap();
    const newly=Object.keys(after).find(k=>after[k]&&!before[k]);
    if(newly){
      const meta=STAGE_META[newly];
      document.getElementById('rwe').textContent='🏆';
      document.getElementById('rwt').textContent='Kapitel abgeschlossen!';
      document.getElementById('rwm').textContent='„'+meta.name+'" ist geschafft – ein echter Meilenstein auf deinem Weg.';
      document.getElementById('rwmodal').style.display='flex';
    }
  }catch(e){}
  return true;
}
// Aktiver Abschluss eines Schritts (Button oder echtes Sequenz-Ende)
function completeStep(id){
  const added=logStep(id);
  try{renderJourney();}catch(e){}
  try{renderPath();}catch(e){}
  toast(added?'✅ Abgeschlossen – im Log gespeichert!':'Schon erledigt ✓');
}
// Letzten (bzw. heutigen) Log-Eintrag wieder entfernen
function undoStep(id){
  const arr=D.vision&&D.vision.pathLog&&D.vision.pathLog[id];
  if(!arr||!arr.length)return;
  const cfg=STEP_CFG[id]||{mode:'once'};
  const today=new Date().toISOString().slice(0,10);
  if(cfg.mode==='daily'||(cfg.mode==='count'&&cfg.unit!=='Sitzungen')){
    for(let i=arr.length-1;i>=0;i--){if(String(arr[i]).slice(0,10)===today){arr.splice(i,1);break;}}
  }else{arr.pop();}
  saveProfile();
  try{renderJourney();}catch(e){}
  try{renderPath();}catch(e){}
  try{renderMyBereich();}catch(e){}
  toast('↩ Rückgängig gemacht');
}
// Kompatibilität: Pfad-Tab ruft weiterhin markPathStep auf
function markPathStep(stepId){completeStep(stepId);}
function computePathStats(){
  if(!UID||!D)return{};
  const c={};
  Object.keys(STEP_CFG).forEach(id=>{if(stepStatus(id).done)c[id]=true;});
  return c;
}

// ── Geführte Reflexionen (eigene "Fertig"-Sequenzen) ──
const REFLECTIONS={
  quarterly_review:{stepId:'quarterly_review',title:'🔄 Quartals-Review',accent:'#6DC98A',steps:[
    {key:'vision_still',q:'Stimmt deine Vision noch?',ph:'Fühlt sich deine 1/3/5-Jahres-Vision noch richtig an? Was hat sich verändert?'},
    {key:'progress',q:'Was hast du in den letzten ~90 Tagen erreicht?',ph:'Konkrete Fortschritte, Erfolge, Erkenntnisse...'},
    {key:'obstacles',q:'Was hat dich am meisten aufgehalten?',ph:'Wiederkehrende Muster, Hindernisse, Blockaden...'},
    {key:'adjust',q:'Was passt du fürs nächste Quartal an?',ph:'Was lässt du weg? Was nimmst du dir neu vor?'},
    {key:'focus90',q:'Dein wichtigstes Ziel für die nächsten 90 Tage?',ph:'Das eine Ergebnis, das den größten Unterschied macht...'}
  ]},
  beliefs_revisited:{stepId:'beliefs_revisited',title:'🧠 Glaubenssätze überprüfen',accent:'#B08EE8',steps:[
    {key:'old',q:'Welche limitierenden Glaubenssätze hattest du?',ph:'Die Sätze, die dich vor einiger Zeit gebremst haben...'},
    {key:'changed',q:'Was hat sich daran verändert?',ph:'Welcher Satz hat an Kraft verloren? Was glaubst du heute?'},
    {key:'new',q:'Welche neuen Glaubenssätze zeigen sich?',ph:'Manchmal tauchen tiefere Schichten auf...'},
    {key:'empower',q:'Dein ermächtigender Gegen-Satz',ph:'Formuliere einen kraftvollen, wahren Satz in Gegenwartsform...'}
  ]},
  comfort_map:{stepId:'comfort_map',title:'🧗 Komfortzone kartieren',accent:'#F4A96A',steps:[
    {key:'inside',q:'Was gehört zu deiner Komfortzone?',ph:'Situationen, in denen du dich sicher fühlst: vertraute Routinen, bekannte Aufgaben, dein gewohntes Umfeld...'},
    {key:'avoid',q:'Was vermeidest du, obwohl es dich weiterbringen würde?',ph:'Z. B. präsentieren, Nein sagen, auf Fremde zugehen, um Hilfe bitten, Neues ausprobieren...'},
    {key:'cost',q:'Was kostet dich dieses Vermeiden?',ph:'Verpasste Chancen, Abhängigkeit von anderen, ein leises Gefühl von Stillstand...'},
    {key:'gain',q:'Was würde möglich, wenn du diese Grenze erweiterst?',ph:'Beruflich, in Beziehungen, für dein Selbstvertrauen...'},
    {key:'first',q:'Dein erster kleiner Schritt über die Grenze?',ph:'So klein, dass du ihn diese Woche wirklich machst – Herausforderung ja, Überforderung nein.'}
  ]}
};
let reflectKey=null,reflectStep=0,reflectData={};
function openReflection(key){
  const def=REFLECTIONS[key];if(!def)return;
  reflectKey=key;reflectStep=0;reflectData={};
  document.getElementById('reflect-title').textContent=def.title;
  renderReflectStep();
  document.getElementById('reflectmod').style.display='flex';
}
function renderReflectStep(){
  const def=REFLECTIONS[reflectKey];const step=def.steps[reflectStep];const isLast=reflectStep===def.steps.length-1;
  document.getElementById('reflect-next-btn').textContent=isLast?'✓ Abschließen':'Weiter ›';
  document.getElementById('reflect-step-content').innerHTML=`
    <div style="font-size:.73rem;font-weight:700;color:var(--p);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Schritt ${reflectStep+1} von ${def.steps.length}</div>
    <div style="font-size:1rem;font-weight:800;margin-bottom:12px">${step.q}</div>
    <textarea class="ta" id="reflect-input" placeholder="${step.ph}">${esc(reflectData[step.key]||'')}</textarea>
    <div style="display:flex;gap:4px;margin-top:10px">${def.steps.map((_,i)=>`<div style="flex:1;height:4px;border-radius:2px;background:${i<=reflectStep?def.accent:'var(--bo)'}"></div>`).join('')}</div>`;
}
function nextReflect(){
  const def=REFLECTIONS[reflectKey];const step=def.steps[reflectStep];
  reflectData[step.key]=document.getElementById('reflect-input').value.trim();
  if(reflectStep<def.steps.length-1){reflectStep++;renderReflectStep();}
  else finishReflection();
}
function prevReflect(){
  if(reflectStep>0){const step=REFLECTIONS[reflectKey].steps[reflectStep];reflectData[step.key]=document.getElementById('reflect-input').value.trim();reflectStep--;renderReflectStep();}
}
async function finishReflection(){
  const def=REFLECTIONS[reflectKey];if(!def)return;
  // Abschließen nur mit mindestens einer beantworteten Frage
  const hasAny=Object.values(reflectData||{}).some(v=>v&&String(v).trim());
  if(!hasAny){toast('✍️ Beantworte mindestens eine Frage, um abzuschließen.');return;}
  if(!D.vision)D.vision={};
  if(!D.vision.reflections)D.vision.reflections={};
  if(!D.vision.reflections[def.stepId])D.vision.reflections[def.stepId]=[];
  D.vision.reflections[def.stepId].push({date:new Date().toISOString(),data:{...reflectData}});
  await saveProfile();
  logStep(def.stepId);
  document.getElementById('reflectmod').style.display='none';
  try{renderJourney();}catch(e){}
  toast('✅ '+def.title+' abgeschlossen!');
}

// ═══════════════════════════════════════════════════════════════
// ── KOMFORTZONE ──  Passende Challenges vorschlagen, annehmen,
//    abschließen. Nur der "Geschafft"-Button zählt den Schritt.
// ═══════════════════════════════════════════════════════════════
const COMFORT_CHALLENGES={
  visibility:{
    sanft:['Stelle heute in einer Runde eine Frage, statt still zu bleiben.','Teile eine Meinung, bevor du gefragt wirst.','Sag jemandem vor anderen ein ehrliches Kompliment.','Erzähle heute jemandem von einem Ziel, das dir wichtig ist.'],
    mutig:['Melde dich für einen kurzen Wortbeitrag oder eine Mini-Präsentation.','Teile einen eigenen Gedanken öffentlich (z. B. Beitrag posten).','Übernimm heute sichtbar die Führung bei einer Sache.']},
  social:{
    sanft:['Sprich eine Person kurz an, die du sonst nur grüßt.','Frage eine fremde Person nach einer Empfehlung.','Melde dich bei jemandem, mit dem du lange keinen Kontakt hattest.'],
    mutig:['Führe heute ein echtes Gespräch mit einer fremden Person.','Lade jemanden konkret auf einen Kaffee ein.','Geh allein an einen Ort, an dem man ins Gespräch kommt.']},
  conflict:{
    sanft:['Sag heute einmal freundlich „Nein" – ohne lange Begründung.','Sprich eine kleine Unstimmigkeit ruhig an, statt sie zu schlucken.','Äußere einen Wunsch klar und direkt.'],
    mutig:['Führe das aufgeschobene schwierige Gespräch – heute.','Verhandle etwas nach (Preis, Deadline, Aufgabenverteilung).','Setze eine Grenze, die du lange aufgeschoben hast.']},
  newthings:{
    sanft:['Nimm heute bewusst einen neuen Weg oder probiere etwas Ungewohntes.','Iss oder koche etwas, das du noch nie probiert hast.','Lerne 15 Minuten etwas völlig Neues.'],
    mutig:['Melde dich für etwas an, das dich nervös macht.','Mache heute etwas zum ersten Mal – allein.','Starte mit einem ersten Schritt das Projekt, für das du dich „noch nicht bereit" fühlst.']},
  help:{
    sanft:['Bitte heute jemanden um einen kleinen Gefallen.','Stelle eine Frage, obwohl du denkst, du müsstest es wissen.','Sag jemandem ehrlich, dass dir etwas schwerfällt.'],
    mutig:['Bitte um Unterstützung bei etwas, das dir wirklich wichtig ist.','Teile mit einer Vertrauensperson eine echte Unsicherheit.','Bitte um ehrliches Feedback zu etwas, das dir am Herzen liegt.']}
};
function comfortProfile(){return (D.vision&&D.vision.onboarding&&D.vision.onboarding.profile)||{};}
function comfortData(){if(!D.vision)D.vision={};if(!D.vision.comfort)D.vision.comfort={current:null,log:[]};return D.vision.comfort;}
function comfortSuggestions(){
  const p=comfortProfile();
  const zone=p.comfortZone&&p.comfortZone!=='none'?p.comfortZone:null;
  const tier=p.comfortAppetite==='mutig'?'mutig':'sanft';
  let pool=[];
  if(zone&&COMFORT_CHALLENGES[zone]){pool=COMFORT_CHALLENGES[zone][tier].map(t=>({text:t,zone}));}
  else{Object.keys(COMFORT_CHALLENGES).forEach(z=>{COMFORT_CHALLENGES[z][tier].forEach(t=>pool.push({text:t,zone:z}));});}
  // Täglich rotierende Auswahl von 3 – deterministisch, ohne Zufalls-Flackern
  const doy=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5);
  const out=[];for(let i=0;i<Math.min(3,pool.length);i++)out.push(pool[(doy+i*2)%pool.length]);
  return out;
}
function openComfortChallenge(){renderComfortModal();document.getElementById('comfortmod').style.display='flex';}
function renderComfortModal(){
  const el=document.getElementById('comfort-content');if(!el)return;
  const c=comfortData();
  const today=new Date().toISOString().split('T')[0];
  const st=stepStatus('comfort_challenge');
  const prog=`<div style="font-size:.76rem;font-weight:700;color:var(--mu);margin-bottom:10px">${st.count}/${st.target} Challenges gemeistert${st.done?' · ✓ Schritt erledigt':''}</div>`;
  if(c.current&&c.current.date===today){
    el.innerHTML=prog+`
      <div style="background:#FFF7ED;border:1.5px solid #FED7AA;border-radius:var(--r2);padding:14px 16px;margin-bottom:12px">
        <div style="font-size:.74rem;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">🧗 Deine heutige Challenge</div>
        <div style="font-size:.95rem;font-weight:800;line-height:1.5">${esc(c.current.text)}</div>
      </div>
      <div style="font-size:.8rem;color:var(--mu);margin-bottom:8px">Wie hat es sich angefühlt? (optional)</div>
      <textarea class="ta" id="comfort-felt" placeholder="Kurz notieren – das macht den Wachstums-Beweis später sichtbar..." style="min-height:60px"></textarea>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="addbtn" style="flex:2" onclick="completeComfortChallenge()">✓ Geschafft!</button>
        <button class="modal-close" style="flex:1;margin-top:0" onclick="resetComfortChallenge()">🔁 Andere wählen</button>
      </div>`;
    return;
  }
  const sugg=comfortSuggestions();
  el.innerHTML=prog+`
    <div style="font-size:.85rem;color:var(--mu);line-height:1.55;margin-bottom:12px">Wähle EINE Mutprobe für heute – passend zu deinem Profil${comfortProfile().comfortZone&&comfortProfile().comfortZone!=='none'?' („'+(COMFORT_LABEL[comfortProfile().comfortZone]||'')+'")':''}. Herausfordernd, aber sicher und freiwillig – niemals ein Risiko für dich oder andere.</div>
    <div style="display:flex;flex-direction:column;gap:8px">${sugg.map((s,i)=>`<button class="ob-opt" onclick="chooseComfortChallenge(${i})">${esc(s.text)}</button>`).join('')}</div>
    <div style="font-size:.78rem;font-weight:700;color:var(--mu);margin:12px 0 6px">Oder deine eigene Challenge:</div>
    <div style="display:flex;gap:8px">
      <input class="ti" id="comfort-custom" placeholder="Meine eigene Mutprobe für heute..." maxlength="200">
      <button class="addbtn" onclick="acceptCustomComfort()">Annehmen</button>
    </div>`;
  window._comfortSugg=sugg;
}
function chooseComfortChallenge(i){
  const s=(window._comfortSugg||[])[i];if(!s)return;
  acceptComfortChallenge(s.text,s.zone);
}
function acceptCustomComfort(){
  const v=(document.getElementById('comfort-custom')||{}).value||'';
  if(!v.trim()){toast('✍️ Beschreibe kurz deine Challenge.');return;}
  acceptComfortChallenge(v.trim().slice(0,200),comfortProfile().comfortZone||'none');
}
function acceptComfortChallenge(text,zone){
  const c=comfortData();
  c.current={date:new Date().toISOString().split('T')[0],text,zone};
  saveProfile();
  toast('🧗 Challenge angenommen – du schaffst das!');
  renderComfortModal();
  try{renderJourney();}catch(e){}
}
function resetComfortChallenge(){const c=comfortData();c.current=null;saveProfile();renderComfortModal();try{renderJourney();}catch(e){}}
function completeComfortChallenge(){
  const c=comfortData();if(!c.current)return;
  const felt=((document.getElementById('comfort-felt')||{}).value||'').trim().slice(0,300);
  c.log.unshift({date:new Date().toISOString(),text:c.current.text,zone:c.current.zone,felt});
  c.log=c.log.slice(0,50);
  c.current=null;
  logStep('comfort_challenge');
  saveProfile();
  document.getElementById('comfortmod').style.display='none';
  const st=stepStatus('comfort_challenge');
  toast(st.done?'🏆 3 Challenges gemeistert – deine Komfortzone ist gewachsen!':'💪 Geschafft! Deine Komfortzone ist heute ein Stück größer geworden.');
  try{renderJourney();}catch(e){}
}
function renderPath(){
  if(!UID||!D)return;
  const completed=computePathStats();
  const totalSteps=PATH_STAGES.reduce((s,st)=>s+st.steps.length,0);
  const doneSteps=PATH_STAGES.reduce((s,st)=>s+st.steps.filter(sp=>completed[sp.id]).length,0);
  const pct=Math.round((doneSteps/totalSteps)*100);
  document.getElementById('path-pct').textContent=pct+'%';
  document.getElementById('path-bar').style.width=pct+'%';
  document.getElementById('path-overall-progress').textContent=doneSteps+' von '+totalSteps+' Schritten';

  // Find next recommended step
  let nextStep=null,nextStage=null;
  outer:for(const stage of PATH_STAGES){
    for(const step of stage.steps){
      if(!completed[step.id]){nextStep=step;nextStage=stage;break outer;}
    }
  }
  renderPathAI(nextStep,nextStage,pct);

  // Render stages
  const stagesEl=document.getElementById('path-stages');
  stagesEl.innerHTML='';
  PATH_STAGES.forEach((stage,si)=>{
    const stageDone=stage.steps.filter(s=>completed[s.id]).length;
    const stageTotal=stage.steps.length;
    const isComplete=stageDone===stageTotal;
    const isActive=nextStage?.id===stage.id;
    const div=document.createElement('div');
    div.className='path-stage'+(isComplete?' completed':isActive?' active':'');
    div.innerHTML=`<div class="path-stage-header" onclick="togglePathStage(this)">
      <div class="path-stage-icon">${stage.icon}</div>
      <div class="path-stage-info">
        <div class="path-stage-name">${stage.name}</div>
        <div class="path-stage-desc">${stage.desc}</div>
        <div style="height:4px;background:var(--bo);border-radius:2px;margin-top:7px;overflow:hidden;max-width:200px">
          <div style="height:100%;width:${Math.round((stageDone/stageTotal)*100)}%;background:${isComplete?'var(--ok)':'var(--p)'};border-radius:2px;transition:width .5s"></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px">
        <span class="path-stage-badge" style="background:${isComplete?'#DCFCE7':isActive?'#EEF2FF':'var(--bg)'};color:${isComplete?'#15803D':isActive?'var(--p)':'var(--mu)'};border:1.5px solid ${isComplete?'#BBF7D0':isActive?'#C7D2FE':'var(--bo)'}">${isComplete?'✓ Abgeschlossen':isActive?'● Aktiv':stage.badge}</span>
        <span class="path-stage-prog">${stageDone}/${stageTotal}</span>
      </div>
    </div>
    <div class="path-stage-steps">
      <div style="padding:12px 16px 8px;font-size:.8rem;color:var(--mu);line-height:1.5;border-bottom:1px solid var(--bo);font-style:italic">💡 ${stage.why}</div>
      ${stage.steps.map(step=>{
        const done=!!completed[step.id];
        return`<div class="path-step${done?' completed':''}">
          <div class="path-step-cb">${done?'✓':''}</div>
          <div class="path-step-info">
            <div class="path-step-title">${step.title}</div>
            <div class="path-step-why">${step.why}</div>
          </div>
          <span class="path-step-time">⏱ ${step.time}</span>
          ${!done?`<button class="path-step-action" onclick="${step.action};closePathAndGo('${step.tab}')">Starten →</button>`:`<span style="padding:6px 10px;border:2px solid var(--ok);border-radius:var(--r3);color:var(--ok);font-size:.75rem;font-weight:700;white-space:nowrap">✓ Erledigt</span>`}
        </div>`;
      }).join('')}
    </div>`;
    // Auto-open active stage
    if(isActive||isComplete)div.classList.add('open');
    stagesEl.appendChild(div);
  });
}
function togglePathStage(header){header.parentElement.classList.toggle('open');}
function closePathAndGo(tab){
  const btn=Array.from(document.querySelectorAll('.tbtn')).find(b=>b.getAttribute('onclick')&&b.getAttribute('onclick').includes("'"+tab+"'"));
  if(btn)btn.click();
}
async function renderPathAI(nextStep,nextStage,pct){
  if(!document.getElementById('path-ai-text'))return;
  const textEl=document.getElementById('path-ai-text');
  const actionEl=document.getElementById('path-ai-action');
  if(pct===100){
    textEl.textContent='🎉 Du hast alle Schritte abgeschlossen! Das ist eine außergewöhnliche Leistung. Dein nächster Schritt ist der Quartals-Review – überprüfe deine Vision und setze neue Impulse.';
    actionEl.innerHTML=`<button class="path-step-action" onclick="showTab('review',document.querySelectorAll('.tbtn')[7])">Zum Quartals-Review →</button>`;
    return;
  }
  if(!nextStep){
    textEl.textContent='Starte mit Schritt 1 – dem Vision-Prozess. Er ist das Fundament für alles andere.';
    return;
  }
  // Static recommendations based on step – no API call needed
  const recs={
    vision_process:'🌟 Beginne mit dem Vision-Prozess – er ist das Fundament für maximale Energie. Ohne klare Vision fehlt die Richtung, und ohne Richtung entsteht Prokrastination.',
    life_areas:'🎯 Definiere deine Lebensbereiche. Sie geben deinen täglichen Aufgaben Sinn – und Sinn ist der stärkste Anti-Prokrastinations-Faktor.',
    beliefs_done:'🧠 Limitierende Glaubenssätze sind die unsichtbare Bremse. Wer sie kennt, kann sie transformieren. Das ist der Unterschied zwischen Wollen und Tun.',
    first_tasks:'📋 Lege deine ersten Aufgaben mit Lebensbereich an. Wenn jede Aufgabe einem größeren Ziel dient, steigt die Motivation automatisch.',
    mit_used:'🎯 Probiere die MIT-Methode aus. 3 Aufgaben pro Tag statt endloser Listen – das reduziert Überforderung und schafft tägliche Erfolgserlebnisse.',
    cal_used:'📅 Plane Aufgaben mit konkreten Zeitblöcken. Aufgaben ohne Zeitplan werden 3x häufiger aufgeschoben.',
    morning_done:'🌅 Starte deine erste Morgenroutine. 5 Minuten Intention + Dankbarkeit verändern den gesamten Energieverlauf des Tages.',
    pomodoro_used:'⏱️ Nutze den Pomodoro-Timer. 25-Minuten-Sprints überwinden den Startwiderstand – das Gehirn prokrastiniert bei großen Aufgaben, nicht bei kleinen Zeitblöcken.',
    evening_done:'🌙 Schließe deinen ersten Tag mit der Abendreflexion ab. Was nicht reflektiert wird, wiederholt sich. Der Abschluss-Loop ist entscheidend.',
    wellbeing_tracked:'🧘 Tracke dein Wohlbefinden 3 Tage. Erst dann werden Energie-Muster sichtbar – und du verstehst wann du produktiv bist und wann nicht.',
    first_review:'🔄 Führe deinen ersten Wochenrückblick durch. Er ist das mächtigste Werkzeug gegen Prokrastination – macht Muster sichtbar bevor sie sich verfestigen.',
    journal_7days:'📓 Führe das Journal 7 Tage. Nach einer Woche werden erste Muster sichtbar die du alleine nie bemerkt hättest.',
    analytics_checked:'📈 Schau dir deine Analytics an. Daten über dich selbst sind Gold – sie zeigen wann und warum du produktiv bist.',
    ai_coach_used:'🤖 Nutze den FocusAI-Coach für ein tiefes Gespräch. Er kennt deine Vision und Glaubenssätze und gibt personalisierte Impulse.',
    quarterly_review:'🔄 Führe deinen ersten Quartals-Review durch. Alle 90 Tage: Stimmt meine Vision noch? Was verändert sich?',
    beliefs_revisited:'💡 Überprüfe deine Glaubenssätze nach 30 Tagen. Nach echten Erfahrungen zeigen sich neue Schichten – und neue Möglichkeiten.'
  };
  textEl.textContent=recs[nextStep.id]||`Dein nächster Schritt: "${nextStep.title}" – ${nextStep.why}`;
  actionEl.innerHTML=`<button class="path-step-action" onclick="${nextStep.action};closePathAndGo('${nextStep.tab}')">Jetzt starten →</button>`;
}

