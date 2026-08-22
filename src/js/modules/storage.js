/**
 * Storage Management Module
 * Handles all localStorage operations with error handling and type safety
 */

import { getConfig } from './config.js';

const STORAGE_KEYS = getConfig('storage');

/**
 * Safe JSON parse with fallback
 */
function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Safe JSON stringify with fallback
 */
function safeStringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch {
    return '{}';
  }
}

/**
 * Get today's date string in YYYY-MM-DD format
 */
export function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Load today's count from storage
 */
export function loadTodayCount() {
  const raw = localStorage.getItem(STORAGE_KEYS.today);
  if (!raw) return { count: 0, date: getTodayString() };

  const parsed = safeParse(raw, { count: 0, date: getTodayString() });
  const today = getTodayString();

  // If date mismatch, archive old count and reset
  if (parsed.date !== today) {
    return { count: 0, date: today };
  }

  return { count: parsed.count || 0, date: parsed.date };
}

/**
 * Save today's count to storage
 */
export function saveTodayCount(count) {
  const data = { date: getTodayString(), count };
  localStorage.setItem(STORAGE_KEYS.today, safeStringify(data));
}

/**
 * Load history from storage
 */
export function loadHistory() {
  const raw = localStorage.getItem(STORAGE_KEYS.history);
  return safeParse(raw, {});
}

/**
 * Save history to storage
 */
export function saveHistory(history) {
  localStorage.setItem(STORAGE_KEYS.history, safeStringify(history));
}

/**
 * Load streak data from storage
 */
export function loadStreak() {
  const raw = localStorage.getItem(STORAGE_KEYS.streak);
  return safeParse(raw, { n: 0, last: '' });
}

/**
 * Save streak data to storage
 */
export function saveStreak(streak) {
  localStorage.setItem(STORAGE_KEYS.streak, safeStringify(streak));
}

/**
 * Load goal from storage
 */
export function loadGoal() {
  const raw = localStorage.getItem(STORAGE_KEYS.goal);
  const goal = parseInt(raw, 10);
  return isNaN(goal) ? getConfig('app.defaultGoal') : goal;
}

/**
 * Save goal to storage
 */
export function saveGoal(goal) {
  localStorage.setItem(STORAGE_KEYS.goal, String(goal));
}

/**
 * Load theme from storage
 */
export function loadTheme() {
  return localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
}

/**
 * Save theme to storage
 */
export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

/**
 * Load language from storage
 */
export function loadLanguage() {
  return localStorage.getItem(STORAGE_KEYS.language) || 'te';
}

/**
 * Save language to storage
 */
export function saveLanguage(lang) {
  localStorage.setItem(STORAGE_KEYS.language, lang);
}

/**
 * Load category from storage
 */
export function loadCategory() {
  return localStorage.getItem(STORAGE_KEYS.category) || getConfig('app.defaultCategory');
}

/**
 * Save category to storage
 */
export function saveCategory(category) {
  localStorage.setItem(STORAGE_KEYS.category, category);
}

/**
 * Load duration from storage
 */
export function loadDuration() {
  const raw = localStorage.getItem(STORAGE_KEYS.duration);
  const duration = parseInt(raw, 10);
  return isNaN(duration) ? getConfig('app.defaultDuration') : duration;
}

/**
 * Save duration to storage
 */
export function saveDuration(duration) {
  localStorage.setItem(STORAGE_KEYS.duration, String(duration));
}

/**
 * Load reminder settings
 */
export function loadReminderSettings() {
  return {
    enabled: localStorage.getItem(STORAGE_KEYS.reminderEnabled) === 'true',
    time: localStorage.getItem(STORAGE_KEYS.reminderTime) || getConfig('notifications.defaultTime'),
    frequency: localStorage.getItem(STORAGE_KEYS.reminderFreq) || getConfig('notifications.defaultFrequency')
  };
}

/**
 * Save reminder settings
 */
export function saveReminderSettings(settings) {
  if (settings.enabled !== undefined) {
    localStorage.setItem(STORAGE_KEYS.reminderEnabled, String(settings.enabled));
  }
  if (settings.time) {
    localStorage.setItem(STORAGE_KEYS.reminderTime, settings.time);
  }
  if (settings.frequency) {
    localStorage.setItem(STORAGE_KEYS.reminderFreq, settings.frequency);
  }
}

