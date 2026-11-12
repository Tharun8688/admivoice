import { useEffect, useState } from 'react'
import { Waves, PhoneCall, Globe, GraduationCap, Briefcase, BarChart3, ShieldCheck, Menu, X, ArrowRight, Check, Send, Trash2, Mail, Phone, MapPin, Bot, Users, Sparkles, ClipboardList } from 'lucide-react'
import { useApp } from './lib/store'
import { loadEnquiries, saveEnquiries, type Enquiry } from './lib/api'

const NAV = [['Features', '#features'], ['How it works', '#how'], ['Internships', '#internships'], ['Enquire', '#enquire']]
const COURSES = ['B.Tech CSE', 'B.Tech AI & ML', 'B.Tech ECE', 'MBA', 'BBA', 'B.Sc Data Science', 'B.Com Honours']
const FEATURES = [
  [PhoneCall, 'AI Voice calling', 'Individual and bulk admission campaigns with approved scripts, scheduling, retries, transcripts and call outcomes.'],
  [GraduationCap, 'Admissions workspace', 'Enquiry-to-enrolment pipeline in table and Kanban views with document verification and officer assignment.'],
  [Globe, 'WebConnect', 'Connect your college website. The assistant answers fees, eligibility and deadlines from verified content only.'],
  [Briefcase, 'Internship portal', 'Publish programmes, shortlist, schedule interviews, track completion and issue certificates.'],
  [Users, 'Unified contacts', 'Students, parents and applicants with segments, tags, communication history and bulk import/export.'],
  [BarChart3, 'Analytics & reports', 'Call performance, conversion, course demand and officer metrics, exportable to CSV and PDF.'],
] as const

function Logo({ light }: { light?: boolean }) {
  return <a href="#top" className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet2-500 shadow-md"><Waves size={17} className="text-white" /></span><span className={`text-[17px] font-semibold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>Admivoice</span></a>
}

function Header() {
  const [open, setOpen] = useState(false); const [sc, setSc] = useState(false)
  useEffect(() => { const f = () => setSc(window.scrollY > 12); f(); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f) }, [])
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all ${sc || open ? 'bg-navy-900/95 backdrop-blur shadow-lg' : ''}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo light />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">{NAV.map(([l, h]) => <a key={h} href={h} className="text-sm text-slate-300 transition-colors hover:text-white">{l}</a>)}</nav>
        <a href="#/login" className="hidden h-9 items-center rounded-lg bg-white px-4 text-sm font-medium text-navy-900 hover:bg-slate-100 md:inline-flex">View live demo</a>
        <button className="text-white md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="flex flex-col gap-1 border-t border-white/10 px-5 pb-4 md:hidden">{[...NAV, ['View live demo', '#/login']].map(([l, h]) => <a key={h} onClick={() => setOpen(false)} href={h} className="rounded-lg px-2 py-2.5 text-slate-200 hover:bg-white/5">{l}</a>)}</nav>}
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy-900 pt-32 pb-24 text-white">
      <div className="absolute -right-24 top-0 h-[28rem] w-[28rem] rounded-full bg-brand-600/30 blur-3xl" /><div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-violet2-500/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200"><Sparkles size={13} className="text-violet-300" />AI-powered admissions for colleges &amp; universities</span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">Less manual work.<br />Faster admissions.<br /><span className="text-violet-300">Smarter communication.</span></h1>
          <p className="mt-5 max-w-lg text-lg text-slate-300">Admivoice automates admission calls, enquiries and internship administration, so your team spends time on students, not spreadsheets.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#enquire" className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-5 font-medium text-white hover:bg-brand-600">Submit an enquiry <ArrowRight size={16} /></a>
            <a href="#/login" className="inline-flex h-11 items-center rounded-lg border border-white/20 px-5 font-medium text-white hover:bg-white/5">View live demo</a>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">{[['24/7', 'AI enquiry handling'], ['8', 'pipeline stages'], ['9', 'languages-ready']].map(([a, b]) => <div key={b}><dt className="text-2xl font-semibold">{a}</dt><dd className="text-xs text-slate-400">{b}</dd></div>)}</dl>
        </div>
        <div className="relative" aria-hidden>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300"><PhoneCall size={18} /></span><div className="flex-1"><p className="text-sm font-medium">Ananya Reddy · B.Tech CSE</p><p className="text-xs text-slate-400">AI call in progress · 1:42</p></div><span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />LIVE</span></div>
            <div className="mt-4 flex h-8 items-center gap-[3px]">{Array.from({ length: 40 }, (_, i) => <span key={i} style={{ animationDelay: `${(i % 8) * 90}ms`, height: `${30 + ((i * 37) % 70)}%` }} className="w-[3px] flex-1 origin-center animate-wave rounded-full bg-violet-400" />)}</div>
            <div className="mt-4 space-y-2.5 text-[13px]">
              <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2"><Bot size={12} className="mr-1 inline" />Eligibility is 60% in 12th with Maths. Applications close 30 June.</p>
              <p className="ml-auto max-w-[75%] rounded-2xl rounded-tr-sm bg-brand-500/60 px-3 py-2">Can you send me the application link?</p>
              <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2"><Bot size={12} className="mr-1 inline" />Sending it to your WhatsApp now.</p>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs"><span className="text-slate-400">Predicted outcome</span><span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-300">Interested · 82%</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="bg-canvas py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-semibold text-brand-600">Everything in one platform</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Built exclusively for college admissions</h2><p className="mt-3 text-ink-3">Not a generic CRM or chatbot. A dedicated operating system for admissions and internship administration.</p></div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{FEATURES.map(([I, t, d]) => <div key={t} className="rounded-2xl border border-line bg-white p-6 shadow-card transition-shadow hover:shadow-pop"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><I size={19} /></span><h3 className="mt-4 font-semibold text-ink">{t}</h3><p className="mt-1.5 text-sm leading-relaxed text-ink-3">{d}</p></div>)}</div>
      </div>
    </section>
  )
}

