# JanSahayak AI — Build Plan

## Top-Level Overview

**Goal:** Build a complete, hackathon-ready, voice-first AI web application called **JanSahayak AI** that lets users speak naturally in Hindi, Marathi, or English to discover government schemes, scholarships, and skill-development opportunities relevant to Maharashtra and India.

**Scope:**
- Greenfield project — workspace is currently empty.
- Frontend: HTML5 + CSS3 + Vanilla JS (no frameworks).
- Backend: Node.js + Express.js.
- AI: Google Gemini API (key obtained from Google AI Studio).
- Voice: Browser SpeechRecognition API + SpeechSynthesis API.
- Storage: localStorage only (no server-side sessions).
- Deployment target: Render (manual deploy documented in README).

**Non-goals:**
- No React/Vue/Angular/Next.js/TypeScript/Tailwind/Bootstrap.
- No live internet search — catalog is static JSON, curated once.
- No CI/CD pipeline or render.yaml.
- No Aadhaar/banking data collection.
- No background microphone recording.

**Approach:** Eight focused sub-tasks, each independently reviewable, progressing from project scaffolding → catalog → backend → frontend core → voice workflow → UI polish → accessibility/security → README/deployment docs.

---

## Sub-Task 1 — Project Scaffolding and Environment Setup

**Intent:** Establish the complete file/directory structure, npm project, dependencies, `.env.example`, `.gitignore`, and an empty placeholder for every file the rest of the tasks will fill in. This ensures every subsequent sub-task has a stable foundation to write into without restructuring.

**Expected Outcomes:**
- `package.json` with `name`, `version`, `main: "server.js"`, `scripts.start: "node server.js"`, and production dependencies (`express`, `@google/generative-ai`, `dotenv`, `cors`, `express-rate-limit`).
- `.env.example` containing `GEMINI_API_KEY=your_api_key_here` and `GEMINI_MODEL=gemini-1.5-flash`.
- `.gitignore` excluding `node_modules/`, `.env`, `*.log`.
- Empty (stub) files created at every required path: `public/index.html`, `public/style.css`, `public/script.js`, `data/opportunities.json`, `server.js`, `README.md`.

**Todo List:**
1. Create `package.json` with all required fields and dependencies listed above.
2. Create `.env.example`.
3. Create `.gitignore`.
4. Create stub `public/index.html` (single `<!DOCTYPE html>` placeholder).
5. Create stub `public/style.css` (empty).
6. Create stub `public/script.js` (empty).
7. Create stub `data/opportunities.json` (`[]`).
8. Create stub `server.js` (`// placeholder`).
9. Create stub `README.md` (`# JanSahayak AI`).

**Relevant Context:** No existing files — pure greenfield. File structure mirrors Section 17 of the brief exactly.

**Status:** [ ] pending

---

## Sub-Task 2 — Curated Opportunity Catalog (`data/opportunities.json`)

**Intent:** Populate `data/opportunities.json` with 18 real, verifiable public opportunities covering Maharashtra and national schemes. Each record must have a stable official source URL and verified metadata. This catalog is the ground truth the AI uses — fabrication is explicitly forbidden.

**Expected Outcomes:**
- `data/opportunities.json` is a JSON array of 18 objects.
- Each object has: `id`, `title`, `category` (one of: `scholarship`, `welfare`, `skill`, `employment`, `health`), `audience`, `description`, `eligibility` (array of strings), `documents` (array of strings), `benefits`, `officialUrl`, `portal`, `verified` (boolean, always `true` for included records), `state` (`"Maharashtra"` or `"National"`).
- No invented deadlines, invented amounts, or unverifiable claims.

**Todo List:**
1. Research and compile the following 18 records with their exact official URLs:

