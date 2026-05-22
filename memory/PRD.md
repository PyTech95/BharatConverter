# बुलंद भारत पार्टी (Buland Bharat Party) — Website PRD

## Original Problem Statement
> "create a website for बुलंद भारत पार्टी. website should be in hindi main language and a convertor in engilsh as a language convertor on top"

## User Choices (from clarification)
- **Pages**: Home, About, Leaders, News/Events, Join Us, Contact — all pages
- **Membership**: Save to MongoDB + admin view
- **Color scheme**: Match the uploaded logo (tricolor — saffron, white, green, with deep ink black + blue + cream)
- **Admin**: login + news add/edit
- **Language**: Hindi ↔ English toggle (manual translations)
- **Admin credentials**: `admin@bulandbharat.in` / `BulandBharat@2025`

## Architecture
- **Backend**: FastAPI + MongoDB (Motor), JWT auth (PyJWT + bcrypt), admin seeded on startup, all routes under `/api`.
- **Frontend**: React (CRA) + Tailwind + shadcn/ui (sharp-edge override), React Router, sonner toasts, LanguageContext + AuthContext.
- **Translations**: Full Hindi/English dictionary at `/app/frontend/src/lib/translations.js`. Toggle persists in localStorage. Page also dynamically swaps fonts (Tiro Devanagari Hindi/Mukta ↔ Cormorant Garamond/Inter) via `html[lang]` selector.

## User Personas
1. **Visitor / Voter**: Reads about the party in Hindi/English, browses news, submits membership.
2. **Member / Volunteer**: Joins via membership form, follows news updates.
3. **Admin / Party Office**: Logs in to view membership applications, manage news (CRUD), read contact messages.

## Implementation (December 2025 — Initial MVP)
- Backend `server.py` with endpoints: `/api/auth/login`, `/api/auth/me`, `/api/membership` (POST public, GET admin), `/api/membership/count`, `/api/news` (CRUD, GET public), `/api/contact` (POST public, GET admin), `/api/leaders` (GET).
- Auto-seed: admin user, 4 leaders (President + 3 committee), 3 sample news articles on startup.
- Frontend pages: HomePage (hero + 4 pillars + quote + news preview + CTA), AboutPage (ideology/vision/mission editorial), LeadersPage (President featured + grid), NewsPage (list + detail), JoinPage (form → MongoDB), ContactPage (form + info cards), AdminLoginPage, AdminDashboardPage (tabs: Memberships table, News CRUD with modal editor, Contact messages).
- Design: light cream (#FDFBF7) backgrounds, sharp 2px corners, tricolor strips, Devanagari serif headings, editorial magazine grid for news.

## Backlog / Future Enhancements (P1/P2)
- **P1** — Image upload for news (S3/static folder) instead of URL paste
- **P1** — Bulk export memberships to CSV
- **P1** — Email notification on new membership (via SendGrid/Resend)
- **P2** — Pagination on news list
- **P2** — Public manifesto / Vision PDF download
- **P2** — Search/filter on memberships admin table
- **P2** — Donation / contribution integration (Razorpay/Stripe)
- **P2** — WhatsApp share buttons on news
- **P2** — Multilingual extension (Marathi, Tamil, Bengali, Telugu)

## Files Touched
- `/app/backend/server.py`, `/app/backend/.env`
- `/app/frontend/src/App.js`, `App.css`, `index.css`, `tailwind.config.js`
- `/app/frontend/src/lib/{api,translations}.js`
- `/app/frontend/src/contexts/{LanguageContext,AuthContext}.jsx`
- `/app/frontend/src/components/layout/{Header,Footer,PublicLayout}.jsx`
- `/app/frontend/src/pages/{HomePage,AboutPage,LeadersPage,NewsPage,JoinPage,ContactPage,AdminLoginPage,AdminDashboardPage}.jsx`

## Test Credentials
See `/app/memory/test_credentials.md`.
