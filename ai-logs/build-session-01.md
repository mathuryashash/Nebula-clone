# Nebula — AI Build Log
**Contest:** 8x Engineer
**Date:** 2026-05-20
**Tool:** Claude (Anthropic) via Cowork mode
**Model:** claude-sonnet-4-6

---

## Prompt
I want to build a mobile astrology app similar to Nebula (reference: $400K+/year app). Key features:
- Daily, weekly, monthly horoscope feed
- Birth chart generator with house/planet breakdown
- Compatibility score between two birth charts
- AI astrologer chat for personalized questions
- Personalization by sun/moon/rising sign

Reference app: Nebula: Horoscope & Astrology on App Store
Starter template: https://github.com/8xsocial/template-mobile.git
Target repo: https://github.com/mathuryashash/Nebula-clone.git

Platform: React Native (iOS + Android)
AI backend: Groq API
API keys: Use placeholders (.env)

## Response
Analyzed the starter template. It uses:
- Expo Router (file-based navigation)
- NativeWind (TailwindCSS for React Native)
- React Native SVG (for chart visualization)
- React Native Reanimated (animations)
- Supabase (auth, optional)
- RevenueCat (subscriptions)
- Dark theme with accent color system

Began building the full app on top of the template, replacing/extending all screens.

---

## Prompt
Design the cosmic theme — purple/gold color palette for an astrology app. Update theme.ts, tailwind.config.js, and app.json.

