// FocusFlow · 04-routines.js — Morgen-/Abendroutine, Stimmung, Wohlbefinden, Tages-Flow
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── ROUTINES ──  Morgen/Abend-Routine, Stimmung, Pomodoro
// ═══════════════════════════════════════════════════════════════
function setMorningGreeting(){
  const h=new Date().getHours();
  const greet=h<12?'Guten Morgen! ☀️':h<18?'Guten Tag! 🌤️':'Guten Abend! 🌙';
  document.getElementById('morning-h').textContent=greet;
  document.getElementById('morning-p').textContent='Wie startest du in diesen Moment?';
  document.getElementById('morning-quote').textContent=QUOTES[Math.floor(Math.random()*QUOTES.length)];
}

// Stimmung hat sichtbare Konsequenz: Auswahl wird markiert, der Effekt auf den
// Tag wird erklärt, und der Ton der App passt sich an (ruhig bei Tiefpunkten).
const MOOD_INFO={
  'Müde':{p:'Alles klar – heute zählt sanftes Dranbleiben, nicht Tempo.',fx:'→ Dein Einstieg wird leichter',calm:true},
  'Unmotiviert':{p:'Okay. Wir machen den ersten Schritt besonders klein – Motivation folgt dem Handeln.',fx:'→ Kleinster erster Schritt',calm:true},
  'Okay':{p:'Solide Basis – ein klarer erster Schritt bringt dich in Bewegung.',fx:''},
  'Gut':{p:'Schön! Nutze den Rückenwind für deinen Fokus-Schritt.',fx:''},
  'Fokussiert':{p:'Stark – jetzt ist der beste Moment für deine wichtigste Aufgabe.',fx:'→ Schwerste Aufgabe zuerst'}
};
const CALM_QUOTES=['🌱 Kleine Schritte sind heute genau richtig.','🤍 Sanft dranbleiben zählt mehr als Tempo.','🍃 Ein ruhiger Anfang ist auch ein Anfang.','🕯️ Heute reicht das Nötigste – und das ist okay.'];
function todayMoodLabel(){const t=new Date().toISOString().split('T')[0];const m=(D.dailyLog&&D.dailyLog[t]&&D.dailyLog[t].mood)||'';return m?m.split(' ')[1]||'':'';}
function calmMode(){const l=todayMoodLabel();return l==='Müde'||l==='Unmotiviert';}
function updateMoodButtons(){
  const l=todayMoodLabel();
  document.querySelectorAll('.mbtn').forEach(b=>b.classList.toggle('sel',!!l&&b.dataset.m===l));
  const fx=document.getElementById('mood-effect');
  if(fx)fx.textContent=l&&MOOD_INFO[l]?MOOD_INFO[l].fx:'';
}
function setMood(e,l){
  const colors={Müde:'#94A3B8,#748496',Unmotiviert:'#E87C7C,#D05050',Okay:'#F4D06A,#D4A82A',Gut:'#6DC98A,#4CAF72',Fokussiert:'#7C9EE8,#5B7FD4'};
  const c=colors[l]||'#7C9EE8,#9B8EE8';
  document.getElementById('morning-banner').style.background=`linear-gradient(135deg,${c})`;
  document.getElementById('morning-h').textContent='Stimmung: '+e+' '+l;
  const info=MOOD_INFO[l]||{p:'Schön, dass du hier bist.'};
  document.getElementById('morning-p').textContent=info.p;
  if(info.calm)document.getElementById('morning-quote').textContent=CALM_QUOTES[Math.floor(Math.random()*CALM_QUOTES.length)];
  D.currentMood=e+' '+l;
  const today=new Date().toISOString().split('T')[0];
  if(!D.dailyLog)D.dailyLog={};
  if(!D.dailyLog[today])D.dailyLog[today]={};
  D.dailyLog[today].mood=e+' '+l;
  try{saveProfile();}catch(err){}
  updateMoodButtons();
  toast(info.calm?'Danke für deine Ehrlichkeit. Heute gehen wir es sanfter an.':'Stimmung: '+e+' '+l);
  try{updateTodayStrip();}catch(err){}
  // Tages-Empfehlung neu berechnen – die Stimmung verändert den Einstieg
  try{renderJourney();}catch(err){}
  // P8: Bei Tiefpunkten die Vision reaktivieren – das innere Bild trägt
  if(l==='Müde'||l==='Unmotiviert'){try{showVisionBoost();}catch(err){}}
}
// Vision-Reaktivierung: Affirmation + Zielbild + Verbindungs-Frage zum Heute
function showVisionBoost(){
  const aff=D.vision&&D.vision.affirmation;
  const vis=(D.vision&&(D.vision.y1||D.vision.y5))||'';
  if(!aff&&!vis)return false;
  const c=document.getElementById('vboost-content');if(!c)return false;
  c.innerHTML=(aff?`<div style="font-size:1rem;font-style:italic;font-weight:600;line-height:1.6;background:#FFFBEB;border:1px solid #FDE68A;border-radius:var(--r2);padding:13px 15px;color:#92400E">💫 „${esc(aff)}"</div>`:'')
    +(vis?`<div style="font-size:.85rem;color:var(--mu);line-height:1.6;margin-top:10px">${esc(String(vis).slice(0,220))}${String(vis).length>220?'…':''}</div>`:'')
    +`<div style="font-size:.9rem;font-weight:700;margin-top:14px;line-height:1.5">Lies das einmal in Ruhe. Welche deiner heutigen Aktionen bringt dich dieser Person am nächsten?</div>`;
  document.getElementById('vboostmod').style.display='flex';
  return true;
}

