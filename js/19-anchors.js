// FocusFlow · 19-anchors.js — 💎 Anker: Glaubenssätze & Erkenntnisse einfangen,
// destillieren (Kern-Anker max 5) und täglich niedrig dosiert wiedersehen.
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
//
// Psychologische Leitplanken (bewusste Entscheidungen, nicht ändern ohne Grund):
// - Nur SELBST formulierte Sätze; generische Affirmationen backfiren bei
//   niedrigem Selbstwert (Wood et al. 2009). Die App coacht Richtung Prozess-Form.
// - Verankert wird durch WENIGE Sätze (Kern max 5) + Verhaltens-Beweise,
//   nicht durch Masse. Zahlen werden bescheiden dargestellt ("3× hilfreich"),
//   keine Pseudo-Statistik. Der Score schlägt vor – der NUTZER entscheidet.

function anchorsData(){
  if(!D.vision)D.vision={};
  if(!Array.isArray(D.vision.anchors))D.vision.anchors=[];
  return D.vision.anchors;
}
function addAnchor(text,kind,source){
  const t=(text||'').trim().slice(0,300);
  if(!t)return null;
  const arr=anchorsData();
  const dupe=arr.find(a=>a.text.toLowerCase()===t.toLowerCase());
  if(dupe)return dupe;
  const a={id:Date.now(),text:t,kind:kind==='belief'?'belief':'insight',status:'test',created:new Date().toISOString(),shown:0,helped:0,lastShown:'',lastHelped:'',history:[],source:source||'manual'};
  arr.unshift(a);
  if(arr.length>100)arr.length=100;
  try{saveProfile();}catch(e){}
  return a;
}

// ── Schnell-Einfang (≤10 Sekunden, Muster: Ablenkungs-Parkplatz) ──
let anchorKind='insight',anchorSource='manual';
function openAnchorCapture(prefill,kind,source){
  anchorKind=kind==='belief'?'belief':'insight';
  anchorSource=source||'manual';
  const t=document.getElementById('anchor-text');if(t)t.value=prefill||'';
  const sub=document.getElementById('anchor-subtitle');
  if(sub)sub.textContent=source==='evening'
    ?'Aus deiner Abendreflexion – lohnt es sich, das festzuhalten?'
    :'Kurz festhalten, bevor es verfliegt – das Verankern übernimmt danach die App.';
  updateAnchorKindUI();
  document.getElementById('anchormod').style.display='flex';
  if(!prefill&&t)setTimeout(()=>{try{t.focus();}catch(e){}},80);
}
function setAnchorKind(k){anchorKind=k==='belief'?'belief':'insight';updateAnchorKindUI();}
function updateAnchorKindUI(){
  const bi=document.getElementById('ak-insight'),bb=document.getElementById('ak-belief');
  if(bi)bi.classList.toggle('sel',anchorKind==='insight');
  if(bb)bb.classList.toggle('sel',anchorKind==='belief');
  const hint=document.getElementById('anchor-form-hint');
  if(hint)hint.style.display=anchorKind==='belief'?'block':'none';
}
function saveAnchorCapture(){
  const t=((document.getElementById('anchor-text')||{}).value||'').trim();
  if(!t){toast('✍️ Schreib den Gedanken kurz auf.');return;}
  addAnchor(t,anchorKind,anchorSource);
  document.getElementById('anchormod').style.display='none';
  toast('💎 Festgehalten – rotiert ab jetzt als Impuls des Tages.');
  try{renderJourney();}catch(e){}
  try{renderMyBereich();}catch(e){}
}

