# Sri Rama Chant Counter 🪷

A beautiful, feature-rich Sri Rama chanting counter app for daily spiritual practice. Built with modern web technologies, PWA support, and offline capabilities.

## ✨ Features

### Core Features
- **Chant Counter** - Tap to count chants with visual, haptic, and audio feedback
- **Progress Ring** - Beautiful animated progress visualization
- **Daily Goal** - Configurable daily target (default: 1000)
- **Session Timer** - Built-in meditation timer with presets
- **Categories** - Morning, Evening, Meditation, General sessions
- **History** - Track daily progress with streak counter
- **Statistics** - Total chants, completed days, average, streak

### 🌐 Multi-Language Support
- Telugu (తెలుగు) - Default
- English
- Hindi (हिंदी)
- Tamil (தமிழ்)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Sanskrit (संस्कृत)

### ☁️ Cloud Sync
- Google Sign-In authentication
- Firestore backup & restore
- Automatic date-based sync
- Conflict resolution (local wins for today)

### 🏆 Achievements System
- 108 Chants milestone
- 1,008 Chants milestone
- 10,000 Chants milestone
- 50,000 Chants milestone
- 100,000 Chants milestone
- Toast notifications with celebration sounds

### 🔔 Smart Reminders
- Browser notifications API
- Daily/weekday scheduling
- Custom reminder times
- Permission management

### 📱 PWA Features
- Installable as native app
- Offline support via Service Worker
- Background sync
- App shortcuts

### 🎮 Interaction
- **Voice Recognition** - Say "Rama" or "రామ" to count (Telugu)
- **Keyboard Shortcuts** - Space to chant, Ctrl+R to reset, etc.
- **Haptic Feedback** - Vibration on mobile
- **Sound Effects** - Subtle audio cues
- **Export/Import** - Backup/restore data as JSON

### 🎨 Themes
- Dark mode (default)
- Light mode
- Persisted preference

## 📁 Project Structure

```
sri-rama-chant.io/
├── index.html              # Main HTML entry point
├── languages.js            # Translation strings (7 languages)
├── sri rama image.png      # App icon
├── public/
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service Worker
└── src/
    ├── css/
    │   └── styles.css      # All styles
    └── js/
        ├── main.js         # Entry point
        └── modules/
            ├── config.js         # Configuration management
            ├── storage.js        # localStorage wrapper
            ├── i18n.js           # Internationalization
            ├── achievements.js   # Milestone system
            ├── notifications.js  # Browser notifications
            ├── haptics.js        # Sound & vibration
            ├── firebase.js       # Cloud sync
            ├── grid.js           # Virtualized grid
            └── app.js            # Main app controller
```

## 🚀 Getting Started

### Local Development
```bash
# Serve locally (required for Service Worker & Firebase)
npx serve .
# or
python -m http.server 8000
```

Then open `http://localhost:8000` (or the port shown).

### Firebase Configuration
The app includes a demo Firebase config. For production:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Google provider)
3. Enable Firestore Database
4. Replace the config in `src/js/modules/config.js`:

```javascript
firebase: {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ... etc
}
```

Or set `window.__APP_CONFIG__` before loading the app:
```html
<script>
  window.__APP_CONFIG__ = {
    firebase: { /* your config */ }
  };
</script>
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Add chant |
| `Ctrl+R` | Reset today |
| `H` | Toggle history |
| `Ctrl+S` | Show stats |
| `M` | Toggle microphone |
| `1-4` | Switch category |
| `Esc` | Close modals |

## 🔧 Configuration

### Feature Flags (`src/js/modules/config.js`)
```javascript
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
}
```

### Achievements
```javascript
achievements: {
  milestones: [108, 1008, 10000, 50000, 100000]
}
```

## 📦 Data Export/Import

- **Export**: Settings → Export Data → downloads JSON
- **Import**: Settings → Import Data → select JSON file

Exported data includes:
- Today's count & date
- Full history
- Streak data
- Goal, theme, language
- Categories, duration
- Reminder settings
- Achievements & stats

## 🏗️ Architecture

### Modular ES6 Modules
Each feature is isolated in its own module:
- **Single Responsibility** - Each module handles one concern
- **Dependency Injection** - Modules import what they need
- **Tree Shakeable** - Unused code eliminated in production

### State Management
- Centralized in `app.js`
- Persisted to `localStorage` via `storage.js`
- Synced to Firestore via `firebase.js`

### Virtualized Grid
- Only renders visible cells (~50 vs 1000+)
- Smooth scrolling on all devices
- Efficient memory usage

### Offline-First
- Service Worker caches all assets
- Works completely offline
- Background sync when online

## 🌐 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| ES Modules | ✅ | ✅ | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ |
| Vibration API | ✅ | ✅ | ❌ | ✅ |
| Speech Recognition | ✅ | ❌ | ❌ | ✅ |
| PWA Install | ✅ | ✅ | ✅ | ✅ |

## 📄 License

MIT License - Feel free to use and modify for your spiritual practice.

## 🙏 Acknowledgments

- Noto Serif Telugu font by Google Fonts
- Firebase by Google
- Icons from Unicode/Emoji

---

**Jai Shri Ram!** 🙏