'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ─── Load catalog ────────────────────────────────────────────────────────────
const CATALOG_PATH = path.join(__dirname, 'data', 'opportunities.json');
let catalog = [];
try {
  catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  console.log(`[JanSahayak] Loaded ${catalog.length} opportunities from catalog.`);
} catch (err) {
  console.error('[JanSahayak] WARNING: Could not load opportunities catalog:', err.message);
}

// ─── Gemini client ───────────────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
let genAI = null;
if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_api_key_here') {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log(`[JanSahayak] Gemini client initialized with model: ${GEMINI_MODEL}`);
} else {
  console.warn('[JanSahayak] WARNING: GEMINI_API_KEY not set. AI responses will be unavailable.');
}

// ─── App setup ───────────────────────────────────────────────────────────────
const app = express();

app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting — 30 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a few minutes before trying again.',
    retryAfter: 15
  }
});
app.use('/api/', limiter);

// ─── Catalog search ──────────────────────────────────────────────────────────

const CATEGORY_KEYWORDS = {
  scholarship: ['scholarship', 'scholarships', 'chhatrvarti', 'shishyavrutti', 'stipend',
    'छात्रवृत्ति', 'शिष्यवृत्ती', 'students', 'education', 'college', 'university',
    'school', 'study', 'पढ़ाई', 'अभ्यास', 'विद्यार्थी', 'student', 'padhai'],
  skill: ['skill', 'skills', 'training', 'course', 'kaushal', 'कौशल', 'कौशल्य',
    'learn', 'vocational', 'certification', 'certificate', 'प्रशिक्षण', 'shikhna',
    'sikhna', 'courses', 'online', 'swayam', 'pmkvy', 'upskill'],
  employment: ['job', 'jobs', 'employment', 'rozgar', 'रोजगार', 'nokri', 'naukri',
    'नौकरी', 'work', 'startup', 'entrepreneur', 'business', 'self-employment',
    'व्यवसाय', 'udyog', 'उद्योग'],
  health: ['health', 'medical', 'hospital', 'treatment', 'swasthya', 'स्वास्थ्य',
    'आरोग्य', 'arogya', 'insurance', 'bima', 'बीमा', 'ayushman', 'aushman',
    'illness', 'surgery', 'doctor'],
  welfare: ['welfare', 'scheme', 'yojana', 'योजना', 'pension', 'housing', 'house',
    'awas', 'आवास', 'ration', 'subsidy', 'assistance', 'help', 'support',
    'farmer', 'kisan', 'किसान', 'poor', 'bpl', 'digilocker', 'document',
    'pension', 'widow', 'disability', 'elderly', 'old age', 'social']
};

const LOCATION_KEYWORDS = {
  maharashtra: ['maharashtra', 'maharastra', 'महाराष्ट्र', 'maharashtra', 'mahadbт',
    'mumbai', 'pune', 'nagpur', 'nashik', 'aurangabad', 'thane', 'solapur',
    'kolhapur', 'satara', 'ahmednagar'],
  national: ['india', 'central', 'national', 'bharata', 'bharat', 'भारत', 'all india']
};

/**
 * Extract intent categories from a query string.
 */
function extractCategories(query) {
  const q = query.toLowerCase();
  const found = new Set();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (q.includes(kw.toLowerCase())) {
        found.add(category);
        break;
      }
    }
  }
  return Array.from(found);
}

/**
 * Extract location preference from a query string.
 * Returns 'maharashtra', 'national', or 'all'.
 */
function extractLocation(query) {
  const q = query.toLowerCase();
  for (const kw of LOCATION_KEYWORDS.maharashtra) {
    if (q.includes(kw.toLowerCase())) return 'maharashtra';
  }
  for (const kw of LOCATION_KEYWORDS.national) {
    if (q.includes(kw.toLowerCase())) return 'national';
  }
  return 'all';
}

/**
 * Score an opportunity record against a query.
 */
function scoreOpportunity(opp, queryLower, categories, location) {
  let score = 0;

  // Category match — high weight
  if (categories.length > 0 && categories.includes(opp.category)) score += 40;

  // Location match
  if (location === 'maharashtra') {
    if (opp.state === 'Maharashtra') score += 20;
    else if (opp.state === 'National') score += 5; // National schemes are also relevant
  } else if (location === 'national') {
    if (opp.state === 'National') score += 20;
  } else {
    score += 10; // No location filter — slight boost to all
  }

  // Text match in title, description, audience
  const searchFields = [
    opp.title,
    opp.description,
    opp.audience,
    opp.category,
    (opp.eligibility || []).join(' ')
  ].join(' ').toLowerCase();

  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  for (const word of queryWords) {
    if (searchFields.includes(word)) score += 3;
  }

  return score;
}

