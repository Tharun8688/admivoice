import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Waves, Code2, Terminal, Megaphone, Link2, RefreshCw, Loader2, AlertCircle, BellRing, HeartHandshake, Building2, ArrowUp, PhoneCall, Globe, GraduationCap, Briefcase, BarChart3, ShieldCheck, Menu, X, ArrowRight, Check, Send, Trash2, Mail, Phone, MapPin, Bot, Users, Sparkles, ClipboardList, Play, Plus, Minus, Clock, FileCheck2, Award, CalendarClock, Lock, Languages } from 'lucide-react'
import { loadEnquiries, saveEnquiries, submitToWeb3Forms, type Enquiry } from './lib/api'

const NAV = [['Workflows', '#/workflows'], ['Product', '#/product'], ['Internships', '#/internships'], ['WebConnect', '#/webconnect'], ['FAQ', '#/faq'], ['Enquire', '#/enquire']]
const COURSES = ['B.Tech CSE', 'B.Tech AI & ML', 'B.Tech ECE', 'MBA', 'BBA', 'B.Sc Data Science', 'B.Com Honours']

/* ---------- helpers ---------- */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { el.classList.add('in'); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el); return () => io.disconnect()
  }, [])
  return ref
}
export const Reveal = ({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => { const r = useReveal(); return <div ref={r} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${className}`}>{children}</div> }
function Count({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0); const r = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = r.current; if (!el) return
    const run = () => { const t0 = performance.now(); const f = (t: number) => { const p = Math.min(1, (t - t0) / 1200); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(f) }; requestAnimationFrame(f) }
    if (!('IntersectionObserver' in window)) { setN(to); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect() } }, { threshold: 0.5 }); io.observe(el); return () => io.disconnect()
  }, [to])
  return <span ref={r}>{n}{suffix}</span>
}
export const Eyebrow = ({ children, light }: { children: ReactNode; light?: boolean }) => <p className={`text-sm font-semibold ${light ? 'text-violet-300' : 'text-brand-600'}`}>{children}</p>
export function Logo({ light }: { light?: boolean }) {
  return <a href="#/" className="flex items-center gap-2.5" aria-label="Admivoice home"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet2-500 shadow-md"><Waves size={17} className="text-white" /></span><span className={`text-[17px] font-semibold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>Admivoice</span></a>
}
export const Wave = ({ n = 36, color = 'bg-violet-400' }: { n?: number; color?: string }) => <div className="flex h-8 items-center gap-[3px]" aria-hidden>{Array.from({ length: n }, (_, i) => <span key={i} style={{ animationDelay: `${(i % 8) * 90}ms`, height: `${30 + ((i * 37) % 70)}%` }} className={`w-[3px] flex-1 origin-center animate-wave rounded-full ${color}`} />)}</div>

/* ---------- header ---------- */
export function Header() {
  const [open, setOpen] = useState(false); const [sc, setSc] = useState(false)
  useEffect(() => { const f = () => setSc(window.scrollY > 12); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f) }, [])
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${sc || open ? 'bg-navy-900/90 shadow-lg backdrop-blur-md' : ''}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo light />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">{NAV.map(([l, h]) => <a key={h} href={h} className="text-sm text-slate-300 transition-colors hover:text-white">{l}</a>)}</nav>
        <div className="hidden items-center gap-2 lg:flex"><a href="#/enquire" className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-200 hover:text-white">Enquire</a><a href="#/login" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-4 text-sm font-medium text-navy-900 transition-colors hover:bg-slate-100"><Play size={13} className="fill-current" />Live demo</a></div>
        <button className="text-white lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="flex flex-col gap-1 border-t border-white/10 px-5 pb-5 pt-2 lg:hidden">{NAV.map(([l, h]) => <a key={h} onClick={() => setOpen(false)} href={h} className="rounded-lg px-2 py-2.5 text-slate-200 hover:bg-white/5">{l}</a>)}<a href="#/login" className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-white font-medium text-navy-900">View live demo</a></nav>}
    </header>
  )
}

