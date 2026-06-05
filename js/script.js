// Firebase Integration setup via CDN Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your exact Firebase configuration keys
const firebaseConfig = {
  apiKey: "AIzaSyAek46jg7U8LDcWAmZ5djZMDOeDPu-YvWU",
  authDomain: "sri-rama-chanting.firebaseapp.com",
  projectId: "sri-rama-chanting",
  storageBucket: "sri-rama-chanting.firebasestorage.app",
  messagingSenderId: "4251303862",
  appId: "1:4251303862:web:1da8dea845e368efd64b17",
  measurementId: "G-CV5QM9TFDZ"
};

// Initialize backend instances
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// App core data definitions
let T = 1000, cells = [], rec = null, listening = false, lastT = 0, CD = 1000;
let todayN = 0, hist = {}, streak = {n: 0, last: ''}, currentGoal = 1000;
let currentCategory = 'general';
let currentLang = 'te';
let sessionTimerRunning = false;
let sessionTimerInterval = null;
let sessionDuration = 10 * 60; 
let sessionTimeLeft = sessionDuration;
let currentUser = null;

const strings = {
  te: {
    headerTitle: '🪷 శ్రీరామ నామ 🪷', subtitle: 'వెయ్యి నామాల జప పుస్తకం', goalLabel: 'రోజువారీ లక్ష్యం',
    categoryLabel: 'సెషన్ రకం', durationLabel: 'జపం సమయం', timerLabel: 'సెషన్ టైమర్', remainLabel: 'మిగిలినవి',
    percentLabel: 'శాతం', totalLabel: 'మొత్తం', completeLabel: 'పూర్తి రోజులు', streakLabel: 'వరుస 🔥',
    addLabel: 'గణన', micLabel: 'మైక్', statsLabel: 'గణాంకాలు', resetLabel: 'రీసెట్', homeLabel: 'హోమ్',
    countLabel: 'గణన', statsNavLabel: 'స్టాట్‌లు', settingsLabel: 'సెట్టింగ్‌లు', gridTitle: '✦ శ్రీరామ నామ జప వీక్ష్యం ✦',
    dateHeader: 'తేదీ', countHeader: 'నామాలు', statusHeader: 'స్థితి', sessionStart: 'ప్రారంభించు', sessionStop: 'ఆపు', timerEnd: 'జపం కంప్లీట్ - శ్రీరామ జయరామ'
  },
  en: {
    headerTitle: '🪷 Sri Ram Names 🪷', subtitle: 'One Thousand Names Chanting Book', goalLabel: 'Daily Goal',
    categoryLabel: 'Session Type', durationLabel: 'Duration', timerLabel: 'Session Timer', remainLabel: 'Remaining',
    percentLabel: 'Percent', totalLabel: 'Total', completeLabel: 'Complete Days', streakLabel: 'Streak 🔥',
    addLabel: 'Count', micLabel: 'Mic', statsLabel: 'Stats', resetLabel: 'Reset', homeLabel: 'Home',
    countLabel: 'Count', statsNavLabel: 'Stats', settingsLabel: 'Settings', gridTitle: '✦ Sri Ram Progress ✦',
    dateHeader: 'Date', countHeader: 'Names', statusHeader: 'Status', sessionStart: 'Start', sessionStop: 'Stop', timerEnd: 'Chanting Complete - Sri Ram!'
  }
};

const quotes = {
  te: ['🙏 రోజూ ఆచరణ చేసిన సాధకుడు చివరకు నిశ్చయమైన ఫలాన్ని పొందుతాడు', '✨ ప్రతిదిన ఒక చిన్న ప్రయత్నం గతి చేస్తుంది'],
  en: ['🙏 Daily practice leads to certain results', '✨ Small efforts daily lead to success']
};

// Initialize Particle graphics background
const pc = document.getElementById('ptc');
for(let i = 0; i < 8; i++){
  let p = document.createElement('div');
  p.style.position = 'fixed'; p.style.color = 'rgba(255,215,0,0.08)';
  p.style.fontSize = (0.6 + Math.random() * 1.2) + 'rem';
  p.style.left = Math.random() * 100 + '%'; p.style.top = Math.random() * 50 + '%';
  p.style.animation = 'float linear infinite'; p.style.animationDuration = (10 + Math.random() * 20) + 's';
  p.textContent = ['రామ', 'శ్రీ', 'జయ', 'ॐ'][i % 4];
  pc.appendChild(p);
}