const MORNING_STEPS=[
  {title:'🙏 Dankbarkeit',q:'Für was bist du heute dankbar?',placeholder:'Nenne 3 Dinge für die du heute dankbar bist...',key:'gratitude'},
  {title:'🌟 Tagesintention',q:'Was ist deine Intention für heute?',placeholder:'Wie möchtest du dich heute fühlen und was möchtest du erreichen?',key:'intention'},
  {title:'💫 Dein Satz für heute',q:'Sprich ihn einmal laut aus – er begleitet dich durch den Tag.',placeholder:'',key:'affirmation',fromVision:true},
  {title:'🎯 Fokus-Aufgabe',q:'Was ist deine wichtigste Aufgabe heute?',placeholder:'Die eine Aufgabe die heute alles andere übertrifft...',key:'focus'},
];
const EVENING_STEPS=[
  {title:'🏆 Erfolge',q:'Was habe ich heute erreicht, worauf ich stolz bin?',placeholder:'Auch kleine Erfolge zählen...',key:'wins'},
  {title:'📚 Lernmomente',q:'Was habe ich heute gelernt oder was würde ich anders machen?',placeholder:'Jeder Tag lehrt uns etwas...',key:'learnings'},
  {title:'😬 Prokrastination',q:'Habe ich heute etwas aufgeschoben? Was und warum?',placeholder:'Ehrliche Reflexion ohne Selbstkritik...',key:'procr'},
  {title:'🙏 Dankbarkeit',q:'Wofür bin ich heute dankbar?',placeholder:'3 Dinge aus dem heutigen Tag...',key:'gratitude_eve'},
  {title:'🌙 Intention für morgen',q:'Was nehme ich mir für morgen vor?',placeholder:'Eine klare Intention für den kommenden Tag...',key:'tomorrow'},
];
let morningData={},eveningData={},eveningStep=0;

function openMorningRoutine(){
  morningStep=0;
  // Pre-fill from saved data if exists
  const saved=D.dailyLog?.[new Date().toISOString().split('T')[0]]?.morning;
  morningData=saved?{...saved}:{};
  renderMorningStep();
  document.getElementById('morningmod').style.display='flex';
}
function renderMorningStep(){
  const step=MORNING_STEPS[morningStep];
  const isLast=morningStep===MORNING_STEPS.length-1;
  document.getElementById('morning-next-btn').textContent=isLast?'✓ Fertig':'Weiter ›';
  // Satz des Tages: rotierender Anker (Destillation) mit Affirmation als Fallback
  const val=step.fromVision?(typeof morningAnchorText==='function'?morningAnchorText():(D.vision?.affirmation||'Ich bin fokussiert und erschaffe mein bestes Leben.')):morningData[step.key]||'';
  document.getElementById('morning-step-content').innerHTML=`
    <div style="font-size:.73rem;font-weight:700;color:var(--p);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Schritt ${morningStep+1} von ${MORNING_STEPS.length}</div>
    <div style="font-size:1rem;font-weight:800;margin-bottom:5px">${step.title}</div>
    <div style="font-size:.87rem;color:var(--mu);margin-bottom:12px">${step.q}</div>
    <textarea class="ta" id="morning-input" placeholder="${step.placeholder}" ${step.fromVision?'style="background:#F0FDF4;color:#065F46;font-weight:600"':''}>${val}</textarea>
    <div style="display:flex;gap:4px;margin-top:10px">${MORNING_STEPS.map((_,i)=>`<div style="flex:1;height:4px;border-radius:2px;background:${i<=morningStep?'var(--p)':'var(--bo)'}"></div>`).join('')}</div>`;
}
function nextMorningStep(){
  const step=MORNING_STEPS[morningStep];
  morningData[step.key]=document.getElementById('morning-input').value.trim();
  if(morningStep<MORNING_STEPS.length-1){morningStep++;renderMorningStep();}
  else{
    // Fertigstellen nur bei echtem Inhalt (Affirmation ist vorbefüllt und zählt nicht)
    const hasAny=['gratitude','intention','focus'].some(k=>morningData[k]&&morningData[k].trim());
    if(!hasAny){toast('✍️ Beantworte mindestens eine Frage, um die Routine abzuschließen.');return;}
    document.getElementById('morningmod').style.display='none';
    saveMorningData();
    toast('🌅 Morgenroutine abgeschlossen! Schönen Tag! ✨');
  }
}
function prevMorningStep(){if(morningStep>0){morningData[MORNING_STEPS[morningStep].key]=document.getElementById('morning-input').value.trim();morningStep--;renderMorningStep();}}

