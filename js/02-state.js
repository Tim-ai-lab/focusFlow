// FocusFlow · 02-state.js — Zentraler Zustand (D, SESSION, UID) + DOM-/Datums-Helfer
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ═══════════════════════════════════════════════════════════════
// ── STATE ──  Zentrale Daten: D, SESSION, UID und UI-Zustand
// ═══════════════════════════════════════════════════════════════
let SESSION=null,UID=null,dFlt='all';
let calYear=new Date().getFullYear(),calMonth=new Date().getMonth();
let calView='month',dayViewDate=new Date().toISOString().split('T')[0];
let activeDayStr='',nowLineInterval=null,selectedLifeArea=null,morningStep=0;
let D={tasks:[],mitTasks:['','',''],mitDone:[false,false,false],diary:[],streak:0,lastDate:'',pomoSess:0,todayDone:0,todayScore:0,weekDone:[0,0,0,0,0,0,0],vision:{y5:'',y3:'',y1:'',values:'',affirmation:''},lifeAreas:{career:{vision:'',beliefs:''},health:{vision:'',beliefs:''},relations:{vision:'',beliefs:''},finance:{vision:'',beliefs:''},personal:{vision:'',beliefs:''},meaning:{vision:'',beliefs:''}},wellbeing:[],reviews:[],aiHistory:[]};

// ═══════════════════════════════════════════════════════════════
// ── HELPERS ──  DOM-Helfer, Datum- und Zeitformatierung
// ═══════════════════════════════════════════════════════════════
function gv(id){return document.getElementById(id).value.trim();}
function gs(id){return document.getElementById(id).value;}
function loading(on){document.getElementById('loading').style.display=on?'flex':'none';}
function setErr(m){document.getElementById('aerr').textContent=m;document.getElementById('aok').textContent='';}
function setOk(m){document.getElementById('aok').textContent=m;document.getElementById('aerr').textContent='';}
function fmtDate(d){if(!d)return '';return new Date(d+'T12:00:00').toLocaleDateString('de-DE',{day:'2-digit',month:'short'});}
function fmtTime(t){if(!t)return '';return t.slice(0,5);}
// Schützt Nutzereingaben (Aufgaben, Journal, Notizen …) vor HTML-Injection/Layout-Bruch.
function esc(s){return (s==null?'':String(s)).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function getWeekNum(d){const dt=new Date(d);const start=new Date(dt.getFullYear(),0,1);return Math.ceil(((dt-start)/864e5+start.getDay()+1)/7);}

