import { useEffect, useRef, useState } from 'react'
import { Globe, RefreshCw, Plus, AlertTriangle, CheckCircle2, Loader2, Trash2, Bot, Send, FileText, BookOpen, ExternalLink, Link2 } from 'lucide-react'
import { useApp } from '@/lib/store'
import type { Knowledge } from '@/lib/types'
import { Badge, Button, Card, CardHeader, Confirm, DataTable, DemoBadge, Empty, Field, Input, Modal, PageHeader, Select, Switch, Tabs, type Col } from '@/components/ui'
import { ago, cn, uid } from '@/lib/utils'

const COURSES = [
  { id: 'c1', name: 'B.Tech Computer Science & Engineering', dept: 'Computer Science', duration: '4 years', seats: 240, fee: '₹1,85,000 / year', elig: '60% in 12th with Maths, Physics & Chemistry; valid JEE / state CET rank', deadline: '30 June' },
  { id: 'c2', name: 'B.Tech AI & Machine Learning', dept: 'Computer Science', duration: '4 years', seats: 120, fee: '₹2,05,000 / year', elig: '60% in 12th with Maths; valid JEE / state CET rank', deadline: '30 June' },
  { id: 'c3', name: 'B.Tech Electronics & Communication', dept: 'Electronics', duration: '4 years', seats: 120, fee: '₹1,70,000 / year', elig: '55% in 12th with PCM; valid JEE / state CET rank', deadline: '30 June' },
  { id: 'c4', name: 'MBA', dept: 'Management', duration: '2 years', seats: 180, fee: '₹2,40,000 / year', elig: 'Bachelor’s degree with 50%; valid CAT / MAT / CMAT score', deadline: '15 July' },
  { id: 'c5', name: 'B.Sc Data Science', dept: 'Sciences', duration: '3 years', seats: 90, fee: '₹95,000 / year', elig: '50% in 12th with Mathematics', deadline: '10 July' },
  { id: 'c6', name: 'B.Com Honours', dept: 'Commerce', duration: '3 years', seats: 150, fee: '₹70,000 / year', elig: '50% in 12th (any stream)', deadline: '10 July' },
]
const FAQ = [
  { k: ['hostel', 'accommodation'], a: 'On-campus hostels are available for all first-year students. Double-sharing rooms cost ₹85,000 per year including meals.', src: 'Hostel & scholarships FAQ' },
  { k: ['scholarship', 'merit'], a: 'Merit scholarships of 25–100% tuition waiver are offered based on entrance rank and 12th-grade scores.', src: 'Hostel & scholarships FAQ' },
]
function answer(q: string): { a: string; src: string } {
  const s = q.toLowerCase()
  for (const f of FAQ) if (f.k.some(k => s.includes(k))) return { a: f.a, src: f.src }
  const c = COURSES.find(c => c.name.toLowerCase().split(/[ &]+/).filter(w => w.length > 2).some(w => s.includes(w)) && (s.includes(c.name.toLowerCase().split(' ')[0].toLowerCase()) || s.includes(c.dept.toLowerCase())))
    ?? COURSES.find(c => s.includes('mba') && c.name === 'MBA') ?? COURSES.find(c => (s.includes('cse') || s.includes('computer')) && c.id === 'c1') ?? COURSES.find(c => s.includes('data') && c.id === 'c5')
  if (c) {
    if (/fee|cost|price/.test(s)) return { a: `${c.name}: ${c.fee}.`, src: 'Main college website · Fee structures' }
    if (/eligib|qualif|require|marks/.test(s)) return { a: `${c.name}: ${c.elig}.`, src: 'Main college website · Eligibility' }
    if (/deadline|last date|apply/.test(s)) return { a: `Applications for ${c.name} close on ${c.deadline}.`, src: 'Admissions portal · Deadlines' }
    return { a: `${c.name} is a ${c.duration} programme with ${c.seats} seats. Fees: ${c.fee}. Apply by ${c.deadline}.`, src: 'Main college website · Courses' }
  }
  if (/deadline|last date/.test(s)) return { a: 'Most undergraduate applications close on 30 June; MBA closes on 15 July.', src: 'Admissions portal · Deadlines' }
  return { a: 'I don’t have verified information on that yet, so I’ll pass your question to an admissions officer instead of guessing.', src: 'No verified source — escalated' }
}

