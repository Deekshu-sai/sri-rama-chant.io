// Sri Rama Chanting App - Multi-Language Version
(function(){
  var T=1000, cells=[], rec=null, listening=false, lastT=0, CD=1000;
  var todayN=0, hist={}, streak={n:0,last:''};
  var settings={reminderTime:'06:00',remindersEnabled:false,soundEnabled:true,goalCount:1000,language:'en'};
  var achievements=[];
  var currentLang='en';

  // Translation data
  var translations={
    'en':{
      loaded:'✅ Loaded',
      saving:'⏳ Saving...',
      saved:'✅ Saved',
      saveFailed:'⚠️ Save failed',
      micDisabled:'⚠️ Your browser does not support voice. Use Chrome.',
      listening:'🔴 Listening - Say "Ram"',
      heard:'✅ Heard! Chant recorded 🙏',
      micStopped:'Microphone stopped.',
      noResetNeeded:'No chants to reset',
      resetConfirm:'Reset {count} chants today? (History will be saved)',
      notificationBody:'Time for your daily chanting!',
      achieved:'🏆 Achievement Unlocked!',
      ramaNames:['Ram','Rama','Ram Ram','Sri Ram','Shriram']
    },
    'te':{
      loaded:'✅ లోడ్ అయింది',
      saving:'⏳ సేవ్ అవుతున్నది...',
      saved:'✅ సేవ్ అయింది',
      saveFailed:'⚠️ సేవ్ విఫలమైంది',
      micDisabled:'⚠️ మీ బ్రౌజర్‌లో voice పని చేయదు. Chrome వాడండి.',
      listening:'🔴 వింటున్నాను — "రామ" అని పలకండి',
      heard:'✅ విన్నాను! నామం పడింది 🙏',
      micStopped:'మైక్రోఫోన్ ఆపబడింది.',
      noResetNeeded:'రీసెట్ చేయడానికి ఎటువంటి నామాలు లేవు',
      resetConfirm:'ఈ రోజు {count} నామాలు రీసెట్ చేయాలా? (చరిత్ర భద్రంగా ఉంటుంది)',
      notificationBody:'ఈ రోజు నామాలను జపించే సమయం వచ్చింది!',
      achieved:'🏆 సాధన విజయం!',
      ramaNames:['రామ','రాం','రామ రామ','శ్రీ రామ','శ్రీరామ']
    },
    'hi':{
      loaded:'✅ लोड हो गया',
      saving:'⏳ सेव हो रहा है...',
      saved:'✅ सेव हो गया',
      saveFailed:'⚠️ सेव विफल',
      micDisabled:'⚠️ आपके ब्राउज़र में वॉयस काम नहीं करता। Chrome का उपयोग करें।',
      listening:'🔴 सुन रहा हूँ — "राम" कहें',
      heard:'✅ सुना गया! चाँट दर्ज किया गया 🙏',
      micStopped:'माइक बंद कर दिया गया।',
      noResetNeeded:'रीसेट करने के लिए कोई चाँट नहीं हैं',
      resetConfirm:'आज के {count} चाँटों को रीसेट करें? (इतिहास सहेजा जाएगा)',
      notificationBody:'आपकी दैनिक चाँटिंग का समय हो गया!',
      achieved:'🏆 उपलब्धि अनलॉक!',
      ramaNames:['राम','रामा','राम राम','श्री राम','श्रीराम']
    },
    'kn':{
      loaded:'✅ ಲೋಡ್ ಆಗಿದೆ',
      saving:'⏳ ಸಂರಕ್ಷಣೆ ಮಾಡುತ್ತಿದೆ...',
      saved:'✅ ಸಂರಕ್ಷಿತ',
      saveFailed:'⚠️ ಸಂರಕ್ಷಣೆ ವಿಫಲ',
      micDisabled:'⚠️ ನಿಮ್ಮ ಬ್ರೌಜರ್‌ನಲ್ಲಿ ವಾಯ್ಸ್ ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ. Chrome ಬಳಸಿ.',
      listening:'🔴 ಆಲಿಸುತ್ತಿದೆ — "ರಾಮ" ಹೇಳಿ',
      heard:'✅ ಕೇಳಿದೆ! ಚಾಂಟ್ ದಾಖಲಾಗಿದೆ 🙏',
      micStopped:'ಮೈಕ್ರೋಫೋನ್ ಮುಚ್ಚಿದೆ.',
      noResetNeeded:'ರಿಸೆಟ್ ಮಾಡಲು ಯಾವುದೇ ಚಾಂಟ್‌ಗಳಿಲ್ಲ',
      resetConfirm:'ಇಂದಿನ {count} ಚಾಂಟ್‌ಗಳನ್ನು ರಿಸೆಟ್ ಮಾಡುವುದೇ? (ಇತಿಹಾಸ ಹಿಡಿದುಕೊಳ್ಳಲಾಗುತ್ತದೆ)',
      notificationBody:'ನಿಮ್ಮ ದೈನಿಕ ಚಾಂಟಿಂಗ್ ಸಮಯ!',
      achieved:'🏆 ಸಾಧನೆ ಅನ್‌ಲಾಕ್!',
      ramaNames:['ರಾಮ','ರಾಮಾ','ರಾಮ ರಾಮ','ಶ್ರೀ ರಾಮ','ಶ್ರೀರಾಮ']
    }
  };

  // Achievement definitions
  var achievementDefs=[
    {id:'fifty',names:{en:'50 First Steps',te:'50 ప్రథమ పదిలు',hi:'50 पहले कदम',kn:'50 ಮೊದಲ ಹಂತಗಳು'},descriptions:{en:'Complete 50 names',te:'50 నామాలూ పూర్తించు',hi:'50 नाम पूरे करें',kn:'50 ನಾಮಗಳನ್ನು ಪೂರ್ಣ ಮಾಡಿ'},target:50,type:'count'},
    {id:'hundred',names:{en:'💯 Hundred Names',te:'💯 వందవెల నామ',hi:'💯 सौ नाम',kn:'💯 ನೂರು ನಾಮ'},descriptions:{en:'Complete 100 names',te:'100 నామాలూ పూర్తించు',hi:'100 नाम पूरे करें',kn:'100 ನಾಮಗಳನ್ನು ಪೂರ್ಣ ಮಾಡಿ'},target:100,type:'count'},
    {id:'fivehundred',names:{en:'500 Midway',te:'500 మధ్య',hi:'500 आधा रास्ता',kn:'500 ಮಧ್ಯ'},descriptions:{en:'Complete 500 names',te:'500 నామాలూ పూర్తించు',hi:'500 नाम पूरे करें',kn:'500 ನಾಮಗಳನ್ನು ಪೂರ್ಣ ಮಾಡಿ'},target:500,type:'count'},
    {id:'thousand',names:{en:'🏆 Thousand Names',te:'🏆 విలువైన నామ',hi:'🏆 हज़ार नाम',kn:'🏆 ಸಾವಿರ ನಾಮ'},descriptions:{en:'Complete 1000 in one day',te:'ఒక రోజుకు 1000 నామాలూ',hi:'एक दिन में 1000 नाम',kn:'ಒಂದು ದಿನದಲ್ಲಿ 1000 ನಾಮ'},target:1000,type:'count'},
    {id:'week',names:{en:'7️⃣ Week Streak',te:'7️⃣ ఒక వారం',hi:'7️⃣ हफ्ता लगातार',kn:'7️⃣ ಒಂದು ವಾರ'},descriptions:{en:'7 consecutive days',te:'7 వరుస రోజులు',hi:'7 दिन लगातार',kn:'7 ದಿನ ಸತತ'},target:7,type:'streak'}
  ];

  function t(key){return translations[currentLang][key]||translations['en'][key]||key;}

  // Language change
  window.changeLang=function(lang){
    currentLang=lang;
    settings.language=lang;
    try{store.setItem('SR_settings',JSON.stringify(settings));}catch(e){}
    
    document.querySelectorAll('[data-en]').forEach(function(el){
      var key='data-'+lang;
      if(el.hasAttribute(key)){el.textContent=el.getAttribute(key);}
    });
    
    document.querySelectorAll('.lang-btn').forEach(function(btn){btn.classList.remove('active');});
    document.querySelector('[data-lang="'+lang+'"]').classList.add('active');
    
    updateUI();
    renderHist();
  };

  // ── Particles ──
  var pc=document.getElementById('ptc');
  var ws=['రామ','శ్రీ','జయ','ॐ','రా','మ'];
  for(var i=0;i<16;i++){
    var p=document.createElement('div'); p.className='pt';
    p.textContent=ws[i%ws.length];
    p.style.left=Math.random()*100+'%';
    p.style.animationDuration=(8+Math.random()*14)+'s';
    p.style.animationDelay=(Math.random()*12)+'s';
    p.style.fontSize=(0.5+Math.random()*0.9)+'rem';
    pc.appendChild(p);
  }

  // ── Grid ──
  var g=document.getElementById('grid');
  for(var i=0;i<T;i++){
    var c=document.createElement('div'); c.className='cell';
    c.innerHTML='<span style="opacity:.12;font-size:60%">रा</span>';
    g.appendChild(c); cells.push(c);
  }

  // ── Date helpers ──
  function today(){var d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
  function pad(n){return n<10?'0'+n:''+n;}
  function fmtD(s){var p=s.split('-');return p[2]+'/'+p[1]+'/'+p[0];}

  // ── Storage ──
  var store=(function(){
    function test(s){try{s.setItem('__t','1');s.removeItem('__t');return true;}catch(e){return false;}}
    if(test(localStorage)) return localStorage;
    if(test(sessionStorage)) return sessionStorage;
    var mem={};
    return {getItem:function(k){return mem[k]||null;},setItem:function(k,v){mem[k]=v;},removeItem:function(k){delete mem[k];}};
  })();

  function setSaveStatus(cls,msg){
    var el=document.getElementById('saveStatus');
    el.className='save-status '+cls; el.textContent=msg;
  }

  // ── Audio Feedback ──
  function playSound(){
    if(!settings.soundEnabled) return;
    try{
      var ctx=new(window.AudioContext||window.webkitAudioContext)();
      var osc=ctx.createOscillator();
      var gain=ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value=800; osc.type='sine';
      gain.gain.setValueAtTime(0.1,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.1);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.1);
    }catch(e){}
  }

  // ── Notifications ──
  function requestNotificationPermission(){
    if('Notification' in window && Notification.permission==='default'){
      Notification.requestPermission();
    }
  }

  function sendNotification(title,options){
    if('Notification' in window && Notification.permission==='granted'){
      new Notification(title,options);
    }
  }

  // ── Load ──
  function load(){
    var ok=false;
    try{
      var raw=store.getItem('SR_today');
      if(raw){var o=JSON.parse(raw);if(o.date===today()){todayN=o.count||0;}}
      var hr=store.getItem('SR_hist');
      if(hr){hist=JSON.parse(hr);}
      var sr=store.getItem('SR_streak');
      if(sr){streak=JSON.parse(sr);}
      var st=store.getItem('SR_settings');
      if(st){settings=Object.assign(settings,JSON.parse(st));currentLang=settings.language;}
      var ach=store.getItem('SR_achievements');
      if(ach){achievements=JSON.parse(ach);}
      ok=true;
    }catch(e){}

    for(var i=0;i<todayN;i++){cells[i].innerHTML='శ్రీరామ';cells[i].className='cell f';}
    updateUI();
    renderHist();
    loadSettings();
    setupReminder();
    requestNotificationPermission();

    if(currentLang!=='en'){
      document.querySelector('[data-lang="'+currentLang+'"]').click();
    }

    if(ok && todayN>0){
      setSaveStatus('save-ok',t('loaded')+' — '+todayN);
    } else if(ok){
      setSaveStatus('save-ok',t('loaded'));
    }
  }

  function save(){
    try{
      store.setItem('SR_today',JSON.stringify({date:today(),count:todayN}));
      hist[today()]=todayN;
      store.setItem('SR_hist',JSON.stringify(hist));
      setSaveStatus('save-ok',t('saved'));
      setTimeout(function(){setSaveStatus('save-info','💾');},2000);
    }catch(e){
      setSaveStatus('save-warn',t('saveFailed'));
    }
  }

  // ── Settings ──
  window.showSettings=function(){
    requestNotificationPermission();
    document.getElementById('settingsModal').classList.add('show');
  };
  window.closeSettings=function(){
    document.getElementById('settingsModal').classList.remove('show');
  };

  function loadSettings(){
    document.getElementById('reminderTime').value=settings.reminderTime;
    document.getElementById('remindersEnabled').checked=settings.remindersEnabled;
    document.getElementById('soundEnabled').checked=settings.soundEnabled;
    document.getElementById('goalCount').value=settings.goalCount;
  }

  window.saveSettings=function(){
    settings.reminderTime=document.getElementById('reminderTime').value;
    settings.remindersEnabled=document.getElementById('remindersEnabled').checked;
    settings.soundEnabled=document.getElementById('soundEnabled').checked;
    settings.goalCount=parseInt(document.getElementById('goalCount').value)||1000;
    try{store.setItem('SR_settings',JSON.stringify(settings));}catch(e){}
    setupReminder();
    setSaveStatus('save-ok',t('saved'));
  };

  function setupReminder(){
    if(!settings.remindersEnabled) return;
    var parts=settings.reminderTime.split(':');
    var h=parseInt(parts[0]), m=parseInt(parts[1]);
    function check(){
      var now=new Date();
      if(now.getHours()===h && now.getMinutes()===m){
        sendNotification('🙏 '+t('notificationBody'));
        playSound();
      }
    }
    setInterval(check,60000);
  }

  // ── Achievements ──
  function checkAchievements(){
    var total=0,days=0,ks=Object.keys(hist);
    for(var i=0;i<ks.length;i++){var n=hist[ks[i]]||0;total+=n;if(n>=settings.goalCount)days++;}

    for(var i=0;i<achievementDefs.length;i++){
      var def=achievementDefs[i];
      var achieved=(def.type==='count'?todayN>=def.target:def.type==='streak'?streak.n>=def.target:false);
      var exist=achievements.find(function(a){return a.id===def.id;});
      if(!exist && achieved) { 
        achievements.push({id:def.id,unlockedAt:new Date().toISOString()}); 
        playSound(); 
        sendNotification('🏆 '+t('achieved'),{body:def.names[currentLang]});
      }
    }
    try{store.setItem('SR_achievements',JSON.stringify(achievements));}catch(e){}
  }

  window.showAchievements=function(){
    var grid=document.getElementById('achievementsGrid');
    grid.innerHTML='';
    for(var i=0;i<achievementDefs.length;i++){
      var def=achievementDefs[i];
      var unlocked=achievements.some(function(a){return a.id===def.id;});
      var div=document.createElement('div');
      div.className='achieve'+(unlocked?' unlocked':'');
      div.innerHTML='<div class="achieve-icon">'+(unlocked?'✅':'🔒')+'</div><div style="font-weight:600;">'+def.names[currentLang]+'</div><div style="font-size:.7rem;opacity:.8;">'+def.descriptions[currentLang]+'</div>';
      grid.appendChild(div);
    }
    document.getElementById('achievementsModal').classList.add('show');
  };
  window.closeAchievements=function(){
    document.getElementById('achievementsModal').classList.remove('show');
  };

  // ── Update UI ──
  function updateUI(){
    document.getElementById('todayCount').textContent=todayN;
    document.getElementById('todayRemain').textContent=Math.max(0,settings.goalCount-todayN);
    var pct=Math.round(todayN/settings.goalCount*100);
    document.getElementById('todayPct').textContent=Math.min(pct,100)+'%';
    document.getElementById('progfill').style.width=Math.min(pct,100)+'%';
    document.getElementById('progtxt').textContent=todayN+' / '+settings.goalCount;

    var total=0,days=0,ks=Object.keys(hist);
    for(var i=0;i<ks.length;i++){var n=hist[ks[i]]||0;total+=n;if(n>=settings.goalCount)days++;}
    document.getElementById('ltTotal').textContent=total.toLocaleString('en-IN');
    document.getElementById('ltDays').textContent=days;
    document.getElementById('ltStreak').textContent=streak.n;
  }

  // ── Add one ──
  window.addOne=function(){
    if(todayN>=settings.goalCount) return;
    var c=cells[todayN];
    c.innerHTML='శ్రీరామ'; c.className='cell f pop';
    playSound();
    setTimeout(function(){c.classList.remove('pop');},600);
    todayN++; save(); updateUI(); checkAchievements(); renderHist();
    if(todayN>=settings.goalCount){
      var yest=new Date(); yest.setDate(yest.getDate()-1);
      var ys=yest.getFullYear()+'-'+pad(yest.getMonth()+1)+'-'+pad(yest.getDate());
      if(streak.last===ys||streak.last===today()) { if(streak.last!==today()) streak.n++; }
      else streak.n=1;
      streak.last=today();
      try{store.setItem('SR_streak',JSON.stringify(streak));}catch(e){}
      updateUI(); checkAchievements();
      document.getElementById('comptotal').textContent='🙏 '+document.getElementById('ltTotal').textContent+' | '+streak.n+' days';
      setTimeout(function(){document.getElementById('completionModal').classList.add('show');},700);
    }
  };

  // ── History ──
  function renderHist(){
    var tb=document.getElementById('histbody');
    tb.innerHTML='';
    var ks=Object.keys(hist).sort().reverse();
    if(!ks.length){tb.innerHTML='<tr><td colspan="3">—</td></tr>';return;}
    for(var i=0;i<ks.length;i++){
      var d=ks[i],n=hist[d]||0,done=n>=settings.goalCount;
      var tr=document.createElement('tr');
      var status=done?'✅':'⏳ '+Math.round(n/settings.goalCount*100)+'%';
      tr.innerHTML='<td>'+fmtD(d)+'</td><td class="'+(done?'done':'')+'">'+n+'</td><td>'+status+'</td>';
      tb.appendChild(tr);
    }
  }

  window.toggleHist=function(){
    var w=document.getElementById('histwrap'); w.classList.toggle('open');
  };

  // ── Manual save/restore ──
  window.manualSave=function(){
    var data=JSON.stringify({d:today(),n:todayN,h:hist,s:streak,st:settings,ach:achievements});
    var code=btoa(unescape(encodeURIComponent(data)));
    document.getElementById('savecode').textContent=code.substring(0,60)+'...';
    if(navigator.clipboard){navigator.clipboard.writeText(code).then(function(){setSaveStatus('save-ok',t('saved'));}); }
  };

  window.showRestore=function(){
    var code=window.prompt('Paste backup code:');
    if(!code||!code.trim()) return;
    try{
      var data=JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
      if(data.n!==undefined){todayN=data.n;}
      if(data.h){hist=data.h;}
      if(data.s){streak=data.s;}
      if(data.st){settings=Object.assign(settings,data.st);}
      if(data.ach){achievements=data.ach;}
      for(var i=0;i<T;i++){cells[i].className='cell';cells[i].innerHTML='<span style="opacity:.12;font-size:60%">रा</span>';}
      for(var i=0;i<todayN;i++){cells[i].innerHTML='శ్రీరామ';cells[i].className='cell f';}
      save(); updateUI(); renderHist(); loadSettings();
      setSaveStatus('save-ok','✅ Restored');
    }catch(e){
      setSaveStatus('save-warn',t('saveFailed'));
    }
  };

  window.exportData=function(){
    var data=JSON.stringify({date:today(),count:todayN,history:hist,streak:streak,settings:settings,achievements:achievements},null,2);
    var blob=new Blob([data],{type:'application/json'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url; a.download='srirama_'+today()+'.json';
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Mic ──
  window.toggleMic=function(){
    if(!('webkitSpeechRecognition' in window)&&!('SpeechRecognition' in window)){
      setV('',t('micDisabled'));return;
    }
    listening?stopMic():startMic();
  };
  
  function startMic(){
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    rec=new SR(); 
    rec.lang=(currentLang==='hi'?'hi-IN':currentLang==='kn'?'kn-IN':'te-IN'); 
    rec.continuous=true; rec.interimResults=true; rec.maxAlternatives=5;
    rec.onstart=function(){listening=true;document.getElementById('micBtn').classList.add('on');setV('act',t('listening'));};
    rec.onresult=function(e){
      var now=Date.now(); if(now-lastT<CD) return;
      for(var i=e.resultIndex;i<e.results.length;i++)
        for(var j=0;j<e.results[i].length;j++){
          var txt=e.results[i][j].transcript.toLowerCase().trim();
          if(matchRama(txt)){lastT=now;addOne();setV('ok',t('heard'));setTimeout(function(){if(listening)setV('act',t('listening'));},1500);return;}
        }
    };
    rec.onerror=function(e){if(e.error==='no-speech'||e.error==='aborted')return;if(e.error==='not-allowed'){setV('',t('micDisabled'));stopMic();return;}};
    rec.onend=function(){if(listening)setTimeout(function(){if(listening)try{rec.start();}catch(e){}},500);};
    try{rec.start();}catch(e){setV('','Error: '+e.message);}
  }
  
  function stopMic(){
    listening=false;
    if(rec){try{rec.abort();}catch(e){}rec=null;}
    document.getElementById('micBtn').classList.remove('on');
    setV('',t('micStopped'));
  }
  
  function setV(c,m){var el=document.getElementById('vstatus');el.className='vstatus'+(c?' '+c:'');el.textContent=m;}
  
  function matchRama(txt){
    var names=translations[currentLang].ramaNames;
    for(var i=0;i<names.length;i++)if(txt.indexOf(names[i].toLowerCase())!==-1)return true;
    return false;
  }

  // ── Reset ──
  window.resetToday=function(){
    if(!todayN) {alert(t('noResetNeeded'));return;}
    if(!confirm(t('resetConfirm').replace('{count}',todayN))) return;
    todayN=0; stopMic();
    for(var i=0;i<T;i++){cells[i].className='cell';cells[i].innerHTML='<span style="opacity:.12;font-size:60%">रा</span>';}
    save(); updateUI(); renderHist();
    setV('',t('listening'));
  };

  load();
})();
