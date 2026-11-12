import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Table2, Kanban, Plus, Download, Phone, Mail, CalendarClock, FileCheck2, FileX2, FileClock, FileQuestion, MessageSquare, Upload } from 'lucide-react'
import { useApp } from '@/lib/store'
import { LEAD_STAGES, type Lead, type LeadStage } from '@/lib/types'
import { Avatar, Badge, Button, Card, DataTable, Empty, Field, FilterSelect, Input, Modal, PageHeader, Progress, SearchInput, Segmented, Select, Textarea, Dropdown, MenuItem, type Col, type Tone } from '@/components/ui'
import { cn, ago, download, fmtDate, toCSV, uid } from '@/lib/utils'

const STAGE_TONE: Record<LeadStage, Tone> = { 'New Enquiry': 'slate', Contacted: 'brand', Interested: 'violet', 'Application Started': 'brand', 'Documents Submitted': 'warn', 'Under Review': 'warn', Admitted: 'ok', Enrolled: 'ok' }
const DOC_ICON = { verified: <FileCheck2 size={15} className="text-ok-600" />, pending: <FileClock size={15} className="text-warn-600" />, rejected: <FileX2 size={15} className="text-bad-600" />, missing: <FileQuestion size={15} className="text-ink-4" /> }
const OFFICERS = ['Ms. Radhika Menon', 'Mr. Imran Qureshi', 'Ms. Sunita Rao', 'Mr. Dinesh Pillai']

function LeadDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { data, update, toast, can, session } = useApp(); const lead = data.leads.find(l => l.id === id); const [note, setNote] = useState(''); const edit = can('admissions')
  if (!lead) return null
  const patch = (p: Partial<Lead>, action: string, target = lead.name) => update(d => ({ ...d, leads: d.leads.map(l => l.id === lead.id ? { ...l, ...p } : l) }), { action, target })
  const move = (stage: LeadStage) => { patch({ stage, progress: Math.round(LEAD_STAGES.indexOf(stage) / 7 * 100), notes: [{ id: uid(), at: new Date().toISOString(), by: 'System', text: `Stage changed to ${stage}`, kind: 'system' }, ...lead.notes] }, 'Moved lead', `${lead.name} → ${stage}`); toast(`Moved to ${stage}`) }
  const verified = lead.docs.filter(d => d.status === 'verified').length
  return (
    <Modal side open onClose={onClose} title="Applicant profile" width={560}>
      <div className="space-y-6">
        <div className="flex items-start gap-3"><Avatar name={lead.name} size={52} /><div className="flex-1"><h3 className="text-lg font-semibold">{lead.name}</h3><p className="text-sm text-ink-3">{lead.course} · {lead.dept}</p><div className="mt-2 flex flex-wrap gap-2"><Badge tone={STAGE_TONE[lead.stage]}>{lead.stage}</Badge><Badge>{lead.source}</Badge><Badge tone="violet">Score {lead.score}</Badge></div></div></div>
        <div className="flex flex-wrap gap-2"><Button size="sm" icon={<Phone size={13} />} onClick={() => toast(`Demo: AI call queued for ${lead.name}`, 'info')}>AI call</Button><Button size="sm" icon={<Mail size={13} />} onClick={() => toast(`Demo: email queued to ${lead.email}`, 'info')}>Email</Button><Button size="sm" icon={<MessageSquare size={13} />} onClick={() => toast('Connect WhatsApp Business in Integrations', 'info')}>WhatsApp</Button></div>
        <section><div className="mb-1.5 flex justify-between text-xs"><span className="font-medium text-ink-2">Application progress</span><span className="text-ink-3">{lead.progress}%</span></div><Progress value={lead.progress} /></section>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Stage"><Select disabled={!edit} value={lead.stage} onChange={e => move(e.target.value as LeadStage)}>{LEAD_STAGES.map(s => <option key={s}>{s}</option>)}</Select></Field>
          <Field label="Assigned officer"><Select disabled={!edit} value={lead.officer} onChange={e => { patch({ officer: e.target.value }, 'Assigned officer', `${lead.name} → ${e.target.value}`); toast('Officer reassigned') }}>{OFFICERS.map(o => <option key={o}>{o}</option>)}</Select></Field>
          <Field label="Course"><Input disabled value={lead.course} /></Field>
          <Field label="Follow-up"><Input disabled={!edit} type="datetime-local" value={lead.followUp ? new Date(new Date(lead.followUp).getTime() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16) : ''} onChange={e => { patch({ followUp: e.target.value ? new Date(e.target.value).toISOString() : null }, 'Scheduled follow-up'); toast('Follow-up saved') }} /></Field>
        </div>
        <section>
          <div className="mb-2 flex items-center justify-between"><h4 className="text-sm font-semibold">Document verification</h4><span className="text-xs text-ink-3">{verified}/{lead.docs.length} verified</span></div>
          <ul className="divide-y divide-line-2 rounded-xl border border-line">{lead.docs.map(doc => <li key={doc.name} className="flex items-center gap-3 px-3 py-2">{DOC_ICON[doc.status]}<span className="flex-1 text-[13px]">{doc.name}</span>
            <select aria-label={`${doc.name} status`} disabled={!edit} value={doc.status} onChange={e => { patch({ docs: lead.docs.map(x => x.name === doc.name ? { ...x, status: e.target.value as typeof doc.status } : x) }, 'Document status', `${lead.name}: ${doc.name} → ${e.target.value}`); toast('Document status updated') }} className="rounded-md border border-line bg-white px-1.5 py-1 text-xs capitalize">{['verified', 'pending', 'rejected', 'missing'].map(s => <option key={s}>{s}</option>)}</select></li>)}</ul>
        </section>
        <section>
          <h4 className="mb-2 text-sm font-semibold">Notes & communication history</h4>
          {edit && <div className="mb-3 flex gap-2"><Input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note…" onKeyDown={e => { if (e.key === 'Enter' && note.trim()) { patch({ notes: [{ id: uid(), at: new Date().toISOString(), by: session!.name, text: note.trim(), kind: 'note' }, ...lead.notes] }, 'Added note'); setNote(''); toast('Note added') } }} /><Button variant="primary" disabled={!note.trim()} onClick={() => { patch({ notes: [{ id: uid(), at: new Date().toISOString(), by: session!.name, text: note.trim(), kind: 'note' }, ...lead.notes] }, 'Added note'); setNote(''); toast('Note added') }}>Add</Button></div>}
          <ol className="relative space-y-3 border-l border-line pl-4">{lead.notes.map(n => <li key={n.id} className="relative"><span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-4 ring-white" /><p className="text-[13px]">{n.text}</p><p className="text-[11px] text-ink-4">{n.by} · {ago(n.at)} · {n.kind}</p></li>)}</ol>
        </section>
      </div>
    </Modal>
  )
}

function KanbanView({ leads, onOpen }: { leads: Lead[]; onOpen: (id: string) => void }) {
  const { update, toast, can } = useApp(); const [drag, setDrag] = useState<string | null>(null); const [over, setOver] = useState<string | null>(null)
  const drop = (stage: LeadStage) => {
    const l = leads.find(x => x.id === drag); setOver(null); setDrag(null); if (!l || l.stage === stage || !can('admissions')) return
    update(d => ({ ...d, leads: d.leads.map(x => x.id === l.id ? { ...x, stage, progress: Math.round(LEAD_STAGES.indexOf(stage) / 7 * 100) } : x) }), { action: 'Moved lead', target: `${l.name} → ${stage}` }); toast(`${l.name} → ${stage}`)
  }
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6">
      <div className="flex min-w-max gap-3">{LEAD_STAGES.map(stage => {
        const col = leads.filter(l => l.stage === stage)
        return (
          <div key={stage} onDragOver={e => { e.preventDefault(); setOver(stage) }} onDragLeave={() => setOver(null)} onDrop={() => drop(stage)}
            className={cn('flex w-[272px] shrink-0 flex-col rounded-2xl border bg-slate-100/60 p-2 transition-colors', over === stage ? 'border-brand-500 bg-brand-50/60' : 'border-transparent')}>
            <div className="flex items-center justify-between px-2 py-1.5"><span className="text-[13px] font-semibold">{stage}</span><span className="rounded-full bg-white px-2 text-xs font-medium text-ink-3 shadow-sm">{col.length}</span></div>
            <div className="max-h-[62vh] space-y-2 overflow-y-auto p-0.5">{col.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 py-6 text-center text-xs text-ink-4">Drop leads here</p>}
              {col.map(l => (
                <div key={l.id} draggable={can('admissions')} onDragStart={() => setDrag(l.id)} onDragEnd={() => setDrag(null)} tabIndex={0} role="button" onKeyDown={e => e.key === 'Enter' && onOpen(l.id)} onClick={() => onOpen(l.id)}
                  className={cn('cursor-pointer rounded-xl border border-line bg-white p-3 shadow-card transition-all hover:shadow-pop', drag === l.id && 'opacity-40')}>
                  <div className="flex items-center gap-2"><Avatar name={l.name} size={26} /><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{l.name}</p><p className="truncate text-[11px] text-ink-3">{l.course}</p></div>
                    <div onClick={e => e.stopPropagation()}><Dropdown width={190} trigger={() => <button aria-label="Move lead" className="rounded px-1 text-ink-4 hover:bg-slate-100">⋯</button>}>{close => LEAD_STAGES.filter(s => s !== stage).map(s => <MenuItem key={s} onClick={() => { setDrag(l.id); update(d => ({ ...d, leads: d.leads.map(x => x.id === l.id ? { ...x, stage: s, progress: Math.round(LEAD_STAGES.indexOf(s) / 7 * 100) } : x) }), { action: 'Moved lead', target: `${l.name} → ${s}` }); setDrag(null); toast(`${l.name} → ${s}`); close() }}>Move to {s}</MenuItem>)}</Dropdown></div></div>
                  <div className="mt-2.5"><Progress value={l.progress} /></div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-ink-3"><span>{l.officer.split(' ').slice(-1)[0]}</span>{l.followUp ? <span className={cn('flex items-center gap-1', new Date(l.followUp) < new Date() && 'text-bad-600')}><CalendarClock size={11} />{ago(l.followUp)}</span> : <span>No follow-up</span>}</div>
                </div>))}</div>
          </div>)
      })}</div>
    </div>
  )
}

export default function Admissions() {
  const { data, update, toast, can, session } = useApp(); const [sp, setSp] = useSearchParams()
  const [view, setView] = useState<'table' | 'kanban'>('table'); const [q, setQ] = useState(''); const [stage, setStage] = useState('All'); const [dept, setDept] = useState('All'); const [officer, setOfficer] = useState('All'); const [sel, setSel] = useState(new Set<string>())
  const [add, setAdd] = useState(false); const [bulk, setBulk] = useState(false); const openId = sp.get('lead')
  const [form, setForm] = useState({ name: '', phone: '', email: '', course: 'B.Tech CSE', source: 'Walk-in' })
  const rows = useMemo(() => data.leads.filter(l => (stage === 'All' || l.stage === stage) && (dept === 'All' || l.dept === dept) && (officer === 'All' || l.officer === officer) && (l.name + l.phone + l.email + l.course + l.id).toLowerCase().includes(q.toLowerCase())), [data.leads, q, stage, dept, officer])
  useEffect(() => setSel(new Set()), [q, stage, dept, officer])
  const cols: Col<Lead>[] = [
    { key: 'n', header: 'Applicant', sort: r => r.name, render: r => <span className="flex items-center gap-2.5"><Avatar name={r.name} size={30} /><span><span className="block font-medium">{r.name}</span><span className="text-xs text-ink-3">{r.phone}</span></span></span> },
    { key: 'c', header: 'Course', sort: r => r.course, render: r => <span><span className="block text-ink-2">{r.course}</span><span className="text-xs text-ink-3">{r.dept}</span></span> },
    { key: 's', header: 'Stage', sort: r => LEAD_STAGES.indexOf(r.stage), render: r => <Badge tone={STAGE_TONE[r.stage]}>{r.stage}</Badge> },
    { key: 'p', header: 'Progress', sort: r => r.progress, render: r => <div className="w-24"><Progress value={r.progress} tone={r.progress > 70 ? 'ok' : 'brand'} /></div> },
    { key: 'd', header: 'Docs', render: r => { const v = r.docs.filter(d => d.status === 'verified').length; return <span className={cn('text-xs', v === 6 ? 'text-ok-600' : 'text-ink-3')}>{v}/6 verified</span> } },
    { key: 'o', header: 'Officer', sort: r => r.officer, render: r => <span className="text-ink-2">{r.officer}</span> },
    { key: 'f', header: 'Follow-up', sort: r => r.followUp ?? 'z', render: r => r.followUp ? <span className={cn('text-xs', new Date(r.followUp) < new Date() ? 'text-bad-600 font-medium' : 'text-ink-3')}>{ago(r.followUp)}</span> : <span className="text-xs text-ink-4">—</span> },
  ]
  const exportCSV = () => { download('admissions-leads.csv', toCSV(rows.map(l => ({ id: l.id, name: l.name, phone: l.phone, email: l.email, course: l.course, stage: l.stage, officer: l.officer, source: l.source })))); toast(`Exported ${rows.length} leads`) }
  const addLead = () => {
    if (!form.name.trim() || form.phone.replace(/\D/g, '').length < 10) return toast('Name and a valid phone number are required', 'error')
    const dept = Object.entries({ 'B.Tech': 'Computer Science', MBA: 'Management', 'B.Sc': 'Sciences', 'B.Com': 'Commerce' }).find(([k]) => form.course.startsWith(k))?.[1] ?? 'Computer Science'
    const l: Lead = { id: `L-${uid()}`, ...form, dept, stage: 'New Enquiry', officer: session!.name.includes('Radhika') ? OFFICERS[0] : OFFICERS[1], progress: 0, docs: ['10th Marksheet', '12th Marksheet', 'Transfer Certificate', 'ID Proof', 'Entrance Scorecard', 'Passport Photo'].map(name => ({ name, status: 'missing' as const })), followUp: new Date(Date.now() + 864e5).toISOString(), createdAt: new Date().toISOString(), score: 45, notes: [{ id: uid(), at: new Date().toISOString(), by: session!.name, text: 'Lead created manually.', kind: 'system' }] }
    update(d => ({ ...d, leads: [l, ...d.leads] }), { action: 'Created lead', target: l.name }); setAdd(false); setForm({ name: '', phone: '', email: '', course: 'B.Tech CSE', source: 'Walk-in' }); toast('Lead added')
  }
  return (
    <div className="space-y-5">
      <PageHeader title="Admissions" sub="Track every enquiry from first contact to enrolment." actions={<>
        <Segmented value={view} onChange={setView} items={[{ id: 'table', label: <><Table2 size={14} />Table</> }, { id: 'kanban', label: <><Kanban size={14} />Kanban</> }]} />
        <Button icon={<Download size={15} />} onClick={exportCSV}>Export</Button>{can('admissions') && <Button variant="primary" icon={<Plus size={15} />} onClick={() => setAdd(true)}>Add enquiry</Button>}</>} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[['Total leads', data.leads.length], ['In review', data.leads.filter(l => ['Documents Submitted', 'Under Review'].includes(l.stage)).length], ['Admitted', data.leads.filter(l => l.stage === 'Admitted').length], ['Enrolled', data.leads.filter(l => l.stage === 'Enrolled').length]].map(([k, v]) => <Card key={k as string} className="px-4 py-3"><p className="text-xs text-ink-3">{k}</p><p className="text-xl font-semibold tabular-nums">{v}</p></Card>)}</div>
      <div className="flex flex-wrap items-center gap-2"><SearchInput value={q} onChange={setQ} placeholder="Search name, phone, course…" className="w-full sm:w-72" />
        <FilterSelect label="Stage" value={stage} onChange={setStage} options={[...LEAD_STAGES]} /><FilterSelect label="Department" value={dept} onChange={setDept} options={[...new Set(data.leads.map(l => l.dept))]} /><FilterSelect label="Officer" value={officer} onChange={setOfficer} options={OFFICERS} />
        {(stage !== 'All' || dept !== 'All' || officer !== 'All' || q) && <Button size="sm" variant="ghost" onClick={() => { setStage('All'); setDept('All'); setOfficer('All'); setQ('') }}>Clear</Button>}</div>
      {sel.size > 0 && can('admissions') && <div className="flex flex-wrap items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm"><span className="font-medium text-brand-700">{sel.size} selected</span>
        <Dropdown align="left" trigger={() => <Button size="sm">Assign officer</Button>}>{close => OFFICERS.map(o => <MenuItem key={o} onClick={() => { update(d => ({ ...d, leads: d.leads.map(l => sel.has(l.id) ? { ...l, officer: o } : l) }), { action: 'Bulk assigned officer', target: `${sel.size} leads → ${o}` }); toast(`Assigned ${sel.size} leads to ${o}`); setSel(new Set()); close() }}>{o}</MenuItem>)}</Dropdown>
        <Dropdown align="left" trigger={() => <Button size="sm">Move to stage</Button>}>{close => LEAD_STAGES.map(s => <MenuItem key={s} onClick={() => { update(d => ({ ...d, leads: d.leads.map(l => sel.has(l.id) ? { ...l, stage: s, progress: Math.round(LEAD_STAGES.indexOf(s) / 7 * 100) } : l) }), { action: 'Bulk moved leads', target: `${sel.size} → ${s}` }); toast(`Moved ${sel.size} leads`); setSel(new Set()); close() }}>{s}</MenuItem>)}</Dropdown>
        <Button size="sm" onClick={() => setBulk(true)} icon={<Phone size={13} />}>Queue AI calls</Button><button className="ml-auto text-xs text-ink-3 hover:underline" onClick={() => setSel(new Set())}>Clear selection</button></div>}
      {view === 'table' ? <Card><DataTable rows={rows} cols={cols} pageSize={12} onRow={l => setSp({ lead: l.id })} selected={sel} onSelect={can('admissions') ? setSel : undefined} empty={<Empty title="No enquiries match" body="Try clearing filters or add a new enquiry." action={<Button onClick={() => { setStage('All'); setDept('All'); setOfficer('All'); setQ('') }}>Clear filters</Button>} />} /></Card>
        : rows.length ? <KanbanView leads={rows} onOpen={id => setSp({ lead: id })} /> : <Card><Empty title="No enquiries match" /></Card>}
      <LeadDrawer id={openId} onClose={() => setSp({})} />
      <Modal open={add} onClose={() => setAdd(false)} title="Add admission enquiry" footer={<><Button onClick={() => setAdd(false)}>Cancel</Button><Button variant="primary" onClick={addLead}>Add enquiry</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><Field label="Full name"><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field></div>
          <Field label="Phone"><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91" /></Field><Field label="Email"><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Course"><Select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}>{['B.Tech CSE', 'B.Tech AI & ML', 'B.Tech ECE', 'MBA', 'BBA', 'B.Sc Data Science', 'B.Com Honours'].map(c => <option key={c}>{c}</option>)}</Select></Field>
          <Field label="Source"><Select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>{['Walk-in', 'Website', 'Referral', 'Education Fair', 'Instagram'].map(c => <option key={c}>{c}</option>)}</Select></Field></div>
      </Modal>
      <Modal open={bulk} onClose={() => setBulk(false)} title="Queue AI calls" width={420} footer={<><Button onClick={() => setBulk(false)}>Cancel</Button><Button variant="primary" onClick={() => { update(d => d, { action: 'Queued AI calls (demo)', target: `${sel.size} leads` }); toast(`Demo: ${sel.size} calls queued — connect telephony to dial`, 'info'); setBulk(false); setSel(new Set()) }}>Queue {sel.size} calls</Button></>}>
        <p className="text-sm text-ink-2">The selected {sel.size} leads will be added to the call queue using the approved “B.Tech 2026 Early Bird” script. In demo mode, no real calls are placed.</p></Modal>
    </div>
  )
}