// ── Impuls des Tages: EIN Satz, deterministisch je Tag, fair rotiert ──
function dailyImpulse(){
  const today=new Date().toISOString().split('T')[0];
  const arr=anchorsData().filter(a=>a.status!=='archive');
  const aff=(D.vision&&D.vision.affirmation)||'';
  if(!arr.length&&!aff)return null;
  if(!D.vision._impulse||D.vision._impulse.date!==today){
    // Am wenigsten kürzlich Gezeigtes zuerst (faire Exposition für die Destillation)
    const sorted=arr.slice().sort((x,y)=>String(x.lastShown||'').localeCompare(String(y.lastShown||'')));
    const pick=sorted[0]||null;
    const doy=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5);
    const useAff=!!aff&&(!pick||doy%3===0); // Vision-Affirmation bleibt Teil der Rotation
    D.vision._impulse={date:today,id:useAff?'aff':pick.id};
    if(!useAff&&pick){pick.shown=(pick.shown||0)+1;pick.lastShown=new Date().toISOString();}
    try{saveProfile();}catch(e){}
  }
  const sel=D.vision._impulse;
  if(sel.id==='aff')return aff?{text:aff,isAnchor:false}:null;
  const a=anchorsData().find(x=>x.id===sel.id&&x.status!=='archive');
  if(!a)return aff?{text:aff,isAnchor:false}:null;
  return {id:a.id,text:a.text,isAnchor:true,helpedToday:String(a.lastHelped||'').slice(0,10)===today};
}
// Verhaltens-Beweis der letzten 3 Tage – koppelt den Satz an echte Erfahrung
function recentProofText(){
  const cutoff=Date.now()-3*864e5;
  const ch=((D.vision&&D.vision.comfort&&D.vision.comfort.log)||[]).find(l=>new Date(l.date).getTime()>=cutoff);
  if(ch)return 'Challenge „'+esc(ch.text.slice(0,48))+(ch.text.length>48?'…':'')+'" gemeistert';
  let best=null;
  const pl=(D.vision&&D.vision.pathLog)||{};
  Object.keys(pl).forEach(id=>(pl[id]||[]).forEach(ts=>{const t=new Date(ts).getTime();if(t>=cutoff&&(!best||t>best.t))best={t,id};}));
  if(best){try{return 'Schritt „'+esc(stepLabel(best.id,journeyCatalog()[best.id]))+'" abgeschlossen';}catch(e){}}
  return '';
}
function impulseHtml(){
  const imp=dailyImpulse();if(!imp)return '';
  const proof=imp.isAnchor?recentProofText():'';
  const btn=imp.isAnchor
    ?(imp.helpedToday
      ?'<span style="font-size:.72rem;font-weight:700;color:#15803D;white-space:nowrap;align-self:center">✓ hilft</span>'
      :`<button onclick="anchorHelped(${imp.id})" title="Dieser Satz hat mir heute geholfen" style="flex-shrink:0;align-self:center;padding:4px 10px;border:1.5px solid var(--bo);background:#fff;border-radius:20px;font-size:.72rem;font-weight:700;color:var(--mu);cursor:pointer;white-space:nowrap">✓ hilft mir</button>`)
    :'';
  return `<div style="font-size:.84rem;font-style:italic;color:var(--txt);background:rgba(255,255,255,.65);border:1px solid var(--bo);border-radius:var(--r3);padding:8px 11px;margin-top:11px">
    <div style="display:flex;gap:8px">
      <div style="flex:1;min-width:0">${imp.isAnchor?'💎':'💫'} „${esc(imp.text)}"${proof?`<div style="font-size:.72rem;font-style:normal;color:var(--mu);margin-top:3px">Beweis: ${proof}</div>`:''}</div>
      ${btn}
    </div></div>`;
}
function anchorHelped(id){
  const a=anchorsData().find(x=>x.id===id);if(!a)return;
  a.helped=(a.helped||0)+1;a.lastHelped=new Date().toISOString();
  try{saveProfile();}catch(e){}
  toast('💎 Notiert. Solche Signale destillieren mit der Zeit deine Kern-Anker.');
  try{renderJourney();}catch(e){}
}
// Morgenroutine: der Satz des Tages ersetzt die starre Affirmation
function morningAnchorText(){
  try{const imp=dailyImpulse();if(imp&&imp.text)return imp.text;}catch(e){}
  return (D.vision&&D.vision.affirmation)||'Ich bin fokussiert und erschaffe mein bestes Leben.';
}