function saveMorningData(){
  const today=new Date().toISOString().split('T')[0];
  if(!D.dailyLog)D.dailyLog={};
  if(!D.dailyLog[today])D.dailyLog[today]={};
  D.dailyLog[today].morning=morningData;
  D.dailyLog[today].mood=D.currentMood||'';
  showMorningSummary();
  saveProfile();
  logStep('morning_done');
  try{if(checkCrisis(Object.values(morningData||{}).join(' ')))showCrisisInfo();}catch(err){}
  try{renderJourney();}catch(e){}
}
function showMorningSummary(){
  const today=new Date().toISOString().split('T')[0];
  const m=D.dailyLog?.[today]?.morning;
  if(!m||!m.gratitude)return;
  document.getElementById('morning-summary').style.display='block';
  document.getElementById('morning-btn').textContent='🌅 Routine ✓';
  document.getElementById('morning-summary-content').innerHTML=
    (m.intention?`<div><strong>🌟 Intention:</strong> ${esc(m.intention)}</div>`:'')
    +(m.focus?`<div><strong>🎯 Fokus:</strong> ${esc(m.focus)}</div>`:'')
    +(m.gratitude?`<div><strong>🙏 Dankbar für:</strong> ${esc(m.gratitude)}</div>`:'')
    +(m.affirmation?`<div style="margin-top:6px;font-style:italic;opacity:.85">💫 ${esc(m.affirmation)}</div>`:'');
}

// EVENING
// Adaptive Abendreflexion (P4/P6): wenige, treffende Fragen. Vertieft nur dort,
// wo heute wirklich etwas offen blieb – und lernt aus den Ursachen.
const SKIP_CATS=[
 {v:'energie',label:'🔋 Zu wenig Energie'},
 {v:'zu_gross',label:'🧱 Aufgabe zu groß'},
 {v:'emotional',label:'💭 Ziel emotional nicht stark genug'},
 {v:'angst',label:'😰 Angst / Unsicherheit'},
 {v:'ablenkung',label:'📱 Ablenkung'},
 {v:'zeit',label:'⏰ Fehlende Zeit'},
 {v:'klarheit',label:'🤔 Fehlende Klarheit'},
 {v:'widerstand',label:'🌊 Innerer Widerstand'},
 {v:'sozial',label:'👥 Soziale Hürde'},
 {v:'perfekt',label:'🔍 Perfektionismus'},
 {v:'nichts',label:'✅ Nichts davon – lief einfach anders'}
];
let activeEveningSteps=[];
function buildEveningSteps(){
  const today=new Date().toISOString().split('T')[0];
  const openMIT=(D.mitTasks||[]).some((t,i)=>t&&t.trim()&&!(D.mitDone&&D.mitDone[i]));
  const hasOverdue=(D.tasks||[]).some(t=>isOverdue(t));
  const hasMorning=D.dailyLog&&D.dailyLog[today]&&D.dailyLog[today].morning;
  const steps=[EVENING_STEPS[0]]; // 🏆 Erfolge – immer
  // Komfortzonen-Challenge: wenn heute angenommen, abends kurz reflektieren
  const cch=D.vision&&D.vision.comfort&&D.vision.comfort.current;
  if(cch&&cch.date===today)steps.push({title:'🧗 Deine Challenge heute',q:'Du hattest dir vorgenommen: „'+esc(cch.text)+'". Wie ist es gelaufen – und was hat es mit dir gemacht? (Als „geschafft" markierst du sie auf „Mein Weg".)',placeholder:'Auch ein Versuch zählt – was hast du über dich gelernt?',key:'comfort_note'});
  if(openMIT||hasOverdue)steps.push({title:'🧱 Was hat dich gebremst?',q:'Etwas blieb heute offen. Das ist kein Fehler – es zeigt, woran wir arbeiten. Was hat dich am meisten gebremst?',key:'blocker_cat',type:'choice'});
  if(new Date().getDay()===0)steps.push(EVENING_STEPS[1]); // 📚 Lernmomente – 1× pro Woche
  if(!hasMorning)steps.push(EVENING_STEPS[3]); // 🙏 Dankbarkeit nur ohne Morgenroutine
  steps.push(EVENING_STEPS[4]); // 🌙 Intention für morgen – immer
  return steps;
}
function openEveningRoutine(){
  eveningStep=0;
  const saved=D.dailyLog?.[new Date().toISOString().split('T')[0]]?.evening;
  eveningData=saved?{...saved}:{};
  activeEveningSteps=buildEveningSteps();
  renderEveningStep();
  document.getElementById('eveningmod').style.display='flex';
}
function renderEveningStep(){
  const step=activeEveningSteps[eveningStep];
  const isLast=eveningStep===activeEveningSteps.length-1;
  document.getElementById('evening-next-btn').textContent=isLast?'✓ Abschließen & ins Tagebuch':'Weiter ›';
  const body=step.type==='choice'
    ?`<div style="display:flex;flex-direction:column;gap:7px;max-height:46vh;overflow-y:auto">${SKIP_CATS.map(c=>`<button class="ob-opt${eveningData[step.key]===c.v?' sel':''}" onclick="selectEveningChoice('${step.key}','${c.v}')">${c.label}</button>`).join('')}</div>`
    :`<textarea class="ta" id="evening-input" placeholder="${step.placeholder}">${esc(eveningData[step.key]||'')}</textarea>`;
  document.getElementById('evening-step-content').innerHTML=`
    <div style="font-size:.73rem;font-weight:700;color:var(--p);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Schritt ${eveningStep+1} von ${activeEveningSteps.length}</div>
    <div style="font-size:1rem;font-weight:800;margin-bottom:5px">${step.title}</div>
    <div style="font-size:.87rem;color:var(--mu);margin-bottom:12px">${step.q}</div>
    ${body}
    <div style="display:flex;gap:4px;margin-top:10px">${activeEveningSteps.map((_,i)=>`<div style="flex:1;height:4px;border-radius:2px;background:${i<=eveningStep?'#B08EE8':'var(--bo)'}"></div>`).join('')}</div>`;
}
function selectEveningChoice(key,v){eveningData[key]=v;renderEveningStep();}
function storeEveningInput(){
  const step=activeEveningSteps[eveningStep];if(!step||step.type==='choice')return;
  const el=document.getElementById('evening-input');
  if(el)eveningData[step.key]=el.value.trim();
}
function nextEveningStep(){
  storeEveningInput();
  if(eveningStep<activeEveningSteps.length-1){eveningStep++;renderEveningStep();}
  else{
    // Abschließen nur mit mindestens einer beantworteten Frage
    const hasAny=['wins','learnings','gratitude_eve','tomorrow','procr','comfort_note'].some(k=>eveningData[k]&&String(eveningData[k]).trim());
    if(!hasAny){toast('✍️ Beantworte mindestens eine Frage, um die Reflexion abzuschließen.');return;}
    document.getElementById('eveningmod').style.display='none';saveEveningData();
  }
}
function prevEveningStep(){if(eveningStep>0){storeEveningInput();eveningStep--;renderEveningStep();}}
// P9: Weg-Anpassung aus wiederkehrenden Brems-Ursachen – mit Protokoll
const CAT2BLOCKER={energie:'lowenergy',zu_gross:'overwhelm',emotional:'unclarity',angst:'fear',ablenkung:'distraction',zeit:'overwhelm',klarheit:'unclarity',widerstand:'procrastination',sozial:'fear',perfekt:'fear'};
function recalibrateFromSkips(){
  const ob=D.vision&&D.vision.onboarding;if(!ob||!ob.done||!ob.profile)return;
  const cutoff=Date.now()-14*864e5;
  const log=(D.vision.skipLog||[]).filter(x=>new Date(x.date).getTime()>=cutoff);
  if(log.length<3)return;
  const counts={};log.forEach(x=>{counts[x.cat]=(counts[x.cat]||0)+1;});
  const top=Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];
  if(!top||counts[top]<3)return;
  const mapped=CAT2BLOCKER[top];
  if(!mapped||mapped===ob.profile.blocker)return;
  const oldB=ob.profile.blocker;
  ob.profile.blocker=mapped;
  ob.journey=computeJourney(ob.profile);
  const cat=journeyCatalog();
  const nextOpen=ob.journey.find(id=>cat[id]&&!stepStatus(id).done);
  const catLbl=(SKIP_CATS.find(c=>c.v===top)||{}).label||top;
  if(!D.vision.pathAdjustLog)D.vision.pathAdjustLog=[];
  D.vision.pathAdjustLog.unshift({
    date:new Date().toISOString(),
    trigger:'Abendreflexion: „'+catLbl+'" '+counts[top]+'× in 14 Tagen',
    oldA:'Größte Hürde: '+((BLOCKER_INFO[oldB]||{}).t||oldB),
    newA:'Größte Hürde: '+((BLOCKER_INFO[mapped]||{}).t||mapped),
    focus:nextOpen?stepLabel(nextOpen,cat[nextOpen]):''
  });
  toast('🧭 Dein Weg wurde angepasst – warum, siehst du in „Mein Bereich".');
}