const style = document.createElement('style');
style.textContent = '@keyframes float { from { transform: translateY(100vh) rotate(0deg); opacity: 0; } to { transform: translateY(-100vh) rotate(360deg); opacity: 0; } }';
document.head.appendChild(style);

// Provision graphic target nodes
const g = document.getElementById('grid');
function createGridElements() {
  g.innerHTML = ''; cells = [];
  for(let i = 0; i < T; i++){
    let c = document.createElement('div');
    c.className = 'cell'; c.innerHTML = '<span style="opacity:.15">రా</span>';
    g.appendChild(c); cells.push(c);
  }
}

// Visual layout rendering engine overrides
window.toggleTheme = function(){
  document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
};

function loadTheme(){
  if(localStorage.getItem('theme') === 'light') document.body.classList.add('light-theme');
  document.getElementById('themeSelect').value = localStorage.getItem('theme') || 'dark';
}

window.changeLanguage = function(lang){
  currentLang = lang; localStorage.setItem('lang', lang); updateLanguage(); updateQuote();
};

function updateLanguage(){
  let s = strings[currentLang] || strings.te;
  document.getElementById('headerTitle').textContent = s.headerTitle;
  document.getElementById('headerSubtitle').textContent = s.subtitle;
  document.getElementById('goalLabel').textContent = s.goalLabel;
  document.getElementById('categoryLabel').textContent = s.categoryLabel;
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
  document.getElementById('sessionToggle').textContent = sessionTimerRunning ? s.sessionStop : s.sessionStart;
}

window.toggleSettings = function(){ document.getElementById('settingsPanel').classList.toggle('show'); };

window.setDuration = function(mins){
  sessionDuration = mins * 60; sessionTimeLeft = sessionDuration; updateTimerDisplay();
};

window.toggleSessionTimer = function(){
  sessionTimerRunning = !sessionTimerRunning;
  let s = strings[currentLang] || strings.te;
  document.getElementById('sessionToggle').textContent = sessionTimerRunning ? s.sessionStop : s.sessionStart;
  if(sessionTimerRunning){
    sessionTimerInterval = setInterval(() => {
      sessionTimeLeft--; updateTimerDisplay();
      if(sessionTimeLeft <= 0){
        clearInterval(sessionTimerInterval); sessionTimerRunning = false;
        document.getElementById('sessionToggle').textContent = s.sessionStart;
      }
    }, 1000);
  } else { clearInterval(sessionTimerInterval); }
};

function updateTimerDisplay(){
  let m = Math.floor(sessionTimeLeft / 60), s = sessionTimeLeft % 60;
  document.getElementById('timerDisplay').textContent = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
}

window.setGoal = function(val){
  currentGoal = Math.max(1, Math.min(10000, parseInt(val) || 1000));
  T = currentGoal; document.getElementById('goalInput').value = currentGoal;
  createGridElements(); updateUI(); refreshCellsUI();
};

window.setCategory = function(cat){ currentCategory = cat; };
function today() { return new Date().toISOString().split('T')[0]; }

function setSaveStatus(cls, msg){
  let el = document.getElementById('saveStatus'); el.className = `status-bar status-${cls}`; el.textContent = msg;
}

// ═══ FIREBASE SYNCHRONIZATION ENGINES ═══
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    document.getElementById('fb-user-name').textContent = user.displayName || "Devotee";
    document.getElementById('fb-user-avatar').src = user.photoURL || "";
    document.getElementById('cloud-logged-out').classList.add('hidden');
    document.getElementById('cloud-logged-in').classList.remove('hidden');
    await pullFromFirestore();
  } else {
    currentUser = null;
    document.getElementById('cloud-logged-out').classList.remove('hidden');
    document.getElementById('cloud-logged-in').classList.add('hidden');
  }
});

document.getElementById('btn-login').addEventListener('click', () => {
  signInWithPopup(auth, provider).catch(err => console.error("Cloud Authentication Error: ", err));
});

