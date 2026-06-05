import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAek46jg7U8LDcWAmZ5djZMDOeDPu-YvWU",
  authDomain: "sri-rama-chanting.firebaseapp.com",
  projectId: "sri-rama-chanting",
  storageBucket: "sri-rama-chanting.firebasestorage.app",
  messagingSenderId: "4251303862",
  appId: "1:4251303862:web:1da8dea845e368efd64b17",
  measurementId: "G-CV5QM9TFDZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// RUNTIME GLOBAL VARIABLES
var T = 1000, cells = [], rec = null, listening = false, lastT = 0, CD = 1000;
var todayN = 0, hist = {}, streak = {n: 0, last: ''}, currentGoal = 1000;
var currentCategory = 'general';
var firebaseUser = null;
var currentLang = 'te';
var sessionTimerRunning = false;
var sessionTimerInterval = null;
var sessionDuration = 10 * 60;
var sessionTimeLeft = sessionDuration;

const translations = {
  te: {
    headerTitle: '🪷 శ్రీరామ నామ 🪷', subtitle: 'వెయ్యి నామాల జప పుస్తకం', goalLabel: 'రోజువారీ లక్ష్యం',
    categoryLabel: 'సెషన్ రకం', durationLabel: 'జపం సమయం', timerLabel: 'సెషన్ టైమర్', remainLabel: 'మిగిలినవి',
    percentLabel: 'శాతం', totalLabel: 'మొత్తం', completeLabel: 'పూర్తి రోజులు', streakLabel: 'వరుస 🔥',
    addLabel: 'గణన', micLabel: 'మైక్', statsLabel: 'గణాంకాలు', resetLabel: 'రీసెట్', homeLabel: 'హోమ్',
    countLabel: 'గణన', statsNavLabel: 'స్టాట్‌లు', settingsLabel: 'సెట్టింగ్‌లు', modalTitle: 'శ్రీరామ జయరామ<br>జయ జయ రామ!',
    modalText: 'ఈ రోజు లక్ష్యం పూర్తయ్యాయి!<br>శ్రీరాముని కృప మీకు సదా లభించుటకు!', statsTitle: 'మీ గణాంకాలు',
    historyBtn: '📅 చరిత్ర ▼', gridTitle: '✦ శ్రీరామ నామ జప వీక్ష్యం ✦', dateHeader: 'తేదీ', countHeader: 'నామాలు',
    statusHeader: 'స్థితి', sessionStart: 'ప్రారంభించు', sessionStop: 'ఆపు', timerEnd: 'జపం కంప్లీట్ - శ్రీరామ జయరామ',
    backupLabel: '☁️ క్లౌడ్ బ్యాకప్:', settingsBoxTitle: '⚙️ సెట్టింగ్‌లు', themeGroupLabel: '✨ థీమ్ / Theme',
    durationGroupLabel: '⏰ జపం సమయం నిర్ణయించండి', closeSettingsBtn: '✕ మూసివేయు', dur5: '5 నిమిషాలు', dur10: '10 నిమిషాలు', dur15: '15 నిమిషాలు', dur20: '20 నిమిషాలు', dur30: '30 నిమిషాలు', readyText: '💾 సిద్ధం',
    ramaNames: ['రామ','రాం','రామ రామ','శ్రీ రామ','శ్రీరామ']
  },
  en: {
    headerTitle: '🪷 Sri Ram Names 🪷', subtitle: 'One Thousand Names Chanting Book', goalLabel: 'Daily Goal',
    categoryLabel: 'Session Type', durationLabel: 'Duration', timerLabel: 'Session Timer', remainLabel: 'Remaining',
    percentLabel: 'Percent', totalLabel: 'Total', completeLabel: 'Complete Days', streakLabel: 'Streak 🔥',
    addLabel: 'Count', micLabel: 'Mic', statsLabel: 'Stats', resetLabel: 'Reset', homeLabel: 'Home',
    countLabel: 'Count', statsNavLabel: 'Stats', settingsLabel: 'Settings', modalTitle: 'Sri Ram<br>Victory to Ram!',
    modalText: 'Daily goal completed!<br>Blessings of Lord Ram upon you!', statsTitle: 'Your Statistics',
    historyBtn: '📅 History ▼', gridTitle: '✦ Sri Ram Names Progress ✦', dateHeader: 'Date', countHeader: 'Names',
    statusHeader: 'Status', sessionStart: 'Start', sessionStop: 'Stop', timerEnd: 'Chanting Complete - Sri Ram!',
    backupLabel: '☁️ Cloud Backup:', settingsBoxTitle: '⚙️ Settings', themeGroupLabel: '✨ Theme / థీమ్',
    durationGroupLabel: '⏰ Set Chanting Duration', closeSettingsBtn: '✕ Close', dur5: '5 Minutes', dur10: '10 Minutes', dur15: '15 Minutes', dur20: '20 Minutes', dur30: '30 Minutes', readyText: '💾 Ready',
    ramaNames: ['ram','rama','ram ram','sri ram','shriram']
  },
  hi: {
    headerTitle: '🪷 श्री राम नाम 🪷', subtitle: 'हज़ार नामों की पूजा', goalLabel: 'दैनिक लक्ष्य',
    categoryLabel: 'सत्र प्रकार', durationLabel: 'अवधि', timerLabel: 'सत्र टाइमर', remainLabel: 'बचा हुआ',
    percentLabel: 'प्रतिशत', totalLabel: 'कुल', completeLabel: 'पूर्ण दिन', streakLabel: 'धारावाहिक 🔥',
    addLabel: 'गिनती', micLabel: 'माइक', statsLabel: 'आंकड़े', resetLabel: 'रीसेट', homeLabel: 'होम',
    countLabel: 'गिनती', statsNavLabel: 'आंकड़े', settingsLabel: 'सेटिंग्स', modalTitle: 'श्री राम जय राम<br>जय जय राम!',
    modalText: 'आज का लक्ष्य पूरा हुआ!<br>भगवान राम का आशीर्वाद आपको सदा मिले!', statsTitle: 'आपकी आंकड़े',
    historyBtn: '📅 इतिहास ▼', gridTitle: '✦ श्री राम नाम पूजा ✦', dateHeader: 'तारीख', countHeader: 'नाम',
    statusHeader: 'स्थिति', sessionStart: 'शुरू करें', sessionStop: 'रोकें', timerEnd: 'पूजा पूर्ण - श्री राम!',
    backupLabel: '☁️ क्लाउड बैकअप:', settingsBoxTitle: '⚙️ सेटिंग्स', themeGroupLabel: '✨ थीम / Theme',
    durationGroupLabel: '⏰ पूजा का समय निर्धारित करें', closeSettingsBtn: '✕ बंद करें', dur5: '5 मिनट', dur10: '10 मिनट', dur15: '15 मिनट', dur20: '20 मिनट', dur30: '30 मिनट', readyText: '💾 तैयार',
    ramaNames: ['राम','रामा','राम राम','श्री राम','श्रीराम']
  },
  ta: {
    headerTitle: '🪷 இராம் நாம் 🪷', subtitle: 'ஆயிரம் நாமாவலி பூஜை', goalLabel: 'தினசரி இலக்கு',
    categoryLabel: 'அமர்வு வகை', durationLabel: 'காலம்', timerLabel: 'அமர்வு நேர மணி', remainLabel: 'மீதம்',
    percentLabel: 'சதவீதம்', totalLabel: 'மொத்தம்', completeLabel: 'முடிந்த நாட்கள்', streakLabel: 'தொடர்ச்சி 🔥',
    addLabel: 'எண்ணு', micLabel: 'மைக்', statsLabel: 'புள்ளிவிபரங்கள்', resetLabel: 'மீட்டமை', homeLabel: 'முகப்பு',
    countLabel: 'எண்ணு', statsNavLabel: 'புள்ளிவிபரங்கள்', settingsLabel: 'அமைப்புகள்', modalTitle: 'இராம் ஜய இராம்<br>ஜய ஜய இராம்!',
    modalText: 'இன்றைய இலக்கு நிறைவேறிவிட்டது!<br>இறைவன் இராமனின் ஆசீர்வாதம் என்றுமே உன்னை அடைய வேண்டும்!', statsTitle: 'உங்கள் புள்ளிவிபரங்கள்',
    historyBtn: '📅 வரலாறு ▼', gridTitle: '✦ இராம் நாம பூஜை பிரகாரம் ✦', dateHeader: 'தேதி', countHeader: 'நாமாவலி',
    statusHeader: 'நிலை', sessionStart: 'தொடங்கு', sessionStop: 'நிறுத்து', timerEnd: 'பூஜை முடிந்தது - இராம் ஜய!',
    backupLabel: '☁️ கிளவுட் பேக்கப்:', settingsBoxTitle: '⚙️ அமைப்புகள்', themeGroupLabel: '✨ தீம் / Theme',
    durationGroupLabel: '⏰ ஜப நேரத்தை முடிவு செய்யுங்கள்', closeSettingsBtn: '✕ மூடு', dur5: '5 நிமிடங்கள்', dur10: '10 நிமிடங்கள்', dur15: '15 நிமிடங்கள்', dur20: '20 நிமிடங்கள்', dur30: '30 நிமிடங்கள்', readyText: '💾 தயார்',
    ramaNames: ['ram','rama','ram ram','sri ram']
  }
};