async function saveEveningData(){
  const today=new Date().toISOString().split('T')[0];
  if(!D.dailyLog)D.dailyLog={};
  if(!D.dailyLog[today])D.dailyLog[today]={};
  D.dailyLog[today].evening=eveningData;

  // Brems-Ursache loggen (Diagnostik, kein Fehler) + Weg ggf. rekalibrieren
  const e=eveningData;
  if(e.blocker_cat&&e.blocker_cat!=='nichts'){
    if(!D.vision)D.vision={};
    if(!D.vision.skipLog)D.vision.skipLog=[];
    D.vision.skipLog.unshift({date:today,cat:e.blocker_cat});
    D.vision.skipLog=D.vision.skipLog.slice(0,60);
    try{recalibrateFromSkips();}catch(err){console.error('recalibrate',err);}
  }
  try{if(checkCrisis([e.wins,e.learnings,e.tomorrow,e.gratitude_eve].join(' ')))showCrisisInfo();}catch(err2){}

  // Auto-create diary entry from full day
  const m=D.dailyLog[today]?.morning||{};
  const catL=(SKIP_CATS.find(c=>c.v===e.blocker_cat)||{}).label;
  const doneTasks=D.tasks.filter(t=>t.done&&t.createdAt&&t.createdAt.startsWith(today)).map(t=>t.name).join(', ')||'Keine';
  const diaryText=`🌅 MORGEN:\n🙏 Dankbar: ${m.gratitude||'-'}\n🌟 Intention: ${m.intention||'-'}\n🎯 Fokus: ${m.focus||'-'}\n\n🌙 ABEND:\n🏆 Erfolge: ${e.wins||'-'}\n📚 Gelernt: ${e.learnings||'-'}\n🧱 Gebremst durch: ${catL||e.procr||'-'}\n🙏 Abend-Dankbarkeit: ${e.gratitude_eve||'-'}\n\n✅ Erledigte Aufgaben: ${doneTasks}\n\n🌙 Morgen nehme ich mir vor: ${e.tomorrow||'-'}`;

  const id=Date.now();
  const entry={id,habit:'Tagesreflexion',trigger:'',strategy:diaryText,cat:'sonstiges',date:today,isDailyLog:true};
  // Remove old entry for today if exists
  D.diary=D.diary.filter(d=>!(d.isDailyLog&&d.date===today));
  D.diary.unshift(entry);
  await sbFetch('/rest/v1/diary',{method:'POST',body:JSON.stringify({id,user_id:UID,habit:'Tagesreflexion 📓',trigger:'',strategy:diaryText,cat:'sonstiges',date:today})});

  // Auto-save journal when evening is done
  await saveProfile();
  pendingHabits=[];
  await autoSaveJournal();
  document.getElementById('evening-btn').textContent='🌙 Reflexion ✓';
  document.getElementById('evening-btn').style.background='rgba(176,142,232,.4)';
  await saveProfile();
  try{renderJournal();}catch(err){console.error('renderJournal',err);}
  logStep('evening_done');
  try{renderJourney();}catch(e){}
  toast('🌙 Abendreflexion gespeichert & ins Tagebuch übertragen! 📓');
  // Ernte: Wertvolles aus der Reflexion als Anker anbieten (ein optionales
  // Angebot, vorbefüllt – Schließen kostet einen Tap)
  const harvest=String(e.learnings||e.comfort_note||'').trim();
  if(harvest.length>=15){
    setTimeout(()=>{try{openAnchorCapture(harvest.slice(0,300),'insight','evening');}catch(err){}},900);
  }
}

