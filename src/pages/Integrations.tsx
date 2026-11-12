import { useState } from 'react'
import { Globe, Database, Sheet, Mail, MessageCircle, Phone, Bot, School, Plug, CheckCircle2 } from 'lucide-react'
import { useApp } from '@/lib/store'
import type { Integration } from '@/lib/types'
import { Badge, Button, Card, Confirm, DemoBadge, Field, Input, Modal, PageHeader, SearchInput, Tabs } from '@/components/ui'

const ICON: Record<string, typeof Globe> = { Knowledge: Globe, CRM: Database, Data: Sheet, Email: Mail, Messaging: MessageCircle, Telephony: Phone, AI: Bot, SIS: School }
const FIELDS: Record<string, string[]> = { Knowledge: ['Website URL'], CRM: ['Instance URL', 'API key'], Data: ['Spreadsheet name', 'Google account'], Email: ['From address', 'API key'], Messaging: ['Business phone number', 'Access token'], Telephony: ['Account SID', 'Auth token', 'Caller ID'], AI: ['Provider', 'API key'], SIS: ['Endpoint URL', 'API key'] }
export default function Integrations() {
  const { data, update, toast, can } = useApp(); const [q, setQ] = useState(''); const [cat, setCat] = useState('All'); const [cfg, setCfg] = useState<Integration | null>(null); const [vals, setVals] = useState<Record<string, string>>({}); const [off, setOff] = useState<Integration | null>(null)
  const cats = ['All', ...new Set(data.integrations.map(i => i.category))]
  const list = data.integrations.filter(i => (cat === 'All' || i.category === cat) && (i.name + i.desc).toLowerCase().includes(q.toLowerCase()))
  const save = () => {
    if (!cfg) return; const f = FIELDS[cfg.category]; if (f.some(k => !vals[k]?.trim())) return toast('Fill in all fields', 'error')
    update(d => ({ ...d, integrations: d.integrations.map(i => i.id === cfg.id ? { ...i, connected: true, demo: true, configured: vals[f[0]] } : i) }), { action: 'Configured integration (demo)', target: cfg.name }); setCfg(null); toast(`${cfg.name} marked connected (demo)`)
  }
  return (
    <div className="space-y-5">
      <PageHeader title="Integrations" sub="Connect Admivoice to your telephony, CRM, messaging and student systems." actions={<DemoBadge text="Demo connectors" />} />
      <div className="flex flex-wrap items-center gap-3"><SearchInput value={q} onChange={setQ} placeholder="Search integrations…" className="w-full sm:w-72" /><div className="-mb-px flex-1 overflow-x-auto"><Tabs value={cat} onChange={setCat} items={cats.map(c => ({ id: c, label: c }))} className="border-0" /></div></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map(i => { const I = ICON[i.category] ?? Plug; return (
        <Card key={i.id} className="flex flex-col p-5 transition-shadow hover:shadow-pop">
          <div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><I size={19} /></span>{i.connected ? <Badge tone="ok" dot>Connected</Badge> : <Badge>Not connected</Badge>}</div>
          <h3 className="mt-3 font-semibold">{i.name}</h3><p className="mt-1 flex-1 text-[13px] text-ink-3">{i.desc}</p>
          {i.connected && <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-2"><CheckCircle2 size={13} className="text-ok-600" />{i.configured}{i.demo && <DemoBadge />}</p>}
          <div className="mt-4 flex gap-2 border-t border-line pt-3">{i.connected ? <><Button size="sm" disabled={!can('integrations')} onClick={() => { setVals({ [FIELDS[i.category][0]]: i.configured }); setCfg(i) }}>Configure</Button><Button size="sm" variant="ghost" disabled={!can('integrations')} onClick={() => setOff(i)}>Disconnect</Button></> : <Button size="sm" variant="primary" disabled={!can('integrations')} onClick={() => { setVals({}); setCfg(i) }}>Connect</Button>}</div>
        </Card>) })}</div>
      <Modal open={!!cfg} onClose={() => setCfg(null)} title={`${cfg?.connected ? 'Configure' : 'Connect'} ${cfg?.name}`} footer={<><Button onClick={() => setCfg(null)}>Cancel</Button><Button variant="primary" onClick={save}>Save</Button></>}>
        {cfg && <div className="space-y-4">{FIELDS[cfg.category].map(k => <Field key={k} label={k}><Input type={/key|token/i.test(k) ? 'password' : 'text'} value={vals[k] ?? ''} onChange={e => setVals({ ...vals, [k]: e.target.value })} /></Field>)}
          <p className="rounded-lg bg-warn-50 p-3 text-xs text-warn-700">Demo mode: credentials are not validated or stored, and no external service is contacted. Real connectors plug into the provider interfaces in <code>src/lib</code>.</p></div>}
      </Modal>
      <Confirm open={!!off} danger onClose={() => setOff(null)} title="Disconnect integration?" confirmLabel="Disconnect" body={`${off?.name} will stop syncing. You can reconnect at any time.`} onConfirm={() => { update(d => ({ ...d, integrations: d.integrations.map(i => i.id === off!.id ? { ...i, connected: false, configured: '' } : i) }), { action: 'Disconnected integration', target: off!.name }); toast('Disconnected') }} />
    </div>
  )
}