const quotes = {
  te: ['🙏 రోజూ ఆచరణ చేసిన సాధకుడు చివరకు నిశ్చయమైన ఫలాన్ని పొందుతాడు', '✨ ప్రతిదిన ఒక చిన్న ప్రయత్నం గతి చేస్తుంది', '🌟 వినీతసేవ ఏవిధం చేసిన జనుల్ని దేవుడు భాగ్యవంతులుచేస్తాడు'],
  en: ['🙏 Daily practice leads to certain results', '✨ Small efforts daily lead to success', '🌟 God blesses those who serve with humility'],
  hi: ['🙏 रोज़ का अभ्यास निश्चित परिणाम देता है', '✨ प्रतिदिन छोटे प्रयास सफलता की ओर ले जाते हैं', '🌟 भगवान विनम्रता से सेवा करने वालों को आशीर्वाद देते हैं'],
  ta: ['🙏 தினசரி பயிற்சி உறுதியான फलம் தரும்', '✨ தினந்தோறும் சிறிய முயற்சிகள் வெற்றிக்கு வழிவகுக்கும்', '🌟 கடவுள் பணிவுடன் சேவை செய்பவர்களை ஆசீர்வதிக்கிறார்']
};

// Background floaters initialization
var pc = document.getElementById('ptc');
for(var i = 0; i < 8; i++){
  var p = document.createElement('div');
  p.style.position = 'fixed'; p.style.color = 'rgba(255,215,0,0.08)';
  p.style.fontSize = (0.6 + Math.random() * 1.2) + 'rem';
  p.style.left = Math.random() * 100 + '%'; p.style.top = Math.random() * 50 + '%';
  p.style.animation = 'float linear infinite'; p.style.animationDuration = (10 + Math.random() * 20) + 's';
  p.style.animationDelay = (Math.random() * 15) + 's';
  p.textContent = ['రామ', 'శ్రీ', 'జయ', 'ॐ'][i % 4];
  pc.appendChild(p);
}
var fstyle = document.createElement('style');
fstyle.textContent = '@keyframes float { from { transform: translateY(100vh) rotate(0deg) scale(1); opacity: 0; } 10% { opacity: 0.3; } 90% { opacity: 0.3; } to { transform: translateY(-100vh) rotate(360deg) scale(0); opacity: 0; } }';
document.head.appendChild(fstyle);

