// FocusFlow · 06-onboarding.js — Einstiegstest, Profil, Journey-Berechnung, Tutorial
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── ONBOARDING & JOURNEY ──  Eingangstest + personalisierte Strecke
// ═══════════════════════════════════════════════════════════════
const ONBOARD_QUESTIONS=[
 {id:'goal',q:'Was ist dein wichtigstes Ziel mit FocusFlow?',sub:'Worauf soll dein Weg zuerst einzahlen?',o:[
   {v:'vision',label:'🌟 Klarheit & Vision finden'},
   {v:'procrastination',label:'🚀 Prokrastination überwinden'},
   {v:'productivity',label:'⚡ Produktiver & fokussierter werden'},
   {v:'balance',label:'🧘 Ausgeglichener & energiegeladener leben'},
   {v:'habits',label:'🔁 Dranbleiben & gute Gewohnheiten aufbauen'}]},
 {id:'area',q:'Welcher Lebensbereich ist dir gerade am wichtigsten?',o:[
   {v:'career',label:'💼 Karriere & Beruf'},
   {v:'health',label:'💪 Gesundheit & Körper'},
   {v:'relations',label:'❤️ Beziehungen'},
   {v:'finance',label:'💰 Finanzen'},
   {v:'personal',label:'🧠 Persönlichkeit & Lernen'},
   {v:'meaning',label:'✨ Sinn & Zweck'}]},
 {id:'visionClarity',q:'Wie klar ist deine langfristige Vision?',sub:'Weißt du, wohin du in 3–5 Jahren willst?',o:[
   {v:'low',label:'🌫️ Eher unklar – ich suche noch'},
   {v:'mid',label:'🌤️ Grobe Idee, aber nicht konkret'},
   {v:'high',label:'☀️ Sehr klar – ich weiß, wohin'}]},
 {id:'blocker',q:'Was hält dich am meisten auf?',sub:'Dein größter innerer Widerstand.',o:[
   {v:'overwhelm',label:'🤯 Überforderung – zu viel auf einmal'},
   {v:'unclarity',label:'🤔 Unklarheit – ich weiß nicht, wo anfangen'},
   {v:'lowenergy',label:'😴 Niedrige Energie / Erschöpfung'},
   {v:'fear',label:'😰 Angst & Selbstzweifel'},
   {v:'distraction',label:'🎮 Ablenkung – Handy, Social Media'},
   {v:'procrastination',label:'⏳ Aufschieben trotz besserem Wissen'}]},
 {id:'energy',q:'Wie ist deine Energie typischerweise?',o:[
   {v:'low',label:'🔋 Oft niedrig'},
   {v:'mid',label:'🔋🔋 Mittel, schwankend'},
   {v:'high',label:'🔋🔋🔋 Meist hoch'}]},
 {id:'time',q:'Wie viel Zeit kannst du täglich investieren?',o:[
   {v:'low',label:'⏱️ Unter 10 Minuten'},
   {v:'mid',label:'⏱️ 10–25 Minuten'},
   {v:'high',label:'⏱️ Mehr als 25 Minuten'}]},
 {id:'consistency',q:'Wie konsistent hältst du Vorhaben durch?',o:[
   {v:'low',label:'😅 Selten – ich verliere schnell den Faden'},
   {v:'mid',label:'🙂 Mal so, mal so'},
   {v:'high',label:'💪 Ziemlich zuverlässig'}]},
 {id:'priorities',q:'Hast du klare Tagesprioritäten?',sub:'Weißt du morgens, was heute wirklich zählt?',o:[
   {v:'low',label:'❌ Selten oder nie'},
   {v:'mid',label:'➖ Manchmal'},
   {v:'high',label:'✅ Fast immer'}]},
 {id:'values',q:'Wie gut kennst du deine eigenen Werte?',o:[
   {v:'low',label:'🤷 Habe ich kaum reflektiert'},
   {v:'mid',label:'🧩 Teilweise'},
   {v:'high',label:'💎 Sehr gut'}]},
 {id:'procr_freq',q:'Wie häufig schiebst du Wichtiges auf?',o:[
   {v:'high',label:'😬 Täglich'},
   {v:'mid',label:'😐 Ab und zu'},
   {v:'low',label:'😎 Selten'}]},
 {id:'sleep',q:'Wie erholsam sind dein Schlaf & deine Pausen?',o:[
   {v:'low',label:'😵 Schlecht'},
   {v:'mid',label:'😐 Okay'},
   {v:'high',label:'😴 Gut'}]},
 {id:'stress',q:'Wie gehst du mit Stress um?',o:[
   {v:'low',label:'🌊 Fühle mich oft überwältigt'},
   {v:'mid',label:'⚖️ Wechselhaft'},
   {v:'high',label:'🧘 Meist gut reguliert'}]},
 {id:'reflection',q:'Reflektierst du regelmäßig (Journal/Rückblick)?',o:[
   {v:'low',label:'❌ Nie'},
   {v:'mid',label:'➖ Selten'},
   {v:'high',label:'📓 Regelmäßig'}]},
 {id:'motivation',q:'Was motiviert dich am meisten?',o:[
   {v:'wins',label:'🏆 Kleine, schnelle Erfolge'},
   {v:'meaning',label:'✨ Langfristige Bedeutung'},
   {v:'deadlines',label:'⏰ Klare Deadlines & Struktur'},
   {v:'growth',label:'🌱 Persönliches Wachstum'}]},
 {id:'structure',q:'Wie strukturiert ist dein Alltag?',o:[
   {v:'low',label:'🌪️ Eher chaotisch'},
   {v:'mid',label:'🧱 Teils strukturiert'},
   {v:'high',label:'📐 Klar strukturiert'}]},
 {id:'selfdoubt',q:'Wie stark ist dein innerer Kritiker?',sub:'Selbstzweifel, die dich bremsen.',o:[
   {v:'high',label:'🌧️ Stark'},
   {v:'mid',label:'⛅ Mittel'},
   {v:'low',label:'☀️ Eher gering'}]},
 {id:'comfort',q:'Wo bleibst du am liebsten in deiner Komfortzone?',sub:'Der Bereich, den du meidest, obwohl er dich wachsen ließe.',o:[
   {v:'visibility',label:'🎤 Sichtbarkeit – präsentieren, im Mittelpunkt stehen'},
   {v:'social',label:'👥 Auf fremde Menschen zugehen'},
   {v:'conflict',label:'🗣️ Nein sagen, Konflikte & schwierige Gespräche'},
   {v:'newthings',label:'🧗 Neues & Ungewisses ausprobieren'},
   {v:'help',label:'🙋 Um Hilfe bitten, Schwäche zeigen'},
   {v:'none',label:'🤷 Keiner davon besonders'}]}
];
let obStep=0,obAnswers={},obQuestions=[],obFollowupsAdded=false;
// Adaptive Folgefragen: werden nur gestellt, wenn sie den Weg präziser machen.
const ADAPTIVE_FOLLOWUPS=[
  {id:'approach',when:a=>a.visionClarity==='low'&&a.goal!=='vision',q:'Deine Vision ist noch nicht ganz klar. Was ist dir jetzt wichtiger?',o:[
    {v:'clarity',label:'🌟 Zuerst Klarheit über meine Richtung gewinnen'},
    {v:'action',label:'🚀 Direkt ins Handeln kommen, Klarheit wächst dabei'}]},
  {id:'overwhelm_type',when:a=>a.blocker==='overwhelm',q:'Was überfordert dich mehr?',o:[
    {v:'toomany',label:'📋 Zu viele Aufgaben gleichzeitig'},
    {v:'unclear',label:'🤔 Unklar, was wirklich Priorität hat'}]},
  {id:'energy_cause',when:a=>a.energy==='low'||a.blocker==='lowenergy',q:'Woran liegt deine niedrige Energie am ehesten?',o:[
    {v:'sleep',label:'😴 Schlaf & Erholung'},
    {v:'stress',label:'😰 Stress & Anspannung'},
    {v:'body',label:'🏃 Bewegung & Körper'}]},
  {id:'time_style',when:a=>a.time==='low',q:'Bei wenig Zeit: was passt besser zu dir?',o:[
    {v:'micro',label:'⚡ Eine winzige tägliche Gewohnheit'},
    {v:'block',label:'⏱️ Ein kurzer fokussierter Block'}]},
  {id:'comfort_appetite',when:a=>a.comfort&&a.comfort!=='none',q:'Wie viel Herausforderung verträgt dein Alltag gerade?',o:[
    {v:'sanft',label:'🌱 Sanft – kleine Mutproben, die sicher gelingen'},
    {v:'mutig',label:'🔥 Mutig – ich will spürbar gefordert werden'}]}
];
const LIFE_LABEL={career:'💼 Karriere',health:'💪 Gesundheit',relations:'❤️ Beziehungen',finance:'💰 Finanzen',personal:'🧠 Persönlichkeit',meaning:'✨ Sinn & Zweck'};
const COMFORT_LABEL={visibility:'🎤 Sichtbarkeit',social:'👥 Auf Menschen zugehen',conflict:'🗣️ Klartext & Nein sagen',newthings:'🧗 Neues wagen',help:'🙋 Um Hilfe bitten',none:'🌀 Gemischt'};
const BLOCKER_INFO={
  overwhelm:{t:'Überforderung',s:'Wir zerlegen alles in kleine, machbare Schritte. Weniger, dafür das Richtige.'},
  unclarity:{t:'Unklarheit',s:'Zuerst Klarheit schaffen – wenn das Ziel klar ist, kommt die Energie von selbst.'},
  lowenergy:{t:'Niedrige Energie',s:'Energie ist die Basis. Wir stärken zuerst Körper, Schlaf und Rhythmus.'},
  fear:{t:'Angst & Selbstzweifel',s:'Wir arbeiten an den Glaubenssätzen, die dich bremsen, und bauen kleine Erfolge auf.'},
  distraction:{t:'Ablenkung',s:'Fokus-Werkzeuge und klare Zeitblöcke schützen deine Aufmerksamkeit.'},
  procrastination:{t:'Aufschieben',s:'Mit der 2-Minuten-Regel und Pomodoro überwinden wir den Startwiderstand.'}
};