| # | Title | Category | Official URL |
|---|-------|----------|-------------|
| 1 | Central Sector Scheme of Scholarships for College and University Students | scholarship | https://scholarships.gov.in |
| 2 | Post-Matric Scholarship for SC Students (Maharashtra) | scholarship | https://mahadbt.maharashtra.gov.in |
| 3 | Post-Matric Scholarship for OBC Students (Maharashtra) | scholarship | https://mahadbt.maharashtra.gov.in |
| 4 | Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti (EBC) | scholarship | https://mahadbt.maharashtra.gov.in |
| 5 | National Scholarship Portal — Minority Scholarship (Pre & Post Matric) | scholarship | https://scholarships.gov.in |
| 6 | PM YASASVI Scholarship (OBC/EBC/DNT) | scholarship | https://yet.nta.ac.in |
| 7 | Swayam — Free Online Courses (NPTEL / IGNOU) | skill | https://swayam.gov.in |
| 8 | Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0) | skill | https://www.pmkvyofficial.org |
| 9 | Maharashtra State Skill Development Society (MSSDS) | skill | https://mssds.in |
| 10 | Pradhan Mantri Rojgar Protsahan Yojana (PMRPY) | employment | https://pmrpy.gov.in |
| 11 | Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY) | health | https://www.jeevandayee.gov.in |
| 12 | Ayushman Bharat PM-JAY | health | https://pmjay.gov.in |
| 13 | PM Kisan Samman Nidhi | welfare | https://pmkisan.gov.in |
| 14 | Pradhan Mantri Awas Yojana — Gramin (PMAY-G) | welfare | https://pmayg.nic.in |
| 15 | Pradhan Mantri Awas Yojana — Urban (PMAY-U) | welfare | https://pmaymis.gov.in |
| 16 | National Social Assistance Programme (NSAP) | welfare | https://nsap.nic.in |
| 17 | Startup Maharashtra | employment | https://startup.maharashtra.gov.in |
| 18 | DigiLocker — Digital Document Wallet | welfare | https://www.digilocker.gov.in |

2. Write each record into the JSON array with all required fields populated from publicly documented information only.
3. For eligibility and documents, use phrases like "as per official guidelines — verify on official portal" where exact criteria are not conclusively confirmed in public documentation.

**Relevant Context:** Section 11 of the brief prohibits invented facts. Section 13 requires `officialUrl` for each card. The catalog is loaded server-side in `server.js` at startup.

**Status:** [ ] pending

---

## Sub-Task 3 — Express Backend (`server.js`)

**Intent:** Implement the complete, production-safe Express server with: static file serving, the `POST /api/search` endpoint (catalog search + Gemini integration), rate limiting, CORS, request validation, and safe error responses. The frontend will talk exclusively to this backend.

**Expected Outcomes:**
- Server starts with `node server.js`, listens on `process.env.PORT || 3000`.
- `GET /` serves `public/index.html`.
- `POST /api/search` accepts `{ query, language, inputMode, history }`, validates inputs, searches the catalog, calls Gemini, returns `{ answer, opportunities[], followUpSuggestions[], inputEchoed, language }`.
- Rate limiting: 30 requests per 15-minute window per IP.
- Request body size capped at 10 KB.
- CORS enabled for same-origin and configured origin.
- `GEMINI_API_KEY` loaded from `.env` — never echoed in responses.
- If Gemini fails, return a graceful error with catalog-only results.
- All error responses use safe messages with no stack traces.

**Todo List:**
1. Install dependencies: `express`, `@google/generative-ai`, `dotenv`, `cors`, `express-rate-limit`.
2. Load `data/opportunities.json` at server startup into memory.
3. Implement catalog search function — keyword match across `title`, `description`, `audience`, `category`, `state`, `eligibility` fields; extract intent keywords from the query (scholarship, skill, health, employment, welfare) and filter by category; also filter by state mention (Maharashtra, national).
4. Implement `POST /api/search` handler:
   a. Validate: query must be a non-empty string, max 500 characters; language must be one of `en`, `hi`, `mr`; history must be an array, max 10 entries.
   b. Run catalog search to get up to 5 matching opportunities.
   c. Build a Gemini prompt: system instruction (JanSahayak AI persona, language instruction, no-fabrication rule) + retrieved catalog entries as JSON context + user query + conversation history.
   d. Call Gemini `generateContent` with the built prompt.
   e. Parse Gemini response for `answer` text and `followUpSuggestions` (extract from response or generate defaults).
   f. Return structured JSON response.
5. Add `express-rate-limit` middleware (30 req / 15 min).
6. Add body-parser with 10 KB limit.
7. Add CORS middleware.
8. Serve `public/` as static directory.
9. Add global error handler that never leaks stack traces.
10. Export/start server on configured port.

**Relevant Context:** Section 12 describes the Gemini prompt architecture. Section 11 describes catalog search. Section 15 covers security requirements. The model name comes from `process.env.GEMINI_MODEL` with fallback to `"gemini-1.5-flash"`.

**Status:** [ ] pending

---

## Sub-Task 4 — HTML Structure (`public/index.html`)

**Intent:** Write the complete semantic HTML for the single-page application. Every interactive element must have correct ARIA labels, roles, and `id`s that the JavaScript in Sub-Task 5 and Sub-Task 6 will reference. No inline styles; no inline scripts. The structure must support the full chatbot layout described in Section 14.