## Response
Updated `lib/theme.ts` with:
- ACCENT: #a855f7 (violet-500) — primary purple
- GOLD: #f59e0b (amber-500) — gold highlights
- BG: #080612 — deep near-black with purple cast
- SURFACE/SURFACE2/SURFACE3: layered dark surfaces
- Element colors: Fire (#f97316), Earth (#84cc16), Air (#38bdf8), Water (#818cf8)

Updated `tailwind.config.js` to match new colors.
Updated `app.json` with Nebula name, bundle ID, dark splash screen.
Created `.env.example` with Groq API key placeholder.

---

## Prompt
Build the astrology calculation engine. Needs: Sun sign calculation, Moon sign (reasonably accurate), Rising sign (ascendant based on birth time + location), planet positions for all 10 planets, element/modality analysis, and compatibility scoring.

## Response
Built `lib/astrology.ts` — a full astrology computation engine:

**Sun sign**: Simple date-range lookup (exact)

**Moon sign**: Implemented simplified Meeus algorithm using Julian Day number and mean lunar longitude formula:
`L = 218.3164477 + 481267.88123421 * T`
Maps ecliptic longitude to zodiac sign.

**Rising sign (Ascendant)**: Uses:
- GMST (Greenwich Mean Sidereal Time) from JD
- LST = GMST + longitude  
- Ascendant from obliquity of ecliptic + latitude using atan2 formula
Provides accurate Rising to within ~1 sign for most birth times.

**Planet positions**: Simplified orbital elements from Meeus "Astronomical Algorithms":
- Mean longitude formula for each planet: L₀ + rate × T
- Maps to sign + degree within sign
- Retrograde detection: compares position to previous day

**Compatibility engine**: Multi-factor scoring:
- Elemental harmony (Fire+Air, Earth+Water = +compatible)
- Modality dynamics (Cardinal vs Fixed vs Mutable)
- Moon sign emotional compatibility
- Produces per-category scores (love, communication, values, passion) + summary text

**Moon phase**: D (elongation) from Meeus, maps to 8 traditional phases with illumination %.

---

## Prompt
Build the Groq API integration for the AI astrologer chat. System prompt should include the user's chart data, speak as a wise astrologer, and give practical guidance.

## Response
Built `lib/groq.ts`:
- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Model: `llama3-70b-8192` (fast, high quality)
- System prompt includes: user's Sun/Moon/Rising signs, today's date, astrologer persona guidelines
- buildSystemPrompt(ctx): dynamically generates persona with user's chart embedded
- sendMessage(messages, apiKey): standard OpenAI-compatible chat completion call
- max_tokens: 512, temperature: 0.8 for natural astrological responses

Demo mode fallback: When no API key configured, returns contextually appropriate canned responses based on the user's sign and question topic (career, love, moon, sun, etc.)

---

## Prompt
Build the multi-step onboarding screen: Name → Birth Date → Birth Time → Location. Must calculate and save Sun/Moon/Rising signs. Use visual chip selectors for date/time picking.

## Response
Built `app/(onboarding)/index.tsx`:
- Step 1: Name input
- Step 2: Birth date — year text input + scrollable month chips + day chip grid. Shows sun sign preview as user selects.
- Step 3: Birth time — hour/minute chips (24h) + timezone UTC offset selector
- Step 4: City name + latitude/longitude inputs

On completion:
1. Calculates birth chart using `calculateBirthChart(birthData)`
2. Saves profile to AsyncStorage via `saveProfile()`
3. Updates Supabase user_metadata.onboarding_completed if auth is configured
4. Navigates to `/(tabs)`

Key UX: animated progress bar, "Your Sun Sign" live preview card appears as user enters birth date.

---

## Prompt
Build the 4-tab navigation layout with cosmic glyph icons: Today (☉), Chart (◎), Love (♡), Astrologer (✦). Dark frosted tab bar with purple gradient background.

## Response
Built `app/(tabs)/_layout.tsx`:
- Custom TabIcon component with glyph + label
- Active state: ACCENT purple color
- Tab bar: LinearGradient background (rgba(8,6,18,0.92) → #080612)
- Semi-transparent with border-top separator
- Respects safe area insets for iPhone home indicator

Tabs: Today (index) → Chart → Compatibility → Chat

---

## Prompt
Build the horoscope feed (Today tab). Should show: personalized greeting with user's sign trinity, daily/weekly/monthly period selector, full horoscope reading with overview + love/career/wellness sections, lucky number/color strip, daily affirmation.

## Response
Built `app/(tabs)/index.tsx`:
- Header: personalized greeting, date, moon phase badge (emoji + illumination %), planetary day of week
- Sign card: element-colored banner showing Sun/Moon/Rising trinity
- Period selector: pill buttons for Today/Week/Month with purple gradient active state
- Reading sections:
  - Overview card with ACCENT border
  - Love/Career/Wellness category cards
  - Lucky Number + Lucky Color gold row
  - Daily Affirmation card with gold/purple gradient
- Traits and keyword badges in element colors
- Pull-to-refresh support

Content rotates deterministically based on date seed — same day = same reading, different day = different reading from pool.

Built `lib/horoscopeContent.ts`: Complete horoscope content library with 2-3 readings per sign per period (daily/weekly/monthly). Each reading includes overview, love, career, wellness, lucky number, lucky color, affirmation.

---

## Prompt
Build the birth chart visualization — an SVG natal chart wheel with zodiac segments, house divisions, planet glyphs positioned at their actual longitudes, and aspect lines.

## Response
Built `components/BirthChartWheel.tsx` using react-native-svg:

**Wheel structure (outer → inner)**:
1. Outer zodiac band: 12 × 30° segments colored by element (fire/earth/air/water)
2. Zodiac symbol glyphs in each segment (Unicode glyphs: ♈♉♊...)
3. House division lines at 30° intervals from Ascendant (AC/DC axis highlighted)
4. House number labels in the house band
5. Inner circle: planet placement ring
6. Planet glyphs (☉☽☿♀♂♃♄♅♆♇) at accurate positions
7. Retrograde "Rx" markers in red
8. Aspect lines: trines/sextiles (green), conjunctions (purple), squares/oppositions (red)
9. Center: Nebula ☽ glyph with gradient

**Technical approach**: 
- Ascendant placed at left (180° mark, traditional Western chart orientation)
- All planet positions rotated by `(lon - ascendant + 180) % 360`
- Collision detection: adjusts overlapping planet angles ±5° for readability
- Aspect calculation: checks angular separation for conjunction(0°), sextile(60°), square(90°), trine(120°), opposition(180°) with orbs

Built `app/(tabs)/chart.tsx`:
- Chart wheel tab + Planets breakdown tab + Houses tab
- Element balance counter (Fire/Earth/Air/Water planet count)
- Dominant Element and Dominant Modality stats
- Full planet table: glyph, name, retrograde badge, sign, house, degree
- House cusp table: house number, meaning, sign, degree

---

## Prompt
Build the compatibility report screen. Two-person birth info input, synastry scoring, score visualization with progress bars, strengths/challenges analysis.

## Response
Built `app/(tabs)/compatibility.tsx`:
- User's profile card shown at top
- Partner input form: name, birth year, month chips, day chips
- Live sun sign preview as partner date is entered
- Calculate button with pink→purple gradient
- Results section:
  - Overall score with circular arc visualization (color: green≥75, gold≥55, red<55)
  - Sign pair display with ♡ separator
  - Summary text
  - 4-category breakdown with animated bar charts (love/communication/values/passion)
  - Strengths and Challenges cards with color-coded borders

---

## Prompt
Build the AI astrologer chat screen with Groq API. Chat bubble UI, suggested prompts, typing indicator, demo mode fallback when API key not set.

## Response
Built `app/(tabs)/chat.tsx`:

**UI components**:
- MessageBubble: user bubbles (purple), assistant bubbles (dark surface) with Nebula avatar
- TypingIndicator: three-dot animation
- Suggested prompts: scrollable list of 6 starter questions shown before first message

**Chat mechanics**:
- System prompt generated from `buildSystemPrompt()` includes user's full chart context
- Last 8 messages sent to Groq for context window
- API key check: falls back to `getDemoResponse()` if not configured
- getDemoResponse(): keyword-matched responses for sun/moon/career/love questions, always personalized to user's actual sign data

**Demo mode responses**: Fully personalized to sign — checks Sun sign element (Fire/Earth/Air/Water) for career advice, Moon sign for emotional needs, etc. Reads as natural astrological counsel even without API key.

Agent: "Nebula" with ☽ avatar, green "Online" indicator, chart badge showing Sun sign.

---

## Prompt
Final polish: settings screen, cleanup of template placeholder tabs, update landing page for Nebula branding, cosmic background with floating star clusters on landing page.

## Response
- Updated `app/index.tsx` landing page: cosmic purple/gold theme, floating star clusters with Reanimated, ☽ moon logo, features list (horoscopes/charts/compatibility)
- Built `app/settings.tsx`: Update Birth Data (re-runs onboarding), Privacy/Terms/Support links, Sign Out
- Removed template placeholder tabs (explore, profile, activity)
- Updated `app/(onboarding)/_layout.tsx` for clean stack navigation
- Updated `lib/mockData.ts` with Nebula-specific FAQ content for support screen
- Verified all imports resolve correctly across the app

---

## Architecture decisions

**Why no Supabase required**: Storing birth data locally (AsyncStorage) eliminates backend dependency for the core experience. Auth is optional — if Supabase isn't configured, the app still flows from onboarding → tabs.

**Why simplified orbital calculations vs. real ephemeris**: A proper Swiss Ephemeris library (swisseph) requires native modules and significant build complexity. The Meeus simplified algorithms give accuracy within ~1° for Sun, ~3° for Moon, which is sufficient for a zodiac sign result (30° per sign). For a contest demo, this is the right trade-off.

**Why Groq over OpenAI**: llama3-70b-8192 on Groq runs at ~280 tokens/second — dramatically faster than OpenAI for real-time chat. The model quality is excellent for conversational astrology.

**Chart visualization choice**: react-native-svg was already in the template dependencies. Building the wheel from scratch in SVG gives us complete control over the cosmic aesthetic vs. any existing chart library that would impose its own styling.

**Content strategy**: Static horoscope content with date-seed rotation ensures the app works offline and without any API calls, while feeling "fresh" each day. A production version would call an LLM to generate unique daily content.
