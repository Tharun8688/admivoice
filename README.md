# Admivoice

AI-powered admissions & internship administration platform for colleges and universities.
React + TypeScript + Vite, Tailwind CSS, Recharts, React Router.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Modules
Enquiry Form (home) · AI Voice · Admissions (table + Kanban) · WebConnect · Contacts · Analytics · Internships · Integrations · Settings

## Demo mode — what is and isn't real
- **Simulated:** AI calls, live transcripts, recordings, website crawling, the chatbot (rule-based over sample data), and integration connections. All are labelled "Demo" in the UI. No calls are placed and no external service is contacted.
- **Real in the UI:** every navigation item, filter, sort, pagination, drag-and-drop pipeline, CRUD modals, CSV import/export, PDF export (browser print), role-based permissions, institution switching with isolated data, audit log, toasts and confirmations.
- Data persists in `localStorage` (`Settings → Security & data → Reset demo data`).
- Sign-in is a demo session with a role picker. Production auth is intended to be Supabase Auth.

## Connecting real providers
`src/lib/store.tsx` is the single data seam. Replace `update()` / the seed data with Supabase queries
(one `institution_id` column + row-level security gives tenant isolation), and swap the simulated
call/crawl logic in `src/pages/Voice.tsx` and `src/pages/WebConnect.tsx` for telephony, voice-AI and crawler providers.

## Roles
Super Admin, College Admin, Admission Officer, Internship Coordinator, Read-Only Management — see `src/lib/types.ts` (`ROLE_PERMS`) and Settings → Roles.
