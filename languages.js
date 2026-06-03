// Multilingual Translation System
const translations = {
  en: {
    // Header
    appTitle: "Sri Rama Chant Counter",
    appSubtitle: "Chant with devotion",
    
    // Settings
    settingsTitle: "Settings",
    language: "Language",
    theme: "Theme",
    darkTheme: "Dark Theme",
    lightTheme: "Light Theme",
    goal: "Daily Goal",
    category: "Category",
    duration: "Duration",
    reminders: "Reminders",
    sound: "Sound Effects",
    soundOn: "Sound On",
    soundOff: "Sound Off",
    closeSettings: "Close Settings",
    
    // Categories
    mantra: "Mantra",
    meditation: "Meditation",
    kirtan: "Kirtan",
    bhajan: "Bhajan",
    
    // Duration
    short: "Short (10 min)",
    medium: "Medium (30 min)",
    long: "Long (60 min)",
    custom: "Custom",
    
    // Progress Labels
    today: "Today",
    total: "Total",
    streak: "Streak",
    progress: "Progress",
    chants: "Chants",
    days: "Days",
    
    // Timer
    timer: "Timer",
    start: "Start",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
    
    // Buttons
    reset: "Reset",
    history: "History",
    export: "Export Data",
    share: "Share Progress",
    
    // Statistics
    sessionChants: "Session",
    dailyChants: "Daily",
    weeklyChants: "Weekly",
    averagePerDay: "Avg/Day",
    
    // Status Messages
    sessionStarted: "Session started! 🙏",
    sessionPaused: "Session paused",
    sessionResumed: "Session resumed",
    goalReached: "Daily goal reached! 🎉",
    streakMaintained: "Streak maintained! 🔥",
    newStreakStart: "New streak started!",
    
    // Grid
    gridVisualization: "Chant Grid",
    cellRepresents: "Each cell = 1 chant",
    
    // Quote
    quote: "ॐ रामाय नमः - Glory to Lord Rama",
    
    // Reminders
    hourly: "Hourly",
    twice: "Twice Daily",
    daily: "Daily",
    custom: "Custom Time",
    
    // Achievements
    milestone108: "108 Chants! 🏆",
    milestone1008: "1008 Chants! 🌟",
    milestone10000: "10,000 Chants! 👑",
  },
  
  te: {
    // Header
    appTitle: "శ్రీ రామ నామ గణన",
    appSubtitle: "భక్తితో జపించండి",
    
    // Settings
    settingsTitle: "సెట్టింగ్‌లు",
    language: "భాష",
    theme: "థీమ్",
    darkTheme: "చీకటి థీమ్",
    lightTheme: "లేత థీమ్",
    goal: "రోజువారీ లక్ష్యం",
    category: "వర్గం",
    duration: "వ్యవధి",
    reminders: "రిమైండర్‌లు",
    sound: "ధ్వని ప్రభావాలు",
    soundOn: "ధ్వని ఆన్",
    soundOff: "ధ్వని ఆఫ్",
    closeSettings: "సెట్టింగ్‌లు మూసివేయండి",
    
    // Categories
    mantra: "మంత్రం",
    meditation: "ధ్యానం",
    kirtan: "కీర్తన",
    bhajan: "భజన",
    
    // Duration
    short: "చిన్న (10 నిమిషాలు)",
    medium: "మధ్యస్థం (30 నిమిషాలు)",
    long: "పొడవైన (60 నిమిషాలు)",
    custom: "కస్టమ్",
    
    // Progress Labels
    today: "ఈ రోజు",
    total: "మొత్తం",
    streak: "స్ట్రీక్",
    progress: "పురోగతి",
    chants: "జపాలు",
    days: "రోజులు",
    
    // Timer
    timer: "టైమర్",
    start: "ప్రారంభించండి",
    pause: "పాజ్",
    resume: "కొనసాగించండి",
    stop: "ఆపండి",
    
    // Buttons
    reset: "రీసెట్",
    history: "చరిత్ర",
    export: "డేటా ఎగుమతి",
    share: "పంచుకోండి",
    
    // Statistics
    sessionChants: "సెషన్",
    dailyChants: "రోజువారీ",
    weeklyChants: "సాప్తాహిక",
    averagePerDay: "సగటు/రోజు",
    
    // Status Messages
    sessionStarted: "సెషన్ ప్రారంభమైంది! 🙏",
    sessionPaused: "సెషన్ ఆపివేయబడింది",
    sessionResumed: "సెషన్ కొనసాగించారు",
    goalReached: "రోజువారీ లక్ష్యం చేరుకుంది! 🎉",
    streakMaintained: "స్ట్రీక్ నిర్వహించబడింది! 🔥",
    newStreakStart: "కొత్త స్ట్రీక్ ప్రారంభమైంది!",
    
    // Grid
    gridVisualization: "జప గ్రిడ్",
    cellRepresents: "ప్రతి సెల్ = 1 జప",
    
    // Quote
    quote: "ॐ రామాయ నమః - రామ భగవానుకు మేమె సమర్పణ చేస్తాము",
    
    // Reminders
    hourly: "ప్రతి గంటకు",
    twice: "రోజుకు రెండుసార్లు",
    daily: "రోజువారీ",
    custom: "కస్టమ్ సమయం",
    
    // Achievements
    milestone108: "108 జపాలు! 🏆",
    milestone1008: "1008 జపాలు! 🌟",
    milestone10000: "10,000 జపాలు! 👑",
  },
  
  hi: {
    // Header
    appTitle: "श्री राम जप काउंटर",
    appSubtitle: "भक्ति के साथ जपें",
    
    // Settings
    settingsTitle: "सेटिंग्स",
    language: "भाषा",
    theme: "थीम",
    darkTheme: "डार्क थीम",
    lightTheme: "लाइट थीम",
    goal: "दैनिक लक्ष्य",
    category: "श्रेणी",
    duration: "अवधि",
    reminders: "रिमाइंडर्स",
    sound: "ध्वनि प्रभाव",
    soundOn: "ध्वनि चालू",
    soundOff: "ध्वनि बंद",
    closeSettings: "सेटिंग्स बंद करें",
    
    // Categories
    mantra: "मंत्र",
    meditation: "ध्यान",
    kirtan: "कीर्तन",
    bhajan: "भजन",
    
    // Duration
    short: "छोटा (10 मिनट)",
    medium: "माध्यम (30 मिनट)",
    long: "लंबा (60 मिनट)",
    custom: "कस्टम",
    
    // Progress Labels
    today: "आज",
    total: "कुल",
    streak: "सीरीज़",
    progress: "प्रगति",
    chants: "जाप",
    days: "दिन",
    
    // Timer
    timer: "टाइमर",
    start: "शुरू",
    pause: "रोकें",
    resume: "जारी रखें",
    stop: "रुकें",
    
    // Buttons
    reset: "रीसेट",
    history: "इतिहास",
    export: "डेटा निर्यात",
    share: "साझा करें",
    
    // Statistics
    sessionChants: "सत्र",
    dailyChants: "दैनिक",
    weeklyChants: "साप्ताहिक",
    averagePerDay: "औसत/दिन",
    
    // Status Messages
    sessionStarted: "सत्र शुरू हुआ! 🙏",
    sessionPaused: "सत्र रोका गया",
    sessionResumed: "सत्र जारी रखा गया",
    goalReached: "दैनिक लक्ष्य प्राप्त! 🎉",
    streakMaintained: "सीरीज़ बनी रही! 🔥",
    newStreakStart: "नई सीरीज़ शुरू!",
    
    // Grid
    gridVisualization: "जप ग्रिड",
    cellRepresents: "प्रत्येक सेल = 1 जाप",
    
    // Quote
    quote: "ॐ रामाय नमः - श्री राम को नमस्कार",
    
    // Reminders
    hourly: "प्रति घंटा",
    twice: "दिन में दो बार",
    daily: "दैनिक",
    custom: "कस्टम समय",
    
    // Achievements
    milestone108: "108 जाप! 🏆",
    milestone1008: "1008 जाप! 🌟",
    milestone10000: "10,000 जाप! 👑",
  },
  
  sa: {
    // Header
    appTitle: "श्रीराम नाम जपनम्",
    appSubtitle: "भक्त्या जपयतु",
    
    // Settings
    settingsTitle: "सेटिंग्स",
    language: "भाषा",
    theme: "थीम",
    darkTheme: "कृष्णथीम",
    lightTheme: "दीप्तथीम",
    goal: "दैनिकलक्ष्यम्",
    category: "वर्गः",
    duration: "अवधिः",
    reminders: "स्मारकाः",
    sound: "शब्दप्रभावाः",
    soundOn: "शब्दः आन्",
    soundOff: "शब्दः अप्",
    closeSettings: "सेटिंग्स मुञ्चतु",
    
    // Categories
    mantra: "मन्त्रम्",
    meditation: "ध्यानम्",
    kirtan: "कीर्तनम्",
    bhajan: "भजनम्",
    
    // Duration
    short: "लघु (१० मिनिटाः)",
    medium: "मध्यम (३० मिनिटाः)",
    long: "दीर्घ (६० मिनिटाः)",
    custom: "कस्टम",
    
    // Progress Labels
    today: "अद्य",
    total: "सर्वः",
    streak: "श्रेणीः",
    progress: "प्रगतिः",
    chants: "जपाः",
    days: "दिनाः",
    
    // Timer
    timer: "समायः",
    start: "आरभतु",
    pause: "विरमतु",
    resume: "पुनः यातु",
    stop: "स्थितु",
    
    // Buttons
    reset: "पुनः संस्थापयतु",
    history: "इतिहासः",
    export: "आंकडानिर्यातम्",
    share: "साझाः करोतु",
    
    // Statistics
    sessionChants: "सत्रम्",
    dailyChants: "दैनिकम्",
    weeklyChants: "सप्ताहिकम्",
    averagePerDay: "औसतः/दिनम्",
    
    // Status Messages
    sessionStarted: "सत्रम् आरभितम्! 🙏",
    sessionPaused: "सत्रम् विरतम्",
    sessionResumed: "सत्रम् पुनः यातम्",
    goalReached: "दैनिकलक्ष्यम् प्राप्तम्! 🎉",
    streakMaintained: "श्रेणीः संरक्षिता! 🔥",
    newStreakStart: "नवीनश्रेणीः आरभिता!",
    
    // Grid
    gridVisualization: "जपग्रिडः",
    cellRepresents: "प्रत्येकः सेलः = १ जपः",
    
    // Quote
    quote: "ॐ रामाय नमः - श्रीरामः परमब्रह्मणः",
    
    // Reminders
    hourly: "प्रत्येकघन्टायाः",
    twice: "द्विदाप्रतिदिनम्",
    daily: "दैनिकम्",
    custom: "कस्टमसमायः",
    
    // Achievements
    milestone108: "१०८ जपाः! 🏆",
    milestone1008: "१��०८ जपाः! 🌟",
    milestone10000: "१०००० जपाः! 👑",
  },
  
  kn: {
    // Header
    appTitle: "ಶ್ರೀ ರಾಮ ಜಪ ಗಣನೆ",
    appSubtitle: "ಭಕ್ತಿಯಿಂದ ಜಪಿಸಿ",
    
    // Settings
    settingsTitle: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    language: "ಭಾಷೆ",
    theme: "ಥೀಮ್",
    darkTheme: "ಡಾರ್ಕ್ ಥೀಮ್",
    lightTheme: "ಲೈಟ್ ಥೀಮ್",
    goal: "ದೈನಿಕ ಲಕ್ಷ್ಯ",
    category: "ವರ್ಗ",
    duration: "ಮುಕ್ತಾಯತೆ",
    reminders: "ರಿಮೈಂಡರ್‌ಗಳು",
    sound: "ಧ್ವನಿ ಪರಿಣಾಮಗಳು",
    soundOn: "ಧ್ವನಿ ಆನ್",
    soundOff: "ಧ್ವನಿ ಆಫ್",
    closeSettings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮುಚ್ಚಿ",
    
    // Categories
    mantra: "ಮಂತ್ರ",
    meditation: "ಧ್ಯಾನ",
    kirtan: "ಕೀರ್ತನ",
    bhajan: "ಭಜನೆ",
    
    // Duration
    short: "ಸಣ್ಣ (10 ನಿಮಿಷ)",
    medium: "ಮಧ್ಯಮ (30 ನಿಮಿಷ)",
    long: "ಉದ್ದ (60 ನಿಮಿಷ)",
    custom: "ಕಸ್ಟಮ್",
    
    // Progress Labels
    today: "ಇಂದು",
    total: "ಒಟ್ಟು",
    streak: "ಸ್ಟ್ರೀಕ್",
    progress: "ಪ್ರಗತಿ",
    chants: "ಜಪಗಳು",
    days: "ದಿನಗಳು",
    
    // Timer
    timer: "ಟೈಮರ್",
    start: "ಪ್ರಾರಂಭಿಸಿ",
    pause: "ವಿರಾಮ",
    resume: "ಮುಂದುವರಿಸಿ",
    stop: "ನಿಲ್ಲಿಸಿ",
    
    // Buttons
    reset: "ರೀಸೆಟ್",
    history: "ಇತಿಹಾಸ",
    export: "ಡೇಟಾ ರಫ್ತೆ",
    share: "ಹಂಚಿಕೊಳ್ಳಿ",
    
    // Statistics
    sessionChants: "ಅಧಿವೇಶನ",
    dailyChants: "ದೈನಿಕ",
    weeklyChants: "ಸಾಪ್ತಾಹಿಕ",
    averagePerDay: "ಸರಾಸರಿ/ದಿನ",
    
    // Status Messages
    sessionStarted: "ಅಧಿವೇಶನ ಪ್ರಾರಂಭವಾಯಿತು! 🙏",
    sessionPaused: "ಅಧಿವೇಶನ ವಿರಾಮ",
    sessionResumed: "ಅಧಿವೇಶನ ಮುಂದುವರಿಸಿದೆ",
    goalReached: "ದೈನಿಕ ಲಕ್ಷ್ಯ ತಲುಪಲಾಯಿತು! 🎉",
    streakMaintained: "ಸ್ಟ್ರೀಕ್ ನಿರ್ವಹಿಸಲಾಯಿತು! 🔥",
    newStreakStart: "ಹೊಸ ಸ್ಟ್ರೀಕ್ ಪ್ರಾರಂಭವಾಯಿತು!",
    
    // Grid
    gridVisualization: "ಜಪ ಗ್ರಿಡ್",
    cellRepresents: "ಪ್ರತಿಯೊಂದು ಸೆಲ್ = 1 ಜಪ",
    
    // Quote
    quote: "ॐ ರಾಮಾಯ ನಮಃ - ಶ್ರೀರಾಮನಿಗೆ ನಮಸ್ಕಾರ",
    
    // Reminders
    hourly: "ಗಂಟೆಗೆ ಒಮ್ಮೆ",
    twice: "ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ",
    daily: "ದೈನಿಕ",
    custom: "ಕಸ್ಟಮ್ ಸಮಯ",
    
    // Achievements
    milestone108: "108 ಜಪಗಳು! 🏆",
    milestone1008: "1008 ಜಪಗಳು! 🌟",
    milestone10000: "10,000 ಜಪಗಳು! 👑",
  },
  
  ta: {
    // Header
    appTitle: "ஸ்ரீ ராம சொல்லலை எண்ணிக்கை",
    appSubtitle: "பக்தியுடன் ஜபிக்கவும்",
    
    // Settings
    settingsTitle: "அமைப்புகள்",
    language: "மொழி",
    theme: "கருப்பொருள்",
    darkTheme: "இருண்ட கருப்பொருள்",
    lightTheme: "ஒளி கருப்பொருள்",
    goal: "தினசரி இலக்கு",
    category: "வகை",
    duration: "கால அவधि",
    reminders: "நினைவூட்டல்கள்",
    sound: "ஒலி விளைவுகள்",
    soundOn: "ஒலி இயக்கத்தில்",
    soundOff: "ஒலி முடக்கம்",
    closeSettings: "அமைப்புகள் மூடுக",
    
    // Categories
    mantra: "மந்திரம்",
    meditation: "தியானம்",
    kirtan: "கீர்த்தனை",
    bhajan: "பாடல்",
    
    // Duration
    short: "குறுகிய (10 நிமிடம்)",
    medium: "இடைநிலை (30 நிமிடம்)",
    long: "நீண்ட (60 நிமிடம்)",
    custom: "விருப்பப்படி",
    
    // Progress Labels
    today: "இன்று",
    total: "மொத்தம்",
    streak: "தொடர்",
    progress: "முன்னேற்றம்",
    chants: "சொல்லலைகள்",
    days: "நாட்கள்",
    
    // Timer
    timer: "நேரமாপி",
    start: "தொடங்கவும்",
    pause: "இடைநிறுத்தவும்",
    resume: "தொடரவும்",
    stop: "நிறுத்துக",
    
    // Buttons
    reset: "மீட்டமைக்கவும்",
    history: "வரலாறு",
    export: "தரவு ஏற்றுமதி",
    share: "பகிரவும்",
    
    // Statistics
    sessionChants: "அமர்வு",
    dailyChants: "தினசரி",
    weeklyChants: "வாராந்திர",
    averagePerDay: "சராசரி/நாள்",
    
    // Status Messages
    sessionStarted: "அமர்வு தொடங்கியது! 🙏",
    sessionPaused: "அமர்வு இடைநிறுத்தப்பட்டது",
    sessionResumed: "அமர்வு தொடரப்பட்டது",
    goalReached: "தினசரி இலக்கு அடையப்பட்டது! 🎉",
    streakMaintained: "தொடர் பராமரிக்கப்பட்டது! 🔥",
    newStreakStart: "புதிய தொடர் தொடங்கியது!",
    
    // Grid
    gridVisualization: "சொல்லலை வலை",
    cellRepresents: "ஒவ்வொரு செல் = 1 சொல்லலை",
    
    // Quote
    quote: "ॐ ராமாய நமः - ஸ்ரீ ராமுக்கு நமஸ்காரம்",
    
    // Reminders
    hourly: "மணிக்கு ஒருமுறை",
    twice: "நாளில் இருமுறை",
    daily: "தினசரி",
    custom: "விருப்பப்படி நேரம்",
    
    // Achievements
    milestone108: "108 சொல்லலைகள்! 🏆",
    milestone1008: "1008 சொல்லலைகள்! 🌟",
    milestone10000: "10,000 சொல்லலைகள்! 👑",
  },
  
  ml: {
    // Header
    appTitle: "ശ്രീ രാമ നാമ ജപം",
    appSubtitle: "ഭക്തിയോടെ ജപിക്കുക",
    
    // Settings
    settingsTitle: "ക്രമീകരണങ്ങൾ",
    language: "ഭാഷ",
    theme: "തീം",
    darkTheme: "ഇരുണ്ട തീം",
    lightTheme: "പ്രകാശ തീം",
    goal: "ദൈനിക ലക്ഷ്യം",
    category: "വിഭാഗം",
    duration: "കാലയളവ്",
    reminders: "ശ്രദ്ധാപനങ്ങൾ",
    sound: "സൗണ്ട് ഇഫക്റ്റുകൾ",
    soundOn: "സൗണ്ട് ഓണ്",
    soundOff: "സൗണ്ട് ഓഫ്",
    closeSettings: "ക്രമീകരണങ്ങൾ അടയ്ക്കുക",
    
    // Categories
    mantra: "മന്ത്രം",
    meditation: "ധ്യാനം",
    kirtan: "കീർത്തനം",
    bhajan: "ഭജനം",
    
    // Duration
    short: "ചെറിയ (10 മിനിറ്റ്)",
    medium: "മധ്യം (30 മിനിറ്റ്)",
    long: "നീണ്ട (60 മിനിറ്റ്)",
    custom: "കസ്റ്റം",
    
    // Progress Labels
    today: "ഇന്ന്",
    total: "ആകെ",
    streak: "സ്ട്രീക്ക്",
    progress: "പ്രഗതി",
    chants: "ജപങ്ങൾ",
    days: "ദിനങ്ങൾ",
    
    // Timer
    timer: "ടൈമർ",
    start: "ആരംഭിക്കുക",
    pause: "താൽക്കാലികമായി നിർത്തുക",
    resume: "തുടരുക",
    stop: "നിർത്തുക",
    
    // Buttons
    reset: "പുനരാരംഭിക്കുക",
    history: "ചരിത്രം",
    export: "ഡാറ്റ നയതീരുക",
    share: "പങ്കിടുക",
    
    // Statistics
    sessionChants: "സെഷൻ",
    dailyChants: "ദൈനിക",
    weeklyChants: "സാപ്താഹിക",
    averagePerDay: "ശരാശരി/ദിനം",
    
    // Status Messages
    sessionStarted: "സെഷൻ ആരംഭിച്ചു! 🙏",
    sessionPaused: "സെഷൻ താൽക്കാലികമായി നിർത്തി",
    sessionResumed: "സെഷൻ തുടർന്നു",
    goalReached: "ദൈനിക ലക്ഷ്യം കൈവരിച്ചു! 🎉",
    streakMaintained: "സ്ട്രീക്ക് നിലനിർത്തിയത്! 🔥",
    newStreakStart: "പുതിയ സ്ട്രീക്ക് ആരംഭിച്ചു!",
    
    // Grid
    gridVisualization: "ജപ ഗ്രിഡ്",
    cellRepresents: "ഓരോ കോശം = 1 ജപം",
    
    // Quote
    quote: "ॐ രാമായ നമഃ - ശ്രീരാമനെ നമസ്കരിക്കുന്നു",
    
    // Reminders
    hourly: "ഓരോ മണിക്കൂറും",
    twice: "ദിവസത്തിൽ രണ്ടുതവണ",
    daily: "ദൈനിക",
    custom: "കസ്റ്റം സമയം",
    
    // Achievements
    milestone108: "108 ജപങ്ങൾ! 🏆",
    milestone1008: "1008 ജപങ്ങൾ! 🌟",
    milestone10000: "10,000 ജപങ്ങൾ! 👑",
  }
};

