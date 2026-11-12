# Admivoice

AI-powered admissions & internship platform for colleges. React + TypeScript + Vite + Tailwind + Recharts.

- **Landing page** (`/`) — public home: hero, features, how it works, internships, enquiry form with live "Submitted details".
- **Live demo app** (`/#/login` → sign in with any role) — Enquiry Form, AI Voice, Admissions (table + Kanban), WebConnect, Contacts, Analytics, Internships, Integrations, Settings.

```bash
npm install
npm run dev
npm run build
```

## Demo mode
AI calls, transcripts, recordings, website crawling, the chatbot and integration connections are **simulated** and labelled "Demo". Data persists in `localStorage`; sign-in is a demo session with a role picker. Swap `src/lib/store.tsx` for Supabase (RLS per `institution_id`) and the simulated logic in `src/pages/Voice.tsx` / `WebConnect.tsx` for real providers.