// ═══════════════════════════════════════════════════════════════
// ── WELLBEING ──  Wohlbefinden, Emotions-Check, Energie-Insights
// ═══════════════════════════════════════════════════════════════
const EMOTION_STRATEGIES={
  angst:{
    color:'#FEE2E2',border:'#FCA5A5',icon:'😰',
    title:'Angst & Druck – das ist normal',
    text:'Angst vor einer Aufgabe entsteht oft durch Perfektionismus oder Versagensangst. Dein Gehirn übertreibt das Risiko.',
    steps:['<strong>Worst-Case-Analyse:</strong> Was ist das Schlimmste das passieren kann? Ist es wirklich so schlimm?','<strong>2-Minuten-Regel:</strong> Starte nur für 2 Minuten – kein Druck, kein Ergebnis nötig','<strong>Reframing:</strong> Diese Aufgabe ist ein Schritt zu deiner Vision – kein Test deines Wertes'],
    btn:'2 Minuten starten 💪'
  },
  overwhelm:{
    color:'#FFF7ED',border:'#FED7AA',icon:'🤯',
    title:'Überforderung – zerteile es',
    text:'Überforderung entsteht wenn eine Aufgabe zu groß und zu unspezifisch ist. Dein Gehirn weigert sich anzufangen.',
    steps:['<strong>Nächster Mini-Schritt:</strong> Was ist die kleinste mögliche Aktion – 2 Minuten oder weniger?','<strong>Alles andere ausblenden:</strong> Nur dieser eine Schritt, sonst nichts','<strong>Pomodoro starten:</strong> 25 Minuten – danach neu bewerten'],
    btn:'Kleinsten Schritt definieren 🎯'
  },
  langeweile:{
    color:'#F1F5F9',border:'#CBD5E1',icon:'😑',
    title:'Langeweile – finde den Sinn',
    text:'Langeweile bei Aufgaben entsteht wenn der Sinnbezug fehlt. Verbinde die Aufgabe mit dem größeren Warum.',
    steps:['<strong>Vision-Verbindung:</strong> Warum ist diese Aufgabe wichtig für deine Vision?','<strong>Challenge erhöhen:</strong> Wie kannst du die Aufgabe interessanter gestalten – Zeitlimit, Gamification?','<strong>Musik/Flow-State:</strong> Nutze Musik oder den Fokus-Modus für Flow'],
    btn:'Sinn-Verbindung herstellen 🌟'
  },
  erschoepfung:{
    color:'#EEF2FF',border:'#C7D2FE',icon:'😴',
    title:'Erschöpfung – höre auf deinen Körper',
    text:'Erschöpfung ist ein körperliches Signal, kein Charakterfehler. Weiterarbeiten bei echter Erschöpfung kostet mehr als es bringt.',
    steps:['<strong>Ehrliche Frage:</strong> Ist das echte Erschöpfung oder Vermeidung? Wenn echt: Pause ist produktiv','<strong>5-Minuten-Auffrischung:</strong> Kurzer Spaziergang, Wasser trinken, 3 tiefe Atemzüge','<strong>Energie-Aufgaben:</strong> Wechsle zu einer leichten Aufgabe – sei heute trotzdem produktiv'],
    btn:'Energie-Aufgabe wählen ⚡'
  },
  zweifel:{
    color:'#F0FDF4',border:'#BBF7D0',icon:'🤔',
    title:'Zweifel & Unklarheit – kläre zuerst',
    text:'Unklarheit ist der häufigste versteckte Prokrastinations-Grund. Das Gehirn meidet was es nicht versteht.',
    steps:['<strong>Aufgabe konkretisieren:</strong> Was genau ist das Ergebnis? Wann ist sie erledigt?','<strong>Erste Frage beantworten:</strong> Was weißt du noch nicht? Kläre nur das – alles andere danach','<strong>FocusAI fragen:</strong> Nutze den Coach um die Aufgabe zu strukturieren'],
    btn:'Aufgabe konkretisieren 🎯'
  },
  fokus:{
    color:'#F0FDF4',border:'#6DC98A',icon:'🔥',
    title:'Du bist fokussiert – nutze es!',
    text:'Fokus-Momente sind wertvoll. Dein Gehirn ist gerade im optimalen Zustand für tiefe Arbeit.',
    steps:['<strong>Handy weg:</strong> Keine Ablenkungen in den nächsten 25 Minuten','<strong>Pomodoro starten:</strong> Nutze diesen Fokus-Zustand maximal','<strong>Wichtigste Aufgabe:</strong> Starte jetzt mit deiner Frog-Aufgabe oder MIT'],
    btn:'Fokus-Modus starten 🔲'
  }
};
let currentEmotionTaskId=null;