function Chat() {
  const [msgs, setMsgs] = useState<{ who: 'u' | 'ai'; t: string; src?: string }[]>([{ who: 'ai', t: 'Hi! I’m the admissions assistant. Ask me about courses, fees, eligibility or deadlines.' }])
  const [v, setV] = useState(''); const end = useRef<HTMLDivElement>(null)
  useEffect(() => end.current?.scrollIntoView({ block: 'nearest' }), [msgs])
  const send = (t: string) => { if (!t.trim()) return; const r = answer(t); setMsgs(m => [...m, { who: 'u', t }]); setV(''); setTimeout(() => setMsgs(m => [...m, { who: 'ai', t: r.a, src: r.src }]), 450) }
  return (
    <Card className="flex h-full flex-col">
      <CardHeader title={<span className="flex items-center gap-2"><Bot size={16} className="text-brand-600" />Website chatbot preview</span>} sub="Answers only from verified synced sources" action={<DemoBadge text="Rule-based demo" />} />
      <div className="flex-1 space-y-3 overflow-y-auto border-y border-line bg-slate-50/60 p-4" style={{ minHeight: 300, maxHeight: 360 }}>
        {msgs.map((m, i) => <div key={i} className={cn('flex', m.who === 'u' && 'justify-end')}><div className={cn('max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed', m.who === 'u' ? 'rounded-br-sm bg-brand-600 text-white' : 'rounded-bl-sm border border-line bg-white')}>{m.t}{m.src && <p className="mt-1.5 flex items-center gap-1 border-t border-line pt-1.5 text-[11px] text-ink-3"><BookOpen size={11} />Source: {m.src}</p>}</div></div>)}<div ref={end} />
      </div>
      <div className="flex flex-wrap gap-1.5 px-4 pt-3">{['MBA fees?', 'B.Tech CSE eligibility', 'Hostel facilities', 'Application deadline'].map(s => <button key={s} onClick={() => send(s)} className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-2 hover:bg-slate-50">{s}</button>)}</div>
      <form onSubmit={e => { e.preventDefault(); send(v) }} className="flex gap-2 p-4"><Input aria-label="Ask a question" value={v} onChange={e => setV(e.target.value)} placeholder="Ask about admissions…" /><Button type="submit" variant="primary" aria-label="Send" icon={<Send size={14} />} /></form>
    </Card>
  )
}

export default function WebConnect() {
  const { data, update, toast, can } = useApp(); const [tab, setTab] = useState<'sources' | 'data' | 'config' | 'preview'>('sources'); const [add, setAdd] = useState(false); const [del, setDel] = useState<Knowledge | null>(null)
  const [form, setForm] = useState({ label: '', url: '', kind: 'Website' as Knowledge['kind'] }); const [dtab, setDtab] = useState<'Courses' | 'Fees' | 'Eligibility' | 'Deadlines'>('Courses')
  const [cfg, setCfg] = useState({ depth: '3', freq: 'Daily', robots: true, courses: true, fees: true, elig: true, dead: true, sched: true })
  const set = (id: string, p: Partial<Knowledge>) => update(d => ({ ...d, knowledge: d.knowledge.map(k => k.id === id ? { ...k, ...p } : k) }))
  const timers = useRef<number[]>([]); useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const sync = (k: Knowledge) => {
    set(k.id, { status: 'syncing', error: undefined }); update(d => d, { action: 'Started sync (simulated)', target: k.label }); toast(`Syncing ${k.label}…`, 'info')
    timers.current.push(window.setTimeout(() => {
      const fail = k.kind === 'PDF' && k.error
      if (fail) { set(k.id, { status: 'error', error: k.error }); toast(`${k.label} failed to sync`, 'error') }
      else { set(k.id, { status: 'synced', lastSync: new Date().toISOString(), pages: k.pages || 12, items: Object.keys(k.items).length ? k.items : { Courses: 38, 'Fee structures': 24 } }); toast(`${k.label} synced`) }
    }, 2400))
  }
  const addSource = () => {
    try { const u = new URL(form.url); if (!/^https?:$/.test(u.protocol)) throw 0 } catch { return toast('Enter a valid http(s) URL', 'error') }
    const k: Knowledge = { id: `W-${uid()}`, label: form.label || new URL(form.url).hostname, url: form.url, kind: form.kind, status: 'queued', lastSync: null, pages: 0, items: {} }
    update(d => ({ ...d, knowledge: [k, ...d.knowledge] }), { action: 'Added knowledge source', target: k.url }); setAdd(false); setForm({ label: '', url: '', kind: 'Website' }); toast('Source added — starting simulated crawl', 'info'); setTimeout(() => sync(k), 300)
  }
  const cols: Col<Knowledge>[] = [
    { key: 'l', header: 'Source', sort: r => r.label, render: r => <span className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-ink-3">{r.kind === 'Website' ? <Globe size={15} /> : <FileText size={15} />}</span><span className="min-w-0"><span className="block font-medium">{r.label}</span><span className="block max-w-[240px] truncate text-xs text-ink-3">{r.url}</span></span></span> },
    { key: 's', header: 'Status', sort: r => r.status, render: r => r.status === 'synced' ? <Badge tone="ok" dot>Synced</Badge> : r.status === 'syncing' ? <Badge tone="brand"><Loader2 size={11} className="animate-spin" />Syncing</Badge> : r.status === 'error' ? <Badge tone="bad" dot>Error</Badge> : <Badge>Queued</Badge> },
    { key: 'p', header: 'Pages', sort: r => r.pages, render: r => <span className="tabular-nums">{r.pages || '—'}</span> },
    { key: 'i', header: 'Imported', render: r => <span className="text-xs text-ink-3">{Object.entries(r.items).map(([k, v]) => `${v} ${k.toLowerCase()}`).slice(0, 2).join(' · ') || '—'}</span> },
    { key: 't', header: 'Last updated', sort: r => r.lastSync ?? '', render: r => <span className="text-xs text-ink-3">{r.lastSync ? ago(r.lastSync) : 'Never'}</span> },
    { key: 'a', header: '', render: r => can('webconnect') ? <span className="flex justify-end gap-1"><Button size="sm" disabled={r.status === 'syncing'} icon={<RefreshCw size={13} className={r.status === 'syncing' ? 'animate-spin' : ''} />} onClick={e => { e.stopPropagation(); sync(r) }}>Sync</Button><Button size="sm" variant="ghost" aria-label="Remove source" icon={<Trash2 size={13} />} onClick={e => { e.stopPropagation(); setDel(r) }} /></span> : null },
  ]
  const errs = data.knowledge.filter(k => k.status === 'error')
  return (
    <div className="space-y-5">
      <PageHeader title="WebConnect" sub="Connect your official website so the AI assistant answers with verified institutional information." actions={<><DemoBadge text="Simulated crawler" />{can('webconnect') && <Button variant="primary" icon={<Plus size={15} />} onClick={() => setAdd(true)}>Connect source</Button>}</>} />
      {errs.map(e => <div key={e.id} role="alert" className="flex flex-wrap items-start gap-3 rounded-xl border border-bad-500/30 bg-bad-50 p-4 text-sm"><AlertTriangle size={18} className="mt-0.5 shrink-0 text-bad-600" /><div className="min-w-0 flex-1"><p className="font-medium text-bad-700">{e.label} failed to sync</p><p className="text-bad-700/80">{e.error}</p></div>{can('webconnect') && <Button size="sm" onClick={() => sync(e)}>Retry</Button>}</div>)}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[['Sources', data.knowledge.length, <Link2 size={15} />], ['Healthy', data.knowledge.filter(k => k.status === 'synced').length, <CheckCircle2 size={15} className="text-ok-600" />], ['Pages indexed', data.knowledge.reduce((s, k) => s + k.pages, 0), <FileText size={15} />], ['Needs attention', errs.length, <AlertTriangle size={15} className="text-bad-600" />]].map(([k, v, i], idx) => <Card key={idx} className="flex items-center justify-between px-4 py-3"><div><p className="text-xs text-ink-3">{k as string}</p><p className="text-xl font-semibold tabular-nums">{v as number}</p></div>{i as React.ReactNode}</Card>)}</div>
      <Tabs value={tab} onChange={setTab} items={[{ id: 'sources', label: 'Knowledge sources' }, { id: 'data', label: 'Imported data' }, { id: 'config', label: 'Crawl settings' }, { id: 'preview', label: 'Chatbot & AI preview' }]} />
      {tab === 'sources' && <Card><DataTable rows={data.knowledge} cols={cols} empty={<Empty title="No sources connected" body="Add your college website to get started." icon={<Globe size={20} />} action={<Button variant="primary" onClick={() => setAdd(true)}>Connect website</Button>} />} /></Card>}
      {tab === 'data' && <Card><div className="px-5 pt-3"><Tabs value={dtab} onChange={setDtab} items={(['Courses', 'Fees', 'Eligibility', 'Deadlines'] as const).map(id => ({ id, label: id }))} /></div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-line bg-slate-50/70 text-left text-xs text-ink-3"><th className="px-5 py-2.5 font-medium">Programme</th><th className="px-4 font-medium">Department</th><th className="px-4 font-medium">{dtab === 'Courses' ? 'Duration · Seats' : dtab === 'Fees' ? 'Fee' : dtab === 'Eligibility' ? 'Eligibility' : 'Last date'}</th><th className="px-5 font-medium">Source</th></tr></thead>
          <tbody>{COURSES.map(c => <tr key={c.id} className="border-b border-line-2 last:border-0"><td className="px-5 py-3 font-medium">{c.name}</td><td className="px-4 text-ink-2">{c.dept}</td><td className="px-4 text-ink-2">{dtab === 'Courses' ? `${c.duration} · ${c.seats} seats` : dtab === 'Fees' ? c.fee : dtab === 'Eligibility' ? c.elig : c.deadline}</td><td className="px-5"><Badge tone="ok"><CheckCircle2 size={11} />Verified</Badge></td></tr>)}</tbody></table></div>
        <p className="border-t border-line px-5 py-3 text-xs text-ink-3">Sample imported dataset shown for demonstration. Real data appears after connecting a live crawler.</p></Card>}
      {tab === 'config' && <Card className="max-w-2xl"><CardHeader title="Crawl configuration" sub="Control what is imported from connected websites" />
        <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2"><Field label="Crawl depth"><Select value={cfg.depth} onChange={e => setCfg({ ...cfg, depth: e.target.value })}>{['1', '2', '3', '4', '5'].map(d => <option key={d} value={d}>{d} levels</option>)}</Select></Field><Field label="Re-sync frequency"><Select value={cfg.freq} onChange={e => setCfg({ ...cfg, freq: e.target.value })}>{['Hourly', 'Daily', 'Weekly', 'Manual only'].map(d => <option key={d}>{d}</option>)}</Select></Field>
          <div className="space-y-3 sm:col-span-2">{([['robots', 'Respect robots.txt'], ['courses', 'Sync courses & departments'], ['fees', 'Import fee structures'], ['elig', 'Import eligibility criteria'], ['dead', 'Import admission deadlines'], ['sched', 'Notify on sync errors']] as const).map(([k, l]) => <div key={k} className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5"><span className="text-sm">{l}</span><Switch label={l} checked={cfg[k]} onChange={v => setCfg({ ...cfg, [k]: v })} /></div>)}</div>
          <div className="sm:col-span-2"><Button variant="primary" disabled={!can('webconnect')} onClick={() => { update(d => d, { action: 'Updated crawl settings', target: `depth ${cfg.depth}, ${cfg.freq}` }); toast('Crawl settings saved') }}>Save settings</Button></div></div></Card>}
      {tab === 'preview' && <div className="grid gap-4 lg:grid-cols-2"><Chat />
        <Card><CardHeader title="AI knowledge integration" sub="How the voice assistant uses connected sources" />
          <ul className="space-y-3 px-5 pb-5 text-sm">{[['1', 'Student asks a question', 'Via AI voice call or website chat.'], ['2', 'Assistant searches verified sources', `${data.knowledge.filter(k => k.status === 'synced').length} synced sources are searchable.`], ['3', 'Answer is grounded & cited', 'Facts like fees and deadlines come only from imported data.'], ['4', 'Unknown? Escalate', 'If nothing verified is found, it hands off to an officer.']].map(([n, t, d]) => <li key={n} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">{n}</span><div><p className="font-medium">{t}</p><p className="text-xs text-ink-3">{d}</p></div></li>)}</ul>
          <div className="mx-5 mb-5 rounded-xl bg-slate-50 p-3 text-xs text-ink-2"><ExternalLink size={12} className="mr-1 inline" />The chatbot widget will be embeddable on your site via a script tag once a production backend is connected.</div></Card></div>}
      <Modal open={add} onClose={() => setAdd(false)} title="Connect knowledge source" footer={<><Button onClick={() => setAdd(false)}>Cancel</Button><Button variant="primary" onClick={addSource}>Connect & sync</Button></>}>
        <div className="space-y-4"><Field label="Website or document URL"><Input autoFocus value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://www.yourcollege.edu" /></Field><Field label="Display name (optional)"><Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} /></Field>
          <Field label="Type"><Select value={form.kind} onChange={e => setForm({ ...form, kind: e.target.value as Knowledge['kind'] })}><option>Website</option><option>PDF</option><option>FAQ</option></Select></Field>
          <p className="rounded-lg bg-warn-50 p-3 text-xs text-warn-700">Demo mode: the crawl is simulated and the URL is not fetched.</p></div></Modal>
      <Confirm open={!!del} danger onClose={() => setDel(null)} title="Remove knowledge source?" confirmLabel="Remove" body={`The AI assistant will stop using “${del?.label}” for answers.`} onConfirm={() => { update(d => ({ ...d, knowledge: d.knowledge.filter(k => k.id !== del!.id) }), { action: 'Removed knowledge source', target: del!.label }); toast('Source removed') }} />
    </div>
  )
}