// ── Destillation: Kern-Anker (max 5), Schärfen mit Historie, Archiv ──
function promoteAnchor(id){
  const arr=anchorsData();const a=arr.find(x=>x.id===id);if(!a)return;
  if(arr.filter(x=>x.status==='core').length>=5){toast('💎 Bewusst maximal 5 Kern-Anker – stufe erst einen zurück oder archiviere ihn.');return;}
  a.status='core';
  try{saveProfile();}catch(e){}
  toast('💎 Zum Kern-Anker gemacht.');
  try{renderMyBereich();}catch(e){}
  try{renderJourney();}catch(e){}
}
function demoteAnchor(id){
  const a=anchorsData().find(x=>x.id===id);if(!a)return;
  a.status='test';
  try{saveProfile();}catch(e){}
  try{renderMyBereich();}catch(e){}
}
function archiveAnchor(id){
  const a=anchorsData().find(x=>x.id===id);if(!a)return;
  a.status='archive';
  try{saveProfile();}catch(e){}
  toast('🗄 Archiviert – ausmisten gehört zur Destillation.');
  try{renderMyBereich();}catch(e){}
  try{renderJourney();}catch(e){}
}
function sharpenAnchor(id){
  const a=anchorsData().find(x=>x.id===id);if(!a)return;
  const t=prompt('Formulierung schärfen (Prozess-Form trägt: „Ich lerne, …" / „Ich kann …, auch wenn …"):',a.text);
  if(t===null)return;
  const nt=t.trim().slice(0,300);
  if(!nt||nt===a.text)return;
  if(!Array.isArray(a.history))a.history=[];
  a.history.push(a.text);
  a.text=nt;
  try{saveProfile();}catch(e){}
  toast('✏️ Geschärft – die Wirkungs-Historie bleibt erhalten.');
  try{renderMyBereich();}catch(e){}
  try{renderJourney();}catch(e){}
}

// ── Verwaltung in „Mein Bereich" ──
function renderAnchorsSection(){
  const arr=anchorsData();
  const core=arr.filter(a=>a.status==='core');
  const test=arr.filter(a=>a.status==='test').sort((a,b)=>(b.helped||0)-(a.helped||0));
  const archive=arr.filter(a=>a.status==='archive');
  const row=a=>`<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--bo)">
    <div style="flex:1;min-width:0">
      <div style="font-size:.86rem;font-weight:600;line-height:1.45">${a.status==='core'?'💎':'🌱'} ${esc(a.text)}</div>
      <div style="font-size:.7rem;color:var(--mu);margin-top:2px">${a.kind==='belief'?'Glaubenssatz':'Erkenntnis'} · ${a.helped||0}× als hilfreich markiert · ${a.shown||0}× gezeigt${a.history&&a.history.length?' · '+a.history.length+'× geschärft':''}</div>
    </div>
    <div style="display:flex;gap:4px;flex-shrink:0">
      ${a.status==='core'
        ?`<button class="lbtn" title="Zurück in den Test" aria-label="Zurückstufen" onclick="demoteAnchor(${a.id})">↓</button>`
        :`<button class="lbtn" title="Zum Kern-Anker machen" aria-label="Zum Kern-Anker machen" onclick="promoteAnchor(${a.id})">💎</button>`}
      <button class="lbtn" title="Formulierung schärfen" aria-label="Schärfen" onclick="sharpenAnchor(${a.id})">✏️</button>
      <button class="lbtn" title="Archivieren" aria-label="Archivieren" onclick="archiveAnchor(${a.id})">🗄</button>
    </div>
  </div>`;
  return `<div class="sec"><div class="shdr"><div class="stitle">💎 Meine Anker</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="addbtn" style="padding:7px 12px;font-size:.8rem" onclick="openAnchorCapture()">+ Festhalten</button>
      <button onclick="openReflection('abc_reframe')" style="padding:7px 12px;border:2px solid var(--bo);background:#fff;border-radius:var(--r3);font-size:.78rem;font-weight:700;color:var(--mu);cursor:pointer">🧠 Gegen-Satz entwickeln</button>
    </div></div>
    <p class="sdesc">Wenige Sätze, die wirklich tragen – nicht viele. Deine Anker rotieren als „Impuls des Tages"; markierst du sie als hilfreich, destillieren sich über Wochen deine 3–5 Kern-Anker heraus. Die Zahlen schlagen vor – du entscheidest. Tipp: Beim Quartals-Review ausmisten.</p>
    ${core.length?`<div class="flbl" style="margin-bottom:4px">Kern-Anker (${core.length}/5)</div>`+core.map(row).join(''):''}
    ${test.length?`<div class="flbl" style="margin:${core.length?'12px':'0'} 0 4px">Im Test (${test.length})</div>`+test.map(row).join(''):''}
    ${!core.length&&!test.length?'<div class="empty">Noch keine Anker. Halte eine Erkenntnis fest (💎 in der Tagesleiste) oder entwickle einen Gegen-Satz.</div>':''}
    ${archive.length?`<div style="font-size:.72rem;color:var(--mu);margin-top:10px">🗄 ${archive.length} archiviert</div>`:''}
  </div>`;
}

