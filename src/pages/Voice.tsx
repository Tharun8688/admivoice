import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PhoneCall, PhoneOff, Play, Pause, Mic, Plus, Rocket, CalendarClock, Bot, PhoneIncoming, FileText, Sparkles, Trash2, Pencil, Volume2, ShieldCheck } from 'lucide-react'
import { useApp } from '@/lib/store'
import type { Call, Campaign } from '@/lib/types'
import { transcript } from '@/data/seed'
import { Avatar, Badge, Button, Card, CardHeader, Confirm, DataTable, Empty, Field, FilterSelect, Input, Modal, PageHeader, Progress, SearchInput, Select, Switch, Tabs, Textarea, DemoBadge, type Tone, type Col } from '@/components/ui'
import { cn, fmtDur, fmtDateTime, ago, uid } from '@/lib/utils'
import { SIM_LIVE, useTick } from '@/lib/useSim'

interface Live { id: string; student: string; phone: string; campaign: string; start: number; lang: string; born: number; course: string }
const OUT_TONE: Record<string, Tone> = { Interested: 'ok', 'Application started': 'ok', 'Callback requested': 'warn', 'Not interested': 'slate', 'No answer': 'slate', 'Wrong number': 'bad', Pending: 'brand' }
const OUTCOMES: Call['outcome'][] = ['Interested', 'Application started', 'Callback requested', 'Not interested', 'No answer', 'Wrong number']

function Wave({ on, n = 24 }: { on: boolean; n?: number }) {
  return <div className="flex h-8 items-center gap-[3px]" aria-hidden>{Array.from({ length: n }, (_, i) => <span key={i} style={{ animationDelay: `${(i % 7) * 90}ms`, height: `${30 + ((i * 37) % 70)}%` }} className={cn('w-[3px] origin-center rounded-full', on ? 'bg-brand-500 animate-wave' : 'bg-slate-300')} />)}</div>
}

function Player({ duration }: { duration: number }) {
  const [pos, setPos] = useState(0); const [on, setOn] = useState(false)
  useEffect(() => { if (!on) return; const i = setInterval(() => setPos(p => { if (p >= duration) { setOn(false); return 0 } return p + 1 }), 1000); return () => clearInterval(i) }, [on, duration])
  return (
    <div className="rounded-xl border border-line bg-slate-50 p-3">
      <div className="flex items-center gap-3">
        <button onClick={() => setOn(o => !o)} aria-label={on ? 'Pause recording' : 'Play recording'} className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700">{on ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}</button>
        <div className="flex-1"><input type="range" aria-label="Seek" min={0} max={duration} value={pos} onChange={e => setPos(+e.target.value)} className="w-full accent-brand-600" /><div className="flex justify-between font-mono text-[11px] text-ink-3"><span>{fmtDur(pos)}</span><span>{fmtDur(duration)}</span></div></div>
        <Volume2 size={15} className="text-ink-4" />
      </div>
      <p className="mt-2 text-[11px] text-ink-3">Demo recording — playback is simulated. Connect a telephony provider to store real audio.</p>
    </div>
  )
}
const Transcript = ({ lines }: { lines: Call['transcript'] }) => lines.length ? (
  <ul className="space-y-2.5">{lines.map((l, i) => <li key={i} className={cn('flex gap-2.5', l.who === 'student' && 'flex-row-reverse')}>
    <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold', l.who === 'ai' ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-600')}>{l.who === 'ai' ? <Bot size={13} /> : 'S'}</span>
    <div className={cn('max-w-[82%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed', l.who === 'ai' ? 'bg-brand-50 text-ink rounded-tl-sm' : 'bg-slate-100 rounded-tr-sm')}>{l.text}<span className="ml-2 font-mono text-[10px] text-ink-4">{fmtDur(l.t)}</span></div></li>)}</ul>
) : <Empty title="No transcript" body="This call wasn't answered, so there is nothing to transcribe." />