function How() {
  const steps = [['Connect', 'Link your college website so the assistant learns courses, fees, eligibility and deadlines.'], ['Automate', 'Launch approved AI voice campaigns or let the assistant answer inbound enquiries.'], ['Track', 'Follow every applicant through the pipeline, from first enquiry to enrolment.'], ['Improve', 'Review transcripts, outcomes and analytics to keep getting faster.']]
  return (
    <section id="how" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-ink">How Admivoice works</h2>
        <ol className="mt-12 grid gap-6 md:grid-cols-4">{steps.map(([t, d], i) => <li key={t} className="relative rounded-2xl border border-line p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-white">{i + 1}</span><h3 className="mt-4 font-semibold">{t}</h3><p className="mt-1 text-sm text-ink-3">{d}</p></li>)}</ol>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-xs font-medium text-ink-2">{['New Enquiry', 'Contacted', 'Interested', 'Application Started', 'Documents Submitted', 'Under Review', 'Admitted', 'Enrolled'].map((s, i, a) => <span key={s} className="flex items-center gap-2"><span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">{s}</span>{i < a.length - 1 && <ArrowRight size={12} className="text-ink-4" />}</span>)}</div>
      </div>
    </section>
  )
}

function Internships() {
  return (
    <section id="internships" className="bg-navy-900 py-20 text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
        <div><p className="text-sm font-semibold text-violet-300">Internships</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">A complete internship portal, built in</h2><p className="mt-3 text-slate-300">Publish opportunities, manage applications and track interns through to certification, all from the same platform.</p>
          <ul className="mt-6 space-y-3 text-sm">{['Publish programmes and open positions', 'Applied → Under Review → Shortlisted → Interview → Selected', 'Assign coordinators and schedule interviews', 'Track completion and issue certificates'].map(t => <li key={t} className="flex items-start gap-3"><Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />{t}</li>)}</ul></div>
        <div className="space-y-3">{[['Admissions Data Analyst Intern', 'Computer Science · 12 weeks · Hybrid', '3 spots left'], ['Campus Communications Intern', 'Management · 8 weeks · On-campus', '2 spots left'], ['Library Digitisation Intern', 'Sciences · 6 weeks · Remote', '4 spots left']].map(([t, s, b]) => <div key={t} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4"><div><p className="font-medium">{t}</p><p className="text-xs text-slate-400">{s}</p></div><span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">{b}</span></div>)}<p className="text-xs text-slate-500">Sample listings shown for illustration.</p></div>
      </div>
    </section>
  )
}