/**
 * Search the catalog and return top N matches.
 */
function searchCatalog(query, maxResults = 5) {
  if (!query || catalog.length === 0) return [];
  const queryLower = query.toLowerCase();
  const categories = extractCategories(query);
  const location = extractLocation(query);

  const scored = catalog.map(opp => ({
    opp,
    score: scoreOpportunity(opp, queryLower, categories, location)
  }));

  scored.sort((a, b) => b.score - a.score);

  // Return only opportunities with at least some relevance score
  return scored
    .filter(item => item.score > 5)
    .slice(0, maxResults)
    .map(item => item.opp);
}

// ─── Gemini prompt builder ───────────────────────────────────────────────────

const LANGUAGE_NAMES = { en: 'English', hi: 'Hindi', mr: 'Marathi' };

function buildGeminiPrompt(query, language, opportunities, history) {
  const langName = LANGUAGE_NAMES[language] || 'English';
  const catalogContext = opportunities.length > 0
    ? JSON.stringify(opportunities.map(o => ({
        title: o.title,
        category: o.category,
        audience: o.audience,
        description: o.description,
        eligibility: o.eligibility,
        documents: o.documents,
        benefits: o.benefits,
        officialUrl: o.officialUrl,
        portal: o.portal,
        state: o.state,
        needsVerification: o.needsVerification
      })), null, 2)
    : 'No matching opportunities found in the JanSahayak catalog for this query.';

  const historyText = history && history.length > 0
    ? history.slice(-6).map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')
    : '';

  const systemInstruction = `You are JanSahayak AI, a friendly and helpful assistant that helps Indian citizens — especially those in Maharashtra — discover government schemes, scholarships, skill development programs, and welfare opportunities.

Your primary role:
1. Explain the relevant opportunities from the provided catalog in simple, clear language.
2. Summarize eligibility requirements and required documents in a friendly way.
3. Always tell users which information needs verification on the official portal.
4. Never invent facts, deadlines, amounts, or criteria not present in the catalog data.
5. If the catalog has no matching entry, honestly say so and suggest official portals like scholarships.gov.in, mahadbt.maharashtra.gov.in, or india.gov.in.
6. Be warm, encouraging, and empathetic — many users may have low digital literacy.
7. Always respond in ${langName}. If the user wrote in a mix of languages (Hinglish, Romanized Hindi, etc.), still respond in ${langName}.
8. Keep your response concise — 3 to 5 short paragraphs maximum.
9. End every response with 2-3 suggested follow-up questions the user might want to ask.

Format your follow-up suggestions at the very end, prefixed with "FOLLOW_UP:" on a new line, as a JSON array of strings.
Example: FOLLOW_UP: ["What documents are needed?", "How do I apply?", "Is there a last date?"]`;

  return {
    systemInstruction,
    userMessage: `${historyText ? `Previous conversation:\n${historyText}\n\n` : ''}Available opportunities from JanSahayak catalog:\n${catalogContext}\n\nUser's question: ${query}`
  };
}

/**
 * Parse follow-up suggestions from Gemini response text.
 */
function parseFollowUps(text, language) {
  const defaultFollowUps = {
    en: ['What documents are needed?', 'How do I apply?', 'Show me other schemes'],
    hi: ['कौन से दस्तावेज़ चाहिए?', 'आवेदन कैसे करें?', 'और योजनाएं दिखाएं'],
    mr: ['कोणते कागदपत्रे लागतात?', 'अर्ज कसा करायचा?', 'इतर योजना दाखवा']
  };

  try {
    const match = text.match(/FOLLOW_UP:\s*(\[[\s\S]*?\])/);
    if (match) {
      const suggestions = JSON.parse(match[1]);
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        return suggestions.slice(0, 3);
      }
    }
  } catch (_) {
    // ignore parse errors
  }
  return defaultFollowUps[language] || defaultFollowUps.en;
}

/**
 * Strip the FOLLOW_UP: suffix from the answer text.
 */
function cleanAnswer(text) {
  return text.replace(/FOLLOW_UP:\s*\[[\s\S]*?\]/, '').trim();
}

// ─── POST /api/search ────────────────────────────────────────────────────────

