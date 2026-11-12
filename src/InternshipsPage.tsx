import { useEffect, useRef, useState } from 'react'
import { Mail, ArrowRight, AlertCircle, Award, CalendarClock, Check, Clock, Code2, FileCheck2, GraduationCap, Loader2, MapPin, Megaphone, Send, Terminal, Users, Wallet } from 'lucide-react'
import { Header, Footer, Reveal, Eyebrow, Lbl, inpCls } from './Landing'
import { submitToWeb3Forms } from './lib/api'

const ROLES = [
  { id: 'JavaScript Intern', icon: Code2, blurb: 'Build interactive pages and small web apps with the admissions tech team.', do: ['Build and polish web pages with JavaScript, HTML and CSS', 'Fix UI bugs and improve accessibility', 'Learn a real Git and code-review workflow'], skills: ['JavaScript', 'HTML & CSS', 'Git'], duration: '8 weeks', mode: 'Hybrid', stipend: '₹8,000 / month', spots: 3 },
  { id: 'Python Intern', icon: Terminal, blurb: 'Automate reports and analyse enquiry data with Python scripts and notebooks.', do: ['Write scripts that automate admissions reports', 'Clean and analyse enquiry data', 'Build simple charts and summaries for the team'], skills: ['Python', 'Data handling', 'Automation'], duration: '8 weeks', mode: 'Remote', stipend: '₹8,000 / month', spots: 3 },
  { id: 'Student Partner Intern', icon: Megaphone, blurb: 'Represent the college to prospective students, host campus tours and support admission drives.', do: ['Welcome visitors and lead campus tours', 'Support admission drives and open days', 'Answer first-level questions from prospective students'], skills: ['Communication', 'Public speaking', 'Events'], duration: '10 weeks', mode: 'On-campus', stipend: '₹6,000 / month + certificate', spots: 4 },
] as const
const HR = 'hr@dialgrow.com'
const mail = (role?: string) => `mailto:${HR}?subject=${encodeURIComponent(role ? `Internship application: ${role}` : 'Internship application')}&body=${encodeURIComponent('Hi,\n\nPlease find my resume attached.\n\nName:\nCollege:\nYear of study:\nRole: ' + (role ?? '') + '\n')}`
const STEPS = ['Apply', 'Review', 'Shortlist', 'Interview', 'Selected', 'In progress', 'Completed']
const empty = { role: ROLES[0].id as string, name: '', email: '', phone: '', college: '', year: '2nd year', links: '', message: '', botcheck: '' }

