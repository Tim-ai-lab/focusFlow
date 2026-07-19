// FocusFlow · 11-vision.js — Vision-Prozess (6 Schritte), Lebensbereiche
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── VISION ──  Vision-Prozess (6 Schritte), Lebensbereiche
// ═══════════════════════════════════════════════════════════════
const VISION_STEPS=[
  {
    id:'deathbed',title:'⚰️ Die Sterbebett-Frage',subtitle:'Was wirklich zählt im Leben',
    systemPrompt:`Du begleitest den Nutzer durch die "Sterbebett-Frage" – eine der kraftvollsten Übungen der Positiven Psychologie (basierend auf Bronnie Wares Forschung zu den größten Lebensreue-Momenten und Viktor Frankls Logotherapie).

Dein Ziel: Den Nutzer tief in seine echten Werte und Prioritäten führen, fernab gesellschaftlicher Erwartungen.

Starte mit einer warmen, einladenden Einführung dieser Übung. Stelle dann die zentrale Frage: "Stell dir vor, du bist 85 Jahre alt und schaust auf dein Leben zurück. Was muss passiert sein – in deinen Beziehungen, deiner Arbeit, deinem inneren Leben – damit du mit einem Lächeln sagen kannst: Ich habe wirklich gelebt. Ich bereue nichts."

Wenn der Nutzer antwortet, vertiefe mit 2-3 Folgefragen wie:
- "Was davon wäre für dich das Allerwichtigste?"
- "Gibt es etwas das du heute tust das dich von diesem Leben wegführt?"
- "Welche Angst oder welcher Glaubenssatz hält dich davon ab?"

Sei einfühlsam, tiefgründig und ermutigend. Keine oberflächlichen Antworten akzeptieren – freundlich nachhaken. Antworte auf Deutsch, max 150 Wörter.`,
    startMessage:'👋 Willkommen beim Vision-Prozess! Ich werde dich durch 6 Schritte begleiten, die auf Erkenntnissen aus Positiver Psychologie, Logotherapie und Coaching basieren.\n\nWir beginnen mit der vielleicht kraftvollsten Frage überhaupt.\n\n**Stell dir vor: Du bist 85 Jahre alt, liegst in deinem Bett und schaust auf dein Leben zurück.**\n\nDein Körper ist ruhig, dein Geist klar. Neben dir sitzen die Menschen die dir wichtig sind.\n\nWas muss in deinem Leben passiert sein – in deinen Beziehungen, deiner Arbeit, deinem inneren Wachstum – damit du mit einem tiefen Lächeln sagen kannst:\n\n*„Ich habe wirklich gelebt. Ich bereue nichts."*\n\nNimm dir Zeit. Schreibe was dir wirklich in den Sinn kommt – ohne Filter.'
  },
  {
    id:'idealday',title:'☀️ Dein idealer Tag',subtitle:'Dein Leben in 5 Jahren konkret vorstellen',
    systemPrompt:`Du begleitest den Nutzer durch die "Idealer Tag"-Visualisierung – eine Technik aus dem Life Design (Stanford d.school) und dem mentalen Kontrastieren (Gabriele Oettingen, WOOP-Methode).

Ziel: Eine lebhafte, emotionale und konkrete Vorstellung des gewünschten Lebens entwickeln.

Bitte den Nutzer, seinen idealen Alltag in 5 Jahren so detailliert wie möglich zu beschreiben. Starte mit: "Es ist ein normaler Dienstag in deinem Leben in 5 Jahren. Du wachst auf..."

Frage konkret nach:
- Wo bist du physisch? Wie sieht deine Umgebung aus?
- Was machst du beruflich? Wie fühlt sich deine Arbeit an?
- Mit wem verbringst du Zeit? Wie sind deine Beziehungen?
- Wie ist dein Körper? Deine Energie? Dein Geist?
- Was hast du heute Abend erreicht? Wie schläfst du ein?

Hilf dem Nutzer, von abstrakten Wünschen zu konkreten, sinnlichen Bildern zu kommen. Frage nach Gefühlen, nicht nur Fakten. Antworte auf Deutsch, max 150 Wörter.`,
    startMessage:'☀️ Wunderbar. Jetzt machen wir das Abstrakte konkret.\n\n**Es ist ein ganz normaler Dienstag in deinem Leben – 5 Jahre von heute.**\n\nDein Wecker klingelt. Du öffnest die Augen.\n\nWo bist du? Wie riecht die Luft? Was siehst du als erstes? Wie fühlt sich dein Körper an wenn du aufstehst?\n\nBeschreibe mir diesen Tag so lebendig wie möglich – von dem Moment wo du aufwachst bis zu dem Moment wo du einschläfst.\n\nWas machst du? Mit wem? Wie fühlt sich deine Arbeit an? Wie sind deine Beziehungen? Was hast du am Abend erreicht?\n\n*Je konkreter und bildlicher, desto tiefer verankert sich deine Vision.*'
  },
  {
    id:'values',title:'💎 Deine Kernwerte',subtitle:'Was dir wirklich am wichtigsten ist',
    systemPrompt:`Du begleitest den Nutzer durch eine Werte-Klärung basierend auf ACT (Acceptance and Commitment Therapy, Steven Hayes) und Positive Psychologie (Martin Seligman).

Ziel: Die echten, tief verwurzelten Werte des Nutzers herausarbeiten – nicht die gesellschaftlich erwarteten.

Erkläre kurz den Unterschied zwischen Zielen (was wir haben wollen) und Werten (wie wir sein wollen). Werte sind Richtungen, keine Destinationen.

Frage den Nutzer:
- "In welchen Momenten deines Lebens hast du dich am lebendigsten gefühlt? Was war in diesen Momenten wichtig?"
- "Was bringt dich auf wenn du siehst dass es in der Welt fehlt?"
- "Wenn jemand deine Beerdigung hält – was sollen sie über dich sagen?"

Hilf dem Nutzer, aus seinen Antworten 5-7 Kernwerte zu destillieren. Wichtig: Hinterfrage ob es wirklich SEINE Werte sind oder übernommene Werte (von Eltern, Gesellschaft). Antworte auf Deutsch, max 150 Wörter.`,
    startMessage:'💎 Jetzt gehen wir tiefer.\n\nEs gibt einen wichtigen Unterschied den die meisten Menschen nie reflektieren:\n\n**Ziele** sind das was wir haben oder erreichen wollen.\n**Werte** sind das wie wir sein und leben wollen – jeden Tag, unabhängig von Ergebnissen.\n\nEine Vision die nicht aus echten Werten kommt, fühlt sich hohl an – und wird sabotiert.\n\nLass uns also deine echten Werte herausarbeiten.\n\n**Erste Frage:** Denk an die 3 Momente in deinem Leben wo du dich am lebendigsten, echtesten und erfülltesten gefühlt hast.\n\nWas war in diesen Momenten wichtig? Was hat diese Momente so besonders gemacht?\n\nNimm dir Zeit und beschreibe sie so genau du kannst.'
  },
  {
    id:'beliefs',title:'🧠 Limitierende Glaubenssätze',subtitle:'Was dich innerlich zurückhält',
    systemPrompt:`Du begleitest den Nutzer durch die Arbeit mit limitierenden Glaubenssätzen – basierend auf kognitiver Verhaltenstherapie (CBT), Narrative Therapy und Byron Katies "The Work".

Ziel: Unbewusste, sabotierende Überzeugungen aufdecken und transformieren.

Erkläre: Glaubenssätze sind Überzeugungen die wir über uns, andere und die Welt haben – meist unbewusst. Sie entstehen oft in der Kindheit und bestimmen was wir für möglich halten.

Frage den Nutzer:
- "Wenn du an deine Vision denkst – was sagt die kleine, kritische Stimme in dir sofort?"
- "Welche Sätze hörst du wenn du groß träumst? (Ich bin nicht gut genug / Das ist nicht für mich / Ich verdiene das nicht...)"
- "Woher kommen diese Überzeugungen? Von wem hast du sie übernommen?"

Dann führe durch eine sanfte Transformation: Ist dieser Glaubenssatz wirklich wahr? Was wäre möglich wenn du ihn loslässt? Wie würde ein ermächtigender Gegensatz klingen?

Sei besonders einfühlsam und nicht wertend. Antworte auf Deutsch, max 150 Wörter.`,
    startMessage:'🧠 Wir machen jetzt etwas was die meisten Menschen meiden – aber es ist vielleicht der wichtigste Schritt.\n\nJeder von uns trägt innere Stimmen mit sich. Überzeugungen die uns sagen was möglich ist und was nicht. Was wir verdienen und was nicht.\n\nDiese Glaubenssätze entstehen oft früh im Leben – durch Erfahrungen, durch Menschen die wir geliebt haben, durch Misserfolge die wir falsch interpretiert haben.\n\n**Und sie sabotieren unsere Vision – still und effektiv.**\n\nHier ist meine erste Frage:\n\nWenn du an deine Vision denkst – an das Leben das du wirklich führen willst – **was sagt die kritische, zweifelnde Stimme in dir sofort?**\n\nSchreibe die ersten Gedanken auf die kommen. Ohne Filter. Ich verspreche dir – wir werden sie gemeinsam transformieren.'
  },
  {
    id:'vision',title:'✍️ Deine Vision formulieren',subtitle:'In Gegenwartsform, mit Gefühl',
    systemPrompt:`Du begleitest den Nutzer beim Formulieren seiner Lebensvision – basierend auf Erkenntnissen aus dem Neurolinguistischen Programmieren (NLP), Positive Psychology (Seligman) und dem Konzept des "Future Self" (Benjamin Hardy).

Ziel: Eine kraftvolle, emotionale Vision in Gegenwartsform formulieren die das Nervensystem aktiviert.

Erkläre: Unser Gehirn unterscheidet nicht zwischen lebhaft vorgestellter und erlebter Realität (mentale Simulation). Gegenwartsform aktiviert andere neuronale Muster als Zukunftsform.

Hilf dem Nutzer basierend auf den vorigen Schritten eine Vision zu formulieren für:
- 1 Jahr (konkret, erreichbar, spürbar)
- 3 Jahre (mittelfristig, wachsend)
- 5 Jahre (groß, mutig, erfüllend)

Jede Vision soll:
- In der Gegenwartsform sein ("Ich bin / Ich habe / Ich erlebe")
- Ein Gefühl transportieren, nicht nur Fakten
- Aus den echten Werten kommen
- Spezifisch und bildlich sein

Wenn der Nutzer formuliert, hilf ihm zu verfeinern: "Kannst du das noch konkreter machen? Was fühlst du dabei?" Antworte auf Deutsch, max 150 Wörter.`,
    startMessage:'✍️ Jetzt kommt der Moment wo alles zusammenkommt.\n\nDu hast reflektiert was wirklich zählt. Du hast deinen idealen Tag beschrieben. Du kennst deine Werte. Du hast deine Glaubenssätze angeschaut.\n\nJetzt formulieren wir deine Vision – und wir tun es auf eine Weise die sich im Nervensystem verankert.\n\n**Wichtig:** Wir schreiben in der Gegenwartsform. Nicht "Ich will" oder "Ich werde" – sondern **"Ich bin", "Ich habe", "Ich lebe"**.\n\nUnser Gehirn verarbeitet das anders. Es fühlt sich vielleicht seltsam an – das ist gut so.\n\nStarten wir mit **einem Jahr von heute**.\n\nBeschreibe wer du in einem Jahr bist, was du erreichst hast, wie du dich fühlst – in Gegenwartsform, als wäre es schon Realität.\n\nWas kommt?'
  },
  {
    id:'affirmation',title:'💫 Deine Affirmation',subtitle:'Dein täglicher Anker',
    systemPrompt:`Du begleitest den Nutzer bei der Erstellung seiner persönlichen Affirmation – basierend auf Selbstaffirmationstheorie (Claude Steele), Neuroplastizität-Forschung und Dr. Shad Helmstettlers Arbeit zu "Self-Talk".

Ziel: Eine Affirmation die sich echt anfühlt, emotional resoniert und täglich gesprochen werden kann.

Erkläre: Affirmationen funktionieren nicht wenn sie sich leer oder gelogen anfühlen. Sie müssen:
- Im Einklang mit echten Werten sein
- Emotional resonieren ("Ich fühle" statt nur "Ich bin")
- Spezifisch genug sein um real zu wirken
- Kurz genug um täglich erinnerbar zu sein

Hilf dem Nutzer eine 2-3 Satz Affirmation zu entwickeln die seine Vision destilliert. Teste gemeinsam: "Wenn du das laut liest – wie fühlt es sich an? Klingt es wahr? Was würde es noch echter machen?"

Schließe den Prozess emotional ab: Beglückwünsche den Nutzer zu diesem wichtigen Schritt. Erkläre wie er die Affirmation täglich in der Morgenroutine nutzt. Antworte auf Deutsch, max 150 Wörter.`,
    startMessage:'💫 Letzter Schritt – und vielleicht der der am stärksten in deinen Alltag wirkt.\n\nDeine Affirmation ist nicht ein motivierender Spruch aus dem Internet. Sie ist **dein persönlicher Anker** – destilliert aus allem was du in diesem Prozess entdeckt hast.\n\nSie wird jeden Morgen in deiner Routine erscheinen. Du wirst sie lesen, atmen, fühlen.\n\nEine gute Affirmation:\n✓ Fühlt sich wahr an – nicht aufgesetzt\n✓ Transportiert ein Gefühl, nicht nur Worte\n✓ Erinnert dich wer du bist und sein willst\n✓ Ist kurz genug um sie täglich zu sagen\n\nBasierend auf allem was wir erarbeitet haben – **was ist der Kern? Wer bist du? Wofür stehst du?**\n\nVersuche einmal 2-3 Sätze zu formulieren die sich tief und wahr anfühlen.'
  }
];

