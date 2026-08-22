/**
 * Notifications Module
 * Handles browser notifications, reminder scheduling, and permission management
 */

import { getConfig } from './config.js';
import { loadReminderSettings, saveReminderSettings } from './storage.js';
import { i18n } from './i18n.js';

class NotificationsManager {
  constructor() {
    this.permission = 'default';
    this.reminderInterval = null;
    this.initialized = false;
  }

  /**
   * Initialize notification system
   */
  async init() {
    if (this.initialized) return;

    // Check if notifications are supported
    if (typeof Notification === 'undefined') {
      console.warn('Notifications not supported in this browser');
      return;
    }

    this.permission = Notification.permission;
    this.initialized = true;

    // Request permission if not decided
    if (this.permission === 'default') {
      // We'll request on user interaction, not auto
    }

    // Schedule existing reminders
    this.scheduleReminders();
  }

  /**
   * Request notification permission
   */
  async requestPermission() {
    if (typeof Notification === 'undefined') {
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      // Cannot request again, user must enable in browser settings
      this.showPermissionBanner();
      return false;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  }

  /**
   * Show permission banner for denied notifications
   */
  showPermissionBanner() {
    if (typeof document === 'undefined') return;

    const existing = document.querySelector('.notif-banner');
    if (existing) return;

    const banner = document.createElement('div');
    banner.className = 'notif-banner';
    banner.innerHTML = `
      <span>${i18n.t('notificationsBlocked') || 'Notifications are blocked. Enable them in browser settings for reminders.'}</span>
      <button class="notif-banner-btn" onclick="this.parentElement.remove()">${i18n.t('dismiss') || 'Dismiss'}</button>
    `;
    document.body.prepend(banner);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (banner.parentElement) banner.remove();
    }, 10000);
  }

  /**
   * Show a notification
   */
  showNotification(title, options = {}) {
    if (this.permission !== 'granted') return null;

    const defaultOptions = {
      icon: 'sri rama image.png',
      badge: 'sri rama image.png',
      tag: 'sri-rama-chant',
      renotify: true,
      requireInteraction: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return null;
    }
  }

  /**
   * Show daily reminder notification
   */
  showReminder() {
    const t = i18n.getAll();
    this.showNotification(
      t.reminderTitle || '🙏 Sri Rama Chant Reminder',
      {
        body: t.reminderBody || 'Time for your daily chanting session!',
        tag: 'daily-reminder',
        actions: [
          { action: 'open', title: t.openApp || 'Open App' },
          { action: 'dismiss', title: t.dismiss || 'Dismiss' }
        ]
      }
    );
  }

  /**
   * Schedule daily reminders
   */
  scheduleReminders() {
    // Clear existing interval
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
    }

    const settings = loadReminderSettings();
    if (!settings.enabled) return;

    // Check every minute if it's time for reminder
    this.reminderInterval = setInterval(() => {
      this.checkReminderTime(settings);
    }, 60000); // Check every minute
  }

  /**
   * Check if it's time for a reminder
   */
  checkReminderTime(settings) {
    const now = new Date();
    const [hours, minutes] = settings.time.split(':').map(Number);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const targetMinutes = hours * 60 + minutes;

    // Check if it's the right time (within 1 minute window)
    if (Math.abs(currentMinutes - targetMinutes) <= 1) {
      // Check frequency
      const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

      if (settings.frequency === 'daily' ||
          (settings.frequency === 'weekdays' && isWeekday)) {
        this.showReminder();
      }
    }
  }

  /**
   * Update reminder settings
   */
  updateSettings(newSettings) {
    saveReminderSettings(newSettings);
    this.scheduleReminders();
  }

  /**
   * Enable reminders
   */
  enableReminders(time, frequency) {
    saveReminderSettings({ enabled: true, time, frequency });
    this.scheduleReminders();
  }

  /**
   * Disable reminders
   */
  disableReminders() {
    saveReminderSettings({ enabled: false });
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
      this.reminderInterval = null;
    }
  }

  /**
   * Get current reminder settings
   */
  getSettings() {
    return loadReminderSettings();
  }

  /**
   * Check if notifications are supported
   */
  isSupported() {
    return typeof Notification !== 'undefined';
  }

  /**
   * Get permission status
   */
  getPermission() {
    return this.permission;
  }

  /**
   * Show test notification
   */
  showTestNotification() {
    const t = i18n.getAll();
    this.showNotification(
      t.testNotificationTitle || '🔔 Test Notification',
      { body: t.testNotificationBody || 'Notifications are working!' }
    );
  }
}

export const notifications = new NotificationsManager();
export default notifications;