/* ---------- Live console ---------- */
function LiveConsole({ live, setLive, openNew }: { live: Live[]; setLive: React.Dispatch<React.SetStateAction<Live[]>>; openNew: () => void }) {
  const { update, toast, can, data } = useApp(); const t = useTick(); const [sel, setSel] = useState<string | undefined>(live[0]?.id); const [rec, setRec] = useState(true); const [ending, setEnding] = useState<Live | null>(null)
  const cur = live.find(l => l.id === sel) ?? live[0]
  const dur = cur ? cur.start + Math.floor((Date.now() - cur.born) / 1000) : 0
  void t
  const full = useMemo(() => cur ? transcript(cur.student, cur.course, 'Interested') : [], [cur?.id])
  const shown = full.filter(l => l.t * 1.0 <= dur - 0 && l.t <= dur)
  const end = (outcome: Call['outcome']) => {
    if (!cur) return
    const call: Call = { id: `K-${uid()}`, student: cur.student, phone: cur.phone, campaign: cur.campaign, status: 'completed', duration: dur, startedAt: new Date(cur.born).toISOString(), outcome, direction: 'outbound', language: cur.lang, sentiment: outcome === 'Not interested' ? 'negative' : 'positive', summary: `${cur.student} discussed ${cur.course}. Outcome: ${outcome}.`, transcript: full.filter(l => l.t <= dur) }
    update(d => ({ ...d, calls: [call, ...d.calls] }), { action: 'Ended AI call', target: `${cur.student} · ${outcome}` })
    setLive(l => l.filter(x => x.id !== cur.id)); setSel(undefined); setEnding(null); toast(`Call ended — logged as “${outcome}”`)
  }
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader title={`Active calls (${live.length})`} sub="Simulated in demo mode" action={can('calls') && <Button size="sm" variant="primary" icon={<Plus size={14} />} onClick={openNew}>New call</Button>} />
        <ul className="space-y-1 px-3 pb-3">{live.length === 0 && <Empty title="No active calls" body="Start a new AI call or launch a campaign." icon={<PhoneCall size={20} />} />}
          {live.map(l => <li key={l.id}><button onClick={() => setSel(l.id)} className={cn('flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors', cur?.id === l.id ? 'border-brand-200 bg-brand-50/60' : 'border-transparent hover:bg-slate-50')}>
            <Avatar name={l.student} /><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{l.student}</p><p className="truncate text-xs text-ink-3">{l.phone}</p></div>
            <div className="text-right"><p className="font-mono text-[13px] text-ok-600 tabular-nums">{fmtDur(l.start + Math.floor((Date.now() - l.born) / 1000))}</p><Badge tone="ok" dot>Live</Badge></div></button></li>)}</ul>
        <div className="mx-3 mb-3 rounded-xl bg-slate-50 p-3 text-xs text-ink-2"><div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-medium"><Bot size={13} /> AI assistant</span><Badge tone="ok" dot>Online</Badge></div><p className="mt-1.5 text-ink-3">Grounded in {data.knowledge.filter(k => k.status === 'synced').length} verified knowledge sources.</p></div>
      </Card>
      <Card className="lg:col-span-2">
        {!cur ? <Empty title="Select a call to monitor" body="Live status, transcript and controls appear here." icon={<Mic size={20} />} /> : <>
          <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4">
            <Avatar name={cur.student} size={42} />
            <div className="min-w-0 flex-1"><p className="font-semibold">{cur.student}</p><p className="text-xs text-ink-3">{cur.phone} · {cur.lang}</p></div>
            <div className="text-right"><p className="font-mono text-2xl font-semibold tabular-nums">{fmtDur(dur)}</p><p className="text-xs text-ink-3">{cur.campaign}</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-b border-line bg-slate-50/60 px-5 py-3">
            <Wave on /><div className="flex-1" />
            <span className="flex items-center gap-1.5 text-xs text-ink-2"><span className={cn('h-2 w-2 rounded-full', rec ? 'bg-bad-500 animate-pulse' : 'bg-slate-300')} />{rec ? 'Recording' : 'Recording paused'}</span>
            <Button size="sm" onClick={() => { setRec(r => !r); toast(rec ? 'Recording paused' : 'Recording resumed', 'info') }} icon={rec ? <Pause size={13} /> : <Mic size={13} />}>{rec ? 'Pause' : 'Resume'}</Button>
            {can('calls') && <Button size="sm" variant="danger" icon={<PhoneOff size={13} />} onClick={() => setEnding(cur)}>End call</Button>}
          </div>
          <div className="grid gap-0 md:grid-cols-[1fr_220px]">
            <div className="max-h-[360px] min-h-[260px] overflow-y-auto p-5"><p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-4">Live transcript</p><Transcript lines={shown} />{shown.length < full.length && <p className="mt-3 flex items-center gap-2 text-xs text-ink-3"><span className="flex gap-0.5">{[0, 1, 2].map(i => <span key={i} style={{ animationDelay: `${i * 150}ms` }} className="h-1 w-1 animate-bounce rounded-full bg-slate-400" />)}</span>listening…</p>}</div>
            <div className="space-y-4 border-t border-line p-5 md:border-l md:border-t-0">
              <div><p className="text-xs font-medium text-ink-4">AI status</p><p className="mt-1 flex items-center gap-1.5 text-sm font-medium"><Sparkles size={14} className="text-violet-500" />{shown.length % 2 ? 'Speaking' : 'Listening'}</p></div>
              <div><p className="text-xs font-medium text-ink-4">Predicted outcome</p><Badge tone="ok" className="mt-1">Interested · 82%</Badge></div>
              <div><p className="text-xs font-medium text-ink-4">Sentiment</p><Progress value={78} tone="ok" /></div>
              <div><p className="text-xs font-medium text-ink-4">Knowledge used</p><p className="mt-1 text-xs text-ink-2">Eligibility, Deadlines (meridian.edu)</p></div>
            </div>
          </div>
        </>}
      </Card>
      <Modal open={!!ending} onClose={() => setEnding(null)} title="End call & record outcome" width={420}>
        <p className="mb-3 text-sm text-ink-2">Select the outcome to log for {ending?.student}.</p>
        <div className="grid grid-cols-2 gap-2">{OUTCOMES.map(o => <Button key={o} onClick={() => end(o)}>{o}</Button>)}</div>
      </Modal>
    </div>
  )
}

