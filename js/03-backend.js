// FocusFlow · 03-backend.js — Supabase-Zugriff, Auth, Session-Persistenz, Laden/Speichern
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── DB ──  Alle Supabase-Aufrufe: sbFetch, sbAuth, fetchWithTimeout
// ═══════════════════════════════════════════════════════════════
async function fetchWithTimeout(url, opts={}, ms=FETCH_TIMEOUT){
  const ctrl=new AbortController();
  const timer=setTimeout(()=>ctrl.abort(),ms);
  try{
    const res=await fetch(url,{...opts,signal:ctrl.signal});
    clearTimeout(timer);
    return res;
  }catch(e){
    clearTimeout(timer);
    throw e;
  }
}

async function sbFetch(path,opts={},_retried){
  try{
    const res=await fetchWithTimeout(SB_URL+path,{
      ...opts,
      headers:{
        'apikey':SB_KEY,
        'Authorization':'Bearer '+(SESSION?.access_token||SB_KEY),
        'Content-Type':'application/json',
        'Prefer':'return=representation',
        ...(opts.headers||{})
      }
    });
    // Abgelaufenes Token? Einmal automatisch erneuern und Anfrage wiederholen.
    if(res.status===401&&!_retried&&SESSION){
      if(await refreshSession())return sbFetch(path,opts,true);
    }
    const text=await res.text();
    try{return{ok:res.ok,status:res.status,data:text?JSON.parse(text):null};}
    catch{return{ok:res.ok,status:res.status,data:null};}
  }catch(e){
    console.warn('sbFetch failed:',path,e.message);
    return{ok:false,status:0,data:null};
  }
}

async function sbAuth(path,body){
  try{
    const res=await fetchWithTimeout(SB_URL+'/auth/v1'+path,{
      method:'POST',
      headers:{'apikey':SB_KEY,'Content-Type':'application/json'},
      body:JSON.stringify(body)
    });
    return await res.json();
  }catch(e){
    console.warn('sbAuth failed:',e.message);
    return{error:{message:'Verbindung fehlgeschlagen. Bitte Internetverbindung prüfen.'}};
  }
}

// ═══════════════════════════════════════════════════════════════
// ── AUTH ──  Login, Registrierung, Passwort-Reset, Logout
// ═══════════════════════════════════════════════════════════════
function authTab(t){
  document.getElementById('lf').style.display=t==='login'?'block':'none';
  document.getElementById('rf').style.display=t==='register'?'block':'none';
  document.getElementById('resetf').style.display=t==='reset'?'block':'none';
  const help=document.getElementById('login-help');
  if(help)help.style.display='none';
  if(t!=='reset'){
    document.querySelectorAll('.atab').forEach((b,i)=>b.classList.toggle('on',(t==='login'&&i===0)||(t==='register'&&i===1)));
  }
  document.getElementById('aerr').textContent='';document.getElementById('aok').textContent='';
}

function togglePw(id,btn){
  const el=document.getElementById(id);if(!el)return;
  const show=el.type==='password';
  el.type=show?'text':'password';
  btn.textContent=show?'🙈':'👁';
  btn.setAttribute('aria-label',show?'Passwort verbergen':'Passwort anzeigen');
}