**Expected Outcomes:**
- Valid HTML5 document with `lang="en"` (dynamically updated by JS).
- `<head>` includes charset, viewport meta, CSP meta, title, and link to `style.css`.
- Sidebar with: logo/branding, New Chat button, Recent Conversations list (`#conversation-list`), Saved Opportunities section (`#saved-list`), Clear History button, language selector (`#language-select`), privacy note.
- Main area with: header bar (mobile menu toggle, product name, language selector for mobile), chat message container (`#chat-messages`), suggested prompts strip (`#suggested-prompts`), input area (microphone button `#mic-button`, text input `#text-input`, send button `#send-button`, mic status label `#mic-status`).
- Microphone overlay/modal for permission explanations.
- Status indicator strip (`#status-strip`) for voice states.
- `<template id="message-template">` for chat message bubbles.
- `<template id="opportunity-card-template">` for result cards.
- `<template id="conversation-item-template">` for sidebar items.
- All buttons have descriptive `aria-label` attributes.
- `<noscript>` fallback message.
- Script tag at bottom loading `script.js`.

**Relevant Context:** Sections 6, 7, 13, 14. The JS module in Sub-Task 6 queries DOM by these exact IDs. Keep HTML declarative — zero business logic.

**Status:** [ ] pending

---

## Sub-Task 5 — CSS Styling (`public/style.css`)

**Intent:** Implement a polished, modern, voice-first chatbot visual design using only CSS3. The microphone button must be the hero element. The design must be fully responsive (mobile-first), support dark/light theming via CSS custom properties, support `prefers-reduced-motion`, and include accessible focus indicators.

**Expected Outcomes:**
- CSS custom properties (`--color-*`, `--font-*`, `--radius-*`, `--shadow-*`) for theming at `:root`.
- Saffron/navy/white color palette reflecting Indian civic branding.
- Full-viewport sidebar+main two-column layout on desktop; single-column with slide-out sidebar on mobile.
- Microphone button: 80px circle, prominent accent color, ripple animation on listening state, disabled-gray when inactive.
- Voice state visual classes: `.state-idle`, `.state-listening`, `.state-recognizing`, `.state-searching`, `.state-responding`, `.state-error` applied to `#status-strip` and `#mic-button`.
- Chat bubble styles for `.message-user` and `.message-assistant`.
- Opportunity card grid (responsive 1–2 columns); each card has title, category badge, short description, and action button row.
- Smooth transitions for sidebar open/close; respect `prefers-reduced-motion: reduce`.
- High-contrast focus rings on all interactive elements (`:focus-visible`).
- Devanagari-friendly font stack with system fallbacks.
- Scrollbar styling for chat area.
- Loading shimmer animation for AI-processing state.
- `@media (max-width: 768px)` breakpoints.

**Relevant Context:** Sections 6, 14, 16. No Tailwind, no Bootstrap. Pure CSS only.

**Status:** [ ] pending

---

## Sub-Task 6 — Frontend JavaScript (`public/script.js`)

**Intent:** Implement the complete, single-file vanilla JS module that wires together all UI interactions: voice recognition lifecycle, text input fallback, API calls to the backend, chat message rendering, opportunity card rendering, conversation history, saved opportunities, language switching (including UI label translation), and text-to-speech playback. This is the largest sub-task.

**Expected Outcomes:**
- All voice states from Section 7 implemented as distinct JS state transitions with matching CSS class changes.
- `SpeechRecognition` / `webkitSpeechRecognition` feature-detected on load; unsupported-browser path hides mic button and shows text-only notice.
- Microphone button activates recognition only on user gesture; never auto-starts.
- Recognition `lang` set from current language selection.
- Interim transcript shown in a live preview element; final transcript placed in text input for user review before submit.
- Duplicate submission prevented by disabling send while a request is in flight.
- `fetch POST /api/search` sends `{ query, language, inputMode, history }`.
- Response rendered as assistant message bubble + opportunity cards using `<template>` clones.
- Conversation `history` array maintained in memory (last 10 turns); also persisted to `localStorage` under key `jansahayak_history`.
- Saved opportunities stored in `localStorage` under key `jansahayak_saved`; Save button toggles save/unsave.
- Sidebar "Recent Conversations" built from `localStorage` sessions (keyed by timestamp).
- "New Chat" clears in-memory history and opens a fresh session.
- Language selector updates `document.documentElement.lang`, reconfigures SpeechRecognition lang, and swaps all `data-i18n` labels using a bundled translation map for EN/HI/MR strings covering all UI text.
- `SpeechSynthesis` speaker button on each assistant bubble: reads `answer` text aloud in selected language voice; stop/pause/replay controls.
- Suggested prompts strip: 4 example queries per language; clicking a prompt populates and submits it.
- Mobile sidebar toggle (hamburger → close).
- Safe DOM rendering — never use `innerHTML` with untrusted server content; use `textContent` and template cloning.
- All errors display user-friendly messages in selected language without technical details.
- Rate-limit (429) and server-error (500) responses handled gracefully with retry option.