/* ---------- hero ---------- */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy-900 pb-24 pt-32 text-white sm:pt-36">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '44px 44px', maskImage: 'radial-gradient(ellipse at 50% 30%,#000,transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%,#000,transparent 70%)' }} />
      <div className="absolute -right-24 top-0 h-[30rem] w-[30rem] rounded-full bg-brand-600/30 blur-3xl" /><div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-violet2-500/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-fadeUp">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200"><Sparkles size={13} className="text-violet-300" />Built exclusively for college admissions</span>
          <h1 className="mt-5 text-[40px] font-semibold leading-[1.08] tracking-tight sm:text-[56px]">Less manual work.<br />Faster admissions.<br /><span className="bg-gradient-to-r from-violet-300 to-brand-200 bg-clip-text text-transparent">Smarter communication.</span></h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">From shortlisting to seat confirmation, Admivoice's AI voice platform handles every student touchpoint, at machine scale, with human warmth.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#/login" className="group inline-flex h-12 items-center gap-2 rounded-xl bg-brand-500 px-6 font-medium text-white shadow-lg shadow-brand-600/30 transition-all hover:bg-brand-600 hover:shadow-brand-600/50"><Play size={15} className="fill-current" />Start free trial</a>
            <a href="#/enquire" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-6 font-medium text-white transition-colors hover:bg-white/5">Book a demo <ArrowRight size={16} /></a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">{['Multi-language support', 'CRM-ready outcome logging', 'FERPA-aware data handling'].map(t => <li key={t} className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400" />{t}</li>)}</ul>
        </div>
        <div className="relative animate-fadeUp [animation-delay:120ms]" aria-hidden>
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-500/20 to-violet2-500/10 blur-2xl" />
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300"><PhoneCall size={18} /></span><div className="flex-1"><p className="text-sm font-medium">Ananya · B.Tech CSE</p><p className="text-xs text-slate-400">B.Tech 2026 Early Bird · English</p></div><span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />LIVE</span></div>
            <div className="mt-4"><Wave n={44} /></div>
            <div className="mt-4 space-y-2.5 text-[13px]">
              <p className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2"><Bot size={12} className="mr-1 inline" />Eligibility is 60% in 12th with Maths. Applications close 30 June.</p>
              <p className="ml-auto max-w-[75%] rounded-2xl rounded-tr-sm bg-brand-500/70 px-3 py-2">Can you send me the application link?</p>
              <p className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2"><Bot size={12} className="mr-1 inline" />Sending it to your WhatsApp now.</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">{[['Duration', '1:42'], ['Sentiment', 'Positive'], ['Outcome', 'Interested']].map(([a, b]) => <div key={a} className="rounded-xl bg-white/5 py-2"><p className="text-slate-400">{a}</p><p className="mt-0.5 font-medium">{b}</p></div>)}</div>
          </div>
          <div className="absolute -bottom-5 -left-4 hidden rounded-xl border border-white/10 bg-navy-800/90 px-4 py-3 shadow-xl backdrop-blur sm:block"><p className="text-[11px] text-slate-400">Answered from</p><p className="flex items-center gap-1.5 text-sm font-medium"><Globe size={13} className="text-violet-300" />meridian.edu · verified</p></div>
        </div>
      </div>
    </section>
  )
}

/* ---------- stats ---------- */
function Stats() {
  return (
    <section className="border-b border-line bg-white py-12"><div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-5 text-center sm:gap-8">
      {[[3, '×', 'Higher reach vs email'], [60, '%', 'Reduction in fee defaults'], [40, '%', 'Lower counsellor workload']].map(([n, x, l]) => <div key={l as string}><p className="bg-gradient-to-br from-navy-900 to-brand-600 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl"><Count to={n as number} suffix={x as string} /></p><p className="mt-1.5 text-xs text-ink-3 sm:text-sm">{l}</p></div>)}
    </div></section>
  )
}