var g = document.getElementById('grid');
function buildGrid(){
  g.innerHTML = ''; cells = [];
  for(var i = 0; i < T; i++){
    var c = document.createElement('div');
    c.className = 'cell'; c.innerHTML = '<span style="opacity:.15">రా</span>';
    g.appendChild(c); cells.push(c);
  }
}

function today(){ var d = new Date(); return d.getFullYear() + '-' + (d.getMonth()+1<10?'0':'')+(d.getMonth()+1) + '-' + (d.getDate()<10?'0':'')+d.getDate(); }

window.changeLanguage = function(lang){
  currentLang = lang; localStorage.setItem('lang', lang);
  var s = translations[currentLang] || translations.te;
  
  document.getElementById('headerTitle').textContent = s.headerTitle;
  document.getElementById('headerSubtitle').textContent = s.subtitle;
  document.getElementById('goalLabel').textContent = s.goalLabel;
  document.getElementById('durationLabel').textContent = s.durationLabel;
  document.getElementById('timerLabel').textContent = s.timerLabel;
  document.getElementById('remainLabel').textContent = s.remainLabel;
  document.getElementById('percentLabel').textContent = s.percentLabel;
  document.getElementById('totalLabel').textContent = s.totalLabel;
  document.getElementById('completeLabel').textContent = s.completeLabel;
  document.getElementById('streakLabel').textContent = s.streakLabel;
  document.getElementById('addLabel').textContent = s.addLabel;
  document.getElementById('micLabel').textContent = s.micLabel;
  document.getElementById('statsLabel').textContent = s.statsLabel;
  document.getElementById('resetLabel').textContent = s.resetLabel;
  document.getElementById('homeLabel').textContent = s.homeLabel;
  document.getElementById('countLabel').textContent = s.countLabel;
  document.getElementById('statsNavLabel').textContent = s.statsNavLabel;
  document.getElementById('settingsLabel').textContent = s.settingsLabel;
  document.getElementById('gridTitle').textContent = s.gridTitle;
  document.getElementById('dateHeader').textContent = s.dateHeader;
  document.getElementById('countHeader').textContent = s.countHeader;
  document.getElementById('statusHeader').textContent = s.statusHeader;
  document.getElementById('backupLabel').textContent = s.backupLabel;
  document.getElementById('settingsBoxTitle').textContent = s.settingsBoxTitle;
  document.getElementById('themeGroupLabel').textContent = s.themeGroupLabel;
  document.getElementById('durationGroupLabel').textContent = s.durationGroupLabel;
  document.getElementById('closeSettingsBtn').textContent = s.closeSettingsBtn;
  document.getElementById('dur5Label').textContent = s.dur5;
  document.getElementById('dur10Label').textContent = s.dur10;
  document.getElementById('dur15Label').textContent = s.dur15;
  document.getElementById('dur20Label').textContent = s.dur20;
  document.getElementById('dur30Label').textContent = s.dur30;
  document.getElementById('sessionToggle').textContent = sessionTimerRunning ? s.sessionStop : s.sessionStart;
  document.getElementById('saveStatus').textContent = s.readyText;

  var q = quotes[currentLang] || quotes.te;
  document.getElementById('quoteBox').textContent = q[Math.floor(Math.random() * q.length)];
};

