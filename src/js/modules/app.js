/**
 * Main Application Module
 * Orchestrates all modules and manages application state
 */

import { getConfig, setConfig } from './config.js';
import * as storage from './storage.js';
import { i18n } from './i18n.js';
import { achievements } from './achievements.js';
import { notifications } from './notifications.js';
import { haptics } from './haptics.js';
import { initFirebase, signInWithGoogle, signOutUser, syncToCloud, mergeCloudData, isLoggedIn } from './firebase.js';
import VirtualizedGrid from './grid.js';

class App {
  constructor() {
    // State
    this.todayCount = 0;
    this.history = {};
    this.streak = { n: 0, last: '' };
    this.goal = getConfig('app.defaultGoal');
    this.category = storage.loadCategory();
    this.duration = storage.loadDuration();
    this.sessionDuration = this.duration * 60;
    this.sessionTimeLeft = this.sessionDuration;
    this.sessionTimerRunning = false;
    this.sessionTimerInterval = null;
    this.lastVoiceTime = 0;
    this.voiceDebounce = getConfig('notifications.debounceMs');
    this.voiceRecognition = null;
    this.listening = false;

    // DOM elements (will be initialized in init())
    this.elements = {};

    // Grid
    this.grid = null;
  }

  /**
   * Initialize the application
   */
  async init() {
    this.cacheElements();
    this.loadState();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.initGrid();
    this.applyTheme();
    this.updateLanguage();
    this.updateUI();
    this.renderHistory();
    this.initModules();

    // Initialize Firebase
    await initFirebase();

    // Initialize haptics (requires user interaction)
    document.addEventListener('click', () => haptics.initAudioContext(), { once: true });
    document.addEventListener('keydown', () => haptics.initAudioContext(), { once: true });

    // Initialize notifications
    await notifications.init();

    // Check for date rollover
    this.verifyDateIntegrity();

    // Show install prompt if PWA supported
    this.checkPWAInstall();

    console.log('Sri Rama Chant Counter initialized');
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      // Progress
      todayCount: document.getElementById('todayCount'),
      goalDisplay: document.getElementById('goalDisplay'),
      todayRemain: document.getElementById('todayRemain'),
      todayPct: document.getElementById('todayPct'),
      progressRing: document.getElementById('progressRing'),

      // Stats
      ltTotal: document.getElementById('ltTotal'),
      ltDays: document.getElementById('ltDays'),
      ltStreak: document.getElementById('ltStreak'),

      // Settings
      goalInput: document.getElementById('goalInput'),
      categoryButtons: document.querySelectorAll('.cat-btn'),
      durationButtons: document.querySelectorAll('.dur-btn'),

      // Timer
      timerDisplay: document.getElementById('timerDisplay'),
      sessionToggle: document.getElementById('sessionToggle'),

      // Status
      saveStatus: document.getElementById('saveStatus'),

      // Buttons
      addBtn: document.querySelector('.btn-primary'),
      micBtn: document.querySelector('[onclick="window.toggleMic()"]'),
      statsBtn: document.querySelector('[onclick="window.showStats()"]'),
      resetBtn: document.querySelector('[onclick="window.resetToday()"]'),

      // History
      historyBtn: document.getElementById('historyBtn'),
      histwrap: document.getElementById('histwrap'),
      histbody: document.getElementById('histbody'),

      // Grid
      gridContainer: document.getElementById('grid'),

      // Modals
      overlay: document.getElementById('overlay'),
      comptotal: document.getElementById('comptotal'),
      statsModal: document.getElementById('statsModal'),
      statsBody: document.getElementById('statsBody'),

      // Settings panel
      settingsPanel: document.getElementById('settingsPanel'),
      languageSelect: document.getElementById('languageSelect'),
      themeSelect: document.getElementById('themeSelect'),
      reminderEnabled: document.getElementById('reminderEnabled'),
      reminderTime: document.getElementById('reminderTime'),
      reminderFreq: document.getElementById('reminderFreq'),

      // Firebase
      fbSigninBtn: document.getElementById('fb-signin-btn'),
      fbSignoutBtn: document.getElementById('fb-signout-btn'),
      syncLoggedOut: document.getElementById('sync-logged-out'),
      syncLoggedIn: document.getElementById('sync-logged-in'),
      fbUserDisplay: document.getElementById('fb-user-display'),

      // Quote
      quoteBox: document.getElementById('quoteBox')
    };
  }

  /**
   * Load state from storage
   */
  loadState() {
    const todayData = storage.loadTodayCount();
    this.todayCount = todayData.count;
    this.history = storage.loadHistory();
    this.streak = storage.loadStreak();
    this.goal = storage.loadGoal();
  }

  /**
   * Initialize virtualized grid
   */
  initGrid() {
    if (!this.elements.gridContainer) return;

    this.grid = new VirtualizedGrid('grid', {
      totalCells: this.goal,
      onCellClick: (index) => this.handleCellClick(index)
    });

    // Fill existing cells
    if (this.todayCount > 0) {
      this.grid.fillUpTo(this.todayCount);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Goal input
    if (this.elements.goalInput) {
      this.elements.goalInput.addEventListener('change', (e) => this.setGoal(e.target.value));
      this.elements.goalInput.value = this.goal;
    }

    // Category buttons
    this.elements.categoryButtons?.forEach(btn => {
      btn.addEventListener('click', () => this.setCategory(btn.dataset.category));
    });

    // Duration buttons
    this.elements.durationButtons?.forEach(btn => {
      btn.addEventListener('click', () => this.setDuration(parseInt(btn.dataset.duration)));
    });

    // Timer
    const timerBtn = document.querySelector('[onclick="window.toggleSessionTimer()"]');
    if (timerBtn) {
      timerBtn.addEventListener('click', () => this.toggleSessionTimer());
    }

    // History toggle
    if (this.elements.historyBtn) {
      this.elements.historyBtn.addEventListener('click', () => this.toggleHistory());
    }

    // Settings panel
    const settingsBtn = document.querySelector('[onclick="window.toggleSettings()"]');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.toggleSettings());
    }

    // Theme select
    if (this.elements.themeSelect) {
      this.elements.themeSelect.value = storage.loadTheme();
      this.elements.themeSelect.addEventListener('change', (e) => this.setTheme(e.target.value));
    }

    // Language select
    if (this.elements.languageSelect) {
      this.elements.languageSelect.value = i18n.getLanguage();
      this.elements.languageSelect.addEventListener('change', (e) => this.changeLanguage(e.target.value));
    }

    // Reminder settings
    if (this.elements.reminderEnabled) {
      const reminderSettings = storage.loadReminderSettings();
      this.elements.reminderEnabled.checked = reminderSettings.enabled;
      this.elements.reminderTime.value = reminderSettings.time;
      this.elements.reminderFreq.value = reminderSettings.frequency;

      this.elements.reminderEnabled.addEventListener('change', () => this.updateReminders());
      this.elements.reminderTime.addEventListener('change', () => this.updateReminders());
      this.elements.reminderFreq.addEventListener('change', () => this.updateReminders());
    }

    // Firebase auth
    if (this.elements.fbSigninBtn) {
      this.elements.fbSigninBtn.addEventListener('click', () => signInWithGoogle());
    }
    if (this.elements.fbSignoutBtn) {
      this.elements.fbSignoutBtn.addEventListener('click', () => signOutUser().then(() => location.reload()));
    }

    // Subscribe to language changes
    i18n.subscribe(() => this.updateLanguage());

    // Handle resize for grid
    window.addEventListener('resize', () => {
      if (this.grid) this.grid.handleResize();
    });
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          this.addChant();
          break;
        case 'KeyR':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.resetToday();
          }
          break;
        case 'KeyH':
          this.toggleHistory();
          break;
        case 'KeyS':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.showStats();
          }
          break;
        case 'KeyM':
          this.toggleMic();
          break;
        case 'Escape':
          this.closeModals();
          break;
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
          this.setCategory(['morning', 'evening', 'meditation', 'general'][parseInt(e.code.slice(-1)) - 1]);
          break;
      }
    });
  }

  /**
   * Initialize modules
   */
  initModules() {
    // Set initial quote
    if (this.elements.quoteBox) {
      this.elements.quoteBox.textContent = i18n.getQuote();
    }

    // Set duration display
    this.updateTimerDisplay();
  }

  /**
   * Apply saved theme
   */
  applyTheme() {
    const theme = storage.loadTheme();
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    }
  }

  /**
   * Update all UI text for current language
   */
  updateLanguage() {
    const t = i18n.getAll();

    // Update all translatable elements
    const translations = {
      headerTitle: 'appTitle',
      headerSubtitle: 'appSubtitle',
      goalLabel: 'goal',
      categoryLabel: 'category',
      durationLabel: 'duration',
      timerLabel: 'timer',
      remainLabel: 'chants',
      percentLabel: 'progress',
      totalLabel: 'total',
      completeLabel: 'days',
      streakLabel: 'streak',
      addLabel: 'addChant',
      micLabel: 'mic',
      statsLabel: 'stats',
      resetLabel: 'reset',
      homeLabel: 'home',
      countLabel: 'count',
      statsNavLabel: 'stats',
      settingsLabel: 'settings',
      gridTitle: 'gridVisualization',
      dateHeader: 'date',
      countHeader: 'chants',
      statusHeader: 'status',
      sessionToggle: this.sessionTimerRunning ? 'pause' : 'start'
    };

    Object.entries(translations).forEach(([elementId, key]) => {
      const el = document.getElementById(elementId);
      if (el && t[key]) {
        if (elementId === 'sessionToggle') {
          el.textContent = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Update placeholders
    if (this.elements.goalInput) {
      this.elements.goalInput.placeholder = t.goal;
    }

    // Update quote
    if (this.elements.quoteBox) {
      this.elements.quoteBox.textContent = i18n.getQuote();
    }
  }

  /**
   * Update UI elements
   */
  updateUI() {
    if (!this.elements.todayCount) return;

    this.elements.todayCount.textContent = this.todayCount;
    this.elements.goalDisplay.textContent = '/' + this.goal;
    this.elements.todayRemain.textContent = Math.max(0, this.goal - this.todayCount);

    const pct = this.goal > 0 ? Math.round((this.todayCount / this.goal) * 100) : 0;
    this.elements.todayPct.textContent = pct + '%';

    if (this.elements.progressRing) {
      this.elements.progressRing.style.strokeDashoffset = 565.48 - (pct / 100) * 565.48;
    }

    // Calculate stats
    let total = 0, days = 0;
    Object.values(this.history).forEach(n => {
      total += n;
      if (n >= this.goal) days++;
    });

    this.elements.ltTotal.textContent = total.toLocaleString('en-IN');
    this.elements.ltDays.textContent = days;
    this.elements.ltStreak.textContent = this.streak.n;
  }

  /**
   * Render history table
   */
  renderHistory() {
    if (!this.elements.histbody) return;

    this.elements.histbody.innerHTML = '';
    const dates = Object.keys(this.history).sort().reverse();

    dates.slice(0, 15).forEach(date => {
      const count = this.history[date] || 0;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${date}</td><td>${count}</td><td>${count >= this.goal ? '✅' : '⏳'}</td>`;
      this.elements.histbody.appendChild(tr);
    });
  }

  /**
   * Verify date integrity (handle rollover)
   */
  verifyDateIntegrity() {
    const today = storage.getTodayString();
    const todayData = storage.loadTodayCount();

    if (todayData.date !== today) {
      // Archive yesterday's count
      this.history[todayData.date] = todayData.count;
      storage.saveHistory(this.history);

      // Reset today
      this.todayCount = 0;
      this.history[today] = 0;
      storage.saveTodayCount(0);

      // Rebuild grid
      if (this.grid) {
        this.grid.reset();
      }

      this.updateUI();
      this.renderHistory();
    }
  }

  /**
   * Add a chant
   */
  addChant() {
    this.verifyDateIntegrity();

    if (this.todayCount >= this.goal) return;

    // Visual feedback
    if (this.grid) {
      this.grid.fillCell(this.todayCount, true);
    }

    // Haptic & sound
    haptics.mediumHaptic();
    haptics.playChantSound();

    // Update state
    this.todayCount++;
    this.history[storage.getTodayString()] = this.todayCount;

    storage.saveTodayCount(this.todayCount);
    storage.saveHistory(this.history);

    this.updateUI();
    this.renderHistory();

    // Check achievements
    const totalChants = Object.values(this.history).reduce((a, b) => a + b, 0);
    achievements.checkAchievements(totalChants);

    // Sync to cloud
    if (isLoggedIn()) {
      this.syncToCloud();
    }

    // Check goal completion
    if (this.todayCount >= this.goal) {
      this.onGoalReached();
    }
  }

  /**
   * Handle cell click
   */
  handleCellClick(index) {
    if (index < this.todayCount) return;
    this.addChant();
  }

  /**
   * Called when daily goal is reached
   */
  onGoalReached() {
    this.streak.n++;
    this.streak.last = storage.getTodayString();
    storage.saveStreak(this.streak);

    this.updateUI();

    // Celebration
    haptics.strongHaptic();
    haptics.playGoalSound();
    achievements.playAchievementSound(); // Trigger achievement sound

    if (this.elements.comptotal) {
      const total = Object.values(this.history).reduce((a, b) => a + b, 0);
      this.elements.comptotal.textContent = `🙏 ${total.toLocaleString()} | ${this.streak.n} 🔥`;
    }

    if (this.elements.overlay) {
      this.elements.overlay.classList.add('show');
    }

    // Sync to cloud
    if (isLoggedIn()) {
      this.syncToCloud();
    }
  }

  /**
   * Set goal
   */
  setGoal(value) {
    const newGoal = Math.max(getConfig('app.minGoal'), Math.min(getConfig('app.maxGoal'), parseInt(value) || getConfig('app.defaultGoal')));
    this.goal = newGoal;

    if (this.elements.goalInput) {
      this.elements.goalInput.value = this.goal;
    }

    storage.saveGoal(this.goal);

    // Reinitialize grid with new goal
    if (this.grid) {
      this.grid.setTotalCells(this.goal);
      if (this.todayCount > 0) {
        this.grid.fillUpTo(this.todayCount);
      }
    }

    this.updateUI();
    this.renderHistory();

    if (isLoggedIn()) this.syncToCloud();
  }

  /**
   * Set category
   */
  setCategory(category) {
    this.category = category;
    storage.saveCategory(category);

    // Update active button
    this.elements.categoryButtons?.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });
  }

  /**
   * Set duration
   */
  setDuration(minutes) {
    this.duration = minutes;
    this.sessionDuration = minutes * 60;
    this.sessionTimeLeft = this.sessionDuration;
    storage.saveDuration(minutes);
    this.updateTimerDisplay();

    // Update active button
    this.elements.durationButtons?.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.duration) === minutes);
    });
  }

  /**
   * Toggle session timer
   */
  toggleSessionTimer() {
    this.sessionTimerRunning = !this.sessionTimerRunning;
    const t = i18n.getAll();

    if (this.elements.sessionToggle) {
      this.elements.sessionToggle.textContent = this.sessionTimerRunning ? t.pause : t.start;
    }

    if (this.sessionTimerRunning) {
      this.sessionTimerInterval = setInterval(() => {
        this.sessionTimeLeft--;
        this.updateTimerDisplay();

        if (this.sessionTimeLeft <= 0) {
          clearInterval(this.sessionTimerInterval);
          this.sessionTimerRunning = false;
          if (this.elements.sessionToggle) {
            this.elements.sessionToggle.textContent = t.start;
          }
          this.sessionTimeLeft = this.sessionDuration;
          this.updateTimerDisplay();
          this.showNotification(t.sessionComplete || 'Session complete!');
        }
      }, 1000);
    } else {
      clearInterval(this.sessionTimerInterval);
    }
  }

  /**
   * Update timer display
   */
  updateTimerDisplay() {
    if (!this.elements.timerDisplay) return;

    const m = Math.floor(this.sessionTimeLeft / 60);
    const s = this.sessionTimeLeft % 60;
    this.elements.timerDisplay.textContent =
      `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  /**
   * Toggle history panel
   */
  toggleHistory() {
    if (this.elements.histwrap) {
      this.elements.histwrap.classList.toggle('open');
      if (this.elements.historyBtn) {
        const t = i18n.getAll();
        this.elements.historyBtn.textContent = this.elements.histwrap.classList.contains('open')
          ? `${t.history} ▲`
          : `${t.history} ▼`;
      }
    }
  }

  /**
   * Toggle settings panel
   */
  toggleSettings() {
    if (this.elements.settingsPanel) {
      this.elements.settingsPanel.classList.toggle('show');
      if (this.elements.languageSelect) {
        this.elements.languageSelect.value = i18n.getLanguage();
      }
    }
  }

  /**
   * Change language
   */
  changeLanguage(lang) {
    i18n.setLanguage(lang);
  }

  /**
   * Set theme
   */
  setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    storage.saveTheme(theme);
  }

  /**
   * Update reminder settings
   */
  updateReminders() {
    if (!this.elements.reminderEnabled) return;

    const settings = {
      enabled: this.elements.reminderEnabled.checked,
      time: this.elements.reminderTime?.value,
      frequency: this.elements.reminderFreq?.value
    };

    notifications.updateSettings(settings);
  }

  /**
   * Toggle microphone
   */
  async toggleMic() {
    if (this.listening) {
      this.stopVoiceRecognition();
    } else {
      await this.startVoiceRecognition();
    }
  }

  /**
   * Start voice recognition
   */
  async startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      this.showNotification('Speech recognition not supported');
      return;
    }

    this.verifyDateIntegrity();

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.voiceRecognition = new SR();
    this.voiceRecognition.lang = 'te-IN';
    this.voiceRecognition.continuous = true;

    this.voiceRecognition.onresult = (e) => {
      const now = Date.now();
      if (now - this.lastVoiceTime < this.voiceDebounce) return;

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript.toLowerCase();
        if (transcript.includes('రామ') || transcript.includes('ram')) {
          this.lastVoiceTime = now;
          this.addChant();
        }
      }
    };

    this.voiceRecognition.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      if (e.error !== 'no-speech') {
        this.stopVoiceRecognition();
      }
    };

    this.voiceRecognition.start();
    this.listening = true;
    this.setSaveStatus('info', '🔴 Listening...');
  }

  /**
   * Stop voice recognition
   */
  stopVoiceRecognition() {
    this.listening = false;
    if (this.voiceRecognition) {
      this.voiceRecognition.abort();
    }
    this.setSaveStatus('ok', 'Ready');
  }

  /**
   * Show stats modal
   */
  showStats() {
    if (!this.elements.statsBody || !this.elements.statsModal) return;

    let total = 0, days = 0;
    Object.values(this.history).forEach(n => {
      total += n;
      if (n >= this.goal) days++;
    });

    const avg = Object.keys(this.history).length > 0
      ? Math.round(total / Object.keys(this.history).length)
      : 0;

    const t = i18n.getAll();
    this.elements.statsBody.innerHTML = `
      <div style="display:grid;gap:12px;">
        <div>📊 ${t.total}: <b>${total.toLocaleString()}</b></div>
        <div>📅 ${t.days}: <b>${days}</b></div>
        <div>📈 ${t.averagePerDay}: <b>${avg}</b></div>
        <div>🔥 ${t.streak}: <b>${this.streak.n}</b></div>
        <div>🎯 ${t.goal}: <b>${this.goal.toLocaleString()}</b></div>
      </div>
    `;
    this.elements.statsModal.classList.add('show');
  }

  /**
   * Close stats modal
   */
  closeStats() {
    if (this.elements.statsModal) {
      this.elements.statsModal.classList.remove('show');
    }
  }

  /**
   * Close all modals
   */
  closeModals() {
    this.closeStats();
    if (this.elements.overlay) {
      this.elements.overlay.classList.remove('show');
    }
    if (this.elements.settingsPanel) {
      this.elements.settingsPanel.classList.remove('show');
    }
  }

  /**
   * Reset today's count
   */
  resetToday() {
    const t = i18n.getAll();
    if (!confirm(t.confirmReset || 'Reset today\'s count?')) return;

    this.todayCount = 0;
    this.history[storage.getTodayString()] = 0;

    storage.saveTodayCount(0);
    storage.saveHistory(this.history);

    if (this.grid) {
      this.grid.reset();
    }

    this.updateUI();
    this.renderHistory();

    if (isLoggedIn()) this.syncToCloud();
  }

  /**
   * Scroll to top
   */
  scrollToTop() {
    const container = document.querySelector('.container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Sync data to cloud
   */
  async syncToCloud() {
    const data = {
      todayCount: this.todayCount,
      history: this.history,
      streak: this.streak,
      currentGoal: this.goal
    };
    await syncToCloud(data);
  }

  /**
   * Merge cloud data
   */
  async mergeCloudData(cloudData) {
    const localData = {
      todayCount: this.todayCount,
      history: this.history,
      streak: this.streak,
      goal: this.goal
    };

    const merged = mergeCloudData(localData, cloudData);

    this.todayCount = merged.todayCount;
    this.history = merged.history;
    this.streak = merged.streak;
    this.goal = merged.goal;

    storage.saveTodayCount(this.todayCount);
    storage.saveHistory(this.history);
    storage.saveStreak(this.streak);
    storage.saveGoal(this.goal);

    if (this.grid) {
      this.grid.setTotalCells(this.goal);
      this.grid.fillUpTo(this.todayCount);
    }

    this.updateUI();
    this.renderHistory();
  }

  /**
   * Show save status
   */
  setSaveStatus(type, message) {
    if (this.elements.saveStatus) {
      this.elements.saveStatus.className = `status-bar status-${type}`;
      this.elements.saveStatus.textContent = message;
    }
  }

  /**
   * Show notification
   */
  showNotification(message) {
    notifications.showNotification('Sri Rama Chant', { body: message });
  }

  /**
   * Export data
   */
  exportData() {
    const data = storage.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sri-rama-chant-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Import data
   */
  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          storage.importData(data);
          location.reload(); // Reload to apply imported data
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  }

  /**
   * Check PWA install prompt
   */
  checkPWAInstall() {
    if (!getConfig('features.pwa')) return;

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      const installBtn = document.createElement('button');
      installBtn.className = 'install-btn';
      installBtn.textContent = '📱 Install App';
      installBtn.addEventListener('click', async () => {
        installBtn.style.display = 'none';
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('PWA installed');
        }
        deferredPrompt = null;
      });
      document.body.appendChild(installBtn);
    });
  }
}

// Create and export singleton instance
export const app = new App();
export default app;