// Erkennt den Recovery-Link aus der Reset-E-Mail (Token im URL-Hash)
// und zeigt das "Neues Passwort"-Formular.
let recoveryToken=null;
function checkRecovery(){
  const hash=window.location.hash||'';
  if(hash.indexOf('type=recovery')===-1)return false;
  const params=new URLSearchParams(hash.replace(/^#/,''));
  const tok=params.get('access_token');
  if(!tok)return false;
  recoveryToken=tok;
  document.getElementById('lf').style.display='none';
  document.getElementById('rf').style.display='none';
  document.getElementById('resetf').style.display='none';
  const tabs=document.querySelector('.atabs');if(tabs)tabs.style.display='none';
  document.getElementById('newpwf').style.display='block';
  document.getElementById('auth').style.display='flex';
  document.getElementById('app').style.display='none';
  // Token aus der Adresszeile/Historie entfernen
  try{history.replaceState(null,'',window.location.pathname+window.location.search);}catch(e){}
  return true;
}
async function updatePassword(){
  const p1=gv('np1'),p2=gv('np2');
  if(!p1||!p2){setErr('Bitte beide Felder ausfüllen.');return;}
  if(p1.length<6){setErr('Passwort mind. 6 Zeichen.');return;}
  if(p1!==p2){setErr('Die Passwörter stimmen nicht überein.');return;}
  const btn=document.getElementById('newpw-btn');btn.disabled=true;btn.textContent='Speichern...';
  let ok=false;
  try{
    const res=await fetchWithTimeout(SB_URL+'/auth/v1/user',{
      method:'PUT',
      headers:{'apikey':SB_KEY,'Authorization':'Bearer '+recoveryToken,'Content-Type':'application/json'},
      body:JSON.stringify({password:p1})
    });
    ok=res.ok;
    if(!ok){const d=await res.json().catch(()=>null);setErr((d&&(d.msg||d.error_description||d.message))||'Konnte Passwort nicht ändern. Link evtl. abgelaufen.');}
  }catch(e){setErr('Verbindung fehlgeschlagen.');}
  btn.disabled=false;btn.textContent='Passwort speichern';
  if(!ok)return;
  recoveryToken=null;
  document.getElementById('newpwf').style.display='none';
  const tabs=document.querySelector('.atabs');if(tabs)tabs.style.display='flex';
  authTab('login');
  setOk('✅ Passwort geändert! Du kannst dich jetzt anmelden.');
}
async function resetPassword(){
  const e=gv('reset-email');
  if(!e){setErr('Bitte E-Mail-Adresse eingeben.');return;}
  const btn=document.getElementById('reset-btn');
  btn.disabled=true;btn.textContent='Senden...';
  const r=await sbAuth('/recover',{email:e});
  btn.disabled=false;btn.textContent='Link senden';
  if(r&&r.error){setErr(r.error.message||'Fehler beim Senden.');return;}
  setOk('✅ Falls ein Konto mit dieser E-Mail existiert, wurde ein Link zum Zurücksetzen gesendet. Prüfe dein Postfach.');
}
async function register(){
  const n=gv('rn'),e=gv('re'),p=gv('rp');
  if(!n||!e||!p){setErr('Bitte alle Felder ausfüllen.');return;}
  if(p.length<6){setErr('Passwort mind. 6 Zeichen.');return;}
  const btn=document.getElementById('reg-btn');btn.disabled=true;btn.textContent='Registrieren...';
  const r=await sbAuth('/signup',{email:e,password:p,data:{name:n}});
  btn.disabled=false;btn.textContent='Account erstellen';
  if(r.error){setErr(r.error.message);return;}
  setOk('✅ Bestätigungs-E-Mail gesendet! Bitte bestätigen, dann anmelden.');
}
// Übersetzt die verschiedenen Supabase-Fehlerformate in eine klare deutsche Meldung.
function authErrorMessage(r){
  if(!r)return 'Verbindung fehlgeschlagen. Bitte Internetverbindung prüfen.';
  const code=(r.error_code||r.error||'').toString();
  const raw=(r.error_description||r.msg||(r.error&&r.error.message)||r.message||'').toString();
  const txt=(code+' '+raw).toLowerCase();
  if(txt.includes('invalid login')||txt.includes('invalid_grant')||txt.includes('invalid_credentials')||txt.includes('invalid credentials'))
    return '❌ E-Mail oder Passwort ist falsch.';
  if(txt.includes('not confirmed')||txt.includes('email_not_confirmed'))
    return 'Bitte bestätige zuerst deine E-Mail-Adresse (Link in der Bestätigungs-Mail).';
  if(txt.includes('rate limit')||txt.includes('too many'))
    return 'Zu viele Versuche. Bitte warte einen Moment und versuche es erneut.';
  return raw||'Anmeldung fehlgeschlagen.';
}
// ── Session-Persistenz (eingeloggt bleiben über Reloads + Token-Refresh) ──
function saveSession(s){try{if(s&&s.refresh_token)localStorage.setItem('ff_session',JSON.stringify({refresh_token:s.refresh_token}));}catch(e){}}
function clearSession(){try{localStorage.removeItem('ff_session');}catch(e){}}
async function refreshSession(){
  let stored=null;try{stored=JSON.parse(localStorage.getItem('ff_session')||'null');}catch(e){}
  const rt=(SESSION&&SESSION.refresh_token)||(stored&&stored.refresh_token);
  if(!rt)return false;
  const r=await sbAuth('/token?grant_type=refresh_token',{refresh_token:rt});
  if(r&&r.access_token){SESSION=r;UID=r.user.id;saveSession(r);return true;}
  // Refresh-Token ungültig (z. B. abgemeldet) → verwerfen
  clearSession();
  return false;
}
async function tryRestoreSession(){
  let stored=null;try{stored=JSON.parse(localStorage.getItem('ff_session')||'null');}catch(e){}
  if(!stored||!stored.refresh_token)return;
  loading(true);
  const r=await sbAuth('/token?grant_type=refresh_token',{refresh_token:stored.refresh_token});
  if(r&&r.access_token){SESSION=r;UID=r.user.id;saveSession(r);await loadAndShow(r.user);}
  else{clearSession();loading(false);}
}
async function login(){
  const e=gv('le'),p=gv('lp');
  if(!e||!p){setErr('Bitte E-Mail und Passwort eingeben.');return;}
  const btn=document.getElementById('login-btn');btn.disabled=true;btn.textContent='Anmelden...';
  const r=await sbAuth('/token?grant_type=password',{email:e,password:p});
  btn.disabled=false;btn.textContent='Anmelden';
  if(!r||!r.access_token){setErr(authErrorMessage(r));return;}
  SESSION=r;UID=r.user.id;saveSession(r);await loadAndShow(r.user);
}
async function logout(){
  stopPomo();if(nowLineInterval)clearInterval(nowLineInterval);if(reminderTimer)clearInterval(reminderTimer);
  await sbFetch('/auth/v1/logout',{method:'POST'});
  SESSION=null;UID=null;clearSession();
  document.getElementById('app').style.display='none';
  document.getElementById('auth').style.display='flex';
  document.getElementById('le').value='';document.getElementById('lp').value='';
}
async function loadAndShow(user){
  loading(true);
  document.getElementById('upill').textContent='👤 '+(user.user_metadata?.name||user.email);
  document.getElementById('app').style.display='flex';
  document.getElementById('auth').style.display='none';
  setMorningGreeting();
  initAIProvider();
  try{await loadAllData();}catch(e){console.error('loadAllData',e);}
  loading(false);
  try{startAppIntro();}catch(e){console.error('appintro',e);}
  try{startReminderLoop();}catch(e){console.error('reminders',e);}
}

// ═══════════════════════════════════════════════════════════════
// ── LOAD / SAVE ──  Daten laden, speichern, Streak prüfen
// ═══════════════════════════════════════════════════════════════
// Wirft bei einem echten Verbindungs-/Serverfehler – damit loadAllData ihn
// sammeln und sichtbar anzeigen kann. Eine leere Tabelle (neuer Nutzer) ist
// KEIN Fehler.
function checkResp(r){
  if(r.ok)return r;
  if(r.status===0)throw new Error('keine Verbindung (Zeitüberschreitung)');
  if(r.status===401||r.status===403)throw new Error('Zugriff verweigert (HTTP '+r.status+' – Sitzung evtl. abgelaufen)');
  throw new Error('HTTP '+r.status);
}
async function loadAllData(){
  const jobs=[
    ['Aufgaben',loadTasks],
    ['Statistiken',loadStats],
    ['Journal',loadDiary],
    ['Tagesziele',loadMIT],
    ['Profil & Vision',loadProfile]
  ];
  const errors=[];
  await Promise.all(jobs.map(async([label,fn])=>{
    try{await fn();}
    catch(e){console.error('load '+label,e);errors.push(label+' ('+(e.message||e)+')');}
  }));
  checkStreak();generateRecurring();renderAll();
  try{trackAppOpen();}catch(e){console.error('trackAppOpen',e);}
  showDataError(errors);
}
async function loadTasks(){
  const r=checkResp(await sbFetch('/rest/v1/tasks?user_id=eq.'+UID+'&order=created_at.desc'));
  if(r.data)D.tasks=r.data.map(t=>({id:t.id,name:t.name,prio:t.prio,diff:t.diff,special:t.special||'',lifeArea:t.life_area||'',recurring:t.recurring||'',start:t.start_date||'',end:t.end_date||'',startTime:t.start_time||'',endTime:t.end_time||'',dep:t.dep||'',done:t.done,createdAt:t.created_at}));
}
async function loadStats(){
  const r=checkResp(await sbFetch('/rest/v1/stats?user_id=eq.'+UID));
  if(r.data&&r.data.length){const s=r.data[0];D.streak=s.streak||0;D.lastDate=s.last_date||'';D.pomoSess=s.pomo_sess||0;D.todayDone=s.today_done||0;D.todayScore=s.today_score||0;D.weekDone=s.week_done||[0,0,0,0,0,0,0];}
}
async function loadDiary(){
  const r=checkResp(await sbFetch('/rest/v1/diary?user_id=eq.'+UID+'&order=created_at.desc'));
  if(r.data)D.diary=r.data.map(d=>({id:d.id,habit:d.habit,trigger:d.trigger||'',strategy:d.strategy,cat:d.cat,date:d.date}));
}
async function loadMIT(){
  const r=checkResp(await sbFetch('/rest/v1/mit_tasks?user_id=eq.'+UID));
  if(r.data&&r.data.length){D.mitTasks=r.data[0].tasks||['','',''];D.mitDone=r.data[0].done||[false,false,false];}
}
async function loadProfile(){
  const r=checkResp(await sbFetch('/rest/v1/profiles?id=eq.'+UID));
  if(r.data&&r.data.length){
    const p=r.data[0];
    if(p.vision)D.vision=p.vision;
    if(p.life_areas)D.lifeAreas=p.life_areas;
    if(p.wellbeing)D.wellbeing=p.wellbeing;
    if(p.reviews)D.reviews=p.reviews;
    if(p.daily_log)D.dailyLog=p.daily_log;
  }
}
function showDataError(errors){
  const el=document.getElementById('data-error');if(!el)return;
  if(!errors||!errors.length){el.style.display='none';return;}
  document.getElementById('data-error-detail').innerHTML=
    'Fehlgeschlagen: '+errors.join(' · ')
    +'<br><span style="opacity:.85">Bitte Internetverbindung prüfen und auf „Erneut laden" klicken. Bleibt es bestehen, ist Supabase evtl. nicht erreichbar oder die Sitzung abgelaufen – dann bitte ab- und neu anmelden.</span>';
  el.style.display='block';
}
async function retryLoad(){
  loading(true);
  try{await loadAllData();}catch(e){console.error('retryLoad',e);}
  loading(false);
}
async function saveStats(){await sbFetch('/rest/v1/stats?user_id=eq.'+UID,{method:'POST',headers:{'Prefer':'resolution=merge-duplicates'},body:JSON.stringify({user_id:UID,streak:D.streak,last_date:D.lastDate,pomo_sess:D.pomoSess,today_done:D.todayDone,today_score:D.todayScore,week_done:D.weekDone})});}
async function saveMIT(){await sbFetch('/rest/v1/mit_tasks?user_id=eq.'+UID,{method:'POST',headers:{'Prefer':'resolution=merge-duplicates'},body:JSON.stringify({user_id:UID,tasks:D.mitTasks,done:D.mitDone})});}
async function saveProfile(){await sbFetch('/rest/v1/profiles?id=eq.'+UID,{method:'POST',headers:{'Prefer':'resolution=merge-duplicates'},body:JSON.stringify({id:UID,vision:D.vision,life_areas:D.lifeAreas,wellbeing:D.wellbeing,reviews:D.reviews,daily_log:D.dailyLog})});}

function checkStreak(){
  const today=new Date().toDateString();if(D.lastDate===today)return;
  const y=new Date();y.setDate(y.getDate()-1);
  const cont=D.lastDate===y.toDateString();
  // Selbstvergebung statt "What-the-hell-Effekt": Riss einer echten Serie
  // festhalten – "Mein Weg" entlastet dann einmalig, statt nur die 0 zu zeigen.
  if(!cont&&(D.streak||0)>=3&&D.lastDate){
    if(!D.vision)D.vision={};
    D.vision.lapse={date:new Date().toISOString().split('T')[0],lost:D.streak||0};
  }
  D.streak=cont?(D.streak||0)+1:0;
  D.lastDate=today;D.todayDone=0;D.todayScore=0;D.pomoSess=0;D.weekDone[new Date().getDay()]=0;
  // Tägliche Tagesziele (MIT) für den neuen Tag zurücksetzen – gestrige Haken verschwinden
  D.mitTasks=['','',''];D.mitDone=[false,false,false];
  saveStats();saveMIT();
}

