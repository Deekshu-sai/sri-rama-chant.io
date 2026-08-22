/**
 * Internationalization (i18n) Manager
 * Integrates with the translations from languages.js
 */

import { loadLanguage, saveLanguage } from './storage.js';

// Import translations (from languages.js, loaded before this module)
let translations = {};

if (typeof window !== 'undefined' && window.translations) {
  translations = window.translations;
}

class I18nManager {
  constructor() {
    this.currentLanguage = loadLanguage();
    this.fallbackLanguage = 'en';
    this.listeners = new Set();
    this.updateMetaLang();
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages() {
    return Object.keys(translations);
  }

  /**
   * Get language display names
   */
  getLanguageNames() {
    return {
      en: '🇬🇧 English',
      te: '🇮🇳 తెలుగు (Telugu)',
      hi: '🇮🇳 हिंदी (Hindi)',
      ta: '🇮🇳 தமிழ் (Tamil)',
      kn: '🇮🇳 ಕನ್ನಡ (Kannada)',
      ml: '🇮🇳 മലയാളം (Malayalam)',
      sa: '🇮🇳 संस्कृत (Sanskrit)'
    };
  }

  /**
   * Set current language
   */
  setLanguage(lang) {
    if (lang in translations) {
      this.currentLanguage = lang;
      saveLanguage(lang);
      this.updateMetaLang();
      this.notifyListeners();
      return true;
    }
    console.warn(`Language '${lang}' not found in translations`);
    return false;
  }

  /**
   * Get current language code
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get translated string for key with fallback
   */
  t(key) {
    const current = translations[this.currentLanguage];
    if (current && current[key]) {
      return current[key];
    }

    const fallback = translations[this.fallbackLanguage];
    if (fallback && fallback[key]) {
      return fallback[key];
    }

    return key; // Return key as fallback
  }

  /**
   * Get all translations for current language
   */
  getAll() {
    return translations[this.currentLanguage] || translations[this.fallbackLanguage];
  }

  /**
   * Update HTML lang attribute
   */
  updateMetaLang() {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = this.currentLanguage;
    }
  }

  /**
   * Subscribe to language changes
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify listeners of language change
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }

  /**
   * Detect browser language and return supported language code
   */
  detectBrowserLanguage() {
    if (typeof navigator === 'undefined') return this.fallbackLanguage;

    const browserLang = navigator.language?.split('-')[0] || this.fallbackLanguage;
    return browserLang in translations ? browserLang : this.fallbackLanguage;
  }

  /**
   * Get a random quote in current language
   */
  getQuote() {
    const quotes = {
      en: [
        '🙏 Daily practice leads to certain results',
        '✨ Small efforts daily lead to success',
        '🌟 God blesses those who serve with humility'
      ],
      te: [
        '🙏 రోజూ ఆచరణ చేసిన సాధకుడు చివరకు నిశ్చయమైన ఫలాన్ని పొందుతాడు',
        '✨ ప్రతిదిన ఒక చిన్న ప్రయత్నం గతి చేస్తుంది',
        '🌟 వినీతసేవ ఏవిధం చేసిన జనుల్ని దేవుడు భాగ్యవంతులుచేస్తాడు'
      ],
      hi: [
        '🙏 रोज़ का अभ्यास निश्चित परिणाम देता है',
        '✨ प्रतिदिन छोटे प्रयास सफलता की ओर ले जाते हैं',
        '🌟 भगवान विनम्रता से सेवा करने वालों को आशीर्वाद देते हैं'
      ],
      ta: [
        '🙏 தினசரி பயிற்சி உறுதியான பலன் தரும்',
        '✨ தினந்தோறும் சிறிய முயற்சிகள் வெற்றிக்கு வழிவகுக்கும்',
        '🌟 கடவுள் பணிவுடன் சேவை செய்பவர்களை ஆசீர்வதிக்கிறார்'
      ],
      kn: [
        '🙏 ದೈನಂದಿನ ಅಭ್ಯಾಸ ಖಚಿತವಾದ ಫಲಿತಾಂಶಗಳನ್ನು ತರುತ್ತದೆ',
        '✨ ಪ್ರತಿದಿನ ಸಣ್ಣ ಪ್ರಯತ್ನಗಳು ಯಶಸ್ಸಿಗೆ ಕಾರಣವಾಗುತ್ತವೆ',
        '🌟 ವಿನಯದಿಂದ ಸೇವೆ ಸಲ್ಲಿಸುವವರನ್ನು ದೇವರು ಆಶೀರ್ವದಿಸುತ್ತಾನೆ'
      ],
      ml: [
        '🙏 ദൈനംദിന അഭ്യാസം ഉറപ്പായ ഫലങ്ങൾ നൽകുന്നു',
        '✨ പ്രതിദിനം ചെറിയ പ്രയത്നങ്ങൾ വിജയത്തിലേക്ക് നയിക്കുന്നു',
        '🌟 വിനയത്തോടെ സേവിക്കുന്നവരെ ദൈവം അനുഗ്രഹിക്കുന്നു'
      ],
      sa: [
        '🙏 नित्याभ्यासः निश्चितफलं ददाति',
        '✨ क्षुद्रप्रयत्नाः दिने दिने सफलतां वहन्ति',
        '🌟 विनीतसेवां कुर्वतां देवः आशीर्वदति'
      ]
    };

    const langQuotes = quotes[this.currentLanguage] || quotes[this.fallbackLanguage];
    return langQuotes[Math.floor(Math.random() * langQuotes.length)];
  }
}

export const i18n = new I18nManager();
export default i18n;