let visionStep=0,visionConversations={},currentVisionConv=[];

function startVisionProcess(stepIdx=0){
  visionStep=stepIdx!==undefined?stepIdx:0;
  document.getElementById('vision-process-sec').style.display='block';
  document.getElementById('vision-ai-sec').style.display='block';
  document.getElementById('vision-summary-sec').style.display='none';
  openVisionStep(visionStep);
}
function closeVisionProcess(){
  document.getElementById('vision-ai-sec').style.display='none';
  updateVisionStepsOverview();
}
function openVisionStep(idx){
  visionStep=idx;
  const step=VISION_STEPS[idx];
  document.getElementById('vision-step-title').textContent=`Schritt ${idx+1}/6: ${step.title}`;
  document.getElementById('vision-step-subtitle').textContent=step.subtitle;
  // Progress dots
  document.getElementById('vision-step-progress').innerHTML=VISION_STEPS.map((_,i)=>`<div style="flex:1;height:5px;border-radius:3px;background:${i<idx?'var(--ok)':i===idx?'var(--p)':'var(--bo)'}"></div>`).join('');
  // Load or start conversation
  currentVisionConv=visionConversations[step.id]||[];
  const msgBox=document.getElementById('vision-ai-messages');
  if(currentVisionConv.length===0){
    // Start fresh with opening message
    msgBox.innerHTML=`<div class="vai-msg bot">${step.startMessage.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</div>`;
    currentVisionConv=[{role:'assistant',content:step.startMessage}];
  } else {
    msgBox.innerHTML=currentVisionConv.map(m=>`<div class="vai-msg ${m.role==='user'?'user':'bot'}">${m.content.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</div>`).join('');
  }
  document.getElementById('vision-ai-input').value='';
  msgBox.scrollTop=msgBox.scrollHeight;
}
async function sendVisionMessage(){
  const input=document.getElementById('vision-ai-input');
  const msg=input.value.trim();if(!msg)return;
  if(checkCrisis(msg)){showCrisisInfo();return;}
  const step=VISION_STEPS[visionStep];
  const btn=document.getElementById('vision-send-btn');btn.disabled=true;input.value='';
  const msgBox=document.getElementById('vision-ai-messages');
  msgBox.innerHTML+=`<div class="vai-msg user">${msg.replace(/\n/g,'<br>')}</div>`;
  const thinking=document.createElement('div');thinking.className='vai-msg thinking';thinking.textContent='✨ Denke nach...';msgBox.appendChild(thinking);
  msgBox.scrollTop=msgBox.scrollHeight;
  currentVisionConv.push({role:'user',content:msg});
  const system=step.systemPrompt+'\n\nNutzer-Kontext:\nBisherige Vision-Erkenntnisse: '+JSON.stringify(D.vision||{})+'\nKernwerte: '+(D.vision?.values||'noch nicht definiert');
  const reply=await callAI(currentVisionConv,system,1000,true);
  currentVisionConv.push({role:'assistant',content:reply||'Entschuldigung, bitte versuche es erneut.'});
  visionConversations[step.id]=[...currentVisionConv];
  thinking.remove();
  const text=reply||'⚠️ Keine Verbindung zur KI möglich. Bitte antworte weiter – ich speichere deine Eingaben.';
  msgBox.innerHTML+=`<div class="vai-msg bot">${text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</div>`;
  btn.disabled=false;msgBox.scrollTop=msgBox.scrollHeight;
}
async function saveVisionStepAndContinue(){
  const step=VISION_STEPS[visionStep];
  if(!D.vision)D.vision={};
  if(!D.vision.stepData)D.vision.stepData={};
  D.vision.stepData[step.id]=currentVisionConv.filter(m=>m.role==='user').map(m=>m.content).join('\n\n');
  if(step.id==='values'){const t=currentVisionConv.filter(m=>m.role==='user').map(m=>m.content).join(' ');D.vision.values=t.slice(0,500);}
  if(step.id==='affirmation'){const l=currentVisionConv.filter(m=>m.role==='user').pop();if(l)D.vision.affirmation=l.content.slice(0,300);}
  if(step.id==='vision'){const t=currentVisionConv.filter(m=>m.role==='user').map(m=>m.content).join('\n');D.vision.y5=t.slice(0,600);}
  // AI summary
  const summaryPrompt='Fasse die wichtigsten Erkenntnisse des Nutzers aus diesem Gespräch in 2-3 prägnanten Sätzen zusammen. Nur die Essenz, keine Fragen mehr. Beginne mit "Deine Kernerkenntnisse:"';
  const msgs=[...currentVisionConv,{role:'user',content:summaryPrompt}];
  const summary=await callAI(msgs,step.systemPrompt,300);
  if(summary){if(!D.vision.summaries)D.vision.summaries={};D.vision.summaries[step.id]=summary;}
  await saveProfile();
  toast('✅ Schritt gespeichert!');
  if(visionStep<VISION_STEPS.length-1){visionStep++;openVisionStep(visionStep);}
  else{
    // Fertigstellen nur, wenn im Prozess wirklich etwas beantwortet wurde
    const anyContent=Object.values(D.vision.stepData||{}).some(v=>v&&String(v).trim());
    if(!anyContent){toast('✍️ Beantworte mindestens eine Frage im Prozess, um ihn abzuschließen.');return;}
    closeVisionProcess();toast('🌟 Vision-Prozess abgeschlossen!');showVisionSummary();logStep('vision_process');
  }
  updateVisionStepsOverview();
  try{renderJourney();}catch(e){}
}
function updateVisionStepsOverview(){
  VISION_STEPS.forEach((step,i)=>{
    const card=document.getElementById('vstep-'+i);
    const status=document.getElementById('vstatus-'+i);
    const numEl=card?.querySelector('.vstep-num');
    const hasData=D.vision?.stepData?.[step.id];
    if(card){card.classList.toggle('completed',!!hasData);}
    if(status)status.textContent=hasData?'✓':'○';
    if(numEl&&hasData)numEl.style.background='var(--ok)';
  });
}
function showVisionSummary(){
  document.getElementById('vision-summary-sec').style.display='block';
  const el=document.getElementById('vision-summary-content');
  if(!D.vision||!D.vision.stepData){el.innerHTML='<div class="empty">Noch kein Vision-Prozess abgeschlossen.</div>';return;}
  const summaries=D.vision.summaries||{};
  const stepColors={deathbed:'#FEF9C3',idealday:'#DBEAFE',values:'#DCFCE7',beliefs:'#FEE2E2',vision:'#EDE9FE',affirmation:'#FFF7ED'};
  el.innerHTML=VISION_STEPS.map(step=>{
    const data=D.vision.stepData?.[step.id];
    const summary=summaries[step.id];
    if(!data&&!summary)return'';
    return`<div class="vision-summary-block" style="background:${stepColors[step.id]||'var(--bg)'}">
      <div style="font-size:.78rem;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:7px">${step.title}</div>
      ${summary?`<div style="font-size:.87rem;line-height:1.6;color:var(--txt)">${summary.replace(/\n/g,'<br>')}</div>`:''}
      ${D.vision.affirmation&&step.id==='affirmation'?`<div style="margin-top:10px;font-size:.95rem;font-weight:700;font-style:italic;color:#92400E;background:rgba(251,191,36,.2);border-radius:8px;padding:10px 13px">💫 "${D.vision.affirmation}"</div>`:''}
    </div>`;
  }).join('');
}
function hideVisionSummary(){document.getElementById('vision-summary-sec').style.display='none';}

