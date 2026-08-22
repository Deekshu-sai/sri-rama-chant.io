/**
 * Configuration Management Module
 * Handles app configuration, environment variables, and feature flags
 */

// Default configuration - Firebase config should be set via environment or config file
const DEFAULT_CONFIG = {
  // App settings
  app: {
    name: 'Sri Rama Chant Counter',
    version: '2.0.0',
    defaultGoal: 1000,
    maxGoal: 10000,
    minGoal: 1,
    defaultDuration: 10, // minutes
    defaultCategory: 'general'
  },

  // Firebase configuration - REPLACE WITH YOUR OWN CONFIG
  // For production, use environment variables or a separate config file
  firebaseConfig = {
  apiKey: "AIzaSyAJzxtA1fv-Hziscs8Ltdo1LM4pfqzTxOw",
  authDomain: "sri-rama-chant-counter.firebaseapp.com",
  projectId: "sri-rama-chant-counter",
  storageBucket: "sri-rama-chant-counter.firebasestorage.app",
  messagingSenderId: "159460923018",
  appId: "1:159460923018:web:dc5f84f907947b74733f73",
  measurementId: "G-8QQVEDLWDK"
},

  // Feature flags
  features: {
    firebaseSync: true,
    voiceRecognition: true,
    hapticFeedback: true,
    soundEffects: true,
    notifications: true,
    achievements: true,
    dataExport: true,
    pwa: true,
    offlineMode: true,
    virtualizedGrid: true
  },

  // Achievements/milestones
  achievements: {
    milestones: [108, 1008, 10000, 50000, 100000],
    milestoneNames: {
      108: '108 Chants',
      1008: '1008 Chants',
      10000: '10,000 Chants',
      50000: '50,000 Chants',
      100000: '100,000 Chants'
    }
  },

  // Storage keys
  storage: {
    today: 'SR_today',
    history: 'SR_hist',
    streak: 'SR_streak',
    goal: 'SR_goal',
    theme: 'SR_theme',
    language: 'SR_lang',
    category: 'SR_category',
    duration: 'SR_duration',
    reminderEnabled: 'SR_reminder_enabled',
    reminderTime: 'SR_reminder_time',
    reminderFreq: 'SR_reminder_freq',
    soundEnabled: 'SR_sound_enabled',
    hapticEnabled: 'SR_haptic_enabled',
    achievements: 'SR_achievements',
    stats: 'SR_stats'
  },

  // Notification settings
  notifications: {
    defaultTime: '09:00',
    defaultFrequency: 'daily',
    debounceMs: 1000 // Debounce for voice recognition
  },

  // Grid settings
  grid: {
    defaultCols: 18,
    breakpoints: {
      500: 12,
      380: 8
    }
  }
};

// Load config from window.__APP_CONFIG__ if available (for build-time injection)
let config = { ...DEFAULT_CONFIG };

if (typeof window !== 'undefined' && window.__APP_CONFIG__) {
  config = deepMerge(config, window.__APP_CONFIG__);
}

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * Get a config value by dot-notation path
 * @param {string} path - Dot-notation path (e.g., 'firebase.apiKey')
 * @returns {*} The config value
 */
export function getConfig(path) {
  const keys = path.split('.');
  let value = config;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  return value;
}

/**
 * Set a config value by dot-notation path
 * @param {string} path - Dot-notation path
 * @param {*} value - Value to set
 */
export function setConfig(path, value) {
  const keys = path.split('.');
  let obj = config;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in obj)) {
      obj[keys[i]] = {};
    }
    obj = obj[keys[i]];
  }
  obj[keys[keys.length - 1]] = value;
}

/**
 * Get the entire config object
 */
export function getAllConfig() {
  return { ...config };
}

export default config;