function updateUI(){
  document.getElementById('todayCount').textContent = todayN;
  document.getElementById('goalDisplay').textContent = '/' + T;
  document.getElementById('todayRemain').textContent = Math.max(0, T - todayN);
  var pct = Math.round(todayN / T * 100) || 0;
  document.getElementById('todayPct').textContent = pct + '%';
  document.getElementById('progressRing').style.strokeDashoffset = 565.48 - (pct / 100) * 565.48;

  var total = 0, days = 0;
  var ks = Object.keys(hist);
  for(var i = 0; i < ks.length; i++){ var n = hist[ks[i]] || 0; total += n; if(n >= T) days++; }
  document.getElementById('ltTotal').textContent = total.toLocaleString('en-IN');
  document.getElementById('ltDays').textContent = days;
  document.getElementById('ltStreak').textContent = streak.n;
}

function refreshCellsUI(){
  for(var i = 0; i < todayN; i++){ if(cells[i]) { cells[i].innerHTML = 'శ్రీరామ'; cells[i].className = 'cell f'; } }
}

function renderHist(){
  var tb = document.getElementById('histbody'); tb.innerHTML = '';
  var ks = Object.keys(hist).sort().reverse();
  for(var i = 0; i < Math.min(ks.length, 15); i++){
    var d = ks[i], n = hist[d] || 0;
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + d + '</td><td>' + n + '</td><td>' + (n >= T ? '✅' : '⏳') + '</td>';
    tb.appendChild(tr);
  }
}