/* ---------- Call log ---------- */
function CallLog({ inbound }: { inbound?: boolean }) {
  const { data, update, toast, can } = useApp(); const [q, setQ] = useState(''); const [st, setSt] = useState('All'); const [oc, setOc] = useState('All'); const [open, setOpen] = useState<Call | null>(null)
  const rows = data.calls.filter(c => c.status !== 'scheduled' && (inbound ? c.direction === 'inbound' : true) && (st === 'All' || c.status === st) && (oc === 'All' || c.outcome === oc) && (c.student + c.phone + c.campaign).toLowerCase().includes(q.toLowerCase()))
  const cols: Col<Call>[] = [
    { key: 's', header: 'Student', sort: r => r.student, render: r => <span className="flex items-center gap-2.5"><Avatar name={r.student} size={28} /><span><span className="block font-medium">{r.student}</span><span className="text-xs text-ink-3">{r.phone}</span></span></span> },
    { key: 'c', header: 'Campaign', sort: r => r.campaign, render: r => <span className="text-ink-2">{r.campaign}</span> },
    { key: 'st', header: 'Status', sort: r => r.status, render: r => <Badge tone={r.status === 'completed' ? 'ok' : r.status === 'missed' ? 'warn' : 'bad'} dot>{r.status}</Badge> },
    { key: 'o', header: 'Outcome', sort: r => r.outcome, render: r => <Badge tone={OUT_TONE[r.outcome]}>{r.outcome}</Badge> },
    { key: 'd', header: 'Duration', sort: r => r.duration, render: r => <span className="font-mono text-xs">{r.duration ? fmtDur(r.duration) : '—'}</span> },
    { key: 'w', header: 'When', sort: r => r.startedAt, render: r => <span className="text-xs text-ink-3">{ago(r.startedAt)}</span> },
  ]
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2 p-4"><SearchInput value={q} onChange={setQ} placeholder="Search calls…" className="w-full sm:w-64" /><FilterSelect label="Status" value={st} onChange={setSt} options={['completed', 'missed', 'failed']} /><FilterSelect label="Outcome" value={oc} onChange={setOc} options={OUTCOMES} /></div>
      <DataTable rows={rows} cols={cols} onRow={setOpen} />
      <Modal side open={!!open} onClose={() => setOpen(null)} title="Call details" width={520}>
        {open && <div className="space-y-5">
          <div className="flex items-center gap-3"><Avatar name={open.student} size={44} /><div><p className="font-semibold">{open.student}</p><p className="text-xs text-ink-3">{open.phone} · {open.direction} · {open.language}</p></div></div>
          <div className="grid grid-cols-3 gap-3 text-center">{[['Duration', open.duration ? fmtDur(open.duration) : '—'], ['Status', open.status], ['Sentiment', open.sentiment]].map(([k, v]) => <div key={k} className="rounded-xl bg-slate-50 p-2.5"><p className="text-[11px] text-ink-3">{k}</p><p className="text-sm font-medium capitalize">{v}</p></div>)}</div>
          {open.duration > 0 && <Player duration={open.duration} />}
          <div><p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-4">AI summary</p><p className="rounded-xl border border-brand-100 bg-brand-50/50 p-3 text-sm leading-relaxed">{open.summary}</p></div>
          <Field label="Call outcome"><Select disabled={!can('calls')} value={open.outcome} onChange={e => { const o = e.target.value as Call['outcome']; update(d => ({ ...d, calls: d.calls.map(c => c.id === open.id ? { ...c, outcome: o } : c) }), { action: 'Changed call outcome', target: `${open.student} → ${o}` }); setOpen({ ...open, outcome: o }); toast('Outcome updated') }}>{OUTCOMES.map(o => <option key={o}>{o}</option>)}</Select></Field>
          <div><p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-4">Transcript</p><Transcript lines={open.transcript} /></div>
        </div>}
      </Modal>
    </Card>
  )
}

