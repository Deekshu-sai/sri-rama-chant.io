/**
 * Haptics & Sound Effects Module
 * Provides tactile and audio feedback for interactions
 */

import { getConfig } from './config.js';
import { loadSoundEnabled, saveSoundEnabled, loadHapticEnabled, saveHapticEnabled } from './storage.js';

class HapticsManager {
  constructor() {
    this.audioContext = null;
    this.soundEnabled = loadSoundEnabled();
    this.hapticEnabled = loadHapticEnabled();
    this.initialized = false;
  }

  /**
   * Initialize audio context (must be called on user interaction)
   */
  initAudioContext() {
    if (this.initialized || typeof window === 'undefined') return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (error) {
      console.warn('Audio context initialization failed:', error);
    }
  }

  /**
   * Play a simple tone
   */
  playTone(frequency, duration, type = 'sine', volume = 0.1) {
    if (!this.soundEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      console.warn('Failed to play tone:', error);
    }
  }

  /**
   * Play chant sound (subtle bell-like tone)
   */
  playChantSound() {
    this.playTone(880, 0.15, 'sine', 0.08); // A5
    setTimeout(() => this.playTone(1320, 0.1, 'sine', 0.05), 50); // E6
  }

  /**
   * Play goal reached sound (celebration)
   */
  playGoalSound() {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.1), i * 100);
    });
  }

  /**
   * Play achievement sound
   */
  playAchievementSound() {
    const notes = [880, 1108, 1318, 1760]; // A5, C#6, E6, A6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.4, 'triangle', 0.12), i * 80);
    });
  }

  /**
   * Play error sound
   */
  playErrorSound() {
    this.playTone(200, 0.3, 'square', 0.1);
  }

  /**
   * Play button click sound
   */
  playClickSound() {
    this.playTone(800, 0.05, 'sine', 0.03);
  }

  /**
   * Trigger haptic vibration
   */
  vibrate(pattern) {
    if (!this.hapticEnabled || typeof navigator === 'undefined' || !navigator.vibrate) {
      return;
    }

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Vibration failed:', error);
    }
  }

  /**
   * Light haptic feedback (for button presses)
   */
  lightHaptic() {
    this.vibrate(10);
  }

  /**
   * Medium haptic feedback (for chant count)
   */
  mediumHaptic() {
    this.vibrate([10, 30, 10]);
  }

  /**
   * Strong haptic feedback (for goal reached)
   */
  strongHaptic() {
    this.vibrate([50, 50, 50, 50, 100]);
  }

  /**
   * Achievement haptic pattern
   */
  achievementHaptic() {
    this.vibrate([30, 50, 30, 50, 30, 100]);
  }

  /**
   * Enable/disable sound
   */
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    saveSoundEnabled(enabled);
  }

  /**
   * Enable/disable haptics
   */
  setHapticEnabled(enabled) {
    this.hapticEnabled = enabled;
    saveHapticEnabled(enabled);
  }

  /**
   * Get sound enabled state
   */
  isSoundEnabled() {
    return this.soundEnabled;
  }

  /**
   * Get haptic enabled state
   */
  isHapticEnabled() {
    return this.hapticEnabled;
  }

  /**
   * Resume audio context (needed for browser autoplay policies)
   */
  async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}

export const haptics = new HapticsManager();
export default haptics;