const empty = { name: '', phone: '', email: '', city: '', course: COURSES[0], time: 'Morning', message: '' }
function Enquire() {
  const [list, setList] = useState<Enquiry[]>(loadEnquiries); const [f, setF] = useState(empty); const [err, setErr] = useState<Record<string, string>>({}); const [ok, setOk] = useState(false)
  useEffect(() => saveEnquiries(list), [list])
  const set = (k: keyof typeof empty, v: string) => { setF(p => ({ ...p, [k]: v })); setErr(p => ({ ...p, [k]: '' })); setOk(false) }
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); const er: Record<string, string> = {}
    if (!f.name.trim()) er.name = 'Full name is required'
    if (f.phone.replace(/\D/g, '').length < 10) er.phone = 'Enter a valid 10-digit phone number'
    if (f.email && !/\S+@\S+\.\S+/.test(f.email)) er.email = 'Enter a valid email'
    setErr(er); if (Object.keys(er).length) return
    setList(l => [{ id: Math.random().toString(36).slice(2), ...f, name: f.name.trim(), at: new Date().toISOString() }, ...l]); setF(empty); setOk(true)
  }
  const inp = (k: string) => `h-10 w-full rounded-lg border bg-white px-3 text-sm placeholder:text-ink-4 hover:border-slate-300 focus:border-brand-500 ${err[k] ? 'border-bad-500' : 'border-line'}`
  const L = ({ t, k, children }: { t: string; k?: string; children: React.ReactNode }) => <label className="block"><span className="mb-1.5 block text-xs font-medium text-ink-2">{t}</span>{children}{k && err[k] && <span role="alert" className="mt-1 block text-xs text-bad-600">{err[k]}</span>}</label>
  return (
    <section id="enquire" className="bg-canvas py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-semibold text-brand-600">Admission enquiry</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Tell us about the student</h2><p className="mt-3 text-ink-3">Fill in the form and the submitted details appear right beside it.</p></div>
        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <form onSubmit={submit} noValidate className="grid gap-4 self-start rounded-2xl border border-line bg-white p-6 shadow-card lg:col-span-2">
            <L t="Full name *" k="name"><input className={inp('name')} value={f.name} onChange={e => set('name', e.target.value)} autoComplete="name" /></L>
            <div className="grid gap-4 sm:grid-cols-2">
              <L t="Phone *" k="phone"><input className={inp('phone')} value={f.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" /></L>
              <L t="Email" k="email"><input type="email" className={inp('email')} value={f.email} onChange={e => set('email', e.target.value)} autoComplete="email" /></L>
              <L t="City"><input className={inp('city')} value={f.city} onChange={e => set('city', e.target.value)} /></L>
              <L t="Best time to call"><select className={inp('time')} value={f.time} onChange={e => set('time', e.target.value)}>{['Morning', 'Afternoon', 'Evening'].map(t => <option key={t}>{t}</option>)}</select></L>
            </div>
            <L t="Course interested in"><select className={inp('course')} value={f.course} onChange={e => set('course', e.target.value)}>{COURSES.map(c => <option key={c}>{c}</option>)}</select></L>
            <L t="Message / questions"><textarea rows={3} className={`${inp('message')} h-auto py-2`} value={f.message} onChange={e => set('message', e.target.value)} /></L>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 font-medium text-white transition-all hover:bg-brand-700 active:scale-[.98]"><Send size={15} />Submit enquiry</button>
            {ok && <p role="status" className="flex items-center gap-2 rounded-lg bg-ok-50 px-3 py-2 text-sm text-ok-700"><Check size={15} />Submitted. Your details are shown on the right.</p>}
          </form>
          <div className="rounded-2xl border border-line bg-white shadow-card lg:col-span-3">
            <div className="flex items-center justify-between px-6 pt-5 pb-4"><h3 className="flex items-center gap-2 font-semibold">Submitted details <span className="rounded-full bg-brand-50 px-2 text-xs font-medium text-brand-700">{list.length}</span></h3>{list.length > 0 && <button onClick={() => { if (confirm('Clear all submissions?')) setList([]) }} className="text-xs text-ink-3 hover:text-bad-600">Clear all</button>}</div>
            {list.length === 0 ? <div className="flex flex-col items-center border-t border-line px-6 py-16 text-center"><span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><ClipboardList size={20} /></span><p className="font-medium">No submissions yet</p><p className="mt-1 max-w-xs text-sm text-ink-3">Submit the form and the details will appear here instantly.</p></div> :
              <ul className="divide-y divide-line-2 border-t border-line">{list.map(x => <li key={x.id} className="flex gap-3 px-6 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">{x.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}</span>
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{x.name}</p><span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">{x.course}</span><span className="text-xs text-ink-4">{new Date(x.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</span></div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2"><span className="flex items-center gap-1"><Phone size={12} />{x.phone}</span>{x.email && <span className="flex items-center gap-1"><Mail size={12} />{x.email}</span>}{x.city && <span className="flex items-center gap-1"><MapPin size={12} />{x.city}</span>}</div>
                  <p className="mt-1.5 text-[13px] text-ink-3">Best time to call: {x.time}{x.message && <> · “{x.message}”</>}</p></div>
                <button aria-label={`Delete ${x.name}`} onClick={() => setList(l => l.filter(i => i.id !== x.id))} className="h-8 w-8 shrink-0 rounded-lg text-ink-4 hover:bg-bad-50 hover:text-bad-600"><Trash2 size={15} className="mx-auto" /></button></li>)}</ul>}
            <p className="border-t border-line px-6 py-3 text-xs text-ink-3">Demo: submissions are saved in this browser only. No data is sent to a server.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Landing() {
  return (
    <>
      <Header />
      <main><Hero /><Features /><How /><Internships /><Enquire />
        <section className="bg-white py-16"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5"><div className="flex items-center gap-3"><ShieldCheck className="text-brand-600" /><p className="font-medium">Role-based access, institution-level data isolation and audit logs.</p></div><a href="#/login" className="inline-flex h-11 items-center gap-2 rounded-lg bg-navy-900 px-5 font-medium text-white hover:bg-navy-800">Open live demo <ArrowRight size={16} /></a></div></section>
      </main>
      <footer className="bg-navy-950 py-10 text-slate-400"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 text-sm"><Logo light /><p>© 2026 Admivoice. AI-powered admissions administration.</p></div></footer>
    </>
  )
}