/* ---------- workflows ---------- */
function Workflows() {
  const w = [[PhoneCall, 'Admissions Outreach', 'Automatically call shortlisted applicants to confirm interest, answer FAQs, and schedule campus visits, with no counsellor required.'], [BellRing, 'Fee Reminder Campaigns', 'Reduce fee defaults with timely AI reminders that feel personal, escalate intelligently, and log every outcome automatically.'], [HeartHandshake, 'Alumni Engagement', 'Re-engage alumni for donation drives, mentorship programs, and annual events using personalised voice campaigns at scale.']] as const
  return (
    <section id="workflows" className="bg-canvas py-24"><div className="mx-auto max-w-6xl px-5">
      <Reveal className="mx-auto max-w-2xl text-center"><Eyebrow>What Admivoice does for you</Eyebrow><h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Built for your workflows</h2><p className="mt-3 text-ink-3">Automate admissions, reduce drop-offs and scale enrolments across education and institutions.</p></Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-3">{w.map(([I, t, d], i) => <Reveal key={t} delay={i * 80}><div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-pop">
        <span className="absolute right-5 top-4 text-6xl font-semibold text-slate-100 transition-colors group-hover:text-brand-100">{i + 1}</span>
        <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white shadow-md"><I size={20} /></span><h3 className="relative mt-5 text-lg font-semibold">{t}</h3><p className="relative mt-2 text-sm leading-relaxed text-ink-3">{d}</p></div></Reveal>)}</div>
      <Reveal className="mt-8"><ul className="grid gap-3 rounded-2xl border border-line bg-white p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4">{[[Languages, 'Multi-language support for regional campuses'], [FileCheck2, 'CRM-ready call outcome logging'], [Lock, 'FERPA-aware data handling'], [Building2, 'Works across schools, colleges & ed-tech']].map(([I, t]) => { const Ic = I as typeof Lock; return <li key={t as string} className="flex items-start gap-3 text-sm text-ink-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Ic size={15} /></span><span className="pt-1">{t as string}</span></li> })}</ul></Reveal>
    </div></section>
  )
}

/* ---------- product showcase ---------- */
const TABS = [
  { id: 'voice', label: 'AI Voice', icon: PhoneCall, title: 'Run calling campaigns on autopilot', pts: ['Individual and bulk admission campaigns', 'Approved scripts, languages, schedules and retries', 'Live transcripts, recordings and outcomes'] },
  { id: 'adm', label: 'Admissions', icon: GraduationCap, title: 'Every applicant, enquiry to enrolment', pts: ['Table and Kanban pipeline views', 'Document verification and follow-ups', 'Officer assignment, notes and history'] },
  { id: 'web', label: 'WebConnect', icon: Globe, title: 'Answers grounded in your website', pts: ['Import courses, fees, eligibility and deadlines', 'Sync status, timestamps and error alerts', 'Escalates when nothing verified is found'] },
  { id: 'int', label: 'Internships', icon: Briefcase, title: 'A full internship portal included', pts: ['Publish programmes and track applications', 'Interviews, shortlists and coordinators', 'Completion tracking and certificates'] },
] as const
function Mock({ id }: { id: string }) {
  if (id === 'voice') return (
    <div className="space-y-3">{[['Ananya', '1:42', true], ['Rohan', '0:58', true], ['Kavya', '3:05', false]].map(([n, t, l]) => <div key={n as string} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">{(n as string).split(' ').map(w => w[0]).join('')}</span><div className="flex-1"><p className="text-sm font-medium">{n}</p><p className="text-xs text-ink-3">{l ? 'Speaking with AI assistant' : 'Callback scheduled · 6 PM'}</p></div>{l ? <span className="flex items-center gap-1.5 rounded-full bg-ok-50 px-2 py-0.5 text-xs font-medium text-ok-700"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok-500" />{t}</span> : <span className="rounded-full bg-warn-50 px-2 py-0.5 text-xs font-medium text-warn-700">Scheduled</span>}</div>)}
      <div className="rounded-xl border border-line bg-white p-3"><Wave n={48} color="bg-brand-500" /><div className="mt-2 flex justify-between text-xs text-ink-3"><span>Recording</span><span>Interested · 82%</span></div></div></div>)
  if (id === 'adm') return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[['Contacted', ['Aarav', 'Meera']], ['Interested', ['Rohan', 'Divya', 'Yash']], ['Docs submitted', ['Sneha']], ['Admitted', ['Arjun', 'Tara']]].map(([c, l]) => <div key={c as string} className="rounded-xl bg-slate-100/80 p-2"><p className="px-1 pb-2 text-xs font-semibold text-ink-2">{c as string}</p><div className="space-y-2">{(l as string[]).map((x, i) => <div key={x} className="rounded-lg border border-line bg-white p-2.5"><p className="text-xs font-medium">{x}</p><div className="mt-2 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-600" style={{ width: `${30 + i * 25 + (c === 'Admitted' ? 30 : 0)}%` }} /></div></div>)}</div></div>)}</div>)
  if (id === 'web') return (
    <div className="grid gap-3 sm:grid-cols-2"><div className="space-y-2">{[['Main college website', 'Synced', 'ok'], ['Admissions portal', 'Syncing', 'brand'], ['Prospectus (PDF)', 'Error', 'bad']].map(([n, s, t]) => <div key={n} className="flex items-center justify-between rounded-xl border border-line bg-white p-3"><div className="flex items-center gap-2.5"><Globe size={15} className="text-ink-3" /><span className="text-sm font-medium">{n}</span></div><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t === 'ok' ? 'bg-ok-50 text-ok-700' : t === 'brand' ? 'bg-brand-50 text-brand-700' : 'bg-bad-50 text-bad-700'}`}>{s}</span></div>)}</div>
      <div className="space-y-2 rounded-xl border border-line bg-white p-3 text-[13px]"><p className="ml-auto w-fit rounded-2xl rounded-br-sm bg-brand-600 px-3 py-1.5 text-white">MBA fees?</p><p className="rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-1.5">MBA: ₹2,40,000 / year.<span className="mt-1 block border-t border-line pt-1 text-[11px] text-ink-3">Source: Main college website · Fee structures</span></p></div></div>)
  return (
    <div className="space-y-3"><div className="flex flex-wrap gap-1.5">{['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'In Progress', 'Completed'].map((s, i) => <span key={s} className={`rounded-full px-2.5 py-1 text-xs font-medium ${i === 3 ? 'bg-brand-600 text-white' : 'bg-white text-ink-2 border border-line'}`}>{s}</span>)}</div>
      {[['JavaScript Intern', '2nd year · 8 weeks · Hybrid', '3/6 filled'], ['Python Intern', '2nd year · 8 weeks · Remote', '2/5 filled']].map(([t, s, f]) => <div key={t} className="flex items-center justify-between rounded-xl border border-line bg-white p-3"><div><p className="text-sm font-medium">{t}</p><p className="text-xs text-ink-3">{s}</p></div><span className="rounded-full bg-ok-50 px-2 py-0.5 text-xs font-medium text-ok-700">{f}</span></div>)}
      <div className="flex items-center gap-2 rounded-xl border border-line bg-white p-3 text-sm"><Award size={16} className="text-violet-500" />Certificate issued to <b>Priya</b></div></div>)
}
function Product() {
  const [tab, setTab] = useState<typeof TABS[number]['id']>('voice'); const cur = TABS.find(t => t.id === tab)!
  return (
    <section id="product" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center"><Eyebrow>The platform</Eyebrow><h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Not a generic CRM. A dedicated admissions OS.</h2><p className="mt-3 text-ink-3">Four connected workspaces that work together, from the first call to the final certificate.</p></Reveal>
        <Reveal className="mt-10">
          <div role="tablist" aria-label="Product areas" className="mx-auto flex w-fit max-w-full overflow-x-auto rounded-xl bg-white p-1 shadow-card ring-1 ring-line">{TABS.map(t => <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab === t.id ? 'bg-navy-900 text-white shadow' : 'text-ink-3 hover:text-ink'}`}><t.icon size={15} />{t.label}</button>)}</div>
          <div className="mt-6 grid items-center gap-8 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8 lg:grid-cols-[1fr_1.25fr]">
            <div key={cur.id} className="animate-fadeUp"><h3 className="text-2xl font-semibold tracking-tight">{cur.title}</h3><ul className="mt-5 space-y-3">{cur.pts.map(p => <li key={p} className="flex items-start gap-3 text-ink-2"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ok-50 text-ok-600"><Check size={12} /></span>{p}</li>)}</ul><a href="#/login" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">See it in the demo <ArrowRight size={15} /></a></div>
            <div key={cur.id + 'm'} className="animate-fadeUp rounded-2xl bg-slate-50 p-4 ring-1 ring-line"><Mock id={cur.id} /></div>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[[BarChart3, 'Analytics & reports', 'Conversion, course demand and officer performance with CSV/PDF export.'], [Users, 'Unified contacts', 'Students, parents and applicants with segments, tags and history.'], [Languages, 'Multilingual calls', 'Per-campaign language preferences for regional outreach.'], [Lock, 'Secure by design', 'Role-based access, institution isolation and full audit logs.']].map(([I, t, d], i) => { const Ic = I as typeof Users; return <Reveal key={t as string} delay={i * 70}><div className="h-full rounded-2xl border border-line bg-white p-5 shadow-card transition-shadow hover:shadow-pop"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Ic size={17} /></span><h3 className="mt-3 font-semibold">{t as string}</h3><p className="mt-1 text-sm text-ink-3">{d as string}</p></div></Reveal> })}</div>
      </div>
    </section>
  )
}

