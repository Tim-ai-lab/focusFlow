// FocusFlow · 09-reminders.js — In-App-/Browser-Erinnerungen
// Klassisches Script (kein ES-Modul): Top-Level-Deklarationen sind global. Ladereihenfolge: index.html.
// ── Erinnerungen (Browser-/In-App-Benachrichtigungen, solange App offen) ──
function getReminders(){return (D.vision&&D.vision.reminders)||{enabled:false,morning:'08:00',evening:'20:00'};}
async function toggleReminders(on){
  if(!D.vision)D.vision={};
  const r=getReminders();r.enabled=on;
  if(on&&'Notification'in window&&Notification.permission==='default'){try{await Notification.requestPermission();}catch(e){}}
  D.vision.reminders=r;saveProfile();startReminderLoop();
  toast(on?'🔔 Erinnerungen aktiviert':'Erinnerungen aus');
}
function setReminderTime(slot,val){if(!D.vision)D.vision={};const r=getReminders();r[slot]=val;D.vision.reminders=r;saveProfile();}
function fireNotification(title,body){
  try{if('Notification'in window&&Notification.permission==='granted'){new Notification(title,{body});return;}}catch(e){}
  toast(title+' – '+body);
}
function testReminder(){fireNotification('FocusFlow','🔔 So sehen deine Erinnerungen aus!');}
let reminderTimer=null;
function startReminderLoop(){
  if(reminderTimer){clearInterval(reminderTimer);reminderTimer=null;}
  if(!getReminders().enabled)return;
  reminderTimer=setInterval(checkReminders,60000);checkReminders();
}
function checkReminders(){
  const r=getReminders();if(!r.enabled||!UID)return;
  const now=new Date();
  const hm=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  const today=now.toISOString().split('T')[0];
  const dl=(D.dailyLog&&D.dailyLog[today])||{};
  const check=(slot,time,done,title,body)=>{
    if(!time||hm<time||done)return;
    const key='ff_rem_'+UID+'_'+today+'_'+slot;
    try{if(localStorage.getItem(key))return;localStorage.setItem(key,'1');}catch(e){}
    fireNotification(title,body);
  };
  check('morning',r.morning,!!dl.morning,'🌅 Morgenroutine','Starte deinen Tag mit Intention & Fokus.');
  check('evening',r.evening,!!dl.evening,'🌙 Abendreflexion','Zeit, deinen Tag zu reflektieren.');
}
