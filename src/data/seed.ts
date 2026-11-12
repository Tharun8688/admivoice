import type { InstData, Institution, Lead, Call, Campaign, Internship, InternApp, Contact, Knowledge, Integration, LeadStage, InternStage, TranscriptLine } from '@/lib/types'
import { LEAD_STAGES, INTERN_STAGES } from '@/lib/types'

export const INSTITUTIONS: Institution[] = [
  { id: 'inst-1', name: 'Meridian Institute of Technology', short: 'MIT-M', city: 'Hyderabad' },
  { id: 'inst-2', name: 'St. Aurelius University', short: 'SAU', city: 'Bengaluru' },
  { id: 'inst-3', name: 'Northfield College of Management', short: 'NCM', city: 'Pune' },
]
function rng(seed: number) { let s = seed; return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296 }
const FIRST = ['Aarav','Ananya','Rohan','Priya','Kavya','Arjun','Sneha','Vikram','Ishita','Rahul','Meera','Aditya','Divya','Karthik','Neha','Siddharth','Pooja','Manish','Tanvi','Harsh','Lakshmi','Varun','Shreya','Nikhil','Aisha','Dev','Riya','Sai','Tara','Yash','Anika','Kabir','Diya','Ishaan','Myra','Reyansh','Saanvi','Vihaan','Navya','Advait','Kiara','Atharv','Pari','Krish','Anvi','Rudra','Zara','Aryan','Ira','Shaurya','Mahika','Aarush','Tisha','Dhruv','Nisha','Veer','Aditi','Lakshya','Sara','Om','Trisha','Kian','Avni','Rishi','Mira','Samar','Jiya','Neil','Ruhi','Parth','Esha','Ayaan','Vanya','Hriday','Naina','Tejas','Ritika','Arnav','Sia','Ved','Anaya','Kunal','Bhavya','Mohit','Charvi','Jay','Disha','Nakul','Ojas','Pranav','Rhea','Tanay','Uma','Vedant','Yamini','Zain','Alia','Bharat','Chaitra','Daksh','Falak','Gauri','Hemant','Indu']
const DEPTS: Record<string, string[]> = {
  'Computer Science': ['B.Tech CSE','B.Tech AI & ML','M.Tech CSE'], 'Electronics': ['B.Tech ECE','B.Tech EEE'],
  'Management': ['MBA','BBA'], 'Mechanical': ['B.Tech Mechanical'], 'Sciences': ['B.Sc Data Science','B.Sc Physics'], 'Commerce': ['B.Com Honours'],
}
const OFFICERS = ['Ms. Radhika','Mr. Imran','Ms. Sunita','Mr. Dinesh']
const SOURCES = ['Website','AI Voice Inbound','Campaign','Referral','Education Fair','Instagram','Walk-in']
const CITIES = ['Hyderabad','Chennai','Bengaluru','Vijayawada','Pune','Mumbai','Kochi','Visakhapatnam']
const DOCS = ['10th Marksheet','12th Marksheet','Transfer Certificate','ID Proof','Entrance Scorecard','Passport Photo']
const iso = (offsetH: number) => new Date(Date.now() + offsetH * 3600e3).toISOString()
const pick = <T,>(r: () => number, a: T[]) => a[Math.floor(r() * a.length)]

export function transcript(name: string, course: string, outcome: string): TranscriptLine[] {
  const base: TranscriptLine[] = [
    { who: 'ai', t: 0, text: `Hello, am I speaking with ${name}? This is the Admissions Assistant calling on behalf of the college.` },
    { who: 'student', t: 6, text: 'Yes, speaking. Is this about my enquiry?' },
    { who: 'ai', t: 10, text: `Yes — you showed interest in ${course}. I can share the eligibility, fee structure and upcoming deadlines. What would you like to know first?` },
    { who: 'student', t: 21, text: 'What is the eligibility and the last date to apply?' },
    { who: 'ai', t: 28, text: 'Eligibility is 60% in 12th with Mathematics, and the application deadline is 30 June. These details are from the official admissions page.' },
  ]
  if (outcome === 'Callback requested') base.push({ who: 'student', t: 44, text: 'I am travelling right now. Can you call me back tomorrow evening?' }, { who: 'ai', t: 50, text: 'Of course. I have scheduled a callback for tomorrow at 6 PM. Is that fine?' }, { who: 'student', t: 56, text: 'Yes, thank you.' })
  else if (outcome === 'Not interested') base.push({ who: 'student', t: 44, text: 'I have already taken admission elsewhere, thanks.' }, { who: 'ai', t: 50, text: 'Understood, congratulations! I will update our records. Have a great day.' })
  else base.push({ who: 'student', t: 44, text: 'That sounds good. How do I start the application?' }, { who: 'ai', t: 50, text: 'I can send the application link to your WhatsApp and email right away. Shall I do that?' }, { who: 'student', t: 58, text: 'Yes please.' })
  return base
}