/* ---------- how ---------- */
function How() {
  const steps = [[Globe, 'Connect', 'Link your college website so the assistant learns courses, fees, eligibility and deadlines.'], [PhoneCall, 'Automate', 'Launch approved AI voice campaigns or let the assistant answer inbound enquiries.'], [ClipboardList, 'Track', 'Follow every applicant through the pipeline, from first enquiry to enrolment.'], [BarChart3, 'Improve', 'Review transcripts, outcomes and analytics to keep getting faster.']] as const
  return (
    <section id="how" className="bg-canvas py-24"><div className="mx-auto max-w-6xl px-5">
      <Reveal className="mx-auto max-w-2xl text-center"><Eyebrow>How it works</Eyebrow><h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">From website to enrolment in four steps</h2></Reveal>
      <ol className="relative mt-14 grid gap-6 md:grid-cols-4"><div className="absolute left-[12%] right-[12%] top-7 hidden border-t-2 border-dashed border-line md:block" />{steps.map(([I, t, d], i) => <Reveal key={t} delay={i * 90}><li className="relative text-center"><span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-white shadow-lg ring-4 ring-white"><I size={22} /></span><p className="mt-1 text-xs font-semibold text-brand-600">Step {i + 1}</p><h3 className="font-semibold">{t}</h3><p className="mx-auto mt-1 max-w-[220px] text-sm text-ink-3">{d}</p></li></Reveal>)}</ol>
      <Reveal className="mt-14"><div className="rounded-2xl bg-white p-5 ring-1 ring-line"><p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-ink-4">Admission pipeline</p><div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2.5 text-xs font-medium">{['New Enquiry', 'Contacted', 'Interested', 'Application Started', 'Documents Submitted', 'Under Review', 'Admitted', 'Enrolled'].map((s, i, a) => <span key={s} className="flex items-center gap-2"><span className={`rounded-full px-3 py-1 ${i >= 6 ? 'bg-ok-50 text-ok-700' : 'bg-brand-50 text-brand-700'}`}>{s}</span>{i < a.length - 1 && <ArrowRight size={12} className="text-ink-4" />}</span>)}</div></div></Reveal>
    </div></section>
  )
}

/* ---------- roles ---------- */
function Roles() {
  const r = [[GraduationCap, 'Admission officers', 'Stop chasing leads by hand. See who to call, what was said, and which documents are pending.', ['AI-handled first-touch calls', 'Follow-up reminders', 'Document verification']], [Users, 'Admissions heads', 'Watch conversion, officer performance and campaign results in one place.', ['Campaign approvals', 'Performance analytics', 'CSV & PDF reports']], [Briefcase, 'Internship coordinators', 'Run the whole internship lifecycle without juggling forms and email threads.', ['Publish & shortlist', 'Interview scheduling', 'Certificates']], [ShieldCheck, 'College management', 'Read-only visibility with audit trails and institution-level data isolation.', ['Read-only access', 'Audit logs', 'Multi-institution']]] as const
  return (
    <section id="roles" className="bg-white py-24"><div className="mx-auto max-w-6xl px-5">
      <Reveal className="mx-auto max-w-2xl text-center"><Eyebrow>Who it's for</Eyebrow><h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Made for every desk in the admissions office</h2></Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-2">{r.map(([I, t, d, pts], i) => <Reveal key={t} delay={i * 70}><div className="h-full rounded-2xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-pop"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><I size={19} /></span><h3 className="text-lg font-semibold">{t}</h3></div><p className="mt-3 text-ink-3">{d}</p><ul className="mt-4 flex flex-wrap gap-2">{pts.map(p => <li key={p} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-ink-2">{p}</li>)}</ul></div></Reveal>)}</div>
    </div></section>
  )
}

/* ---------- internships teaser ---------- */
function InternshipTeaser() {
  return (
    <section className="bg-white py-20"><div className="mx-auto max-w-6xl px-5"><Reveal><div className="grid items-center gap-8 rounded-3xl border border-line bg-canvas p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
      <div><Eyebrow>Internships</Eyebrow><h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Internship roles for 2nd-year students</h2><p className="mt-3 text-ink-3">JavaScript, Python and Student Partner roles, plus a full portal to publish, review, interview and certify.</p>
        <a href="#/internships" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-navy-900 px-5 text-sm font-medium text-white hover:bg-navy-800">View internships <ArrowRight size={15} /></a></div>
      <ul className="grid gap-3">{[[Code2, 'JavaScript Intern'], [Terminal, 'Python Intern'], [Megaphone, 'Student Partner Intern']].map(([I, t]) => { const Ic = I as typeof Code2; return <li key={t as string} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-card"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Ic size={17} /></span><span className="font-medium">{t as string}</span><span className="ml-auto rounded bg-violet2-50 px-1.5 py-0.5 text-xs font-medium text-violet-700">2nd year</span></li> })}</ul>
    </div></Reveal></div></section>
  )
}

const empty = { college: '', name: '', role: 'Admissions officer', email: '', phone: '', city: '', website: '', size: '', interest: 'AI Voice + Admissions', message: '', botcheck: '' }
const ROLES = ['Admissions officer', 'Principal / Director', 'Internship coordinator', 'Management', 'Other']
const SIZES = ['', 'Under 500', '500 – 2,000', '2,000 – 10,000', '10,000+']
const INTERESTS = ['AI Voice + Admissions', 'AI Voice', 'WebConnect', 'Internships', 'Everything']
export const inpCls = (bad?: string) => `h-10 w-full rounded-lg border bg-white px-3 text-sm placeholder:text-ink-4 hover:border-slate-300 focus:border-brand-500 ${bad ? 'border-bad-500' : 'border-line'}`
export const Lbl = ({ t, err, children }: { t: string; err?: string; children: ReactNode }) => <label className="block"><span className="mb-1.5 block text-xs font-medium text-ink-2">{t}</span>{children}{err && <span role="alert" className="mt-1 block text-xs text-bad-600">{err}</span>}</label>

function Enquire() {
  const [list, setList] = useState<Enquiry[]>(loadEnquiries); const [f, setF] = useState(empty); const [err, setErr] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle'); const [msg, setMsg] = useState('')
  useEffect(() => saveEnquiries(list), [list])
  const set = (k: keyof typeof empty, v: string) => { setF(p => ({ ...p, [k]: v })); setErr(p => ({ ...p, [k]: '' })); if (state !== 'sending') setState('idle') }
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (state === 'sending') return
    const er: Record<string, string> = {}
    if (!f.college.trim()) er.college = 'College name is required'
    if (!f.name.trim()) er.name = 'Your name is required'
    if (!/\S+@\S+\.\S+/.test(f.email)) er.email = 'Enter a valid work email'
    if (f.phone.replace(/\D/g, '').length < 10) er.phone = 'Enter a valid 10-digit phone number'
    if (f.website && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/i.test(f.website.trim())) er.website = 'Enter a valid website, e.g. www.college.edu'
    setErr(er); if (Object.keys(er).length) return
    setState('sending')
    const { botcheck, ...fields } = f
    const r = await submitToWeb3Forms(botcheck ? { ...fields, botcheck } : fields, `New college enquiry: ${f.college.trim()}`)
    if (r.ok) { setList(l => [{ id: Math.random().toString(36).slice(2), ...fields, college: f.college.trim(), name: f.name.trim(), at: new Date().toISOString() }, ...l]); setF(empty); setState('ok') }
    else { setState('fail'); setMsg(r.message) }
  }
  return (
    <section id="enquire" className="bg-canvas py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center"><Eyebrow>Book a demo</Eyebrow><h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Tell us about your college</h2><p className="mt-3 text-ink-3">Share your college details and our team will get in touch. Your submission also appears beside the form.</p></Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <form onSubmit={submit} noValidate className="grid gap-4 self-start rounded-2xl border border-line bg-white p-6 shadow-card lg:col-span-3">
            <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" checked={f.botcheck === 'on'} onChange={e => set('botcheck', e.target.checked ? 'on' : '')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Lbl t="College / institution name *" err={err.college}><input className={inpCls(err.college)} value={f.college} onChange={e => set('college', e.target.value)} autoComplete="organization" /></Lbl></div>
              <Lbl t="Your name *" err={err.name}><input className={inpCls(err.name)} value={f.name} onChange={e => set('name', e.target.value)} autoComplete="name" /></Lbl>
              <Lbl t="Your role"><select className={inpCls()} value={f.role} onChange={e => set('role', e.target.value)}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></Lbl>
              <Lbl t="Work email *" err={err.email}><input type="email" className={inpCls(err.email)} value={f.email} onChange={e => set('email', e.target.value)} autoComplete="email" /></Lbl>
              <Lbl t="Phone *" err={err.phone}><input className={inpCls(err.phone)} value={f.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" /></Lbl>
              <Lbl t="City"><input className={inpCls()} value={f.city} onChange={e => set('city', e.target.value)} autoComplete="address-level2" /></Lbl>
              <Lbl t="College website" err={err.website}><input className={inpCls(err.website)} value={f.website} onChange={e => set('website', e.target.value)} placeholder="www.yourcollege.edu" autoComplete="url" /></Lbl>
              <Lbl t="Students / applicants per year"><select className={inpCls()} value={f.size} onChange={e => set('size', e.target.value)}>{SIZES.map(r => <option key={r} value={r}>{r || 'Select…'}</option>)}</select></Lbl>
              <Lbl t="Interested in"><select className={inpCls()} value={f.interest} onChange={e => set('interest', e.target.value)}>{INTERESTS.map(r => <option key={r}>{r}</option>)}</select></Lbl>
              <div className="sm:col-span-2"><Lbl t="Message"><textarea rows={3} className={`${inpCls()} h-auto py-2`} value={f.message} onChange={e => set('message', e.target.value)} placeholder="What would you like to automate?" /></Lbl></div>
            </div>
            <button disabled={state === 'sending'} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 font-medium text-white transition-all hover:bg-brand-700 active:scale-[.98] disabled:opacity-60">{state === 'sending' ? <><Loader2 size={15} className="animate-spin" />Sending…</> : <><Send size={15} />Book a demo</>}</button>
            {state === 'ok' && <p role="status" className="flex items-center gap-2 rounded-lg bg-ok-50 px-3 py-2 text-sm text-ok-700"><Check size={15} />Thanks! We received your details and will contact you soon.</p>}
            {state === 'fail' && <p role="alert" className="flex items-center gap-2 rounded-lg bg-bad-50 px-3 py-2 text-sm text-bad-700"><AlertCircle size={15} />{msg} Your details are still in the form.</p>}
          </form>
          <div className="rounded-2xl border border-line bg-white shadow-card lg:col-span-2 lg:self-start">
            <div className="flex items-center justify-between px-5 pb-4 pt-5"><h3 className="flex items-center gap-2 font-semibold">Submitted details <span className="rounded-full bg-brand-50 px-2 text-xs font-medium text-brand-700">{list.length}</span></h3>{list.length > 0 && <button onClick={() => { if (confirm('Clear the list shown here? (Already-sent enquiries are not affected.)')) setList([]) }} className="text-xs text-ink-3 hover:text-bad-600">Clear</button>}</div>
            {list.length === 0 ? <div className="flex flex-col items-center border-t border-line px-6 py-14 text-center"><span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><ClipboardList size={20} /></span><p className="font-medium">No submissions yet</p><p className="mt-1 max-w-xs text-sm text-ink-3">Send the form and your details will appear here.</p></div> :
              <ul className="max-h-[520px] divide-y divide-line-2 overflow-y-auto border-t border-line">{list.map(x => <li key={x.id} className="flex gap-3 px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white"><Building2 size={17} /></span>
                <div className="min-w-0 flex-1"><p className="font-semibold">{x.college}</p><p className="text-xs text-ink-3">{x.name} · {x.role} · {new Date(x.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</p>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-2"><span className="flex items-center gap-1"><Mail size={12} />{x.email}</span><span className="flex items-center gap-1"><Phone size={12} />{x.phone}</span>{x.city && <span className="flex items-center gap-1"><MapPin size={12} />{x.city}</span>}{x.website && <span className="flex items-center gap-1"><Globe size={12} />{x.website}</span>}</div>
                  <p className="mt-1.5 text-xs text-ink-3">Interested in {x.interest}{x.size && ` · ${x.size} students`}{x.message && <> · “{x.message}”</>}</p></div>
                <button aria-label={`Remove ${x.college} from this list`} onClick={() => setList(l => l.filter(i => i.id !== x.id))} className="h-8 w-8 shrink-0 rounded-lg text-ink-4 hover:bg-bad-50 hover:text-bad-600"><Trash2 size={15} className="mx-auto" /></button></li>)}</ul>}
            <p className="border-t border-line px-5 py-3 text-xs text-ink-3">Details are emailed to the Admivoice team. This list is stored in your browser only.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- WebConnect showcase ---------- */
function WebConnect() {
  const items = [['Verified website knowledge', 'Courses, departments, fee structures, eligibility and deadlines imported from your official college website.'], ['Website chatbot', 'Answers visitor questions instantly and always cites the page it used.'], ['Sync status & alerts', 'See last-updated times and error alerts for every connected source.']]
  const opts = [[PhoneCall, 'Talk Now', 'Talk to our AI assistant live'], [Bot, 'Chat with us', 'Message our AI assistant'], [CalendarClock, 'Call me later', 'Leave your details for an AI callback']] as const
  const [open, setOpen] = useState(0); const [pick, setPick] = useState(0)
  return (
    <section id="webconnect" className="relative overflow-hidden bg-navy-950 py-24 text-white">
      <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl" /><div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet2-500/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-2">
        <Reveal>
          <span className="block h-[3px] w-14 rounded bg-brand-500" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">WebConnect</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Connect your college website</h2>
          <p className="mt-4 max-w-lg text-lg text-slate-400">Link your official website once. Voice, chat and AI callbacks then answer every visitor with verified information.</p>
          <a href="#/login" className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-brand-500 px-6 font-medium text-white shadow-lg shadow-brand-600/30 transition-colors hover:bg-brand-600">Explore WebConnect <ArrowRight size={16} /></a>
          <ul className="mt-9 border-t border-white/10">{items.map(([t, d], i) => <li key={t} className="border-b border-white/10"><button onClick={() => setOpen(i)} aria-expanded={open === i} className="flex w-full items-center justify-between py-5 text-left"><span className={`text-xl font-medium transition-colors ${open === i ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>{t}</span><ArrowRight size={16} className={`transition-transform ${open === i ? 'rotate-90 text-brand-500' : 'text-slate-600'}`} /></button>{open === i && <p className="animate-fadeUp pb-5 pr-8 text-sm leading-relaxed text-slate-400">{d}</p>}</li>)}</ul>
          <p className="mt-6 text-sm text-slate-500">Want it connected to your site? Add your website in the <a href="#/enquire" className="text-violet-300 underline-offset-4 hover:underline">demo request form</a> and we'll set it up.</p>
        </Reveal>
        <Reveal delay={100}>
          <div className="relative rounded-[28px] bg-canvas p-5 shadow-2xl sm:p-8" aria-hidden>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#ef6a5e]" /><span className="h-3 w-3 rounded-full bg-[#f5be4f]" /><span className="h-3 w-3 rounded-full bg-[#62c554]" /><span className="ml-3 h-7 flex-1 rounded-full bg-slate-200/80" /></div>
            <div className="mt-6 grid gap-3"><div className="h-7 w-40 rounded-full bg-slate-200/80" /><div className="h-4 w-3/4 rounded-full bg-slate-200/70" /><div className="h-4 w-1/2 rounded-full bg-slate-200/70" /><div className="mt-2 grid grid-cols-2 gap-3"><div className="h-28 rounded-2xl bg-slate-200/60" /><div className="h-28 rounded-2xl bg-slate-200/60" /></div></div>
            <div className="relative ml-auto mt-[-120px] w-full max-w-[290px] rounded-2xl bg-white p-3 shadow-pop ring-1 ring-line sm:mt-[-150px]">
              <div className="space-y-2">{opts.map(([I, t, d], i) => <button key={t} tabIndex={-1} onMouseEnter={() => setPick(i)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${pick === i ? 'border-brand-200 bg-brand-50/60' : 'border-line'}`}><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${pick === i ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600'}`}><I size={17} /></span><span><span className="block text-sm font-semibold text-ink">{t}</span><span className="block text-[11px] text-ink-3">{d}</span></span></button>)}</div>
              <p className="mt-3 text-center text-[10px] text-ink-4">Powered by <span className="font-semibold text-brand-600">Admivoice</span></p>
              <span className="mt-2 ml-auto flex w-fit items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-xs font-medium text-white shadow-lg"><Waves size={13} />Talk to us</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */
function Faq() {
  const q = [['Does Admivoice place real calls?', 'The live demo uses simulated calls, transcripts and recordings, clearly labelled as such. The platform is designed so real telephony and AI voice providers plug in later.'], ['Where does the AI get its answers?', 'From verified information imported from your own website through WebConnect (courses, fees, eligibility, deadlines). If nothing verified is found, it hands the question to an officer instead of guessing.'], ['Who can see what?', 'Five roles (Super Admin, College Admin, Admission Officer, Internship Coordinator and Read-Only Management) have different permissions. Data is isolated per institution and every key action is audit-logged.'], ['Can we run internships here too?', 'Yes. Internships is a first-class section: publish programmes, manage applicants, schedule interviews, track completion and issue certificates.'], ['What happens to the form I submit?', 'Your college details are emailed to the Admivoice team so we can contact you. A copy is also shown beside the form, stored in your own browser only.']]
  return (
    <section id="faq" className="bg-canvas py-24"><div className="mx-auto max-w-3xl px-5">
      <Reveal className="text-center"><Eyebrow>FAQ</Eyebrow><h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Questions, answered</h2></Reveal>
      <div className="mt-10 divide-y divide-line rounded-2xl border border-line bg-white shadow-card">{q.map(([a, b]) => <details key={a} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink"><span>{a}</span><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-ink-3 transition-colors group-open:bg-brand-600 group-open:text-white"><Plus size={13} className="group-open:hidden" /><Minus size={13} className="hidden group-open:block" /></span></summary><p className="mt-3 pr-10 text-sm leading-relaxed text-ink-3">{b}</p></details>)}</div>
    </div></section>
  )
}

function Cta() {
  return (
    <section className="bg-canvas px-5 pb-24"><Reveal><div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-navy-900 px-6 py-14 text-center text-white sm:py-16">
      <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl" /><div className="absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-violet2-500/25 blur-3xl" />
      <div className="relative"><h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Ready to transform your Education outreach?</h2><p className="mx-auto mt-3 max-w-xl text-slate-300">Join education &amp; institutions teams automating conversations and growing faster.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><a href="#/login" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 font-medium text-navy-900 transition-colors hover:bg-slate-100"><Play size={15} className="fill-current" />Get started free</a><a href="#/enquire" className="inline-flex h-12 items-center rounded-xl border border-white/20 px-6 font-medium hover:bg-white/5">Talk to sales</a></div></div>
    </div></Reveal></section>
  )
}

function Sticky() {
  const [show, setShow] = useState(false)
  useEffect(() => { const f = () => setShow(window.scrollY > 600); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f) }, [])
  return (
    <>
      <div className={`fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-white/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${show ? 'translate-y-0' : 'translate-y-full'}`}><a href="#/login" className="flex h-11 flex-1 items-center justify-center rounded-lg bg-brand-600 text-sm font-medium text-white">Start free trial</a><a href="#/enquire" className="flex h-11 flex-1 items-center justify-center rounded-lg border border-line text-sm font-medium">Book a demo</a></div>
      <button aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-6 right-4 z-30 hidden h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white shadow-lg transition-opacity md:flex ${show ? 'opacity-100' : 'pointer-events-none opacity-0'}`}><ArrowUp size={16} /></button>
    </>
  )
}

export function Footer() {
  return (
    <footer className="bg-navy-950 pb-24 pt-12 text-slate-400 md:pb-10"><div className="mx-auto max-w-6xl px-5"><div className="flex flex-wrap items-start justify-between gap-8"><div className="max-w-xs"><Logo light /><p className="mt-3 text-sm">AI voice platform for admissions, outreach and internships in education.</p></div><nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm" aria-label="Footer">{NAV.map(([l, h]) => <a key={h} href={h} className="hover:text-white">{l}</a>)}<a href="#/login" className="hover:text-white">Live demo</a></nav></div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs"><p>© 2026 Admivoice. All rights reserved. · Built by <a href="https://dialgrow.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline-offset-4 hover:underline">DialGrow</a></p><p className="flex gap-4"><span>Terms</span><span>Privacy</span><span>Security</span></p></div></div></footer>
  )
}

export default function Landing() {
  const { pathname } = useLocation()
  useEffect(() => {
    const id = pathname.slice(1); if (!id) { window.scrollTo(0, 0); return }
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60); return () => clearTimeout(t)
  }, [pathname])
  return (
    <>
      <a href="#/product" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
      <Header />
      <main><Hero /><Stats /><Workflows /><Product /><WebConnect /><How /><Roles /><InternshipTeaser /><Enquire /><Faq /><Cta /></main>
      <Sticky />
      <Footer />
    </>
  )
}
