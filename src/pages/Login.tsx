import { useState } from 'react'
import { PhoneCall, Globe, Briefcase, ShieldCheck } from 'lucide-react'
import { useApp } from '@/lib/store'
import { ROLE_LABEL, type Role } from '@/lib/types'
import { Button, Field, Input, Select, Toasts } from '@/components/ui'
import { Logo } from '@/components/Layout'

export default function Login() {
  const { login, toast } = useApp()
  const [email, setEmail] = useState('admin@meridian.edu'); const [pw, setPw] = useState('demo-password'); const [role, setRole] = useState<Role>('college_admin'); const [busy, setBusy] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); if (!email.includes('@') || pw.length < 6) return toast('Enter a valid email and a password of 6+ characters', 'error')
    setBusy(true); setTimeout(() => { login({ name: role === 'admission_officer' ? 'Radhika Menon' : role === 'internship_coordinator' ? 'Anitha Rao' : 'Demo Admin', email, role }); toast('Signed in (demo session)') }, 600)
  }
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl" /><div className="absolute -bottom-32 left-10 h-96 w-96 rounded-full bg-violet2-500/20 blur-3xl" />
        <div className="relative"><Logo light /></div>
        <div className="relative max-w-md">
          <h1 className="text-[34px] font-semibold leading-tight tracking-tight">Less manual work.<br />Faster admissions.<br /><span className="text-violet-300">Smarter communication.</span></h1>
          <p className="mt-4 text-slate-300">The AI-powered operating system for college admissions and internship administration.</p>
          <ul className="mt-8 space-y-3 text-sm text-slate-200">
            {[[PhoneCall, 'AI voice campaigns with transcripts & outcomes'], [Globe, 'Answers grounded in your verified website content'], [Briefcase, 'Internship portal with full lifecycle tracking'], [ShieldCheck, 'Role-based access, institution isolation, audit logs']].map(([I, t], i) => { const Ic = I as typeof PhoneCall; return <li key={i} className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"><Ic size={16} /></span>{t as string}</li> })}
          </ul>
        </div>
        <p className="relative text-xs text-slate-400">© 2026 Admivoice</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <div className="lg:hidden mb-6"><Logo /></div>
          <div><h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2><p className="mt-1 text-sm text-ink-3">Sign in to your institution workspace.</p></div>
          <Field label="Work email"><Input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></Field>
          <Field label="Password"><Input type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" /></Field>
          <Field label="Sign in as (demo role)" hint="Roles control what each user can see and do."><Select value={role} onChange={e => setRole(e.target.value as Role)}>{(Object.keys(ROLE_LABEL) as Role[]).map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</Select></Field>
          <Button type="submit" variant="primary" className="w-full h-10" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
          <a href="#/" className="block text-center text-sm text-ink-3 hover:text-ink">← Back to website</a>
          <p className="rounded-lg border border-warn-500/30 bg-warn-50 p-3 text-xs text-warn-700">Demo authentication. Production uses Supabase Auth with row-level security per institution — see README.</p>
        </form>
      </div>
      <Toasts />
    </div>
  )
}