app.post('/api/search', async (req, res) => {
  try {
    const { query, language, inputMode, history } = req.body;

    // Validation
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required and must be a string.' });
    }
    if (query.trim().length === 0) {
      return res.status(400).json({ error: 'Query cannot be empty.' });
    }
    if (query.length > 500) {
      return res.status(400).json({ error: 'Query is too long. Please keep it under 500 characters.' });
    }
    const validLanguages = ['en', 'hi', 'mr'];
    const lang = validLanguages.includes(language) ? language : 'en';

    if (history && !Array.isArray(history)) {
      return res.status(400).json({ error: 'History must be an array.' });
    }
    const safeHistory = Array.isArray(history) ? history.slice(-10) : [];

    // Search catalog
    const matchedOpportunities = searchCatalog(query.trim());

    // Build Gemini response
    let answer = '';
    let followUpSuggestions = [];
    let aiAvailable = false;

    if (genAI) {
      try {
        const { systemInstruction, userMessage } = buildGeminiPrompt(
          query.trim(), lang, matchedOpportunities, safeHistory
        );

        const model = genAI.getGenerativeModel({
          model: GEMINI_MODEL,
          systemInstruction
        });

        const result = await model.generateContent(userMessage);
        const rawText = result.response.text();

        followUpSuggestions = parseFollowUps(rawText, lang);
        answer = cleanAnswer(rawText);
        aiAvailable = true;
      } catch (aiError) {
        console.error('[JanSahayak] Gemini error:', aiError.message);
        // Fallback — construct a basic answer from catalog
        answer = buildFallbackAnswer(query, matchedOpportunities, lang);
        followUpSuggestions = getDefaultFollowUps(lang);
      }
    } else {
      answer = buildFallbackAnswer(query, matchedOpportunities, lang);
      followUpSuggestions = getDefaultFollowUps(lang);
    }

    return res.json({
      answer,
      opportunities: matchedOpportunities,
      followUpSuggestions,
      inputEchoed: query.trim(),
      language: lang,
      aiAvailable,
      resultCount: matchedOpportunities.length
    });

  } catch (err) {
    console.error('[JanSahayak] /api/search error:', err.message);
    return res.status(500).json({
      error: 'An error occurred while processing your request. Please try again.'
    });
  }
});

// ─── Fallback answer builders ─────────────────────────────────────────────────

function getDefaultFollowUps(lang) {
  const defaults = {
    en: ['What documents are needed?', 'How do I apply?', 'Show me other schemes'],
    hi: ['कौन से दस्तावेज़ चाहिए?', 'आवेदन कैसे करें?', 'और योजनाएं दिखाएं'],
    mr: ['कोणते कागदपत्रे लागतात?', 'अर्ज कसा करायचा?', 'इतर योजना दाखवा']
  };
  return defaults[lang] || defaults.en;
}

function buildFallbackAnswer(query, opportunities, lang) {
  if (opportunities.length === 0) {
    const noResultMessages = {
      en: `I searched our catalog for "${query}" but couldn't find a verified matching opportunity. For comprehensive information, please visit scholarships.gov.in, mahadbt.maharashtra.gov.in, or india.gov.in where you can explore all available government schemes.`,
      hi: `मैंने "${query}" के लिए हमारे कैटालॉग में खोजा लेकिन कोई सत्यापित मिलान नहीं मिला। पूरी जानकारी के लिए कृपया scholarships.gov.in, mahadbt.maharashtra.gov.in, या india.gov.in पर जाएं।`,
      mr: `मी "${query}" साठी आमच्या कॅटलॉगमध्ये शोधले परंतु कोणताही सत्यापित जुळणारा परिणाम मिळाला नाही. सर्वसमावेशक माहितीसाठी कृपया scholarships.gov.in, mahadbt.maharashtra.gov.in, किंवा india.gov.in ला भेट द्या.`
    };
    return noResultMessages[lang] || noResultMessages.en;
  }

  const foundMessages = {
    en: `I found ${opportunities.length} relevant opportunity(ies) in our catalog that may match your query. Please review the cards below for eligibility details and official sources. Remember to verify the latest information on the official portals before applying.`,
    hi: `मुझे हमारे कैटालॉग में ${opportunities.length} संबंधित अवसर मिले जो आपकी खोज से मेल खा सकते हैं। पात्रता विवरण और आधिकारिक स्रोतों के लिए नीचे दिए गए कार्ड देखें। आवेदन करने से पहले आधिकारिक पोर्टल पर नवीनतम जानकारी सत्यापित करें।`,
    mr: `मला आमच्या कॅटलॉगमध्ये ${opportunities.length} संबंधित संधी मिळाल्या ज्या तुमच्या शोधाशी जुळू शकतात. पात्रता तपशील आणि अधिकृत स्रोतांसाठी खालील कार्ड पहा. अर्ज करण्यापूर्वी अधिकृत पोर्टलवर नवीनतम माहिती तपासा.`
  };
  return foundMessages[lang] || foundMessages.en;
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    catalogSize: catalog.length,
    aiAvailable: !!genAI,
    model: GEMINI_MODEL
  });
});

// ─── Catch-all → index.html ───────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[JanSahayak] Unhandled error:', err.message);
  res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
});

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[JanSahayak] Server running at http://localhost:${PORT}`);
  console.log(`[JanSahayak] API key configured: ${!!genAI}`);
});

module.exports = app;