function renderVision(){renderLifeGrid();updateVisionStepsOverview();}

function renderLifeGrid(){
  const doneCounts={};
  D.tasks.forEach(t=>{if(t.lifeArea&&t.done)doneCounts[t.lifeArea]=(doneCounts[t.lifeArea]||0)+1;});
  const totalCounts={};
  D.tasks.forEach(t=>{if(t.lifeArea)totalCounts[t.lifeArea]=(totalCounts[t.lifeArea]||0)+1;});
  document.getElementById('life-grid').innerHTML=LIFE_AREAS.map(la=>{
    const done=doneCounts[la.id]||0,total=totalCounts[la.id]||0;
    const pct=total?Math.round((done/total)*100):0;
    const sel=selectedLifeArea===la.id;
    return `<div class="life-card la-${la.id}${sel?' selected':''}" onclick="selectLifeArea('${la.id}')">
      <div class="life-card-icon">${la.icon}</div>
      <div class="life-card-name">${la.name}</div>
      <div class="life-card-desc">${la.desc}</div>
      <div class="life-card-prog"><div class="life-card-prog-fill" style="width:${pct}%"></div></div>
      <div style="font-size:.68rem;color:rgba(255,255,255,.75);margin-top:4px;font-weight:700">${done}/${total} Aufgaben · ${pct}%</div>
    </div>`;
  }).join('');
}
function selectLifeArea(id){
  selectedLifeArea=id;
  const la=LIFE_AREAS.find(x=>x.id===id);
  const det=document.getElementById('life-detail');
  det.style.display='block';
  document.getElementById('life-detail-label').textContent=la.icon+' '+la.name+' – Meine Vision & Glaubenssätze';
  document.getElementById('life-vision-input').value=D.lifeAreas[id]?.vision||'';
  document.getElementById('life-beliefs-input').value=D.lifeAreas[id]?.beliefs||'';
  renderLifeGrid();
}
async function saveLifeArea(){
  if(!selectedLifeArea)return;
  D.lifeAreas[selectedLifeArea]={vision:gv('life-vision-input'),beliefs:gv('life-beliefs-input')};
  if(gv('life-vision-input'))logStep('life_areas');
  if(gv('life-beliefs-input'))logStep('beliefs_done');
  await saveProfile();toast('✅ Lebensbereich gespeichert!');renderLifeGrid();try{renderJourney();}catch(e){}
}