// Imperative Schritt-Bezeichnungen (Handlung statt "schon erledigt"-Formulierung)
const STEP_DO={
  vision_process:'Vision-Prozess durchführen',
  life_areas:'Lebensbereiche definieren',
  beliefs_done:'Glaubenssätze notieren',
  first_tasks:'Erste Aufgaben mit Lebensbereich anlegen',
  mit_used:'MIT-Methode anwenden (an 3 Tagen)',
  cal_used:'Aufgaben im Kalender einplanen',
  morning_done:'Morgenroutine machen',
  pomodoro_used:'Pomodoro 3× nutzen',
  evening_done:'Abendreflexion machen',
  wellbeing_tracked:'Wohlbefinden 3 Tage tracken',
  first_review:'Wochenrückblick durchführen',
  journal_7days:'Journal 7 Tage führen',
  analytics_checked:'Analytics ansehen',
  ai_coach_used:'FocusAI für Reflexion nutzen',
  quarterly_review:'Quartals-Review durchführen',
  beliefs_revisited:'Glaubenssätze nach 30 Tagen prüfen',
  comfort_map:'Komfortzone kartieren',
  comfort_challenge:'An 3 Tagen die Komfortzone verlassen'
};
function stepLabel(id,s){return STEP_DO[id]||(s&&s.title)||id;}
// "Warum bekomme ich diese Aufgabe?" – persönliche Begründung aus dem Testprofil
function personalWhy(stepId,p){
  p=p||{};const b=p.blocker;
  const M={
    vision_process:p.visionClarity==='low'?'Dein Test zeigt: Deine Vision ist noch unscharf – ohne klares Zielbild fehlt deinem Gehirn der Antrieb. Genau hier setzt dieser Schritt an.':'Dieser Schritt stärkt das Fundament, auf dem dein ganzer Weg aufbaut.',
    life_areas:'Dein Fokus liegt auf '+(LIFE_LABEL[p.goalArea]||'deinem Kernbereich')+' – klar definierte Lebensbereiche geben deinen Aufgaben Sinn und Richtung.',
    beliefs_done:(p.selfdoubt==='high'||b==='fear')?'Dein Test zeigt einen starken inneren Kritiker – Glaubenssätze zu benennen entzieht ihm die Macht.':'Verborgene Glaubenssätze bremsen leise. Sichtbar gemacht verlieren sie ihre Kraft.',
    first_tasks:b==='overwhelm'?'Deine größte Hürde ist Überforderung – wenige konkrete, sinnvolle Aufgaben wirken dem direkt entgegen.':'Konkrete Aufgaben übersetzen deine Ziele in Alltag – der Hebel vom Wollen ins Tun.',
    mit_used:b==='overwhelm'?'Dein Test zeigt Überforderung als größte Hürde – 3 Prioritäten pro Tag reduzieren genau das.':'Drei klare Prioritäten täglich schaffen Erfolgserlebnisse und schützen vor Verzetteln.',
    cal_used:'Geplantes wird deutlich seltener aufgeschoben – ein fester Zeitblock ist ein Versprechen an dich selbst.',
    morning_done:(p.energyBaseline==='low'||b==='lowenergy')?'Deine Energie ist laut Test dein Engpass – die Morgenroutine ist dein täglicher Energie-Generator.':'Ein bewusster Start richtet deinen Tag auf das aus, was dir wirklich wichtig ist.',
    pomodoro_used:b==='distraction'?'Ablenkung ist laut Test deine größte Hürde – 25-Minuten-Sprints schützen deine Aufmerksamkeit.':(b==='procrastination'?'Der Start ist dein kritischer Moment – Pomodoro macht ihn klein genug zum Anfangen.':'Kurze Fokus-Blöcke senken die Einstiegshürde spürbar.'),
    evening_done:'Die Abendreflexion ist der Lern-Loop deines Weges – hier erkennst du (und die App), was dich wirklich bremst.',
    wellbeing_tracked:(b==='lowenergy'||p.energyBaseline==='low')?'Dein Test zeigt niedrige Energie – erst die Daten zeigen, woran es liegt: Schlaf, Stress oder Bewegung.':'Wer seine Energie-Muster kennt, legt Schweres in starke Stunden.',
    first_review:'Der Wochenrückblick macht Muster sichtbar, bevor sie sich verfestigen – dein stärkstes Lernwerkzeug.',
    journal_7days:'7 Tage Protokoll zeigen dir Zusammenhänge, die im Alltag unsichtbar bleiben.',
    analytics_checked:'Deine eigenen Daten zeigen dir, wann und wie du am besten funktionierst.',
    ai_coach_used:(b==='fear'||p.selfdoubt==='high')?'Im geschützten Gespräch mit FocusAI kannst du Zweifel aussprechen und sortieren.':'FocusAI kennt dein Profil und deine Vision – nutze das für tiefere Reflexion.',
    quarterly_review:'Alle 90 Tage prüfen: Stimmt die Richtung noch? Das verhindert fleißiges Laufen in die falsche Richtung.',
    beliefs_revisited:'Nach Wochen echter Erfahrung zeigen sich neue Schichten deiner Glaubenssätze – und neue Freiheit.',
    comfort_map:(p.comfortZone&&p.comfortZone!=='none')?'Dein Test zeigt: Bei „'+(COMFORT_LABEL[p.comfortZone]||p.comfortZone)+'" bleibst du am liebsten in der Komfortzone. Sie zu kartieren ist der erste Schritt, sie bewusst zu erweitern.':'Deine Komfortzone zu kennen zeigt dir, wo Wachstum für dich gerade am leichtesten möglich ist.',
    comfort_challenge:(b==='fear'||p.selfdoubt==='high')?'Angst schrumpft durch Erfahrung, nicht durch Nachdenken. Kleine, sichere Mutproben bauen Beweise auf, dass du mehr kannst, als dein innerer Kritiker behauptet.':((p.comfortZone&&p.comfortZone!=='none')?'Gezielte Challenges im Bereich „'+(COMFORT_LABEL[p.comfortZone]||p.comfortZone)+'" erweitern genau die Grenze, die dich laut Test am meisten zurückhält.':'Regelmäßige kleine Grenzerweiterungen halten dich im Wachstum – Selbstvertrauen entsteht durch Handeln.')
  };
  return M[stepId]||'';
}