**Relevant Context:** Sections 5–12. The exact DOM IDs come from Sub-Task 4's HTML. Translation strings must cover all button labels, status messages, errors, and instructions in EN, HI, MR.

**Status:** [ ] pending

---

## Sub-Task 7 — Accessibility, Security Hardening, and Bug Fixes

**Intent:** Audit the completed frontend and backend against Sections 15 and 16 of the brief, fix any gaps, and ensure the application is safe to demo and deploy.

**Expected Outcomes:**
- All interactive elements reachable and operable by keyboard alone (Tab, Enter, Space, Escape for mic cancel).
- `aria-live` region for voice status announcements (screen-reader compatible).
- Escape key cancels active SpeechRecognition.
- No `innerHTML` with server-sourced strings (replaced with safe DOM methods).
- Official source URLs opened in `target="_blank" rel="noopener noreferrer"`.
- Content Security Policy meta tag restricts inline scripts and external origins.
- Backend: confirm no stack traces leak; confirm API key is never returned in any response field.
- `express-rate-limit` tested with curl to confirm 429 response after threshold.
- localStorage privacy note visible in sidebar explaining what is stored and how to clear it.
- "Clear History" button wipes both `localStorage` keys and resets sidebar.
- Opportunity cards never show fabricated `verified` dates or "currently open" claims without evidence.
- Reduced-motion CSS confirmed applied.
- Touch targets minimum 44×44px confirmed in CSS.

**Todo List:**
1. Audit HTML for missing `aria-label`, `role`, and `tabindex` on custom elements.
2. Add `aria-live="polite"` to `#status-strip`.
3. Add keyboard handler for Escape → cancel recognition.
4. Audit `script.js` for any `innerHTML` with server data — replace with safe methods.
5. Confirm all `<a>` tags for official sources use `rel="noopener noreferrer"`.
6. Add CSP meta tag to `index.html`.
7. Audit `server.js` error handler for stack trace leaks.
8. Confirm `GEMINI_API_KEY` is never serialized into any response.
9. Verify localStorage privacy note is present and "Clear History" works end-to-end.
10. Audit card templates for fabricated claims.
11. Confirm reduced-motion media query is present in CSS.
12. Confirm 44px touch targets in CSS for mic button and action buttons.

**Relevant Context:** Sections 15, 16. This sub-task is a review + patch pass, not a rewrite.

**Status:** [ ] pending

---

## Sub-Task 8 — README and Deployment Documentation (`README.md`)

**Intent:** Write a comprehensive `README.md` covering: project overview, local setup (including how to get a Gemini API key from Google AI Studio), environment variable configuration, npm start, manual Render deployment steps, feature list, technology stack, demo script, known limitations, and license.

**Expected Outcomes:**
- README has sections: Overview, Features, Tech Stack, Getting Started (Prerequisites, Clone, Install, Configure .env, Run), Gemini API Key Setup (step-by-step Google AI Studio walkthrough), Deployment on Render (manual steps), Project Structure, Demo Script (mirrors Section 19 of brief), Known Limitations, Privacy, License.
- Gemini API Key Setup section explains: go to https://aistudio.google.com, sign in, create an API key, copy it, paste into `.env` as `GEMINI_API_KEY=<key>`.
- Render deploy steps: connect GitHub repo, set environment variables (`GEMINI_API_KEY`, `GEMINI_MODEL`), set build command `npm install`, start command `node server.js`, set node version.
- Known Limitations section honestly states: browser SpeechRecognition requires HTTPS in production; Marathi voice recognition depends on browser/OS; catalog is static and not live-updated; AI responses are explanatory not legal advice.

**Todo List:**
1. Write Overview and tagline.
2. Write Features list.
3. Write Tech Stack table.
4. Write Getting Started section.
5. Write Gemini API Key Setup with numbered steps and URL.
6. Write Render deployment steps.
7. Write Project Structure tree.
8. Write Demo Script (two-minute hackathon demo).
9. Write Known Limitations.
10. Write Privacy note.
11. Write MIT License notice.

