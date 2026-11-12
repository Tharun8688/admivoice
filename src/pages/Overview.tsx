import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Trash2, Phone, Mail, MapPin, ClipboardList, ArrowRight } from 'lucide-react'
import { useApp } from '@/lib/store'
import type { Lead } from '@/lib/types'
import { Avatar, Badge, Button, Card, CardHeader, Confirm, Empty, Field, Input, PageHeader, Select, Textarea } from '@/components/ui'
import { ago, uid } from '@/lib/utils'

const COURSES: Record<string, string> = { 'B.Tech CSE': 'Computer Science', 'B.Tech AI & ML': 'Computer Science', 'B.Tech ECE': 'Electronics', 'B.Tech Mechanical': 'Mechanical', MBA: 'Management', BBA: 'Management', 'B.Sc Data Science': 'Sciences', 'B.Com Honours': 'Commerce' }
const empty = { name: '', phone: '', email: '', city: '', course: 'B.Tech CSE', time: 'Morning', message: '' }

export default function EnquiryForm() {
  const { data, update, toast, session, can } = useApp(); const nav = useNavigate()
  const [f, setF] = useState(empty); const [err, setErr] = useState<Record<string, string>>({}); const [del, setDel] = useState<Lead | null>(null)
  const set = (k: keyof typeof empty, v: string) => { setF({ ...f, [k]: v }); if (err[k]) setErr({ ...err, [k]: '' }) }
  const subs = data.leads.filter(l => l.source === 'Enquiry Form').sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); const er: Record<string, string> = {}
    if (!f.name.trim()) er.name = 'Full name is required'
    if (f.phone.replace(/\D/g, '').length < 10) er.phone = 'Enter a valid 10-digit phone number'
    if (f.email && !/\S+@\S+\.\S+/.test(f.email)) er.email = 'Enter a valid email'
    setErr(er); if (Object.keys(er).length) return toast('Please fix the highlighted fields', 'error')
    const now = new Date().toISOString()
    const lead: Lead = { id: `L-${uid()}`, name: f.name.trim(), phone: f.phone, email: f.email, course: f.course, dept: COURSES[f.course], stage: 'New Enquiry', source: 'Enquiry Form', officer: 'Ms. Radhika Menon', progress: 0, score: 50, followUp: new Date(Date.now() + 864e5).toISOString(), createdAt: now,
      docs: ['10th Marksheet', '12th Marksheet', 'Transfer Certificate', 'ID Proof', 'Entrance Scorecard', 'Passport Photo'].map(name => ({ name, status: 'missing' as const })),
      notes: [{ id: uid(), at: now, by: session?.name ?? 'Form', text: `Enquiry form submitted. City: ${f.city || '—'}. Best time to call: ${f.time}.${f.message ? ` Message: ${f.message}` : ''}`, kind: 'system' }] }
    update(d => ({ ...d, leads: [lead, ...d.leads] }), { action: 'Enquiry form submitted', target: lead.name }); setF(empty); toast('Form submitted — details added below')
  }
  const note = (l: Lead) => l.notes[l.notes.length - 1]?.text ?? ''
  return (
    <div className="space-y-6">
      <PageHeader title="Admission enquiry form" sub="Fill in the student's details. Every submission appears in the list beside the form and in Admissions." />
      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-2 self-start">
          <CardHeader title="New enquiry" sub="Fields marked * are required" />
          <form onSubmit={submit} noValidate className="grid gap-4 px-5 pb-5">
            <Field label="Full name *"><Input value={f.name} onChange={e => set('name', e.target.value)} aria-invalid={!!err.name} className={err.name ? 'border-bad-500' : ''} />{err.name && <span className="mt-1 block text-xs text-bad-600">{err.name}</span>}</Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone *"><Input value={f.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" className={err.phone ? 'border-bad-500' : ''} />{err.phone && <span className="mt-1 block text-xs text-bad-600">{err.phone}</span>}</Field>
              <Field label="Email"><Input type="email" value={f.email} onChange={e => set('email', e.target.value)} className={err.email ? 'border-bad-500' : ''} />{err.email && <span className="mt-1 block text-xs text-bad-600">{err.email}</span>}</Field>
              <Field label="City"><Input value={f.city} onChange={e => set('city', e.target.value)} /></Field>
              <Field label="Best time to call"><Select value={f.time} onChange={e => set('time', e.target.value)}>{['Morning', 'Afternoon', 'Evening'].map(t => <option key={t}>{t}</option>)}</Select></Field>
            </div>
            <Field label="Course interested in"><Select value={f.course} onChange={e => set('course', e.target.value)}>{Object.keys(COURSES).map(c => <option key={c}>{c}</option>)}</Select></Field>
            <Field label="Message / questions"><Textarea rows={3} value={f.message} onChange={e => set('message', e.target.value)} placeholder="Anything the admissions team should know…" /></Field>
            <div className="flex gap-2"><Button type="submit" variant="primary" icon={<Send size={14} />} className="flex-1" disabled={!can('admissions')}>Submit enquiry</Button><Button type="button" onClick={() => { setF(empty); setErr({}) }}>Clear</Button></div>
            {!can('admissions') && <p className="text-xs text-ink-3">Your role is read-only and cannot submit enquiries.</p>}
          </form>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader title={<span className="flex items-center gap-2">Submitted details <Badge tone="brand">{subs.length}</Badge></span>} sub="Newest first" action={<Button size="sm" onClick={() => nav('/admissions')} icon={<ArrowRight size={13} />}>Open Admissions</Button>} />
          {subs.length === 0 ? <Empty icon={<ClipboardList size={20} />} title="No submissions yet" body="Submit the form and the details will appear here instantly." /> :
            <ul className="divide-y divide-line-2 border-t border-line">{subs.map(l => (
              <li key={l.id} className="flex gap-3 px-5 py-4 animate-fadeUp">
                <Avatar name={l.name} size={38} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{l.name}</p><Badge tone="brand">{l.course}</Badge><span className="text-xs text-ink-4">{ago(l.createdAt)}</span></div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2"><span className="flex items-center gap-1"><Phone size={12} />{l.phone}</span>{l.email && <span className="flex items-center gap-1"><Mail size={12} />{l.email}</span>}<span className="flex items-center gap-1"><MapPin size={12} />{(note(l).match(/City: ([^.]*)\./)?.[1]) || '—'}</span></div>
                  <p className="mt-2 text-[13px] text-ink-3">{note(l).replace(/^Enquiry form submitted\. City: [^.]*\. /, '')}</p>
                </div>
                {can('admissions') && <button aria-label={`Delete ${l.name}`} onClick={() => setDel(l)} className="h-8 w-8 shrink-0 rounded-lg text-ink-4 hover:bg-bad-50 hover:text-bad-600"><Trash2 size={15} className="mx-auto" /></button>}
              </li>))}</ul>}
        </Card>
      </div>
      <Confirm open={!!del} danger onClose={() => setDel(null)} title="Delete this submission?" confirmLabel="Delete" body={`${del?.name}'s enquiry will be removed from the list and from Admissions.`} onConfirm={() => { update(d => ({ ...d, leads: d.leads.filter(l => l.id !== del!.id) }), { action: 'Deleted enquiry', target: del!.name }); toast('Submission deleted') }} />
    </div>
  )
}