// ── Tutorial (mit Begründungen) ──
const TUTORIAL_SLIDES=[
  {icon:'👋',title:'Willkommen bei FocusFlow',text:'Dein persönlicher Begleiter für Life-Design und gegen Prokrastination. FocusFlow führt dich Schritt für Schritt – statt dich mit Funktionen zu erschlagen.',why:'Prokrastination ist meist eine Emotions-Reaktion, kein Zeitmanagement-Problem. Deshalb setzt FocusFlow bei Klarheit, Ausrichtung und Energie an.'},
  {icon:'🧭',title:'Mein Weg – deine geführte Strecke',text:'Nach einem kurzen Test bekommst du einen individuellen Pfad. Du siehst immer nur <strong>deinen aktuellen Schritt und die nächsten</strong> – klar und fokussiert.',why:'Fokus auf den einen nächsten Schritt schlägt endlose To-do-Listen. Weniger Optionen = weniger Überforderung = mehr Handeln.'},
  {icon:'🎯',title:'Ziele & Tagesziele',text:'Zerlege große Ziele in <strong>Meilensteine</strong> und wähle täglich max. 3 Hauptaufgaben, die wirklich zählen.',why:'Kleine Etappen und klare Prioritäten schaffen tägliche Erfolgserlebnisse – der stärkste Motor gegen Aufschieben.'},
  {icon:'⏱️',title:'Routinen & Fokus',text:'Morgen- und Abendroutine, Pomodoro-Timer und Wohlbefinden-Tracking geben deinem Tag Struktur und Energie.',why:'Energie ist keine Ressource, die man einfach hat – sie entsteht täglich durch Rituale und Rhythmus.'},
  {icon:'🤖',title:'FocusAI & deine Analyse',text:'Der KI-Coach kennt deine Vision und Ziele. Nach dem Test erhältst du eine <strong>psychologisch fundierte Analyse</strong> – gespeichert und herunterladbar in „Mein Bereich".',why:'Selbstkenntnis ist die Basis jeder echten Veränderung – und macht deinen Fortschritt über die Zeit sichtbar. Wichtig: FocusFlow ist ein Coaching-Werkzeug und ersetzt keine Psychotherapie.'},
  {icon:'🚀',title:'So startest du',text:'Gleich machst du einen kurzen Einstiegstest. Daraus baut FocusFlow deinen persönlichen Weg. Dieses Tutorial findest du jederzeit wieder unter „👤 Mein Bereich".',why:''}
];
let tutStep=0,tutFirstRun=false;
function openTutorial(firstRun){tutFirstRun=!!firstRun;tutStep=0;renderTutStep();document.getElementById('tutmod').style.display='block';}
function renderTutStep(){
  const s=TUTORIAL_SLIDES[tutStep];const isLast=tutStep===TUTORIAL_SLIDES.length-1;
  document.getElementById('tut-next').textContent=isLast?"Los geht's! 🚀":'Weiter ›';
  document.getElementById('tut-back').style.visibility=tutStep>0?'visible':'hidden';
  document.getElementById('tut-content').innerHTML=`<div style="font-size:3rem;text-align:center;margin-bottom:10px">${s.icon}</div><h2 style="text-align:center;font-size:1.3rem;font-weight:800;margin-bottom:10px">${s.title}</h2><div style="font-size:.92rem;line-height:1.65;color:var(--txt)">${s.text}</div>${s.why?`<div class="info-box info-blue" style="margin-top:14px">💡 <strong>Warum:</strong> ${s.why}</div>`:''}`;
  document.getElementById('tut-dots').innerHTML=TUTORIAL_SLIDES.map((_,i)=>`<div style="flex:1;height:4px;border-radius:2px;background:${i<=tutStep?'var(--p)':'var(--bo)'}"></div>`).join('');
}
function nextTut(){if(tutStep<TUTORIAL_SLIDES.length-1){tutStep++;renderTutStep();}else finishTutorial();}
function prevTut(){if(tutStep>0){tutStep--;renderTutStep();}}
function finishTutorial(){
  if(!D.vision)D.vision={};
  D.vision.tutorialSeen=true;try{saveProfile();}catch(e){}
  document.getElementById('tutmod').style.display='none';
  if(tutFirstRun&&!(D.vision.onboarding&&D.vision.onboarding.done))startOnboarding();
}
// Ersteinstieg: Tutorial (wenn ungesehen) → danach obligatorischer Test
function startAppIntro(){
  if(!UID)return;
  const tutSeen=D.vision&&D.vision.tutorialSeen;
  const obDone=D.vision&&D.vision.onboarding&&D.vision.onboarding.done;
  if(!tutSeen){openTutorial(true);return;}
  if(!obDone)startOnboarding();
}
function maybeStartOnboarding(){
  if(!UID)return;
  if(D.vision&&D.vision.onboarding&&D.vision.onboarding.done)return;
  startOnboarding();
}
function startOnboarding(){
  obStep=0;obAnswers={};
  // P8: Beim Re-Test die Vision reaktivieren – ehrlicher Abgleich mit dem Zielbild
  const ovl=document.getElementById('ob-vision-line');
  if(ovl){
    const aff=D.vision&&D.vision.affirmation;
    if(aff){ovl.style.display='block';ovl.textContent='💫 Deine Vision begleitet dich: „'+aff+'" – prüfe im Test ehrlich, was sich seither verändert hat.';}
    else ovl.style.display='none';
  }
  document.getElementById('ob-intro').style.display='block';
  document.getElementById('ob-quiz').style.display='none';
  document.getElementById('ob-result').style.display='none';
  document.getElementById('onboardmod').style.display='block';
}
function beginOnboarding(){
  document.getElementById('ob-intro').style.display='none';
  document.getElementById('ob-result').style.display='none';
  document.getElementById('ob-quiz').style.display='block';
  obQuestions=ONBOARD_QUESTIONS.slice();obFollowupsAdded=false;
  renderObStep();
}
function renderObStep(){
  const q=obQuestions[obStep];const n=obQuestions.length;
  document.getElementById('ob-counter').textContent='Frage '+(obStep+1)+(obFollowupsAdded?' (Vertiefung)':'')+' / '+n;
  const pct=Math.round(((obStep+1)/n)*100);
  document.getElementById('ob-pct').textContent=pct+'%';
  document.getElementById('ob-bar').style.width=pct+'%';
  document.getElementById('ob-question').textContent=q.q;
  const sub=document.getElementById('ob-sub');sub.textContent=q.sub||'';sub.style.display=q.sub?'block':'none';
  document.getElementById('ob-back-btn').style.visibility=obStep>0?'visible':'hidden';
  document.getElementById('ob-options').innerHTML=q.o.map(opt=>
    `<button class="ob-opt${obAnswers[q.id]===opt.v?' sel':''}" onclick="selectOb('${q.id}','${opt.v}')">${opt.label}</button>`).join('');
}
function selectOb(qid,v){
  obAnswers[qid]=v;renderObStep();
  setTimeout(()=>{
    if(obStep<obQuestions.length-1){obStep++;renderObStep();return;}
    // Ende der aktuellen Fragen erreicht: ggf. gezielte Vertiefungsfragen anhängen
    if(!obFollowupsAdded){
      obFollowupsAdded=true;
      const extra=ADAPTIVE_FOLLOWUPS.filter(f=>f.when(obAnswers)&&!(f.id in obAnswers));
      if(extra.length){obQuestions=obQuestions.concat(extra);obStep++;renderObStep();return;}
    }
    finishOnboarding();
  },180);
}
function prevOb(){if(obStep>0){obStep--;renderObStep();}}