export function buildInstitution(idx: number): InstData {
  const r = rng(101 + idx * 77)
  const depts = Object.keys(DEPTS)
  const leads: Lead[] = Array.from({ length: 64 }, (_, i) => {
    const dept = pick(r, depts); const course = pick(r, DEPTS[dept])
    const stage = LEAD_STAGES[Math.min(7, Math.floor(Math.pow(r(), 1.7) * 8))] as LeadStage
    const si = LEAD_STAGES.indexOf(stage); const name = pick(r, FIRST)
    const docState = (k: number) => si >= 5 ? 'verified' : si === 4 ? (k < 4 ? 'verified' : 'pending') : si === 3 ? (k < 2 ? 'pending' : 'missing') : 'missing'
    return {
      id: `L-${1000 + i}`, name, phone: `+91 9${Math.floor(r() * 1e9).toString().padStart(9, '0')}`, email: `${name.toLowerCase()}@mail.com`,
      course, dept, stage, source: pick(r, SOURCES), officer: pick(r, OFFICERS), progress: Math.round((si / 7) * 100),
      docs: DOCS.map((d, k) => ({ name: d, status: (r() < 0.06 && si >= 4 ? 'rejected' : docState(k)) as 'verified' })),
      followUp: si < 6 && r() > 0.3 ? iso(Math.round((r() - 0.25) * 96)) : null, createdAt: iso(-Math.round(r() * 24 * 28)),
      score: Math.round(40 + si * 7 + r() * 15),
      notes: [{ id: `n${i}a`, at: iso(-Math.round(r() * 200)), by: 'System', text: `Enquiry captured via ${pick(r, SOURCES)}.`, kind: 'system' },
        ...(si > 0 ? [{ id: `n${i}b`, at: iso(-Math.round(r() * 100)), by: pick(r, OFFICERS), text: 'AI call completed. Student asked about hostel and scholarship options.', kind: 'call' as const }] : [])],
    }
  })
  const campaigns: Campaign[] = [
    { id: 'C-1', name: 'B.Tech 2026 Early Bird', status: 'active', course: 'B.Tech', language: 'English + Telugu', window: '10:00–18:00', days: ['Mon','Tue','Wed','Thu','Fri','Sat'], retries: 3, retryGap: 4, targets: 1240, reached: 812, converted: 164, approved: true, startsAt: iso(-240), script: 'Greet the student by name. Confirm interest in B.Tech. Share eligibility, fee structure and 30 June deadline using verified website data. Offer to send the application link on WhatsApp. Escalate scholarship and hostel questions to an officer.' },
    { id: 'C-2', name: 'MBA Admissions Drive', status: 'active', course: 'MBA', language: 'English + Hindi', window: '11:00–19:00', days: ['Mon','Tue','Wed','Thu','Fri'], retries: 2, retryGap: 6, targets: 640, reached: 391, converted: 71, approved: true, startsAt: iso(-120), script: 'Introduce the MBA programme, accepted entrance exams (CAT/MAT/CMAT), and interview rounds. Offer to book a counselling slot.' },
    { id: 'C-3', name: 'Document Pending Reminder', status: 'paused', course: 'All', language: 'English', window: '09:30–17:30', days: ['Mon','Tue','Wed','Thu','Fri'], retries: 2, retryGap: 24, targets: 310, reached: 188, converted: 97, approved: true, startsAt: iso(-72), script: 'Remind applicants about pending documents and explain how to upload them in the portal.' },
    { id: 'C-4', name: 'B.Sc Data Science Outreach', status: 'draft', course: 'B.Sc', language: 'English + Tamil', window: '10:00–17:00', days: ['Mon','Wed','Fri'], retries: 2, retryGap: 8, targets: 420, reached: 0, converted: 0, approved: false, startsAt: iso(48), script: 'Awaiting compliance review.' },
  ]
  const outcomes = ['Interested','Callback requested','Not interested','Application started','No answer'] as const
  const calls: Call[] = Array.from({ length: 90 }, (_, i) => {
    const l = leads[Math.floor(r() * leads.length)]
    const status = r() < 0.72 ? 'completed' : r() < 0.6 ? 'missed' : 'failed'
    const outcome = status === 'completed' ? pick(r, [...outcomes.slice(0, 4)]) : status === 'missed' ? 'No answer' : 'Wrong number'
    return {
      id: `K-${5000 + i}`, student: l.name, phone: l.phone, campaign: pick(r, campaigns.slice(0, 3)).name, status, duration: status === 'completed' ? 45 + Math.floor(r() * 260) : status === 'missed' ? 0 : 6,
      startedAt: iso(-i * 1.3 - r()), outcome: outcome as Call['outcome'], direction: r() < 0.2 ? 'inbound' : 'outbound', language: pick(r, ['English','Telugu','Hindi','Tamil']),
      sentiment: outcome === 'Not interested' ? 'negative' : outcome === 'Callback requested' ? 'neutral' : 'positive',
      summary: status === 'completed' ? `${l.name} enquired about ${l.course}. ${outcome === 'Callback requested' ? 'Requested a callback.' : outcome === 'Not interested' ? 'Already enrolled elsewhere.' : 'Application link shared.'}` : status === 'missed' ? 'No answer after ring timeout. Retry scheduled per campaign policy.' : 'Call could not be connected.',
      transcript: status === 'completed' ? transcript(l.name, l.course, outcome) : [],
    }
  })
  const internships: Internship[] = [
    { id: 'I-1', title: 'JavaScript Intern', dept: 'Computer Science', duration: '8 weeks', positions: 6, filled: 3, coordinator: 'Dr. Anitha', status: 'open', mode: 'Hybrid', stipend: '₹8,000 / month', deadline: iso(24 * 12), description: 'For 2nd and 3rd-year students. Build interactive pages and small web apps with JavaScript, working alongside the admissions tech team.', skills: ['JavaScript','HTML & CSS','Git'], certTemplate: 'Standard Completion' },
    { id: 'I-2', title: 'Python Intern', dept: 'Computer Science', duration: '8 weeks', positions: 5, filled: 2, coordinator: 'Dr. Anitha', status: 'open', mode: 'Remote', stipend: '₹8,000 / month', deadline: iso(24 * 14), description: 'For 2nd and 3rd-year students. Automate reports and analyse enquiry data with Python scripts and notebooks.', skills: ['Python','Data handling','Automation'], certTemplate: 'Standard Completion' },
    { id: 'I-3', title: 'Student Partner Intern', dept: 'Management', duration: '10 weeks', positions: 8, filled: 4, coordinator: 'Prof. Rahul', status: 'open', mode: 'On-campus', stipend: '₹6,000 / month + certificate', deadline: iso(24 * 9), description: 'For 2nd and 3rd-year students. Represent the college to prospective students, host campus tours and support admission drives.', skills: ['Communication','Public speaking','Event support'], certTemplate: 'Merit Certificate' },
    { id: 'I-4', title: 'Library Digitisation Intern', dept: 'Sciences', duration: '6 weeks', positions: 5, filled: 1, coordinator: 'Ms. Lata', status: 'open', mode: 'Remote', stipend: 'Unpaid · Certificate', deadline: iso(24 * 20), description: 'Digitise and catalogue archival journals.', skills: ['Cataloguing','Attention to detail'], certTemplate: 'Standard Completion' },
    { id: 'I-5', title: 'Finance Operations Intern', dept: 'Commerce', duration: '10 weeks', positions: 2, filled: 0, coordinator: 'Mr. Ashok', status: 'draft', mode: 'Hybrid', stipend: '₹10,000 / month', deadline: iso(24 * 30), description: 'Support fee reconciliation and reporting.', skills: ['Excel','Tally'], certTemplate: 'Standard Completion' },
  ]
  const internApps: InternApp[] = Array.from({ length: 40 }, (_, i) => {
    const stage = INTERN_STAGES[Math.min(6, Math.floor(Math.pow(r(), 1.3) * 7))] as InternStage
    const name = pick(r, FIRST); const si = INTERN_STAGES.indexOf(stage)
    return { id: `A-${300 + i}`, student: name, email: `${name.toLowerCase()}@mail.com`, college: pick(r, ['Meridian Institute','Sri Venkateswara College','Hindustan Univ.','Christ College','VIT']), internshipId: pick(r, internships.slice(0, 4)).id, stage, cgpa: +(6.5 + r() * 3.3).toFixed(1), interview: si === 3 ? iso(Math.round(r() * 120)) : null, appliedAt: iso(-Math.round(r() * 24 * 20)), coordinator: pick(r, ['Dr. Anitha','Prof. Rahul','Dr. Meera']), certificate: si === 6 ? (r() < 0.6 ? 'issued' : 'pending') : 'none', hours: si >= 5 ? Math.round(r() * 200) : 0, skills: ['Communication','Excel','Python'].slice(0, 1 + Math.floor(r() * 3)) }
  })
  const contacts: Contact[] = Array.from({ length: 70 }, (_, i) => {
    const name = pick(r, FIRST); const type = pick(r, ['Student','Parent','Applicant','Existing Student'] as const)
    return { id: `P-${i}`, name, type, phone: `+91 9${Math.floor(r() * 1e9).toString().padStart(9, '0')}`, email: `${name.toLowerCase()}@mail.com`, tags: [pick(r, ['Scholarship','Hostel','Hot lead','Sports quota','NRI','First-gen']), ...(r() > 0.6 ? ['VIP'] : [])], segment: pick(r, ['B.Tech 2026','MBA 2026','Alumni referrals','Education fair']), city: pick(r, CITIES), lastContact: iso(-Math.round(r() * 24 * 14)), custom: { 'Preferred language': pick(r, ['English','Telugu','Hindi','Tamil']), 'Best time': pick(r, ['Morning','Afternoon','Evening']) }, history: [{ id: `h${i}`, at: iso(-Math.round(r() * 24 * 10)), by: 'AI Assistant', text: pick(r, ['AI call: shared fee structure.', 'WhatsApp: sent application link.', 'Email: brochure delivered.']), kind: 'call' }] }
  })
  const knowledge: Knowledge[] = [
    { id: 'W-1', label: 'Main college website', url: 'https://www.meridian.edu', kind: 'Website', status: 'synced', lastSync: iso(-3), pages: 142, items: { Courses: 38, 'Fee structures': 24, Eligibility: 38, Deadlines: 12 } },
    { id: 'W-2', label: 'Admissions portal', url: 'https://admissions.meridian.edu', kind: 'Website', status: 'syncing', lastSync: iso(-26), pages: 56, items: { Courses: 38, 'Fee structures': 22, Eligibility: 30, Deadlines: 9 } },
    { id: 'W-3', label: 'Prospectus 2026 (PDF)', url: 'https://meridian.edu/docs/prospectus-2026.pdf', kind: 'PDF', status: 'error', lastSync: iso(-80), pages: 0, items: {}, error: 'HTTP 403 — crawler blocked by robots.txt. Allow "AdmivoiceBot" or upload the PDF manually.' },
    { id: 'W-4', label: 'Hostel & scholarships FAQ', url: 'https://meridian.edu/faq', kind: 'FAQ', status: 'synced', lastSync: iso(-9), pages: 18, items: { FAQs: 64, Scholarships: 11 } },
  ]
  const integrations: Integration[] = [
    { id: 'g-web', name: 'College Website', category: 'Knowledge', desc: 'Crawl official pages to ground the AI assistant in verified information.', connected: true, configured: 'meridian.edu', demo: false },
    { id: 'g-crm', name: 'Salesforce Education Cloud', category: 'CRM', desc: 'Two-way sync of leads, applicants and activities.', connected: false, configured: '', demo: false },
    { id: 'g-hub', name: 'HubSpot CRM', category: 'CRM', desc: 'Push AI call outcomes and notes to HubSpot contacts.', connected: false, configured: '', demo: false },
    { id: 'g-gs', name: 'Google Sheets', category: 'Data', desc: 'Auto-export enquiries and call logs to a spreadsheet.', connected: true, configured: 'Admissions-2026-Master', demo: true },
    { id: 'g-mail', name: 'Email (SMTP / SendGrid)', category: 'Email', desc: 'Send application updates and brochures from your domain.', connected: true, configured: 'admissions@meridian.edu', demo: true },
    { id: 'g-wa', name: 'WhatsApp Business', category: 'Messaging', desc: 'Share application links and reminders on WhatsApp.', connected: false, configured: '', demo: false },
    { id: 'g-tel', name: 'Telephony (Twilio / Exotel)', category: 'Telephony', desc: 'Outbound and inbound voice routing for AI calls.', connected: false, configured: '', demo: false },
    { id: 'g-voice', name: 'AI Voice Provider', category: 'AI', desc: 'Speech-to-text, LLM and text-to-speech engine for conversations.', connected: false, configured: '', demo: false },
    { id: 'g-sis', name: 'Student Information System', category: 'SIS', desc: 'Sync admitted students and enrolment records.', connected: false, configured: '', demo: false },
  ]
  return {
    leads, calls, campaigns, internships, internApps, contacts, knowledge, integrations,
    audit: [
      { id: 'au1', at: iso(-1), user: 'Radhika', role: 'admission_officer', action: 'Moved lead', target: leads[0].name + ' → Interested' },
      { id: 'au2', at: iso(-5), user: 'Demo Admin', role: 'college_admin', action: 'Approved campaign script', target: 'B.Tech 2026 Early Bird' },
      { id: 'au3', at: iso(-26), user: 'Anitha', role: 'internship_coordinator', action: 'Scheduled interview', target: internApps[2].student },
    ],
    notifications: [
      { id: 'nt1', at: iso(-0.2), title: 'Knowledge source failed', body: 'Prospectus 2026 (PDF) could not be crawled.', read: false, kind: 'warn' },
      { id: 'nt2', at: iso(-1), title: 'Campaign milestone', body: 'B.Tech 2026 Early Bird reached 800 conversations.', read: false, kind: 'success' },
      { id: 'nt3', at: iso(-4), title: '12 follow-ups due today', body: 'Review pending follow-ups in Admissions.', read: false, kind: 'info' },
    ],
  }
}
