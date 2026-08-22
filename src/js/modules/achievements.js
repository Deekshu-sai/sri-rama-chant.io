/**
 * Achievements System Module
 * Handles milestones, badges, and achievement notifications
 */

import { getConfig } from './config.js';
import { loadAchievements, saveAchievements } from './storage.js';
import { i18n } from './i18n.js';

class AchievementsManager {
  constructor() {
    this.milestones = getConfig('achievements.milestones');
    this.milestoneNames = getConfig('achievements.milestoneNames');
    this.earned = new Set(loadAchievements());
    this.toastElement = null;
    this.initToast();
  }

  /**
   * Initialize achievement toast container
   */
  initToast() {
    if (typeof document === 'undefined') return;

    this.toastElement = document.createElement('div');
    this.toastElement.className = 'achievement-toast';
    this.toastElement.style.display = 'none';
    document.body.appendChild(this.toastElement);
  }

  /**
   * Check and award achievements for a given total count
   */
  checkAchievements(totalCount) {
    const newAchievements = [];

    for (const milestone of this.milestones) {
      if (totalCount >= milestone && !this.earned.has(milestone)) {
        this.earned.add(milestone);
        newAchievements.push(milestone);
      }
    }

    if (newAchievements.length > 0) {
      this.save();
      this.showAchievementToast(newAchievements);
    }

    return newAchievements;
  }

  /**
   * Show achievement toast notification
   */
  showAchievementToast(milestones) {
    if (!this.toastElement || milestones.length === 0) return;

    const firstMilestone = milestones[0];
    const name = this.milestoneNames[firstMilestone] || `${firstMilestone} Chants`;

    this.toastElement.innerHTML = `
      <span style="font-size: 2rem;">🏆</span>
      <div>
        <div style="font-size: 0.9rem;">${i18n.t('milestoneUnlocked') || 'Milestone Unlocked!'}</div>
        <div style="font-size: 1.1rem; font-weight: 800;">${name}</div>
      </div>
    `;

    this.toastElement.style.display = 'flex';
    this.toastElement.classList.remove('hide');

    // Auto-hide after 4 seconds
    setTimeout(() => {
      this.toastElement.classList.add('hide');
      setTimeout(() => {
        this.toastElement.style.display = 'none';
      }, 400);
    }, 4000);
  }

  /**
   * Save achievements to storage
   */
  save() {
    saveAchievements(Array.from(this.earned));
  }

  /**
   * Get all earned achievements
   */
  getEarned() {
    return Array.from(this.earned).sort((a, b) => a - b);
  }

  /**
   * Get next unearned milestone
   */
  getNextMilestone(totalCount) {
    for (const milestone of this.milestones) {
      if (totalCount < milestone) {
        return milestone;
      }
    }
    return null; // All milestones achieved
  }

  /**
   * Get progress to next milestone (0-1)
   */
  getNextMilestoneProgress(totalCount) {
    const next = this.getNextMilestone(totalCount);
    if (!next) return 1;

    const prev = this.milestones.find(m => m <= totalCount) || 0;
    return (totalCount - prev) / (next - prev);
  }

  /**
   * Check if a milestone is earned
   */
  isEarned(milestone) {
    return this.earned.has(milestone);
  }

  /**
   * Get all milestones with earned status
   */
  getAllMilestones(totalCount) {
    return this.milestones.map(milestone => ({
      value: milestone,
      name: this.milestoneNames[milestone] || `${milestone} Chants`,
      earned: this.earned.has(milestone),
      current: totalCount >= milestone,
      progress: totalCount >= milestone ? 1 : Math.min(1, totalCount / milestone)
    }));
  }

  /**
   * Reset all achievements (for testing)
   */
  reset() {
    this.earned.clear();
    this.save();
  }
}

export const achievements = new AchievementsManager();
export default achievements;