function computeOnboardingProfile(a){
  return {
    goal:a.goal||'productivity',
    goalArea:a.area||'personal',
    visionClarity:a.visionClarity||'mid',
    blocker:a.blocker||'unclarity',
    energyBaseline:a.energy||'mid',
    timePerDay:a.time||'mid',
    consistency:a.consistency||'mid',
    reflection:a.reflection||'low',
    motivation:a.motivation||'growth',
    selfdoubt:a.selfdoubt||'mid',
    approach:a.approach||'',
    overwhelmType:a.overwhelm_type||'',
    energyCause:a.energy_cause||'',
    timeStyle:a.time_style||'',
    comfortZone:a.comfort||'none',
    comfortAppetite:a.comfort_appetite||'sanft'
  };
}
function computeJourney(p){
  const base=['vision_process','life_areas','beliefs_done','comfort_map','first_tasks','mit_used','cal_used','morning_done','pomodoro_used','evening_done','wellbeing_tracked','first_review','journal_7days','analytics_checked','comfort_challenge','ai_coach_used','quarterly_review','beliefs_revisited'];
  const boost={};base.forEach(id=>boost[id]=0);
  const add=(id,n)=>{if(boost[id]!=null)boost[id]+=n;};
  if(p.visionClarity==='high'){add('vision_process',-4);add('first_tasks',5);add('mit_used',5);}
  if(p.visionClarity==='low'){add('vision_process',6);add('life_areas',3);add('beliefs_done',2);}
  switch(p.blocker){
    case 'overwhelm':add('mit_used',8);add('first_tasks',5);add('pomodoro_used',4);break;
    case 'unclarity':add('vision_process',6);add('life_areas',5);add('first_tasks',3);break;
    case 'lowenergy':add('wellbeing_tracked',8);add('morning_done',5);break;
    case 'fear':add('beliefs_done',8);add('ai_coach_used',3);break;
    case 'distraction':add('pomodoro_used',8);add('morning_done',3);break;
    case 'procrastination':add('mit_used',6);add('pomodoro_used',5);add('first_tasks',3);break;
  }
  if(p.goal==='vision')add('vision_process',4);
  if(p.goal==='balance'){add('wellbeing_tracked',4);add('morning_done',3);}
  if(p.goal==='habits'){add('morning_done',4);add('evening_done',3);}
  if(p.energyBaseline==='low')add('wellbeing_tracked',3);
  if(p.consistency==='low'){add('morning_done',3);add('evening_done',2);}
  if(p.selfdoubt==='high')add('beliefs_done',3);
  // Adaptive Vertiefungsfragen verfeinern die Reihenfolge weiter
  if(p.approach==='clarity')add('vision_process',5);
  if(p.approach==='action'){add('first_tasks',5);add('mit_used',4);add('vision_process',-3);}
  if(p.overwhelmType==='toomany'){add('pomodoro_used',4);add('mit_used',2);}
  if(p.overwhelmType==='unclear'){add('mit_used',4);add('first_tasks',3);}
  if(p.timeStyle==='micro')add('morning_done',3);
  if(p.timeStyle==='block')add('pomodoro_used',3);
  if(p.energyCause==='sleep')add('wellbeing_tracked',3);
  if(p.energyCause==='stress'){add('wellbeing_tracked',2);add('evening_done',2);}
  if(p.energyCause==='body')add('wellbeing_tracked',2);
  // Komfortzone: Wachstum am Rand – Gewichtung nach Profil
  if(p.comfortZone&&p.comfortZone!=='none'){add('comfort_map',2);add('comfort_challenge',2);}
  else{add('comfort_map',-3);add('comfort_challenge',-3);}
  if(p.blocker==='fear'||p.selfdoubt==='high')add('comfort_map',3);
  if(p.motivation==='growth'){add('comfort_map',2);add('comfort_challenge',3);}
  if(p.comfortAppetite==='mutig')add('comfort_challenge',3);
  return base.map((id,i)=>({id,score:i-boost[id]})).sort((x,y)=>x.score-y.score).map(x=>x.id);
}
// Flacher Katalog aus den bestehenden PATH_STAGES (Titel/Aktion/Tab/Zeit + Stufen-Icon)
function journeyCatalog(){
  const cat={};
  PATH_STAGES.forEach(st=>st.steps.forEach(s=>{cat[s.id]={...s,icon:st.icon};}));
  return cat;
}
async function finishOnboarding(){
  document.getElementById('ob-quiz').style.display='none';
  const el=document.getElementById('ob-result');
  el.style.display='block';
  el.innerHTML='<div class="spinner" style="margin:10px auto 16px"></div><div style="font-size:1.05rem;font-weight:800;margin-bottom:6px">Deine Analyse wird erstellt…</div><div style="font-size:.85rem;color:var(--mu)">FocusAI wertet deine Antworten psychologisch aus.</div>';
  const p=computeOnboardingProfile(obAnswers);
  const journey=computeJourney(p);
  if(!D.vision)D.vision={};
  // P9: Re-Test-Anpassung protokollieren, wenn sich Kern-Annahmen ändern
  const prevOb=D.vision.onboarding;
  if(prevOb&&prevOb.done&&prevOb.profile&&(prevOb.profile.blocker!==p.blocker||prevOb.profile.goalArea!==p.goalArea)){
    if(!D.vision.pathAdjustLog)D.vision.pathAdjustLog=[];
    D.vision.pathAdjustLog.unshift({
      date:new Date().toISOString(),
      trigger:'Standort-Check (Re-Test)',
      oldA:'Hürde: '+((BLOCKER_INFO[prevOb.profile.blocker]||{}).t||prevOb.profile.blocker)+' · Fokus: '+(LIFE_LABEL[prevOb.profile.goalArea]||prevOb.profile.goalArea),
      newA:'Hürde: '+((BLOCKER_INFO[p.blocker]||{}).t||p.blocker)+' · Fokus: '+(LIFE_LABEL[p.goalArea]||p.goalArea),
      focus:''
    });
  }
  D.vision.onboarding={done:true,date:new Date().toISOString().split('T')[0],answers:{...obAnswers},profile:p,journey,aiIntro:''};
  // Psychologisch fundierte Analyse (best effort, mit Fallback)
  let analysisText='';
  try{analysisText=await generateAnalysis(p,obAnswers);}catch(e){console.error('analysis',e);analysisText=fallbackAnalysis(p);}
  if(!D.vision.analyses)D.vision.analyses=[];
  D.vision.analyses.unshift({date:new Date().toISOString(),profile:p,answers:{...obAnswers},text:analysisText});
  try{await saveProfile();}catch(e){console.error('saveProfile onboarding',e);}
  presentAnalysisResult(analysisText);
}
function presentAnalysisResult(text){
  const el=document.getElementById('ob-result');
  el.style.display='block';
  el.innerHTML=`<div style="text-align:left">
    <div style="font-size:1.3rem;font-weight:800;text-align:center;margin-bottom:2px">✨ Deine persönliche Analyse</div>
    <div style="font-size:.82rem;color:var(--mu);text-align:center;margin-bottom:16px">Psychologisch fundiert · aus deinen Antworten</div>
    <div class="md-body" style="max-height:50vh;overflow-y:auto;background:var(--bg);border:1px solid var(--bo);border-radius:var(--r2);padding:16px 18px">${mdToHtml(text)}</div>
    <button class="btnmain" style="margin-top:16px" onclick="finishOnboardingToJourney()">Weiter zu meinem Weg →</button>
    <div style="text-align:center;font-size:.78rem;color:var(--mu);margin-top:8px">Du findest deine Analysen jederzeit unter „👤 Mein Bereich".</div>
  </div>`;
}
function finishOnboardingToJourney(){
  document.getElementById('onboardmod').style.display='none';
  try{renderJourney();}catch(e){}
  showTab('journey',document.getElementById('tbtn-journey'));
  toast('🧭 Dein persönlicher Weg ist bereit!');
}