// Language Manager Class
class LanguageManager {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || 'en';
    this.updateMetaLang();
  }
  
  getStoredLanguage() {
    return localStorage.getItem('selectedLanguage') || 
           (navigator.language?.split('-')[0] in translations ? navigator.language.split('-')[0] : 'en');
  }
  
  setLanguage(lang) {
    if (lang in translations) {
      this.currentLanguage = lang;
      localStorage.setItem('selectedLanguage', lang);
      this.updateMetaLang();
      return true;
    }
    return false;
  }
  
  updateMetaLang() {
    document.documentElement.lang = this.currentLanguage;
  }
  
  t(key) {
    return translations[this.currentLanguage][key] || 
           translations['en'][key] || 
           key;
  }
  
  getAll() {
    return translations[this.currentLanguage] || translations['en'];
  }
  
  getAvailableLanguages() {
    return {
      en: 'English',
      te: 'తెలుగు (Telugu)',
      hi: 'हिंदी (Hindi)',
      sa: 'संस्कृत (Sanskrit)',
      kn: 'ಕನ್ನಡ (Kannada)',
      ta: 'தமிழ் (Tamil)',
      ml: 'മലയാളം (Malayalam)'
    };
  }
}

// Initialize Language Manager
const i18n = new LanguageManager();