function openEmotionCheck(taskId){
  currentEmotionTaskId=taskId;
  const t=D.tasks.find(x=>x.id===taskId);
  document.getElementById('emotion-task-name').textContent=t?`⚡ "${t.name.slice(0,40)}"`:' Emotions-Check';
  document.getElementById('emotion-strategy').style.display='none';
  document.querySelectorAll('.emotion-btn').forEach(b=>b.classList.remove('selected'));
  document.getElementById('emotion-action-btn').textContent='Verstanden – loslegen! 💪';
  document.getElementById('emotionmod').style.display='flex';
}
function selectEmotion(type){
  document.querySelectorAll('.emotion-btn').forEach(b=>b.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  const s=EMOTION_STRATEGIES[type];
  const el=document.getElementById('emotion-strategy');
  el.style.display='block';
  el.style.background=s.color;el.style.borderColor=s.border;
  el.className='emotion-strategy';
  el.innerHTML=`<div style="font-size:.88rem;font-weight:800;margin-bottom:6px">${s.icon} ${s.title}</div>
    <div style="font-size:.83rem;color:var(--mu);margin-bottom:10px;font-style:italic">${s.text}</div>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${s.steps.map((step,i)=>`<div style="display:flex;gap:8px;font-size:.83rem;line-height:1.5"><span style="font-weight:800;color:var(--p);flex-shrink:0">${i+1}.</span><span>${step}</span></div>`).join('')}
    </div>`;
  const btn=document.getElementById('emotion-action-btn');
  btn.textContent=s.btn;
  if(type==='fokus'){btn.onclick=()=>{document.getElementById('emotionmod').style.display='none';openFocus();};}
  else if(type==='erschoepfung'){btn.onclick=()=>{document.getElementById('emotionmod').style.display='none';showTab('wellbeing',document.querySelectorAll('.tbtn')[6]);};}
  else{btn.onclick=()=>{document.getElementById('emotionmod').style.display='none';};}
  // Log emotion to journal
  const today=new Date().toISOString().split('T')[0];
  if(!D.dailyLog)D.dailyLog={};if(!D.dailyLog[today])D.dailyLog[today]={};
  if(!D.dailyLog[today].emotions)D.dailyLog[today].emotions=[];
  D.dailyLog[today].emotions.push({type,taskId:currentEmotionTaskId,time:new Date().toISOString()});
}

function computeEnergyInsights(){
  if(!D)return[];
  const insights=[];
  const wb=D.wellbeing||[];
  const today=new Date().toISOString().split('T')[0];
  const todayWb=wb.find(w=>w.date===today);
  const last7=wb.slice(0,7);

  // Sleep insight
  if(last7.length>=3){
    const avgSleep=last7.reduce((s,w)=>s+w.sleep,0)/last7.length;
    const todaySleep=todayWb?.sleep;
    if(todaySleep&&todaySleep<6){
      insights.push({icon:'😴',type:'warning',color:'#FFF7ED',border:'#FED7AA',title:'Wenig Schlaf heute',text:`Nur ${todaySleep}h Schlaf. An solchen Tagen erledigst du erfahrungsgemäß weniger. Plane heute hauptsächlich leichte und mittlere Aufgaben. Schwere Aufgaben auf morgen verschieben.`});
    } else if(avgSleep<6.5){
      insights.push({icon:'💤',type:'warning',color:'#FFF7ED',border:'#FED7AA',title:'Schlaf-Defizit erkannt',text:`Dein Schlaf-Durchschnitt der letzten ${last7.length} Tage liegt bei ${avgSleep.toFixed(1)}h – zu wenig für optimale kognitive Leistung. Priorisiere heute Abend frühere Schlafenszeit.`});
    }
  }

  // Energy level insight
  if(todayWb?.energy){
    if(todayWb.energy>=8){
      insights.push({icon:'🔥',type:'boost',color:'#F0FDF4',border:'#BBF7D0',title:'Hohe Energie heute!',text:`Energie-Level ${todayWb.energy}/10 – perfekt für deine schwersten Aufgaben. Nutze diesen Zustand für Frog-Aufgaben und kreative Arbeit. Nicht mit Routine verschwenden!`});
    } else if(todayWb.energy<=4){
      insights.push({icon:'⚡',type:'low',color:'#EEF2FF',border:'#C7D2FE',title:'Niedrige Energie heute',text:`Energie-Level ${todayWb.energy}/10. Das ist kein Versagen – es ist Information. Fokussiere dich heute auf leichte, klare Aufgaben. Schwere Entscheidungen und kreative Arbeit auf morgen.`});
    }
  }

  // Stress insight
  if(todayWb?.stress>=8){
    insights.push({icon:'😰',type:'stress',color:'#FEE2E2',border:'#FCA5A5',title:'Hoher Stresslevel heute',text:`Stress ${todayWb.stress}/10. Hoher Stress beeinträchtigt den Präfrontalen Kortex – die Entscheidungszentrale. Starte mit einer kleinen, erledigbaren Aufgabe für ein Erfolgserlebnis. Das reguliert den Stresslevel.`});
  }

  // Productivity pattern
  if(last7.length>=5){
    const dow=new Date().getDay();
    const sameDayEntries=wb.filter(w=>new Date(w.date+'T12:00:00').getDay()===dow);
    if(sameDayEntries.length>=2){
      const avgEnergy=sameDayEntries.reduce((s,w)=>s+w.energy,0)/sameDayEntries.length;
      if(avgEnergy>=7){
        insights.push({icon:'📊',type:'pattern',color:'#F4F6FB',border:'#E4EAF4',title:'Dein persönliches Muster',text:`${['Sonntage','Montage','Dienstage','Mittwoche','Donnerstage','Freitage','Samstage'][dow]} sind für dich typischerweise energiereiche Tage (Ø ${avgEnergy.toFixed(1)}/10). Plane heute deine wichtigsten Aufgaben!`});
      }
    }
  }

  // Overdue tasks insight
  const overdueCount=D.tasks.filter(t=>isOverdue(t)).length;
  if(overdueCount>0){
    insights.push({icon:'⚠️',type:'overdue',color:'#FFF5F5',border:'#FCA5A5',title:`${overdueCount} überfällige Aufgabe${overdueCount>1?'n':''}`,text:`Du hast ${overdueCount} überfällige Aufgabe${overdueCount>1?'n':''} – das erzeugt unbewussten Stress auch wenn du nicht daran denkst. Wähle heute eine davon als MIT-Aufgabe.`});
  }

  return insights;
}

// ═══════════════════════════════════════════════════════════════
// ── DAILY FLOW ──  Tages-Flow-Modus mit Energie-Kontext
// ═══════════════════════════════════════════════════════════════
function openDailyFlow(){
  if(!D||!UID){toast('Bitte erst einloggen.');return;}
  const today=new Date();
  document.getElementById('flow-date-label').textContent=today.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'});
  const todayWb=D.wellbeing?.find(w=>w.date===today.toISOString().split('T')[0]);
  const energyLevel=todayWb?.energy||null;
  const energyBadge=document.getElementById('flow-energy-badge');
  if(energyLevel){
    const color=energyLevel>=7?'#F0FDF4':energyLevel>=5?'#EEF2FF':'#FFF7ED';
    const textColor=energyLevel>=7?'#065F46':energyLevel>=5?'#3730A3':'#92400E';
    const label=energyLevel>=7?'🔥 Hohe Energie':energyLevel>=5?'⚡ Mittlere Energie':'😴 Niedrige Energie';
    energyBadge.style.background=color;energyBadge.style.color=textColor;
    energyBadge.textContent=label+' ('+energyLevel+'/10)';
  } else {
    energyBadge.textContent='Energie: noch nicht erfasst';
  }

  // Render energy insights
  const insights=computeEnergyInsights();
  const insightsEl=document.getElementById('flow-insights');
  if(insights.length){
    insightsEl.innerHTML=insights.map(i=>`<div class="energy-insight" style="background:${i.color};border-color:${i.border}">
      <div class="energy-insight-icon">${i.icon}</div>
      <div><div style="font-size:.82rem;font-weight:800;margin-bottom:3px">${i.title}</div>
      <div class="energy-insight-text" style="font-weight:400">${i.text}</div></div>
    </div>`).join('');
  } else {insightsEl.innerHTML='';}

  // Build smart flow steps based on context
  const todayStr=today.toISOString().split('T')[0];
  const hasMorning=D.dailyLog?.[todayStr]?.morning;
  const hasWb=!!todayWb;
  const hasEvening=D.dailyLog?.[todayStr]?.evening;
  const mitDone=D.mitDone?.every(Boolean);
  const openTasks=D.tasks.filter(t=>!t.done).length;
  const frog=D.tasks.find(t=>t.special==='frog'&&!t.done);

  const steps=[];

  // Step 1: Energie erfassen (if not done)
  if(!hasWb){
    steps.push({done:false,time:'1 Min',title:'⚡ Energie erfassen',sub:'Kurzer Wohlbefinden-Check – gibt dir und der App wichtige Daten',action:()=>{document.getElementById('flowmod').style.display='none';showTab('wellbeing',document.querySelectorAll('.tbtn')[6]);}});
  } else {
    steps.push({done:true,time:'✓',title:'⚡ Energie erfasst',sub:`Energie: ${todayWb.energy}/10 · Schlaf: ${todayWb.sleep}h`});
  }

  // Step 2: Morgenroutine (if not done)
  if(!hasMorning){
    steps.push({done:false,time:'5 Min',title:'🌅 Morgenroutine',sub:'Intention setzen, Dankbarkeit, Affirmation & Fokus-Aufgabe',action:()=>{document.getElementById('flowmod').style.display='none';openMorningRoutine();}});
  } else {
    steps.push({done:true,time:'✓',title:'🌅 Morgenroutine abgeschlossen',sub:`Intention: ${hasMorning.intention?.slice(0,50)||'gesetzt'}...`});
  }

  // Step 3: MIT (smart recommendation based on energy)
  if(!mitDone){
    const rec=energyLevel>=7?'Hohe Energie → heute eine schwere Aufgabe als MIT wählen':energyLevel&&energyLevel<=4?'Niedrige Energie → heute leichte MIT-Aufgaben wählen':'3 Aufgaben wählen die heute zur Vision beitragen';
    steps.push({done:false,time:'2 Min',title:'🎯 Tagesziele setzen (MIT)',sub:rec,action:()=>{document.getElementById('flowmod').style.display='none';showTab('mit',document.querySelectorAll('.tbtn')[1]);}});
  } else {
    steps.push({done:true,time:'✓',title:'🎯 Tagesziele gesetzt',sub:'MIT-Aufgaben für heute definiert'});
  }

  // Step 4: Frog or first task
  if(frog){
    steps.push({done:false,time:'25 Min',title:`🐸 Frog-Aufgabe starten: "${frog.name.slice(0,35)}"`,sub:'Diese Aufgabe gibt dir die meiste Energie wenn du sie erledigst – starte jetzt',action:()=>{document.getElementById('flowmod').style.display='none';openFocus();},highlight:true});
  } else if(openTasks>0){
    const topTask=D.tasks.filter(t=>!t.done).sort((a,b)=>{const p={high:0,normal:1,low:2};return p[a.prio]-p[b.prio];})[0];
    if(topTask)steps.push({done:false,time:'25 Min',title:`▶ Starten: "${topTask.name.slice(0,35)}"`,sub:'Deine wichtigste offene Aufgabe – Pomodoro starten',action:()=>{document.getElementById('flowmod').style.display='none';startPomo();}});
  }

  // Step 5: Evening (if time is right)
  const hour=new Date().getHours();
  if(hour>=17){
    if(!hasEvening){
      steps.push({done:false,time:'8 Min',title:'🌙 Abendreflexion',sub:'Tag abschließen, Muster erkennen, Morgen vorbereiten',action:()=>{document.getElementById('flowmod').style.display='none';openEveningRoutine();}});
    } else {
      steps.push({done:true,time:'✓',title:'🌙 Abendreflexion abgeschlossen',sub:'Tag erfolgreich reflektiert'});
    }
  }

  // Render steps
  document.getElementById('flow-steps').innerHTML=steps.map((s,i)=>`
    <div class="flow-step${s.done?' done':i===steps.findIndex(x=>!x.done)?' active':''}${s.highlight?' frog':''}" ${s.action&&!s.done?`onclick="flowSteps[${i}].action()"style="cursor:pointer"`:''}>
      <div class="flow-step-num">${s.done?'✓':i+1}</div>
      <div class="flow-step-info">
        <div class="flow-step-title">${s.title}</div>
        <div class="flow-step-sub">${s.sub}</div>
      </div>
      <span class="flow-step-time">${s.time}</span>
    </div>`).join('');

  // Store steps for onclick
  window.flowSteps=steps;

  // Total time
  const totalMin=steps.filter(s=>!s.done).reduce((sum,s)=>{const m=parseInt(s.time);return sum+(isNaN(m)?0:m);},0);
  if(totalMin>0){
    document.getElementById('flow-steps').innerHTML+=`<div style="text-align:center;font-size:.8rem;font-weight:700;color:var(--mu);margin-top:8px;padding:8px;background:var(--bg);border-radius:var(--r3)">⏱ Noch ca. ${totalMin} Minuten für deinen heutigen Flow</div>`;
  } else {
    document.getElementById('flow-steps').innerHTML+=`<div style="text-align:center;font-size:.88rem;font-weight:700;color:var(--ok);margin-top:8px;padding:10px;background:#F0FDF4;border-radius:var(--r3);border:1px solid #BBF7D0">🎉 Tages-Flow abgeschlossen! Großartige Arbeit!</div>`;
  }

  document.getElementById('flowmod').style.display='flex';
}