/* ---------- Campaigns ---------- */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const blank: Campaign = { id: '', name: '', status: 'draft', script: '', language: 'English', window: '10:00–18:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], retries: 2, retryGap: 4, targets: 200, reached: 0, converted: 0, approved: false, course: 'All', startsAt: new Date().toISOString() }
function Campaigns() {
  const { data, update, toast, can } = useApp(); const [edit, setEdit] = useState<Campaign | null>(null); const [launch, setLaunch] = useState<Campaign | null>(null); const [del, setDel] = useState<Campaign | null>(null)
  const save = () => {
    if (!edit) return; if (!edit.name.trim() || !edit.script.trim()) return toast('Name and script are required', 'error')
    const isNew = !edit.id; const c = { ...edit, id: edit.id || `C-${uid()}` }
    update(d => ({ ...d, campaigns: isNew ? [c, ...d.campaigns] : d.campaigns.map(x => x.id === c.id ? c : x) }), { action: isNew ? 'Created campaign' : 'Edited campaign', target: c.name }); setEdit(null); toast('Campaign saved')
  }
  const setStatus = (c: Campaign, status: Campaign['status']) => { update(d => ({ ...d, campaigns: d.campaigns.map(x => x.id === c.id ? { ...x, status } : x) }), { action: `Campaign ${status}`, target: c.name }); toast(`${c.name} is now ${status}`) }
  return (
    <div className="space-y-4">
      <div className="flex justify-end">{can('calls') && <Button variant="primary" icon={<Plus size={15} />} onClick={() => setEdit({ ...blank })}>New campaign</Button>}</div>
      <div className="grid gap-4 md:grid-cols-2">{data.campaigns.map(c => (
        <Card key={c.id} className="p-5">
          <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{c.name}</h3><p className="mt-0.5 text-xs text-ink-3">{c.language} · {c.window} · {c.days.length} days/week</p></div>
            <div className="flex gap-1.5"><Badge tone={c.status === 'active' ? 'ok' : c.status === 'paused' ? 'warn' : 'slate'} dot>{c.status}</Badge>{c.approved ? <Badge tone="brand"><ShieldCheck size={11} />Approved</Badge> : <Badge tone="bad">Needs approval</Badge>}</div></div>
          <p className="mt-3 line-clamp-2 text-[13px] text-ink-2">{c.script}</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">{[['Targets', c.targets], ['Reached', c.reached], ['Converted', c.converted]].map(([k, v]) => <div key={k as string} className="rounded-xl bg-slate-50 py-2"><p className="text-lg font-semibold tabular-nums">{v}</p><p className="text-[11px] text-ink-3">{k}</p></div>)}</div>
          <div className="mt-3"><div className="mb-1 flex justify-between text-xs text-ink-3"><span>Progress</span><span>{Math.round(c.reached / Math.max(1, c.targets) * 100)}%</span></div><Progress value={c.reached / Math.max(1, c.targets) * 100} /></div>
          <p className="mt-3 text-xs text-ink-3">Retry up to {c.retries}× every {c.retryGap}h</p>
          {can('calls') && <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
            {c.status === 'active' ? <Button size="sm" icon={<Pause size={13} />} onClick={() => setStatus(c, 'paused')}>Pause</Button> : <Button size="sm" variant="primary" icon={<Rocket size={13} />} onClick={() => c.approved ? setLaunch(c) : toast('Script must be approved before launch', 'error')}>Launch</Button>}
            <Button size="sm" icon={<Pencil size={13} />} onClick={() => setEdit(c)}>Edit</Button><Button size="sm" variant="ghost" icon={<Trash2 size={13} />} onClick={() => setDel(c)}>Delete</Button></div>}
        </Card>))}</div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit campaign' : 'New campaign'} width={620} footer={<><Button onClick={() => setEdit(null)}>Cancel</Button><Button variant="primary" onClick={save}>Save campaign</Button></>}>
        {edit && <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Campaign name"><Input value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} placeholder="e.g. MBA 2026 Outreach" /></Field></div>
          <Field label="Course focus"><Input value={edit.course} onChange={e => setEdit({ ...edit, course: e.target.value })} /></Field>
          <Field label="Language preference"><Select value={edit.language} onChange={e => setEdit({ ...edit, language: e.target.value })}>{['English', 'English + Hindi', 'English + Telugu', 'English + Tamil', 'Hindi', 'Telugu'].map(l => <option key={l}>{l}</option>)}</Select></Field>
          <div className="sm:col-span-2"><Field label="Approved script" hint="The AI follows this script and only uses verified WebConnect knowledge for facts."><Textarea rows={5} value={edit.script} onChange={e => setEdit({ ...edit, script: e.target.value, approved: false })} /></Field></div>
          <Field label="Calling window"><Input value={edit.window} onChange={e => setEdit({ ...edit, window: e.target.value })} /></Field>
          <Field label="Audience size"><Input type="number" min={1} value={edit.targets} onChange={e => setEdit({ ...edit, targets: +e.target.value })} /></Field>
          <div className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-ink-2">Calling days</span><div className="flex flex-wrap gap-1.5">{DAYS.map(d => <button key={d} aria-pressed={edit.days.includes(d)} onClick={() => setEdit({ ...edit, days: edit.days.includes(d) ? edit.days.filter(x => x !== d) : [...edit.days, d] })} className={cn('h-8 rounded-lg border px-3 text-xs font-medium', edit.days.includes(d) ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-line text-ink-3')}>{d}</button>)}</div></div>
          <Field label="Max retries"><Input type="number" min={0} max={6} value={edit.retries} onChange={e => setEdit({ ...edit, retries: +e.target.value })} /></Field>
          <Field label="Retry gap (hours)"><Input type="number" min={1} value={edit.retryGap} onChange={e => setEdit({ ...edit, retryGap: +e.target.value })} /></Field>
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 sm:col-span-2"><div><p className="text-sm font-medium">Script approved for use</p><p className="text-xs text-ink-3">Editing the script resets approval. Only College Admins can approve.</p></div>
            <Switch label="Approve script" checked={edit.approved} onChange={v => can('settings') ? setEdit({ ...edit, approved: v }) : toast('Only College Admins can approve scripts', 'error')} /></div>
        </div>}
      </Modal>
      <Confirm open={!!launch} onClose={() => setLaunch(null)} title="Launch campaign?" confirmLabel="Launch campaign" body={`This will start a DEMO run of “${launch?.name}” for ${launch?.targets} contacts. No real calls are placed until a telephony provider is connected.`} onConfirm={() => { setStatus(launch!, 'active') }} />
      <Confirm open={!!del} danger onClose={() => setDel(null)} title="Delete campaign?" confirmLabel="Delete" body={`“${del?.name}” and its schedule will be permanently removed.`} onConfirm={() => { update(d => ({ ...d, campaigns: d.campaigns.filter(x => x.id !== del!.id) }), { action: 'Deleted campaign', target: del!.name }); toast('Campaign deleted') }} />
    </div>
  )
}

/* ---------- Schedule ---------- */
function Schedule({ openSchedule }: { openSchedule: () => void }) {
  const { data, update, toast, can } = useApp()
  const sched = data.calls.filter(c => c.status === 'scheduled').sort((a, b) => +new Date(a.startedAt) - +new Date(b.startedAt))
  const callbacks = data.calls.filter(c => c.outcome === 'Callback requested').slice(0, 8)
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card><CardHeader title="Scheduled AI calls" sub="Automated calls queued for later" action={can('calls') && <Button size="sm" variant="primary" icon={<CalendarClock size={14} />} onClick={openSchedule}>Schedule call</Button>} />
        {sched.length === 0 ? <Empty title="Nothing scheduled" body="Schedule an automated call or callback for any lead." icon={<CalendarClock size={20} />} /> : <ul className="px-3 pb-3">{sched.map(c => <li key={c.id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50"><Avatar name={c.student} /><div className="flex-1"><p className="text-[13px] font-medium">{c.student}</p><p className="text-xs text-ink-3">{fmtDateTime(c.startedAt)} · {c.campaign}</p></div><Button size="sm" variant="ghost" onClick={() => { update(d => ({ ...d, calls: d.calls.filter(x => x.id !== c.id) }), { action: 'Cancelled scheduled call', target: c.student }); toast('Scheduled call cancelled') }}>Cancel</Button></li>)}</ul>}
      </Card>
      <Card><CardHeader title="Callback requests" sub="Students who asked to be called back" />
        <ul className="px-3 pb-3">{callbacks.map(c => <li key={c.id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50"><Avatar name={c.student} /><div className="flex-1"><p className="text-[13px] font-medium">{c.student}</p><p className="text-xs text-ink-3">{c.phone} · asked {ago(c.startedAt)}</p></div>
          {can('calls') && <Button size="sm" onClick={() => { const at = new Date(Date.now() + 864e5); at.setHours(18, 0, 0, 0); update(d => ({ ...d, calls: [{ ...c, id: `K-${uid()}`, status: 'scheduled', startedAt: at.toISOString(), outcome: 'Pending', transcript: [], duration: 0, summary: 'Callback scheduled' }, ...d.calls] }), { action: 'Scheduled callback', target: c.student }); toast(`Callback booked for tomorrow 6 PM`) }}>Book 6 PM</Button>}</li>)}</ul></Card>
    </div>
  )
}

/* ---------- Page ---------- */
export default function Voice() {
  const { data, update, toast, can } = useApp(); const [sp, setSp] = useSearchParams()
  const [tab, setTab] = useState<'live' | 'log' | 'campaigns' | 'schedule' | 'inbound'>('live')
  const [live, setLive] = useState<Live[]>(() => SIM_LIVE.map(s => ({ ...s, born: Date.now(), course: 'B.Tech CSE' })))
  const [newOpen, setNewOpen] = useState(sp.get('new') === '1'); const [schedOpen, setSchedOpen] = useState(false)
  const [form, setForm] = useState({ leadId: '', phone: '', campaign: data.campaigns[0]?.name ?? '', when: '' })
  useEffect(() => { if (sp.get('new')) { setSp({}, { replace: true }) } }, [])
  const lead = data.leads.find(l => l.id === form.leadId)
  const start = () => {
    if (!lead && !form.phone) return toast('Choose a student or enter a phone number', 'error')
    if (live.length >= 6) return toast('Concurrent call limit reached (6) in demo mode', 'error')
    const name = lead?.name ?? 'Unknown caller'
    setLive(l => [{ id: `live-${uid()}`, student: name, phone: lead?.phone ?? form.phone, campaign: form.campaign, start: 0, lang: 'English', born: Date.now(), course: lead?.course ?? 'B.Tech CSE' }, ...l])
    update(d => d, { action: 'Initiated AI call (demo)', target: name }); setNewOpen(false); setTab('live'); toast('Simulated AI call started')
  }
  const schedule = () => {
    if (!lead || !form.when) return toast('Choose a student and a date/time', 'error')
    update(d => ({ ...d, calls: [{ id: `K-${uid()}`, student: lead.name, phone: lead.phone, campaign: form.campaign, status: 'scheduled', duration: 0, startedAt: new Date(form.when).toISOString(), outcome: 'Pending', summary: 'Scheduled', transcript: [], direction: 'outbound', language: 'English', sentiment: 'neutral' }, ...d.calls] }), { action: 'Scheduled AI call', target: lead.name })
    setSchedOpen(false); toast('Call scheduled'); setTab('schedule')
  }
  const picker = <>
    <Field label="Student / lead"><Select value={form.leadId} onChange={e => setForm({ ...form, leadId: e.target.value })}><option value="">— Select a lead —</option>{data.leads.slice(0, 40).map(l => <option key={l.id} value={l.id}>{l.name} · {l.course}</option>)}</Select></Field>
    <Field label="Campaign"><Select value={form.campaign} onChange={e => setForm({ ...form, campaign: e.target.value })}>{data.campaigns.filter(c => c.approved).map(c => <option key={c.id}>{c.name}</option>)}</Select></Field></>
  return (
    <div className="space-y-5">
      <PageHeader title="AI Voice" sub="Intelligent calling center — initiate, monitor and review AI admission conversations." actions={<>
        <DemoBadge text="Demo telephony" />{can('calls') && <><Button icon={<CalendarClock size={15} />} onClick={() => setSchedOpen(true)}>Schedule</Button><Button variant="primary" icon={<PhoneCall size={15} />} onClick={() => setNewOpen(true)}>New AI call</Button></>}</>} />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'live', label: 'Live console', count: live.length }, { id: 'log', label: 'Call history' }, { id: 'campaigns', label: 'Campaigns', count: data.campaigns.length }, { id: 'schedule', label: 'Schedule & callbacks' }, { id: 'inbound', label: <span className="flex items-center gap-1.5"><PhoneIncoming size={13} />Inbound</span> }]} />
      {tab === 'live' && <LiveConsole live={live} setLive={setLive} openNew={() => setNewOpen(true)} />}
      {tab === 'log' && <CallLog />}
      {tab === 'inbound' && <><Card className="mb-4 flex items-start gap-3 p-4 text-sm text-ink-2"><FileText size={18} className="mt-0.5 text-brand-600" />Inbound enquiries are answered by the AI using verified WebConnect knowledge and logged as new leads.</Card><CallLog inbound /></>}
      {tab === 'campaigns' && <Campaigns />}
      {tab === 'schedule' && <Schedule openSchedule={() => setSchedOpen(true)} />}
      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="Initiate AI call" footer={<><Button onClick={() => setNewOpen(false)}>Cancel</Button><Button variant="primary" icon={<PhoneCall size={14} />} onClick={start}>Start call</Button></>}>
        <div className="space-y-4">{picker}<Field label="…or enter a phone number"><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98xxxxxxx" /></Field>
          <p className="rounded-lg bg-warn-50 p-3 text-xs text-warn-700">Demo mode: this starts a simulated conversation. No phone call is placed.</p></div>
      </Modal>
      <Modal open={schedOpen} onClose={() => setSchedOpen(false)} title="Schedule automated call" footer={<><Button onClick={() => setSchedOpen(false)}>Cancel</Button><Button variant="primary" onClick={schedule}>Schedule</Button></>}>
        <div className="space-y-4">{picker}<Field label="Date & time"><Input type="datetime-local" value={form.when} onChange={e => setForm({ ...form, when: e.target.value })} /></Field></div>
      </Modal>
    </div>
  )
}