**Relevant Context:** Section 19 (demo script), Section 12 (Gemini key), Section 20 (deployment). The `.env.example` file already exists from Sub-Task 1.

**Status:** [ ] pending

---

## Architecture Diagram

```
Browser (HTML + CSS + Vanilla JS)
  │
  ├─ SpeechRecognition API ──► transcript ──► text input (user editable)
  │
  ├─ POST /api/search ──────────────────────────────────┐
  │                                                      ▼
  │                                              Express Backend (server.js)
  │                                                      │
  │                                         ┌────────────┴─────────────┐
  │                                         ▼                          ▼
  │                               Catalog Search                 Google Gemini API
  │                           (opportunities.json)          (generateContent)
  │                                         │                          │
  │                                         └────────────┬─────────────┘
  │                                                      ▼
  │                                         { answer, opportunities,
  │◄────────────────────────────────────── followUpSuggestions }
  │
  ├─ Render chat bubble + opportunity cards
  │
  └─ SpeechSynthesis API ◄── speaker button (user-initiated)
```

---

## Catalog Integrity Policy

Every entry in `data/opportunities.json` must:
- Have an `officialUrl` pointing to an active GOI or Maharashtra state portal.
- Use `"verified": true` only — any unverifiable record must be omitted entirely.
- Never include invented deadlines, invented monetary amounts, or eligibility criteria not found in public documentation.
- Include a `needsVerification` string array for any field where the public source is ambiguous, instructing users to confirm on the official portal.

---

## Translation Map (UI strings — EN / HI / MR)

The following strings must be included in the `i18n` object in `script.js`:

| Key | EN | HI | MR |
|-----|----|----|-----|
| `tapToSpeak` | Tap to Speak | बोलने के लिए टैप करें | बोलण्यासाठी टॅप करा |
| `listening` | Listening... Speak now | सुन रहा हूँ... अभी बोलें | ऐकत आहे... आता बोला |
| `recognizing` | Understanding your words... | आपके शब्द समझ रहा हूँ... | तुमचे शब्द समजत आहे... |
| `searching` | Finding relevant opportunities... | संबंधित अवसर खोज रहा हूँ... | संबंधित संधी शोधत आहे... |
| `preparing` | Preparing your answer... | आपका जवाब तैयार कर रहा हूँ... | तुमचे उत्तर तयार करत आहे... |
| `placeholder` | Ask about scholarships, schemes, skills... | छात्रवृत्ति, योजनाओं, कौशल के बारे में पूछें... | शिष्यवृत्ती, योजना, कौशल्याबद्दल विचारा... |
| `micDenied` | Microphone access denied. Please use text input. | माइक्रोफोन एक्सेस अस्वीकृत। कृपया टेक्स्ट इनपुट का उपयोग करें। | मायक्रोफोन प्रवेश नाकारला. कृपया मजकूर इनपुट वापरा. |
| `noResults` | No matching opportunities found in our catalog. | हमारे कैटालॉग में कोई मिलान नहीं मिला। | आमच्या कॅटलॉगमध्ये कोणतेही जुळणारे नाही. |
| `saveOpportunity` | Save | सहेजें | जतन करा |
| `savedOpportunity` | Saved | सहेजा गया | जतन केले |
| `openWebsite` | Open Official Website | आधिकारिक वेबसाइट खोलें | अधिकृत वेबसाइट उघडा |
| `readAloud` | Read Aloud | जोर से पढ़ें | मोठ्याने वाचा |
| `stopReading` | Stop | रोकें | थांबा |
| `newChat` | New Chat | नई बातचीत | नवीन संभाषण |
| `clearHistory` | Clear History | इतिहास साफ करें | इतिहास साफ करा |
| `micUnavailable` | Voice input not supported in this browser. Text search is fully available. | इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। टेक्स्ट खोज पूरी तरह उपलब्ध है। | या ब्राउझरमध्ये व्हॉइस इनपुट समर्थित नाही. मजकूर शोध पूर्णपणे उपलब्ध आहे. |

---

## Sub-Task Execution Order

```
1. Scaffolding          → stable file tree
2. Catalog              → data layer ready
3. Backend              → API ready (can be tested with curl)
4. HTML                 → DOM structure ready
5. CSS                  → visual design applied
6. JavaScript           → full interactive application
7. Accessibility/Security → hardened and audited
8. README               → documentation complete
```

Each sub-task builds on the previous. Sub-Tasks 4 and 5 can be done in parallel since CSS does not depend on HTML IDs being finalized, but Sub-Task 6 depends on both 4 and 5 being complete.