document.getElementById('btn-logout').addEventListener('click', () => {
  signOut(auth).then(() => {
    todayN = 0; updateUI(); createGridElements();
  });
});

async function pushToFirestore() {
  if (!currentUser) return;
  try {
    setSaveStatus('info', '⏳ క్లౌడ్ సేవ్ అవుతోంది...');
    await setDoc(doc(db, "users", currentUser.uid), {
      todayCount: todayN,
      history: hist,
      streak: streak,
      currentGoal: currentGoal,
      lastSynced: new Date()
    }, { merge: true });
    setSaveStatus('ok', '✅ క్లౌడ్ సేవ్ అయింది');
  } catch (err) { setSaveStatus('warn', '⚠️ క్లౌడ్ సేవ్ విఫలమైంది'); }
}

async function pullFromFirestore() {
  if (!currentUser) return;
  try {
    const docSnap = await getDoc(doc(db, "users", currentUser.uid));
    if (docSnap.exists()) {
      const serverData = docSnap.data();
      hist = serverData.history || {};
      streak = serverData.streak || { n: 0, last: '' };
      if(serverData.currentGoal) { currentGoal = serverData.currentGoal; T = currentGoal; }
      
      let cloudTodayCount = serverData.todayCount || 0;
      todayN = Math.max(todayN, cloudTodayCount);
      
      createGridElements(); updateUI(); refreshCellsUI(); renderHist();
    } else { await pushToFirestore(); }
  } catch (err) { console.error(err); }
}

function updateUI(){
  document.getElementById('todayCount').textContent = todayN;
  document.getElementById('goalDisplay').textContent = '/' + T;
  document.getElementById('todayRemain').textContent = Math.max(0, T - todayN);
  let pct = Math.round((todayN / T) * 100) || 0;
  document.getElementById('todayPct').textContent = pct + '%';
  document.getElementById('progressRing').style.strokeDashoffset = 565.48 - (pct / 100) * 565.48;

  let total = 0, days = 0;
  Object.keys(hist).forEach(k => { total += hist[k]; if(hist[k] >= 1000) days++; });
  document.getElementById('ltTotal').textContent = total.toLocaleString('en-IN');
  document.getElementById('ltDays').textContent = days;
  document.getElementById('ltStreak').textContent = streak.n;
}

function refreshCellsUI(){
  for(let i=0; i<todayN; i++) { if(cells[i]) { cells[i].innerHTML = 'శ్రీరామ'; cells[i].className = 'cell f'; } }
}

window.addOne = function(){
  if(todayN >= T) return;
  let c = cells[todayN];
  if(c) {
    c.innerHTML = 'శ్రీరామ'; c.className = 'cell f pop';
    setTimeout(() => c.classList.remove('pop'), 600);
  }
  todayN++; hist[today()] = todayN;
  updateUI(); renderHist(); pushToFirestore();

  if(todayN >= T){
    streak.n++; streak.last = today();
    updateUI(); document.getElementById('overlay').classList.add('show');
  }
};

function renderHist(){
  let tb = document.getElementById('histbody'); tb.innerHTML = '';
  Object.keys(hist).sort().reverse().slice(0,15).forEach(d => {
    let tr = document.createElement('tr');
    tr.innerHTML = `<td>${d}</td><td>${hist[d]}</td><td>${hist[d] >= T ? '✅':'⏳'}</td>`;
    tb.appendChild(tr);
  });
}

window.toggleHist = function() { document.getElementById('histwrap').classList.toggle('open'); };
window.scrollToTop = function() { document.querySelector('.container').scrollTo({top:0, behavior:'smooth'}); };

window.resetToday = function(){
  if(!confirm('ఈ రోజు గణన రీసెట్ చేయాలా?')) return;
  todayN = 0; hist[today()] = 0; createGridElements(); updateUI(); renderHist(); pushToFirestore();
};

function updateQuote(){
  let q = quotes[currentLang] || quotes.te;
  document.getElementById('quoteBox').textContent = q[Math.floor(Math.random() * q.length)];
}

// Standard setup runs
createGridElements(); loadTheme(); changeLanguage('te'); updateQuote();