function setSaveStatus(cls, msg){
  var el = document.getElementById('saveStatus'); el.className = `status-bar status-${cls}`; el.textContent = msg;
}

async function cloudSave() {
  if (!firebaseUser) return;
  try {
    setSaveStatus('info', '⏳ Saving...');
    await setDoc(doc(db, "users", firebaseUser.uid), {
      todayCount: todayN,
      history: hist,
      streak: streak,
      currentGoal: T,
      lastSynced: new Date()
    }, { merge: true });
    var s = translations[currentLang] || translations.te;
    setSaveStatus('ok', s.readyText);
  } catch(e) { setSaveStatus('warn', '⚠️'); }
}

window.addOne = function(){
  if(todayN >= T) return;
  var c = cells[todayN];
  if(c) {
    c.innerHTML = 'శ్రీరామ'; c.className = 'cell f pop';
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator(); var gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = 900;
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.12);
    } catch(e){}
  }
  todayN++; hist[today()] = todayN;
  try {
    localStorage.setItem('SR_today', JSON.stringify({date: today(), count: todayN}));
    localStorage.setItem('SR_hist', JSON.stringify(hist));
  } catch(e){}
  updateUI(); renderHist(); cloudSave();
  if(todayN >= T){
    streak.n++; streak.last = today();
    try{ localStorage.setItem('SR_streak', JSON.stringify(streak)); }catch(e){}
    updateUI();
    document.getElementById('comptotal').textContent = '🙏 ' + document.getElementById('ltTotal').textContent + ' | ' + streak.n;
    document.getElementById('overlay').classList.add('show');
  }
};

window.setGoal = function(val){
  T = Math.max(1, Math.min(10000, parseInt(val) || 1000));
  document.getElementById('goalInput').value = T;
  localStorage.setItem('goal', T);
  buildGrid(); updateUI(); refreshCellsUI(); cloudSave();
};

window.resetToday = function(){
  if(!confirm('రీసెట్ చేయాలా?')) return;
  todayN = 0; hist[today()] = 0; buildGrid();
  try {
    localStorage.setItem('SR_today', JSON.stringify({date: today(), count: 0}));
    localStorage.setItem('SR_hist', JSON.stringify(hist));
  } catch(e){}
  updateUI(); renderHist(); cloudSave();
};

window.toggleTheme = function(){
  document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
};

window.toggleSettings = function(){ document.getElementById('settingsPanel').classList.toggle('show'); document.getElementById('languageSelect').value = currentLang; };
window.setDuration = function(mins){ sessionDuration = mins * 60; sessionTimeLeft = sessionDuration; updateTimerDisplay(); };
window.setCategory = function(cat) { currentCategory = cat; };
window.toggleHist = function(){ document.getElementById('histwrap').classList.toggle('open'); };
window.scrollToTop = function(){ document.querySelector('.container').scrollTo({top: 0, behavior: 'smooth'}); };

window.showStats = function(){
  var total = 0, days = 0, ks = Object.keys(hist);
  for(var i = 0; i < ks.length; i++){ var n = hist[ks[i]] || 0; total += n; if(n >= T) days++; }
  var avg = ks.length > 0 ? Math.round(total / ks.length) : 0;
  document.getElementById('statsBody').innerHTML = `<div style="display:grid;gap:12px;"><div>📊 Total: <b>${total}</b></div><div>📅 Days: <b>${days}</b></div><div>📈 Average: <b>${avg}</b></div></div>`;
  document.getElementById('statsModal').classList.add('show');
};
window.closeStats = function(){ document.getElementById('statsModal').classList.remove('show'); };

window.toggleSessionTimer = function(){
  sessionTimerRunning = !sessionTimerRunning;
  var s = translations[currentLang] || translations.te;
  document.getElementById('sessionToggle').textContent = sessionTimerRunning ? s.sessionStop : s.sessionStart;
  if(sessionTimerRunning){
    sessionTimerInterval = setInterval(function(){
      sessionTimeLeft--; updateTimerDisplay();
      if(sessionTimeLeft <= 0){
        clearInterval(sessionTimerInterval); sessionTimerRunning = false;
        document.getElementById('sessionToggle').textContent = s.sessionStart;
        sessionTimeLeft = sessionDuration; updateTimerDisplay();
      }
    }, 1000);
  } else { clearInterval(sessionTimerInterval); }
};

