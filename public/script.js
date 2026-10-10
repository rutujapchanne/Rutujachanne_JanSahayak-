/* ═══════════════════════════════════════════════════════════════════════════
   JanSahayak AI — script.js
   Voice-first civic AI chatbot frontend
   Vanilla JS — no frameworks, no external libraries
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

// ─── i18n translations ────────────────────────────────────────────────────────
const I18N = {
  en: {
    tagline:             'Speak Your Need. Discover Your Opportunities.',
    heroGreeting:        'Namaste! What opportunity are you looking for?',
    heroSubtitle:        'Just speak in your preferred language. We\'ll help you find relevant information.',
    tapToSpeak:          'Tap to Speak',
    listening:           'Listening... Speak now',
    recognizing:         'Understanding your words...',
    searching:           'Finding relevant opportunities...',
    preparing:           'Preparing your answer...',
    placeholder:         'Ask about scholarships, schemes, skills...',
    micDenied:           'Microphone access denied. Please use text input.',
    micUnavailable:      'Voice input not supported in this browser. Text search is fully available.',
    noResults:           'No matching opportunities found in our catalog.',
    saveOpportunity:     'Save',
    savedOpportunity:    'Saved ✓',
    openWebsite:         'Official Website',
    readAloud:           'Read Aloud',
    stopReading:         'Stop',
    newChat:             'New Chat',
    clearHistory:        'Clear History',
    selectLanguage:      'Select Language',
    recentChats:         'Recent Conversations',
    savedOpportunities:  'Saved Opportunities',
    noSaved:             'No saved opportunities yet.',
    privacyNote:         'Conversations are stored locally on your device only. No personal data is sent to any server.',
    tryAsking:           'Try asking:',
    heardYouSay:         'I heard you say:',
    skipToContent:       'Skip to main content',
    eligibility:         'Eligibility',
    documents:           'Documents Required',
    benefits:            'Benefits',
    needsVerification:   'Needs Verification',
    viewDetails:         'View Details',
    hideDetails:         'Hide Details',
    suggestedFollowUps:  'You might also ask:',
    preparingAnswer:     'Preparing your answer...',
    errorRetry:          'Something went wrong. Please try again.',
    errorNetwork:        'Network error. Please check your connection.',
    errorRateLimit:      'Too many requests. Please wait a moment.',
    micPermission:       'Microphone access is required for voice search. Please allow it in your browser settings.',
    micHardware:         'No microphone found. Please use text input.',
    micNetworkError:     'Voice recognition failed. Please try again or use text input.',
    voiceCancelled:      'Voice search cancelled.',
    sendBtn:             'Send',
    cancelBtn:           'Cancel',
    aiUnavailable:       '(AI unavailable — showing catalog results only)',
    stateNational:       'National',
    stateMaharashtra:    'Maharashtra',
  },
  hi: {
    tagline:             'अपनी ज़रूरत बोलें। अपने अवसर खोजें।',
    heroGreeting:        'नमस्ते! आप कौन सा अवसर खोज रहे हैं?',
    heroSubtitle:        'बस अपनी पसंदीदा भाषा में बोलें। हम आपको प्रासंगिक जानकारी खोजने में मदद करेंगे।',
    tapToSpeak:          'बोलने के लिए टैप करें',
    listening:           'सुन रहा हूँ... अभी बोलें',
    recognizing:         'आपके शब्द समझ रहा हूँ...',
    searching:           'संबंधित अवसर खोज रहा हूँ...',
    preparing:           'आपका जवाब तैयार कर रहा हूँ...',
    placeholder:         'छात्रवृत्ति, योजनाओं, कौशल के बारे में पूछें...',
    micDenied:           'माइक्रोफोन एक्सेस अस्वीकृत। कृपया टेक्स्ट इनपुट का उपयोग करें।',
    micUnavailable:      'इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। टेक्स्ट खोज पूरी तरह उपलब्ध है।',
    noResults:           'हमारे कैटालॉग में कोई मिलान नहीं मिला।',
    saveOpportunity:     'सहेजें',
    savedOpportunity:    'सहेजा गया ✓',
    openWebsite:         'आधिकारिक वेबसाइट',
    readAloud:           'जोर से पढ़ें',
    stopReading:         'रोकें',
    newChat:             'नई बातचीत',
    clearHistory:        'इतिहास साफ करें',
    selectLanguage:      'भाषा चुनें',
    recentChats:         'हाल की बातचीत',
    savedOpportunities:  'सहेजे गए अवसर',
    noSaved:             'अभी तक कोई सहेजा गया अवसर नहीं।',
    privacyNote:         'बातचीत केवल आपके डिवाइस पर स्थानीय रूप से संग्रहीत है। कोई व्यक्तिगत डेटा सर्वर पर नहीं भेजा जाता।',
    tryAsking:           'यह पूछें:',
    heardYouSay:         'मैंने सुना:',
    skipToContent:       'मुख्य सामग्री पर जाएं',
    eligibility:         'पात्रता',
    documents:           'आवश्यक दस्तावेज़',
    benefits:            'लाभ',
    needsVerification:   'सत्यापन आवश्यक',
    viewDetails:         'विवरण देखें',
    hideDetails:         'विवरण छिपाएं',
    suggestedFollowUps:  'आप यह भी पूछ सकते हैं:',
    preparingAnswer:     'आपका जवाब तैयार हो रहा है...',
    errorRetry:          'कुछ गलत हुआ। कृपया फिर कोशिश करें।',
    errorNetwork:        'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
    errorRateLimit:      'बहुत अधिक अनुरोध। कृपया थोड़ी देर प्रतीक्षा करें।',
    micPermission:       'वॉइस खोज के लिए माइक्रोफोन एक्सेस आवश्यक है। कृपया अपने ब्राउज़र सेटिंग में इसे अनुमति दें।',
    micHardware:         'कोई माइक्रोफोन नहीं मिला। कृपया टेक्स्ट इनपुट का उपयोग करें।',
    micNetworkError:     'वॉइस पहचान विफल हुई। कृपया फिर कोशिश करें या टेक्स्ट इनपुट का उपयोग करें।',
    voiceCancelled:      'वॉइस खोज रद्द की गई।',
    sendBtn:             'भेजें',
    cancelBtn:           'रद्द करें',
    aiUnavailable:       '(AI अनुपलब्ध — केवल कैटालॉग परिणाम दिखाए जा रहे हैं)',
    stateNational:       'राष्ट्रीय',
    stateMaharashtra:    'महाराष्ट्र',
  },
  mr: {
    tagline:             'तुमची गरज सांगा. तुमच्या संधी शोधा.',
    heroGreeting:        'नमस्कार! तुम्ही कोणती संधी शोधत आहात?',
    heroSubtitle:        'फक्त तुमच्या आवडत्या भाषेत बोला. आम्ही तुम्हाला संबंधित माहिती शोधण्यात मदत करू.',
    tapToSpeak:          'बोलण्यासाठी टॅप करा',
    listening:           'ऐकत आहे... आता बोला',
    recognizing:         'तुमचे शब्द समजत आहे...',
    searching:           'संबंधित संधी शोधत आहे...',
    preparing:           'तुमचे उत्तर तयार करत आहे...',
    placeholder:         'शिष्यवृत्ती, योजना, कौशल्याबद्दल विचारा...',
    micDenied:           'मायक्रोफोन प्रवेश नाकारला. कृपया मजकूर इनपुट वापरा.',
    micUnavailable:      'या ब्राउझरमध्ये व्हॉइस इनपुट समर्थित नाही. मजकूर शोध पूर्णपणे उपलब्ध आहे.',
    noResults:           'आमच्या कॅटलॉगमध्ये कोणताही जुळणारा परिणाम नाही.',
    saveOpportunity:     'जतन करा',
    savedOpportunity:    'जतन केले ✓',
    openWebsite:         'अधिकृत वेबसाइट',
    readAloud:           'मोठ्याने वाचा',
    stopReading:         'थांबा',
    newChat:             'नवीन संभाषण',
    clearHistory:        'इतिहास साफ करा',
    selectLanguage:      'भाषा निवडा',
    recentChats:         'अलीकडील संभाषणे',
    savedOpportunities:  'जतन केलेल्या संधी',
    noSaved:             'अद्याप कोणत्याही संधी जतन केल्या नाहीत.',
    privacyNote:         'संभाषणे फक्त तुमच्या डिव्हाइसवर स्थानिकरित्या संग्रहित केली जातात. कोणताही वैयक्तिक डेटा सर्व्हरवर पाठवला जात नाही.',
    tryAsking:           'हे विचारण्याचा प्रयत्न करा:',
    heardYouSay:         'मी ऐकले:',
    skipToContent:       'मुख्य सामग्रीवर जा',
    eligibility:         'पात्रता',
    documents:           'आवश्यक कागदपत्रे',
    benefits:            'फायदे',
    needsVerification:   'सत्यापन आवश्यक',
    viewDetails:         'तपशील पहा',
    hideDetails:         'तपशील लपवा',
    suggestedFollowUps:  'तुम्ही हे देखील विचारू शकता:',
    preparingAnswer:     'तुमचे उत्तर तयार होत आहे...',
    errorRetry:          'काहीतरी चुकीचे झाले. कृपया पुन्हा प्रयत्न करा.',
    errorNetwork:        'नेटवर्क त्रुटी. कृपया तुमचे कनेक्शन तपासा.',
    errorRateLimit:      'खूप जास्त विनंत्या. कृपया थोडी प्रतीक्षा करा.',
    micPermission:       'व्हॉइस शोधासाठी मायक्रोफोन प्रवेश आवश्यक आहे. कृपया तुमच्या ब्राउझर सेटिंग्जमध्ये ते परवानगी द्या.',
    micHardware:         'मायक्रोफोन सापडला नाही. कृपया मजकूर इनपुट वापरा.',
    micNetworkError:     'व्हॉइस ओळख अयशस्वी झाली. कृपया पुन्हा प्रयत्न करा किंवा मजकूर इनपुट वापरा.',
    voiceCancelled:      'व्हॉइस शोध रद्द केला.',
    sendBtn:             'पाठवा',
    cancelBtn:           'रद्द करा',
    aiUnavailable:       '(AI अनुपलब्ध — फक्त कॅटलॉग निकाल दाखवत आहे)',
    stateNational:       'राष्ट्रीय',
    stateMaharashtra:    'महाराष्ट्र',
  }
};

// Suggested prompts per language
const SUGGESTED_PROMPTS = {
  en: [
    'Find scholarships for college students in Maharashtra',
    'Government skill training programs near me',
    'Health insurance schemes for poor families',
    'Startup support for entrepreneurs in Maharashtra'
  ],
  hi: [
    'महाराष्ट्र में कॉलेज छात्रों के लिए छात्रवृत्ति',
    'सरकारी कौशल प्रशिक्षण कार्यक्रम',
    'गरीब परिवारों के लिए स्वास्थ्य बीमा योजनाएं',
    'किसानों के लिए सरकारी योजनाएं'
  ],
  mr: [
    'महाराष्ट्रात महाविद्यालयीन विद्यार्थ्यांसाठी शिष्यवृत्ती',
    'सरकारी कौशल्य प्रशिक्षण कार्यक्रम',
    'गरीब कुटुंबांसाठी आरोग्य विमा योजना',
    'शेतकऱ्यांसाठी सरकारी योजना'
  ]
};

// Language → speech recognition lang code
const LANG_CODES = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

// Category → avatar emoji
const CATEGORY_AVATARS = {
  scholarship: '🎓',
  skill:       '🛠️',
  employment:  '💼',
  health:      '🏥',
  welfare:     '🏛️'
};

// ─── App state ────────────────────────────────────────────────────────────────
const state = {
  language:         'en',
  voiceState:       'idle',   // idle|listening|recognizing|searching|responding|error
  isRequestInFlight: false,
  recognition:      null,
  synthesis:        window.speechSynthesis || null,
  currentUtterance: null,
  conversationHistory: [],    // { role: 'user'|'assistant', content: string }
  sessions:         [],       // [ { id, timestamp, title, history } ]
  currentSessionId: null,
  savedOpportunities: {},     // { id: opportunity }
  micSupported:     false,
  recognitionActive: false,
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const dom = {};

function cacheDom() {
  dom.appShell            = document.getElementById('app-shell');
  dom.sidebar             = document.getElementById('sidebar');
  dom.sidebarClose        = document.getElementById('sidebar-close');
  dom.sidebarToggle       = document.getElementById('sidebar-toggle');
  dom.sidebarOverlay      = document.getElementById('sidebar-overlay');
  dom.newChatBtn          = document.getElementById('new-chat-btn');
  dom.conversationList    = document.getElementById('conversation-list');
  dom.savedList           = document.getElementById('saved-list');
  dom.emptySaved          = document.getElementById('empty-saved');
  dom.clearHistoryBtn     = document.getElementById('clear-history-btn');
  dom.langSelectSidebar   = document.getElementById('language-select-sidebar');
  dom.langSelectTopbar    = document.getElementById('language-select-topbar');
  dom.welcomeHero         = document.getElementById('welcome-hero');
  dom.chatArea            = document.getElementById('chat-area');
  dom.chatMessages        = document.getElementById('chat-messages');
  dom.micBtnHero          = document.getElementById('mic-button-hero');
  dom.micBtnInput         = document.getElementById('mic-button-input');
  dom.micStatusHero       = document.getElementById('mic-status-hero');
  dom.transcriptPreview   = document.getElementById('transcript-preview');
  dom.transcriptText      = document.getElementById('transcript-text');
  dom.promptsGridHero     = document.getElementById('prompts-grid-hero');
  dom.statusStrip         = document.getElementById('status-strip');
  dom.statusText          = document.getElementById('status-text');
  dom.textInput           = document.getElementById('text-input');
  dom.sendButton          = document.getElementById('send-button');
  dom.micUnsupportedNotice = document.getElementById('mic-unsupported-notice');
  dom.suggestedPromptsHero = document.getElementById('suggested-prompts-hero');

  // Templates
  dom.msgTemplate         = document.getElementById('message-template');
  dom.cardTemplate        = document.getElementById('opportunity-card-template');
  dom.convItemTemplate    = document.getElementById('conversation-item-template');
  dom.savedItemTemplate   = document.getElementById('saved-item-template');
  dom.loadingTemplate     = document.getElementById('loading-template');
}

// ─── i18n ─────────────────────────────────────────────────────────────────────
function t(key) {
  return (I18N[state.language] && I18N[state.language][key]) ||
         (I18N.en[key]) ||
         key;
}

function applyI18n() {
  document.documentElement.lang = state.language === 'en' ? 'en' : state.language === 'hi' ? 'hi' : 'mr';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (translation) el.textContent = translation;
  });

  // Placeholder for text input
  if (dom.textInput) dom.textInput.placeholder = t('placeholder');

  // Mic status label
  if (dom.micStatusHero) {
    const span = dom.micStatusHero.querySelector('[data-i18n]');
    if (span) span.textContent = t('tapToSpeak');
  }

  // Update suggested prompts
  renderSuggestedPrompts();
}

// ─── Voice state machine ──────────────────────────────────────────────────────
const STATE_CLASSES = ['state-idle', 'state-listening', 'state-recognizing',
                       'state-searching', 'state-responding', 'state-error'];

function setVoiceState(newState, message) {
  state.voiceState = newState;

  STATE_CLASSES.forEach(cls => dom.appShell.classList.remove(cls));
  dom.appShell.classList.add(`state-${newState}`);

  const statusMessages = {
    idle:        '',
    listening:   t('listening'),
    recognizing: t('recognizing'),
    searching:   t('searching'),
    responding:  t('preparing'),
    error:       message || t('errorRetry')
  };

  const statusMsg = message || statusMessages[newState] || '';

  // Status strip
  if (statusMsg) {
    dom.statusStrip.hidden = false;
    dom.statusText.textContent = statusMsg;
  } else {
    dom.statusStrip.hidden = true;
  }

  // Hero mic label
  if (dom.micStatusHero) {
    const span = dom.micStatusHero.querySelector('[data-i18n]') || dom.micStatusHero;
    span.textContent = newState === 'idle' ? t('tapToSpeak') : (statusMsg || t('tapToSpeak'));
  }

  // Aria pressed on mic buttons
  const isListening = newState === 'listening';
  dom.micBtnHero.setAttribute('aria-pressed', String(isListening));
  dom.micBtnInput.setAttribute('aria-pressed', String(isListening));
}

// ─── Speech Recognition ───────────────────────────────────────────────────────
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    state.micSupported = false;
    dom.micBtnHero.classList.add('mic-disabled');
    dom.micBtnHero.disabled = true;
    dom.micBtnInput.classList.add('mic-disabled');
    dom.micBtnInput.disabled = true;
    dom.micUnsupportedNotice.hidden = false;
    return;
  }
  state.micSupported = true;
}

function startRecognition() {
  if (!state.micSupported) {
    showStatus(t('micUnavailable'), 'error');
    return;
  }
  if (state.recognitionActive) {
    stopRecognition();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = LANG_CODES[state.language] || 'en-IN';
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  state.recognition = recognition;
  state.recognitionActive = true;

  recognition.onstart = () => {
    setVoiceState('listening');
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    const currentText = finalTranscript || interimTranscript;
    if (currentText) {
      showTranscriptPreview(currentText, !!finalTranscript);
    }

    if (finalTranscript) {
      setVoiceState('recognizing');
      // Place in text input for user review — do NOT auto-submit
      dom.textInput.value = finalTranscript.trim();
      dom.textInput.dispatchEvent(new Event('input'));
    }
  };

  recognition.onerror = (event) => {
    state.recognitionActive = false;
    switch (event.error) {
      case 'not-allowed':
      case 'permission-denied':
        setVoiceState('error', t('micDenied'));
        break;
      case 'no-speech':
        setVoiceState('idle');
        break;
      case 'audio-capture':
        setVoiceState('error', t('micHardware'));
        break;
      case 'network':
        setVoiceState('error', t('micNetworkError'));
        break;
      default:
        setVoiceState('error', t('micNetworkError'));
    }
  };

  recognition.onend = () => {
    state.recognitionActive = false;
    if (state.voiceState === 'listening' || state.voiceState === 'recognizing') {
      setVoiceState('idle');
    }
  };

  try {
    recognition.start();
  } catch (err) {
    state.recognitionActive = false;
    setVoiceState('error', t('micNetworkError'));
  }
}

function stopRecognition() {
  if (state.recognition && state.recognitionActive) {
    state.recognition.stop();
    state.recognitionActive = false;
  }
  if (state.voiceState === 'listening' || state.voiceState === 'recognizing') {
    setVoiceState('idle', t('voiceCancelled'));
  }
}

function showTranscriptPreview(text, isFinal) {
  dom.transcriptPreview.hidden = false;
  dom.transcriptText.textContent = text;
  if (isFinal) {
    dom.transcriptPreview.classList.add('final');
  } else {
    dom.transcriptPreview.classList.remove('final');
  }
}

function hideTranscriptPreview() {
  dom.transcriptPreview.hidden = true;
  dom.transcriptText.textContent = '';
}

// ─── Speech Synthesis ─────────────────────────────────────────────────────────
function speakText(text, button) {
  if (!state.synthesis) return;

  // Stop any current speech
  state.synthesis.cancel();

  if (button && button.classList.contains('speaking')) {
    button.classList.remove('speaking');
    const label = button.querySelector('.speak-btn-label');
    if (label) label.textContent = t('readAloud');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_CODES[state.language] || 'en-IN';
  utterance.rate = 0.9;

  // Try to find a matching voice
  const voices = state.synthesis.getVoices();
  const langCode = LANG_CODES[state.language];
  const matchingVoice = voices.find(v => v.lang === langCode) ||
                        voices.find(v => v.lang.startsWith(state.language));
  if (matchingVoice) utterance.voice = matchingVoice;

  utterance.onend = () => {
    if (button) {
      button.classList.remove('speaking');
      const label = button.querySelector('.speak-btn-label');
      if (label) label.textContent = t('readAloud');
    }
  };

  utterance.onerror = () => {
    if (button) {
      button.classList.remove('speaking');
      const label = button.querySelector('.speak-btn-label');
      if (label) label.textContent = t('readAloud');
    }
  };

  state.currentUtterance = utterance;
  state.synthesis.speak(utterance);

  if (button) {
    button.classList.add('speaking');
    const label = button.querySelector('.speak-btn-label');
    if (label) label.textContent = t('stopReading');
  }
}

// ─── API search ───────────────────────────────────────────────────────────────
async function performSearch(query, inputMode = 'text') {
  if (!query || !query.trim()) return;
  if (state.isRequestInFlight) return;

  const trimmedQuery = query.trim();

  // Show chat area, hide welcome hero
  showChatArea();

  // Add user message
  appendUserMessage(trimmedQuery);

  // Add to history
  state.conversationHistory.push({ role: 'user', content: trimmedQuery });
  if (state.conversationHistory.length > 20) {
    state.conversationHistory = state.conversationHistory.slice(-20);
  }

  // Clear input
  dom.textInput.value = '';
  dom.textInput.dispatchEvent(new Event('input'));
  hideTranscriptPreview();

  // Show loading
  const loadingEl = appendLoadingMessage();
  setVoiceState('searching');
  state.isRequestInFlight = true;
  dom.sendButton.disabled = true;

  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: trimmedQuery,
        language: state.language,
        inputMode,
        history: state.conversationHistory.slice(-10)
      })
    });

    // Remove loading
    if (loadingEl && loadingEl.parentNode) loadingEl.remove();

    if (!response.ok) {
      let errorKey = 'errorRetry';
      if (response.status === 429) errorKey = 'errorRateLimit';
      else if (response.status >= 500) errorKey = 'errorRetry';
      appendErrorMessage(t(errorKey));
      setVoiceState('error', t(errorKey));
      return;
    }

    const data = await response.json();

    setVoiceState('idle');

    // Add assistant response to history
    if (data.answer) {
      state.conversationHistory.push({ role: 'assistant', content: data.answer });
    }

    // Render answer
    appendAssistantMessage(data);

    // Save session
    saveCurrentSession(trimmedQuery);

  } catch (err) {
    if (loadingEl && loadingEl.parentNode) loadingEl.remove();
    const isNetwork = err instanceof TypeError;
    appendErrorMessage(t(isNetwork ? 'errorNetwork' : 'errorRetry'));
    setVoiceState('error', t(isNetwork ? 'errorNetwork' : 'errorRetry'));
  } finally {
    state.isRequestInFlight = false;
    dom.sendButton.disabled = dom.textInput.value.trim().length === 0;
  }
}

// ─── Chat rendering ───────────────────────────────────────────────────────────
function showChatArea() {
  dom.welcomeHero.style.display = 'none';
  dom.chatArea.classList.add('visible');
}

function showWelcomeHero() {
  dom.welcomeHero.style.display = '';
  dom.chatArea.classList.remove('visible');
  dom.chatMessages.innerHTML = '';
}

function appendUserMessage(text) {
  const clone = dom.msgTemplate.content.cloneNode(true);
  const msgEl = clone.querySelector('.message');
  msgEl.classList.add('message-user');

  const avatar = msgEl.querySelector('.message-avatar');
  avatar.textContent = '👤';
  avatar.setAttribute('aria-label', 'You');

  const content = msgEl.querySelector('.message-content');
  content.textContent = text;

  dom.chatMessages.appendChild(clone);
  scrollToBottom();
}

function appendAssistantMessage(data) {
  const clone = dom.msgTemplate.content.cloneNode(true);
  const msgEl = clone.querySelector('.message');
  msgEl.classList.add('message-assistant');

  const avatar = msgEl.querySelector('.message-avatar');
  avatar.textContent = '🪔';
  avatar.setAttribute('aria-label', 'JanSahayak AI');

  const content = msgEl.querySelector('.message-content');
  content.textContent = data.answer || '';

  // AI unavailable notice
  if (data.answer && !data.aiAvailable) {
    const note = document.createElement('div');
    note.style.cssText = 'font-size:0.75rem;color:var(--color-text-light);margin-top:6px;';
    note.textContent = t('aiUnavailable');
    content.appendChild(note);
  }

  // Speak button (only if synthesis supported)
  const actionsEl = msgEl.querySelector('.message-actions');
  if (state.synthesis && data.answer) {
    actionsEl.hidden = false;
    const speakBtn = actionsEl.querySelector('.speak-btn');
    speakBtn.addEventListener('click', () => {
      speakText(data.answer, speakBtn);
    });
  }

  // Opportunity cards
  if (data.opportunities && data.opportunities.length > 0) {
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'opp-cards-container';
    data.opportunities.forEach(opp => {
      const card = buildOpportunityCard(opp);
      cardsContainer.appendChild(card);
    });
    msgEl.querySelector('.message-body').appendChild(cardsContainer);
  }

  // Follow-up chips
  if (data.followUpSuggestions && data.followUpSuggestions.length > 0) {
    const followUps = msgEl.querySelector('.follow-up-chips');
    followUps.hidden = false;
    const chipsRow = followUps.querySelector('.chips-row');
    const label = followUps.querySelector('.chips-label');
    label.textContent = t('suggestedFollowUps');
    data.followUpSuggestions.forEach(suggestion => {
      const chip = document.createElement('button');
      chip.className = 'followup-chip';
      chip.type = 'button';
      chip.textContent = suggestion;
      chip.setAttribute('aria-label', `Ask: ${suggestion}`);
      chip.addEventListener('click', () => {
        dom.textInput.value = suggestion;
        dom.textInput.dispatchEvent(new Event('input'));
        performSearch(suggestion, 'text');
      });
      chipsRow.appendChild(chip);
    });
  }

  dom.chatMessages.appendChild(clone);
  scrollToBottom();
}

function appendErrorMessage(message) {
  const clone = dom.msgTemplate.content.cloneNode(true);
  const msgEl = clone.querySelector('.message');
  msgEl.classList.add('message-assistant', 'message-error');

  const avatar = msgEl.querySelector('.message-avatar');
  avatar.textContent = '⚠️';

  const content = msgEl.querySelector('.message-content');
  content.textContent = message;

  // Retry button
  const retryBtn = document.createElement('button');
  retryBtn.className = 'opp-btn opp-toggle-btn';
  retryBtn.style.marginTop = '8px';
  retryBtn.textContent = '↩ ' + t('errorRetry').replace('Something went wrong. ', '').replace('कुछ गलत हुआ। ', '').replace('काहीतरी चुकीचे झाले. ', '');
  retryBtn.addEventListener('click', () => {
    const lastUserMsg = [...dom.chatMessages.querySelectorAll('.message-user .message-content')].slice(-1)[0];
    if (lastUserMsg) performSearch(lastUserMsg.textContent);
  });
  msgEl.querySelector('.message-body').appendChild(retryBtn);

  dom.chatMessages.appendChild(clone);
  scrollToBottom();
}

function appendLoadingMessage() {
  const clone = dom.loadingTemplate.content.cloneNode(true);
  const loadingEl = clone.querySelector('.message-loading');
  dom.chatMessages.appendChild(clone);
  scrollToBottom();
  return dom.chatMessages.querySelector('.message-loading:last-child');
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
  });
}

// ─── Opportunity card builder ─────────────────────────────────────────────────
function buildOpportunityCard(opp) {
  const clone = dom.cardTemplate.content.cloneNode(true);
  const card = clone.querySelector('.opp-card');

  card.setAttribute('id', `card-${opp.id}`);
  card.setAttribute('aria-labelledby', `card-title-${opp.id}`);

  // Category badge
  const catBadge = card.querySelector('.opp-category-badge');
  catBadge.textContent = opp.category;
  catBadge.classList.add(`badge-${opp.category}`);

  // State badge
  const stateBadge = card.querySelector('.opp-state-badge');
  stateBadge.textContent = opp.state === 'Maharashtra' ? t('stateMaharashtra') : t('stateNational');

  // Title
  const titleEl = card.querySelector('.opp-title');
  titleEl.setAttribute('id', `card-title-${opp.id}`);
  titleEl.textContent = opp.title;

  // Audience
  card.querySelector('.opp-audience').textContent = opp.audience;

  // Description
  card.querySelector('.opp-description').textContent = opp.description;

  // Eligibility list
  const eligList = card.querySelector('.opp-eligibility-list');
  (opp.eligibility || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    eligList.appendChild(li);
  });

  // Documents list
  const docsList = card.querySelector('.opp-documents-list');
  (opp.documents || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    docsList.appendChild(li);
  });

  // Benefits
  card.querySelector('.opp-benefits-text').textContent = opp.benefits || '';

  // Needs verification
  const verifySection = card.querySelector('.opp-verify-section');
  const verifyList = card.querySelector('.opp-verify-list');
  if (opp.needsVerification && opp.needsVerification.length > 0) {
    verifySection.hidden = false;
    opp.needsVerification.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      verifyList.appendChild(li);
    });
  }

  // Toggle details button
  const toggleBtn = card.querySelector('.opp-toggle-btn');
  const detailsEl = card.querySelector('.opp-details');
  toggleBtn.querySelector('[data-i18n]').textContent = t('viewDetails');
  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    detailsEl.hidden = isExpanded;
    toggleBtn.querySelector('[data-i18n]').textContent = isExpanded ? t('viewDetails') : t('hideDetails');
  });

  // Official website link
  const linkBtn = card.querySelector('.opp-link-btn');
  linkBtn.setAttribute('href', opp.officialUrl || '#');
  linkBtn.setAttribute('aria-label', `Open official website for ${opp.title}`);
  linkBtn.querySelector('[data-i18n]').textContent = t('openWebsite');

  // Save button
  const saveBtn = card.querySelector('.opp-save-btn');
  const isSaved = !!state.savedOpportunities[opp.id];
  saveBtn.setAttribute('aria-pressed', String(isSaved));
  saveBtn.setAttribute('aria-label', `Save ${opp.title}`);
  saveBtn.querySelector('.save-btn-label').textContent = isSaved ? t('savedOpportunity') : t('saveOpportunity');

  saveBtn.addEventListener('click', () => {
    toggleSaveOpportunity(opp, saveBtn);
  });

  return card;
}

// ─── Save opportunity ─────────────────────────────────────────────────────────
function toggleSaveOpportunity(opp, btn) {
  const isSaved = !!state.savedOpportunities[opp.id];
  if (isSaved) {
    delete state.savedOpportunities[opp.id];
    btn.setAttribute('aria-pressed', 'false');
    btn.querySelector('.save-btn-label').textContent = t('saveOpportunity');
  } else {
    state.savedOpportunities[opp.id] = opp;
    btn.setAttribute('aria-pressed', 'true');
    btn.querySelector('.save-btn-label').textContent = t('savedOpportunity');
  }
  persistSaved();
  renderSavedList();
}

function renderSavedList() {
  dom.savedList.innerHTML = '';
  const saved = Object.values(state.savedOpportunities);
  dom.emptySaved.style.display = saved.length === 0 ? '' : 'none';

  saved.forEach(opp => {
    const clone = dom.savedItemTemplate.content.cloneNode(true);
    const btn = clone.querySelector('.saved-item-btn');
    const icon = clone.querySelector('.saved-item-icon');
    const text = clone.querySelector('.saved-item-text');
    icon.textContent = CATEGORY_AVATARS[opp.category] || '⭐';
    text.textContent = opp.title;
    btn.setAttribute('aria-label', `View saved: ${opp.title}`);
    btn.addEventListener('click', () => {
      performSearch(`Tell me more about ${opp.title}`, 'text');
      closeSidebar();
    });
    dom.savedList.appendChild(clone);
  });
}

// ─── Session / conversation history ──────────────────────────────────────────
function newSession() {
  // Save current session first
  if (state.conversationHistory.length > 0 && state.currentSessionId) {
    updateSession(state.currentSessionId);
  }

  state.currentSessionId = Date.now().toString();
  state.conversationHistory = [];
  showWelcomeHero();
  setVoiceState('idle');
  dom.textInput.value = '';
  dom.sendButton.disabled = true;
  stopRecognition();
  if (state.synthesis) state.synthesis.cancel();
}

function saveCurrentSession(firstQuery) {
  if (!state.currentSessionId) {
    state.currentSessionId = Date.now().toString();
  }

  const existingIndex = state.sessions.findIndex(s => s.id === state.currentSessionId);
  const session = {
    id: state.currentSessionId,
    timestamp: Date.now(),
    title: firstQuery.slice(0, 60),
    history: [...state.conversationHistory]
  };

  if (existingIndex >= 0) {
    state.sessions[existingIndex] = session;
  } else {
    state.sessions.unshift(session);
    if (state.sessions.length > 20) state.sessions = state.sessions.slice(0, 20);
  }

  persistSessions();
  renderConversationList();
}

function updateSession(sessionId) {
  const idx = state.sessions.findIndex(s => s.id === sessionId);
  if (idx >= 0) {
    state.sessions[idx].history = [...state.conversationHistory];
    persistSessions();
  }
}

function loadSession(session) {
  state.currentSessionId = session.id;
  state.conversationHistory = session.history || [];

  showChatArea();
  dom.chatMessages.innerHTML = '';

  for (let i = 0; i < state.conversationHistory.length; i++) {
    const msg = state.conversationHistory[i];
    if (msg.role === 'user') {
      appendUserMessage(msg.content);
    } else {
      // Restore assistant message as plain text (no cards, since we don't have opportunity data)
      const clone = dom.msgTemplate.content.cloneNode(true);
      const msgEl = clone.querySelector('.message');
      msgEl.classList.add('message-assistant');
      const avatar = msgEl.querySelector('.message-avatar');
      avatar.textContent = '🪔';
      const content = msgEl.querySelector('.message-content');
      content.textContent = msg.content;
      dom.chatMessages.appendChild(clone);
    }
  }
  scrollToBottom();
  closeSidebar();
}

function renderConversationList() {
  dom.conversationList.innerHTML = '';
  state.sessions.slice(0, 10).forEach(session => {
    const clone = dom.convItemTemplate.content.cloneNode(true);
    const btn = clone.querySelector('.conv-item-btn');
    const text = clone.querySelector('.conv-item-text');
    text.textContent = session.title;
    btn.setAttribute('aria-label', `Open conversation: ${session.title}`);
    btn.addEventListener('click', () => loadSession(session));
    dom.conversationList.appendChild(clone);
  });
}

// ─── Suggested prompts ────────────────────────────────────────────────────────
function renderSuggestedPrompts() {
  if (!dom.promptsGridHero) return;
  dom.promptsGridHero.innerHTML = '';
  const prompts = SUGGESTED_PROMPTS[state.language] || SUGGESTED_PROMPTS.en;
  prompts.forEach(prompt => {
    const chip = document.createElement('button');
    chip.className = 'prompt-chip';
    chip.type = 'button';
    chip.textContent = prompt;
    chip.setAttribute('aria-label', `Search: ${prompt}`);
    chip.setAttribute('role', 'listitem');
    chip.addEventListener('click', () => {
      performSearch(prompt, 'text');
    });
    dom.promptsGridHero.appendChild(chip);
  });
}

// ─── Sidebar controls ─────────────────────────────────────────────────────────
function openSidebar() {
  dom.sidebar.classList.add('open');
  dom.sidebarOverlay.classList.add('active');
  dom.sidebarToggle.setAttribute('aria-expanded', 'true');
  dom.sidebarClose.focus();
}

function closeSidebar() {
  dom.sidebar.classList.remove('open');
  dom.sidebarOverlay.classList.remove('active');
  dom.sidebarToggle.setAttribute('aria-expanded', 'false');
}

function showStatus(message, type) {
  dom.statusStrip.hidden = false;
  dom.statusText.textContent = message;
  STATE_CLASSES.forEach(cls => dom.appShell.classList.remove(cls));
  dom.appShell.classList.add(`state-${type || 'idle'}`);
}

// ─── Language switching ───────────────────────────────────────────────────────
function switchLanguage(lang) {
  if (!['en', 'hi', 'mr'].includes(lang)) return;
  state.language = lang;

  // Sync both selectors
  dom.langSelectSidebar.value = lang;
  dom.langSelectTopbar.value = lang;

  // Update recognition lang if active
  if (state.recognition) {
    state.recognition.lang = LANG_CODES[lang];
  }

  applyI18n();
  renderSavedList();
  // Update any visible card button labels
  document.querySelectorAll('.save-btn-label').forEach(el => {
    const btn = el.closest('.opp-save-btn');
    if (btn) {
      const pressed = btn.getAttribute('aria-pressed') === 'true';
      el.textContent = pressed ? t('savedOpportunity') : t('saveOpportunity');
    }
  });
}

// ─── Persistence ──────────────────────────────────────────────────────────────
const LS_SESSIONS_KEY = 'jansahayak_sessions';
const LS_SAVED_KEY    = 'jansahayak_saved';
const LS_LANG_KEY     = 'jansahayak_lang';

function persistSessions() {
  try {
    localStorage.setItem(LS_SESSIONS_KEY, JSON.stringify(state.sessions));
  } catch (_) {}
}

function persistSaved() {
  try {
    localStorage.setItem(LS_SAVED_KEY, JSON.stringify(state.savedOpportunities));
  } catch (_) {}
}

function loadFromStorage() {
  try {
    const sessions = localStorage.getItem(LS_SESSIONS_KEY);
    if (sessions) state.sessions = JSON.parse(sessions);
  } catch (_) { state.sessions = []; }

  try {
    const saved = localStorage.getItem(LS_SAVED_KEY);
    if (saved) state.savedOpportunities = JSON.parse(saved);
  } catch (_) { state.savedOpportunities = {}; }

  try {
    const lang = localStorage.getItem(LS_LANG_KEY);
    if (lang && ['en', 'hi', 'mr'].includes(lang)) state.language = lang;
  } catch (_) {}
}

function clearAllHistory() {
  state.sessions = [];
  state.conversationHistory = [];
  state.currentSessionId = null;
  try {
    localStorage.removeItem(LS_SESSIONS_KEY);
  } catch (_) {}
  renderConversationList();
  newSession();
}

// ─── Text input auto-resize ───────────────────────────────────────────────────
function autoResizeTextarea() {
  dom.textInput.style.height = 'auto';
  dom.textInput.style.height = Math.min(dom.textInput.scrollHeight, 120) + 'px';
}

// ─── Event listeners ──────────────────────────────────────────────────────────
function bindEvents() {
  // Mic buttons — both trigger same recognition
  dom.micBtnHero.addEventListener('click', () => {
    if (state.recognitionActive) {
      stopRecognition();
    } else {
      startRecognition();
    }
  });

  dom.micBtnInput.addEventListener('click', () => {
    if (state.recognitionActive) {
      stopRecognition();
    } else {
      startRecognition();
    }
  });

  // Send button
  dom.sendButton.addEventListener('click', () => {
    const query = dom.textInput.value.trim();
    if (query) performSearch(query, 'text');
  });

  // Text input — Enter to send, Shift+Enter for newline
  dom.textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const query = dom.textInput.value.trim();
      if (query && !state.isRequestInFlight) performSearch(query, 'text');
    }
  });

  // Enable/disable send button based on input
  dom.textInput.addEventListener('input', () => {
    dom.sendButton.disabled = dom.textInput.value.trim().length === 0;
    autoResizeTextarea();
  });

  // Language selectors
  dom.langSelectSidebar.addEventListener('change', (e) => {
    switchLanguage(e.target.value);
    try { localStorage.setItem(LS_LANG_KEY, e.target.value); } catch (_) {}
  });
  dom.langSelectTopbar.addEventListener('change', (e) => {
    switchLanguage(e.target.value);
    try { localStorage.setItem(LS_LANG_KEY, e.target.value); } catch (_) {}
  });

  // New chat
  dom.newChatBtn.addEventListener('click', () => {
    newSession();
    closeSidebar();
  });

  // Clear history
  dom.clearHistoryBtn.addEventListener('click', () => {
    if (window.confirm('Clear all conversation history and saved items?')) {
      clearAllHistory();
      state.savedOpportunities = {};
      try { localStorage.removeItem(LS_SAVED_KEY); } catch (_) {}
      renderSavedList();
    }
  });

  // Sidebar toggle (mobile)
  dom.sidebarToggle.addEventListener('click', openSidebar);
  dom.sidebarClose.addEventListener('click', closeSidebar);
  dom.sidebarOverlay.addEventListener('click', closeSidebar);

  // Keyboard: Escape cancels recognition or closes sidebar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.recognitionActive) {
        stopRecognition();
      } else if (dom.sidebar.classList.contains('open')) {
        closeSidebar();
      }
    }
  });

  // Stop TTS when page unloads
  window.addEventListener('beforeunload', () => {
    if (state.synthesis) state.synthesis.cancel();
    stopRecognition();
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
  cacheDom();
  loadFromStorage();

  // Set initial language selector values
  dom.langSelectSidebar.value = state.language;
  dom.langSelectTopbar.value = state.language;

  initSpeechRecognition();
  applyI18n();
  renderConversationList();
  renderSavedList();
  renderSuggestedPrompts();
  bindEvents();
  setVoiceState('idle');

  // Create first session id
  if (!state.currentSessionId) {
    state.currentSessionId = Date.now().toString();
  }

  // Load voices for TTS (async in some browsers)
  if (state.synthesis) {
    state.synthesis.getVoices();
    state.synthesis.addEventListener('voiceschanged', () => {
      state.synthesis.getVoices(); // cache voices
    });
  }

  console.log('[JanSahayak] App initialized. Language:', state.language, '| Mic:', state.micSupported);
}

// Boot
document.addEventListener('DOMContentLoaded', init);
