// FocusFlow · 15-ai.js — callAI (Edge-Function-Proxy), FocusAI-Chat, Kontext
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── AI ──  callAI, FocusAI-Chat, Kontext-Aufbau
// ═══════════════════════════════════════════════════════════════
// Anbieter-Wahl (Anthropic/OpenAI) – nur eine Präferenz, kein Secret.
function getAIProvider(){try{return localStorage.getItem('ff_ai_provider')||'anthropic';}catch(e){return 'anthropic';}}
function setAIProvider(p){try{localStorage.setItem('ff_ai_provider',p);}catch(e){}toast('KI-Anbieter: '+(p==='openai'?'OpenAI (GPT)':'Anthropic (Claude)'));}
function initAIProvider(){const el=document.getElementById('ai-provider');if(el)el.value=getAIProvider();}

// Ruft die Supabase Edge Function auf, die ihrerseits Anthropic/OpenAI
// kontaktiert. Der API-Key liegt als Supabase-Secret – nie im Browser.
// cache=true aktiviert Prompt-Caching im Proxy – nur bei Aufrufen sinnvoll,
// die denselben Prompt/Verlauf innerhalb weniger Minuten wiederholen
// (Vision-Prozess, FocusAI-Chat). Einmal-Aufrufe lassen es weg.
async function callAI(messages,system,maxTokens,cache){
  if(!SESSION)return null;
  try{
    const res=await fetchWithTimeout(SB_URL+'/functions/v1/ai-proxy',{
      method:'POST',
      headers:{
        'apikey':SB_KEY,
        'Authorization':'Bearer '+(SESSION?.access_token||SB_KEY),
        'Content-Type':'application/json'
      },
      body:JSON.stringify({provider:getAIProvider(),system,messages,max_tokens:maxTokens||1000,cache:!!cache})
    },30000);
    const text=await res.text();
    let data=null;try{data=text?JSON.parse(text):null;}catch{}
    if(!res.ok){console.warn('callAI failed:',res.status,data);return null;}
    return data&&data.text?data.text:null;
  }catch(e){
    console.warn('callAI error:',e.message);
    return null;
  }
}

// P10: Coaching ≠ Therapie – Krisensignale erkennen und auf echte Hilfe verweisen
const CRISIS_RE=/suizid|selbstmord|umbring|nicht mehr leben|leben nehmen|leben zu beenden|selbstverletz|ritzen|will sterben|sterben will|keinen ausweg|kein ausweg mehr/i;
function checkCrisis(text){return CRISIS_RE.test(String(text||''));}
function showCrisisInfo(){try{document.getElementById('crisismod').style.display='flex';}catch(e){}}

function getContext(){
  const vision=D.vision;
  const tasks=D.tasks.filter(t=>!t.done).slice(0,8).map(t=>t.name).join(', ');
  const lifeVisions=LIFE_AREAS.map(la=>D.lifeAreas[la.id]?.vision?`${la.name}: ${D.lifeAreas[la.id].vision}`:null).filter(Boolean).join('\n');
  const beliefs=LIFE_AREAS.map(la=>D.lifeAreas[la.id]?.beliefs?`${la.name}: ${D.lifeAreas[la.id].beliefs}`:null).filter(Boolean).join('\n');
  return `Du bist FocusAI, ein einfühlsamer, motivierender und weiser Lebenscoach. Du hilfst dem Nutzer dabei Prokrastination zu überwinden, seine Lebensvision zu schärfen und ein bewussteres, erfülltes Leben zu führen. Du sprichst auf Deutsch, bist direkt aber warmherzig, und gibst konkrete, umsetzbare Ratschläge.

KONTEXT DES NUTZERS:
Lebensvision (5 Jahre): ${vision?.y5||'Noch nicht definiert'}
Vision (1 Jahr): ${vision?.y1||'Noch nicht definiert'}
Kernwerte: ${vision?.values||'Noch nicht definiert'}
Affirmation: ${vision?.affirmation||'Noch nicht definiert'}

Lebensbereiche-Visionen:
${lifeVisions||'Noch nicht definiert'}

Limitierende Glaubenssätze:
${beliefs||'Noch nicht definiert'}

Offene Aufgaben: ${tasks||'Keine'}
Heutiger Streak: ${D.streak} Tage
Heute erledigt: ${D.todayDone} Aufgaben
Heutige Stimmung: ${todayMoodLabel()||'nicht angegeben'}${calmMode()?' – WICHTIG: Der Nutzer ist heute erschöpft/unmotiviert. Sei besonders ruhig und sanft, kein Hype, keine Ausrufezeichen. Schlage nur winzige, leichte Schritte vor und würdige, dass er überhaupt da ist.':''}

WICHTIG: Du bist ein Coach, kein Therapeut. Bei Anzeichen von akuter Krise, Selbstgefährdung oder schwerer Depression: Verweise einfühlsam auf professionelle Hilfe (Telefonseelsorge 0800 111 0 111, Notruf 112) statt normale Coaching-Aufgaben fortzusetzen.

Antworte einfühlsam, motivierend und konkret. Nutze manchmal Emojis. Halte Antworten fokussiert (max 250 Wörter).`;
}
let aiConversation=[];
function aiSuggest(msg){document.getElementById('ai-input').value=msg;sendAI();}
async function sendAI(){
  const input=document.getElementById('ai-input');const msg=input.value.trim();if(!msg)return;
  // Krisensignal: keine normale Coaching-Antwort, sondern Verweis auf echte Hilfe
  if(checkCrisis(msg)){
    input.value='';
    const box=document.getElementById('ai-messages');
    box.innerHTML+=`<div class="ai-msg user">${esc(msg)}</div><div class="ai-msg bot">💙 Danke, dass du das aussprichst – das braucht Mut. Was du beschreibst, klingt nach einer sehr schweren Last, und die gehört in Hände, die dafür ausgebildet sind. FocusFlow ist ein Coaching-Werkzeug, keine Therapie.<br><br>📞 <strong>Telefonseelsorge: 0800 111 0 111</strong> (kostenlos, anonym, rund um die Uhr)<br>🚨 In akuter Gefahr: <strong>Notruf 112</strong><br><br>Du bist nicht allein.</div>`;
    box.scrollTop=box.scrollHeight;
    showCrisisInfo();
    return;
  }
  const btn=document.getElementById('ai-send-btn');btn.disabled=true;input.value='';
  const msgs=document.getElementById('ai-messages');
  msgs.innerHTML+=`<div class="ai-msg user">${esc(msg)}</div>`;
  const thinking=document.createElement('div');thinking.className='ai-msg bot thinking';thinking.textContent='✨ Denke nach...';msgs.appendChild(thinking);
  msgs.scrollTop=msgs.scrollHeight;
  aiConversation.push({role:'user',content:msg});
  const reply=await callAI(aiConversation,getContext(),1000,true);
  aiConversation.push({role:'assistant',content:reply||'Entschuldigung, ich konnte keine Antwort generieren.'});
  if(reply)logStep('ai_coach_used'); // erst ein echtes Coaching-Gespräch zählt
  if(aiConversation.length>20)aiConversation=aiConversation.slice(-20);
  thinking.remove();
  const text=reply||'⚠️ KI momentan nicht erreichbar. Versuche es in einem Moment erneut.';
  msgs.innerHTML+=`<div class="ai-msg bot">${text.replace(/\n/g,'<br>')}</div>`;
  btn.disabled=false;msgs.scrollTop=msgs.scrollHeight;
}