function updateTimerDisplay(){
  var m = Math.floor(sessionTimeLeft / 60), s = sessionTimeLeft % 60;
  document.getElementById('timerDisplay').textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
}

window.toggleMic = function(){
  if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)){ alert('Speech recognition not supported'); return; }
  listening ? stopMic() : startMic();
};

function startMic(){
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  rec = new SR(); rec.lang = 'te-IN'; rec.continuous = true;
  rec.onresult = function(e){
    var now = Date.now(); if(now - lastT < CD) return;
    for(var i = e.resultIndex; i < e.results.length; i++){
      var t = e.results[i][0].transcript.toLowerCase();
      var matchNames = translations[currentLang]?.ramaNames || translations.te.ramaNames;
      for (var k = 0; k < matchNames.length; k++) {
        if(t.indexOf(matchNames[k]) !== -1){ lastT = now; window.addOne(); break; }
      }
    }
  };
  rec.start(); listening = true; setSaveStatus('info', '🔴 మైక్ ఆన్ లో ఉంది...');
}
function stopMic(){ listening = false; if(rec){ rec.abort(); } var s = translations[currentLang] || translations.te; setSaveStatus('ok', s.readyText); }

// CLOUD RUNTIME HANDLERS
onAuthStateChanged(auth, async (user) => {
  if (user) {
    firebaseUser = user;
    document.getElementById('fb-user-display').textContent = user.displayName || "Devotee";
    document.getElementById('sync-logged-out').classList.add('hidden');
    document.getElementById('sync-logged-in').classList.remove('hidden');
    try {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        hist = Object.assign({}, cloudData.history, hist);
        if (cloudData.streak && cloudData.streak.n > streak.n) streak = cloudData.streak;
        if (cloudData.currentGoal) T = cloudData.currentGoal;
        let cloudTodayCount = cloudData.todayCount || 0;
        todayN = Math.max(todayN, cloudTodayCount);
        hist[today()] = todayN;
      }
    } catch(e) { console.error(e); }
  } else {
    firebaseUser = null;
    document.getElementById('sync-logged-out').classList.remove('hidden');
    document.getElementById('sync-logged-in').classList.add('hidden');
  }
  document.getElementById('goalInput').value = T;
  buildGrid(); updateUI(); refreshCellsUI(); renderHist();
});

document.getElementById('fb-signin-btn').addEventListener('click', () => { signInWithPopup(auth, provider); });
document.getElementById('fb-signout-btn').addEventListener('click', () => { signOut(auth).then(() => window.location.reload()); });

document.getElementById('languageSelect').addEventListener('change', (e) => { window.changeLanguage(e.target.value); });

// LOCAL HARDWARE BOOTSTRAP RECOVERY
try {
  var raw = localStorage.getItem('SR_today');
  if(raw){ var o = JSON.parse(raw); if(o.date === today()){ todayN = o.count || 0; } }
  var hr = localStorage.getItem('SR_hist'); if(hr){ hist = JSON.parse(hr); }
  var sr = localStorage.getItem('SR_streak'); if(sr){ streak = JSON.parse(sr); }
  var gCount = localStorage.getItem('goal'); if(gCount){ T = parseInt(gCount) || 1000; }
} catch(e){}

if(localStorage.getItem('theme') === 'light') document.body.classList.add('light-theme');
document.getElementById('themeSelect').value = localStorage.getItem('theme') || 'dark';
document.getElementById('themeSelect').onchange = function(){
  if(this.value === 'light') document.body.classList.add('light-theme');
  else document.body.classList.remove('light-theme');
  localStorage.setItem('theme', this.value);
};

document.getElementById('goalInput').value = T;
currentLang = localStorage.getItem('lang') || 'te';
document.getElementById('languageSelect').value = currentLang;

buildGrid();
window.changeLanguage(currentLang);
updateUI();
refreshCellsUI();
renderHist();
