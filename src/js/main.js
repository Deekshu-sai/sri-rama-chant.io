/**
 * Application Entry Point
 * Initializes the app and makes it globally accessible
 */

import { app } from './modules/app.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await app.init();
    // Make app globally accessible for inline handlers
    window.app = app;
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
});

// Global functions for inline event handlers (backward compatibility)
window.addOne = () => app.addChant();
window.setGoal = (val) => app.setGoal(val);
window.resetToday = () => app.resetToday();
window.toggleTheme = () => app.setTheme(document.body.classList.contains('light-theme') ? 'dark' : 'light');
window.changeLanguage = (lang) => app.changeLanguage(lang);
window.toggleSettings = () => app.toggleSettings();
window.setDuration = (mins) => app.setDuration(mins);
window.setCategory = (cat) => app.setCategory(cat);
window.toggleHist = () => app.toggleHistory();
window.scrollToTop = () => app.scrollToTop();
window.showStats = () => app.showStats();
window.closeStats = () => app.closeStats();
window.toggleSessionTimer = () => app.toggleSessionTimer();
window.toggleMic = () => app.toggleMic();
window.exportData = () => app.exportData();

// Handle beforeinstallprompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW registration failed:', err));
  });
}