// ── Attribution im Moment der Wahrheit (nach gemeisterter Challenge) ──
function anchorAttributionHtml(){
  const pool=anchorsData().filter(a=>a.status!=='archive')
    .sort((a,b)=>((b.status==='core')-(a.status==='core'))||((b.helped||0)-(a.helped||0)))
    .slice(0,4);
  if(!pool.length)return '';
  return `<div style="margin-top:4px">
    <div style="font-size:.88rem;font-weight:800;margin-bottom:8px">Hat dir dabei einer deiner Sätze geholfen?</div>
    <div style="display:flex;flex-direction:column;gap:7px">
      ${pool.map(a=>`<button class="ob-opt" onclick="anchorAttribute(${a.id})">${a.status==='core'?'💎':'🌱'} ${esc(a.text)}</button>`).join('')}
    </div>
    <button class="modal-close" onclick="closeComfortAfter()">Nein / weiter</button>
  </div>`;
}
function anchorAttribute(id){
  const a=anchorsData().find(x=>x.id===id);
  if(a){a.helped=(a.helped||0)+1;a.lastHelped=new Date().toISOString();try{saveProfile();}catch(e){}}
  closeComfortAfter();
  toast('💎 Notiert – dieser Satz gewinnt an Gewicht.');
}
function closeComfortAfter(){
  document.getElementById('comfortmod').style.display='none';
  try{renderJourney();}catch(e){}
  try{renderMyBereich();}catch(e){}
}

// ── Selbstvergebung nach Serien-Riss (Lapse): entlasten statt bestrafen ──
function dismissLapse(){
  if(D.vision)D.vision.lapse=null;
  try{saveProfile();}catch(e){}
  try{renderJourney();}catch(e){}
}
function lapseCardHtml(){
  const lp=D.vision&&D.vision.lapse;
  if(!lp||lp.date!==new Date().toISOString().split('T')[0])return '';
  const core=anchorsData().find(a=>a.status==='core')||anchorsData().find(a=>a.status!=='archive');
  return `<div class="sec" style="background:linear-gradient(135deg,#F0FDF4,#F4F6FB);border:1.5px solid #BBF7D0">
    <div style="font-weight:800;margin-bottom:4px">🤍 Deine Serie ist gerissen – und das ist okay.</div>
    <div style="font-size:.85rem;line-height:1.6">Die ${lp.lost} Tage davor sind nicht verloren – die Erfahrung bleibt in dir. Ein Aussetzer ist ein Datenpunkt, kein Urteil. Entscheidend ist nicht die Lücke, sondern der Wiedereinstieg – und der darf heute klein sein.</div>
    ${core?`<div style="font-size:.85rem;font-style:italic;background:rgba(255,255,255,.7);border:1px solid var(--bo);border-radius:var(--r3);padding:8px 11px;margin-top:9px">💎 „${esc(core.text)}"</div>`:''}
    <button class="addbtn" style="margin-top:11px" onclick="dismissLapse()">Weiter ab heute →</button>
  </div>`;
}