export default function InternshipsPage() {
  const [f, setF] = useState(empty); const [err, setErr] = useState<Record<string, string>>({}); const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle'); const [msg, setMsg] = useState('')
  const form = useRef<HTMLFormElement>(null)
  useEffect(() => { window.scrollTo(0, 0); document.title = 'Internships for 2nd & 3rd-year students — Admivoice'; return () => { document.title = 'Admivoice — AI Admissions Platform' } }, [])
  const set = (k: keyof typeof empty, v: string) => { setF(p => ({ ...p, [k]: v })); setErr(p => ({ ...p, [k]: '' })); if (state !== 'sending') setState('idle') }
  const apply = (id: string) => { set('role', id); form.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (state === 'sending') return; const er: Record<string, string> = {}
    if (!f.name.trim()) er.name = 'Your name is required'
    if (!/\S+@\S+\.\S+/.test(f.email)) er.email = 'Enter a valid email'
    if (f.phone.replace(/\D/g, '').length < 10) er.phone = 'Enter a valid 10-digit phone number'
    if (!f.college.trim()) er.college = 'College name is required'
    setErr(er); if (Object.keys(er).length) return
    setState('sending')
    const { botcheck, ...fields } = f
    const r = await submitToWeb3Forms(botcheck ? { ...fields, botcheck } : fields, `Internship application: ${f.role}`)
    if (r.ok) { setState('ok'); setF({ ...empty, role: f.role }) } else { setState('fail'); setMsg(r.message) }
  }
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-navy-900 pb-20 pt-32 text-white sm:pt-36">
          <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" /><div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-violet2-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-5">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-400"><a href="#/" className="hover:text-white">Home</a> <span className="mx-1.5">/</span> <span className="text-slate-200">Internships</span></nav>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200"><GraduationCap size={13} className="text-violet-300" />Open to 2nd &amp; 3rd-year students</span>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">Internships for <span className="bg-gradient-to-r from-violet-300 to-brand-200 bg-clip-text text-transparent">2nd &amp; 3rd-year students</span></h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">Gain real experience in your second or third year. Pick a role, apply in two minutes, and earn a certificate on completion.</p>
            <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => form.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-500 px-6 font-medium text-white shadow-lg shadow-brand-600/30 hover:bg-brand-600">Apply now <ArrowRight size={16} /></button><a href={mail()} className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-6 font-medium hover:bg-white/5"><Mail size={16} />Send your resume</a></div>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm"><div><dt className="text-slate-400">Roles open</dt><dd className="text-2xl font-semibold">3</dd></div><div><dt className="text-slate-400">Spots available</dt><dd className="text-2xl font-semibold">10</dd></div><div><dt className="text-slate-400">Duration</dt><dd className="text-2xl font-semibold">6–10 wks</dd></div></dl>
          </div>
        </section>

        <section className="bg-canvas py-20"><div className="mx-auto max-w-6xl px-5">
          <Reveal className="max-w-2xl"><Eyebrow>Open roles</Eyebrow><h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Choose your role</h2></Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">{ROLES.map((r, i) => <Reveal key={r.id} delay={i * 80}><article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-pop">
            <div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-white shadow-md"><r.icon size={22} /></span><span className="rounded-full bg-ok-50 px-2.5 py-1 text-xs font-medium text-ok-700">{r.spots} spots left</span></div>
            <h3 className="mt-5 text-xl font-semibold">{r.id}</h3><span className="mt-1 w-fit rounded bg-violet2-50 px-1.5 py-0.5 text-xs font-medium text-violet-700">2nd &amp; 3rd year</span>
            <p className="mt-3 text-sm text-ink-3">{r.blurb}</p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-4">What you'll do</p>
            <ul className="mt-2 space-y-2 text-sm text-ink-2">{r.do.map(d => <li key={d} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-ok-600" />{d}</li>)}</ul>
            <ul className="mt-5 flex flex-wrap gap-1.5">{r.skills.map(x => <li key={x} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-ink-2">{x}</li>)}</ul>
            <dl className="mt-5 grid flex-1 grid-cols-1 content-end gap-2 border-t border-line pt-4 text-sm text-ink-2"><div className="flex items-center gap-2"><Clock size={14} className="text-ink-4" />{r.duration}</div><div className="flex items-center gap-2"><MapPin size={14} className="text-ink-4" />{r.mode}</div><div className="flex items-center gap-2"><Wallet size={14} className="text-ink-4" />{r.stipend}</div></dl>
            <button onClick={() => apply(r.id)} className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 font-medium text-white hover:bg-brand-700 active:scale-[.98]">Apply for this role <ArrowRight size={15} /></button>
            <a href={mail(r.id)} className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line text-sm font-medium text-ink-2 hover:bg-slate-50"><Mail size={14} />Send resume to {HR}</a>
          </article></Reveal>)}</div>
        </div></section>

        <section className="bg-white py-20"><div className="mx-auto max-w-6xl px-5">
          <Reveal className="mx-auto max-w-2xl text-center"><Eyebrow>The journey</Eyebrow><h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">From application to certificate</h2></Reveal>
          <Reveal className="mt-10"><ol className="grid gap-3 sm:grid-cols-4 lg:grid-cols-7">{STEPS.map((s, i) => <li key={s} className="rounded-xl border border-line bg-canvas p-4 text-center"><span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-white">{i + 1}</span><p className="mt-2 text-sm font-medium">{s}</p></li>)}</ol>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">{[[CalendarClock, 'Interview scheduling', 'Your coordinator books a slot and sends the invite.'], [Users, 'Assigned coordinator', 'A dedicated coordinator guides you throughout.'], [Award, 'Completion certificate', 'Issued by your college when you finish.']].map(([I, t, d]) => { const Ic = I as typeof Award; return <div key={t as string} className="flex gap-3 rounded-xl border border-line p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Ic size={17} /></span><div><p className="font-medium">{t as string}</p><p className="text-sm text-ink-3">{d as string}</p></div></div> })}</div></Reveal>
        </div></section>

        <section className="bg-canvas py-20"><div className="mx-auto grid max-w-6xl items-start gap-10 px-5 lg:grid-cols-5">
          <Reveal className="lg:col-span-2"><Eyebrow>Apply</Eyebrow><h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Apply for an internship</h2><p className="mt-3 text-ink-3">Fill in the form and the internship team will contact you about next steps.</p>
            <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50/60 p-4 text-sm"><p className="font-medium text-ink">Send your resume</p><p className="mt-1 text-ink-3">Email your resume to <a href={mail()} className="font-medium text-brand-700 underline-offset-4 hover:underline">{HR}</a> with the role in the subject line.</p></div>
            <ul className="mt-6 space-y-3 text-sm text-ink-2">{['Open to 2nd and 3rd-year students', 'Takes about two minutes', 'Hear back by email'].map(t => <li key={t} className="flex items-center gap-2.5"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-ok-50 text-ok-600"><Check size={12} /></span>{t}</li>)}</ul></Reveal>
          <Reveal delay={80} className="lg:col-span-3"><form ref={form} onSubmit={submit} noValidate className="grid gap-4 rounded-2xl border border-line bg-white p-6 shadow-card sm:grid-cols-2">
            <input type="checkbox" tabIndex={-1} autoComplete="off" className="hidden" checked={f.botcheck === 'on'} onChange={e => set('botcheck', e.target.checked ? 'on' : '')} />
            <div className="sm:col-span-2"><Lbl t="Role *"><select className={inpCls()} value={f.role} onChange={e => set('role', e.target.value)}>{ROLES.map(r => <option key={r.id}>{r.id}</option>)}</select></Lbl></div>
            <Lbl t="Full name *" err={err.name}><input className={inpCls(err.name)} value={f.name} onChange={e => set('name', e.target.value)} autoComplete="name" /></Lbl>
            <Lbl t="Email *" err={err.email}><input type="email" className={inpCls(err.email)} value={f.email} onChange={e => set('email', e.target.value)} autoComplete="email" /></Lbl>
            <Lbl t="Phone *" err={err.phone}><input className={inpCls(err.phone)} value={f.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" placeholder="+91 98765 43210" /></Lbl>
            <Lbl t="Year of study"><select className={inpCls()} value={f.year} onChange={e => set('year', e.target.value)}>{['2nd year', '3rd year', '1st year', '4th year'].map(y => <option key={y}>{y}</option>)}</select></Lbl>
            <div className="sm:col-span-2"><Lbl t="College *" err={err.college}><input className={inpCls(err.college)} value={f.college} onChange={e => set('college', e.target.value)} autoComplete="organization" /></Lbl></div>
            <div className="sm:col-span-2"><Lbl t="GitHub / portfolio / LinkedIn (optional)"><input className={inpCls()} value={f.links} onChange={e => set('links', e.target.value)} placeholder="https://" /></Lbl></div>
            <div className="sm:col-span-2"><Lbl t="Why this role?"><textarea rows={3} className={`${inpCls()} h-auto py-2`} value={f.message} onChange={e => set('message', e.target.value)} /></Lbl></div>
            {!['2nd year', '3rd year'].includes(f.year) && <p className="rounded-lg bg-warn-50 px-3 py-2 text-xs text-warn-700 sm:col-span-2">These roles are designed for 2nd and 3rd-year students. You can still apply and we'll let you know.</p>}
            <button disabled={state === 'sending'} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 font-medium text-white hover:bg-brand-700 active:scale-[.98] disabled:opacity-60 sm:col-span-2">{state === 'sending' ? <><Loader2 size={15} className="animate-spin" />Sending…</> : <><Send size={15} />Submit application</>}</button>
            {state === 'ok' && <p role="status" className="flex items-center gap-2 rounded-lg bg-ok-50 px-3 py-2 text-sm text-ok-700 sm:col-span-2"><Check size={15} />Application received. We'll email you soon.</p>}
            {state === 'fail' && <p role="alert" className="flex items-center gap-2 rounded-lg bg-bad-50 px-3 py-2 text-sm text-bad-700 sm:col-span-2"><AlertCircle size={15} />{msg} Your details are still in the form.</p>}
            <p className="text-xs text-ink-3 sm:col-span-2">By applying you agree to be contacted about this internship. Your details are emailed to the internship team. You can also send your resume to {HR}.</p>
          </form></Reveal>
        </div></section>

        <section className="bg-white py-16"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5"><div className="flex items-center gap-3"><FileCheck2 className="text-brand-600" /><p className="font-medium">Running internships at your college? Publish roles, review applicants and issue certificates with Admivoice.</p></div><a href="#/login" className="inline-flex h-11 items-center gap-2 rounded-xl bg-navy-900 px-5 font-medium text-white hover:bg-navy-800">Open admin demo <ArrowRight size={15} /></a></div></section>
      </main>
      <Footer />
    </>
  )
}