/**
 * Load sound enabled setting
 */
export function loadSoundEnabled() {
  return localStorage.getItem(STORAGE_KEYS.soundEnabled) !== 'false'; // Default true
}

/**
 * Save sound enabled setting
 */
export function saveSoundEnabled(enabled) {
  localStorage.setItem(STORAGE_KEYS.soundEnabled, String(enabled));
}

/**
 * Load haptic enabled setting
 */
export function loadHapticEnabled() {
  return localStorage.getItem(STORAGE_KEYS.hapticEnabled) !== 'false'; // Default true
}

/**
 * Save haptic enabled setting
 */
export function saveHapticEnabled(enabled) {
  localStorage.setItem(STORAGE_KEYS.hapticEnabled, String(enabled));
}

/**
 * Load achievements from storage
 */
export function loadAchievements() {
  const raw = localStorage.getItem(STORAGE_KEYS.achievements);
  return safeParse(raw, []);
}

/**
 * Save achievements to storage
 */
export function saveAchievements(achievements) {
  localStorage.setItem(STORAGE_KEYS.achievements, safeStringify(achievements));
}

/**
 * Load stats from storage
 */
export function loadStats() {
  const raw = localStorage.getItem(STORAGE_KEYS.stats);
  return safeParse(raw, {
    totalSessions: 0,
    totalChants: 0,
    totalTime: 0,
    longestStreak: 0
  });
}

/**
 * Save stats to storage
 */
export function saveStats(stats) {
  localStorage.setItem(STORAGE_KEYS.stats, safeStringify(stats));
}

/**
 * Clear all app data from storage
 */
export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Export all data as JSON
 */
export function exportData() {
  return {
    today: loadTodayCount(),
    history: loadHistory(),
    streak: loadStreak(),
    goal: loadGoal(),
    theme: loadTheme(),
    language: loadLanguage(),
    category: loadCategory(),
    duration: loadDuration(),
    reminders: loadReminderSettings(),
    soundEnabled: loadSoundEnabled(),
    hapticEnabled: loadHapticEnabled(),
    achievements: loadAchievements(),
    stats: loadStats(),
    exportDate: new Date().toISOString(),
    version: getConfig('app.version')
  };
}

/**
 * Import data from JSON
 */
export function importData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data format');
  }

  if (data.today) saveTodayCount(data.today.count);
  if (data.history) saveHistory(data.history);
  if (data.streak) saveStreak(data.streak);
  if (data.goal) saveGoal(data.goal);
  if (data.theme) saveTheme(data.theme);
  if (data.language) saveLanguage(data.language);
  if (data.category) saveCategory(data.category);
  if (data.duration) saveDuration(data.duration);
  if (data.reminders) saveReminderSettings(data.reminders);
  if (data.soundEnabled !== undefined) saveSoundEnabled(data.soundEnabled);
  if (data.hapticEnabled !== undefined) saveHapticEnabled(data.hapticEnabled);
  if (data.achievements) saveAchievements(data.achievements);
  if (data.stats) saveStats(data.stats);
}

/**
 * Get storage usage info
 */
export function getStorageInfo() {
  let totalSize = 0;
  const items = {};

  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const value = localStorage.getItem(key);
    const size = value ? new Blob([value]).size : 0;
    totalSize += size;
    items[name] = { key, size, sizeKB: (size / 1024).toFixed(2) };
  });

  return {
    totalSize,
    totalSizeKB: (totalSize / 1024).toFixed(2),
    items
  };
}

export default {
  loadTodayCount,
  saveTodayCount,
  loadHistory,
  saveHistory,
  loadStreak,
  saveStreak,
  loadGoal,
  saveGoal,
  loadTheme,
  saveTheme,
  loadLanguage,
  saveLanguage,
  loadCategory,
  saveCategory,
  loadDuration,
  saveDuration,
  loadReminderSettings,
  saveReminderSettings,
  loadSoundEnabled,
  saveSoundEnabled,
  loadHapticEnabled,
  saveHapticEnabled,
  loadAchievements,
  saveAchievements,
  loadStats,
  saveStats,
  clearAllData,
  exportData,
  importData,
  getStorageInfo,
  getTodayString
};