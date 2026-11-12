import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Upload, Download, Tag, Mail, Phone, X } from 'lucide-react'
import { useApp } from '@/lib/store'
import type { Contact } from '@/lib/types'
import { Avatar, Badge, Button, Card, DataTable, Empty, Field, FilterSelect, Input, Modal, PageHeader, SearchInput, Select, Tabs, type Col } from '@/components/ui'
import { ago, download, parseCSV, toCSV, uid } from '@/lib/utils'

const TYPES = ['Student', 'Parent', 'Applicant', 'Existing Student'] as const
export default function Contacts() {
  const { data, update, toast, can } = useApp(); const [sp, setSp] = useSearchParams(); const [q, setQ] = useState(sp.get('q') ?? ''); const [type, setType] = useState<'All' | typeof TYPES[number]>('All')
  const [seg, setSeg] = useState('All'); const [tag, setTag] = useState('All'); const [open, setOpen] = useState<string | null>(null); const [add, setAdd] = useState(false); const [newTag, setNewTag] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: 'Applicant' as Contact['type'], city: '' }); const file = useRef<HTMLInputElement>(null)
  const rows = useMemo(() => data.contacts.filter(c => (type === 'All' || c.type === type) && (seg === 'All' || c.segment === seg) && (tag === 'All' || c.tags.includes(tag)) && (c.name + c.phone + c.email + c.city).toLowerCase().includes(q.toLowerCase())), [data.contacts, type, seg, tag, q])
  const cur = data.contacts.find(c => c.id === open)
  const patch = (id: string, p: Partial<Contact>, action: string, target: string) => update(d => ({ ...d, contacts: d.contacts.map(c => c.id === id ? { ...c, ...p } : c) }), { action, target })
  const cols: Col<Contact>[] = [
    { key: 'n', header: 'Contact', sort: r => r.name, render: r => <span className="flex items-center gap-2.5"><Avatar name={r.name} size={30} /><span><span className="block font-medium">{r.name}</span><span className="text-xs text-ink-3">{r.city}</span></span></span> },
    { key: 't', header: 'Type', sort: r => r.type, render: r => <Badge tone={r.type === 'Parent' ? 'violet' : r.type === 'Applicant' ? 'brand' : r.type === 'Student' ? 'ok' : 'slate'}>{r.type}</Badge> },
    { key: 'p', header: 'Phone / email', render: r => <span className="text-xs text-ink-2"><span className="block">{r.phone}</span><span className="text-ink-3">{r.email}</span></span> },
    { key: 'g', header: 'Tags', render: r => <span className="flex flex-wrap gap-1">{r.tags.map(t => <Badge key={t}>{t}</Badge>)}</span> },
    { key: 's', header: 'Segment', sort: r => r.segment, render: r => <span className="text-ink-2">{r.segment}</span> },
    { key: 'l', header: 'Last contact', sort: r => r.lastContact, render: r => <span className="text-xs text-ink-3">{ago(r.lastContact)}</span> },
  ]
  const importCSV = async (f: File) => {
    const parsed = parseCSV(await f.text()).filter(r => r.name)
    if (!parsed.length) return toast('No valid rows found. Expected columns: name, phone, email, type, city', 'error')
    const list: Contact[] = parsed.map(r => ({ id: `P-${uid()}`, name: r.name, phone: r.phone ?? '', email: r.email ?? '', type: (TYPES.find(t => t.toLowerCase() === (r.type ?? '').toLowerCase()) ?? 'Applicant'), tags: [], segment: 'Imported', city: r.city ?? '', lastContact: new Date().toISOString(), custom: {}, history: [] }))
    update(d => ({ ...d, contacts: [...list, ...d.contacts] }), { action: 'Imported contacts', target: `${list.length} from ${f.name}` }); toast(`Imported ${list.length} contacts`)
  }
  return (
    <div className="space-y-5">
      <PageHeader title="Contacts" sub="Students, parents, applicants and existing students in one unified directory." actions={<>
        <input ref={file} type="file" accept=".csv" hidden onChange={e => { const f = e.target.files?.[0]; if (f) importCSV(f); e.target.value = '' }} />
        {can('contacts') && <Button icon={<Upload size={15} />} onClick={() => file.current?.click()}>Import CSV</Button>}
        <Button icon={<Download size={15} />} onClick={() => { if (!can('export')) return toast('No export permission', 'error'); download('contacts.csv', toCSV(rows.map(c => ({ name: c.name, type: c.type, phone: c.phone, email: c.email, city: c.city, segment: c.segment, tags: c.tags.join('|') })))); update(d => d, { action: 'Exported contacts', target: `${rows.length} rows` }); toast(`Exported ${rows.length} contacts`) }}>Export</Button>
        {can('contacts') && <Button variant="primary" icon={<Plus size={15} />} onClick={() => setAdd(true)}>Add contact</Button>}</>} />
      <Card>
        <div className="px-5 pt-2"><Tabs value={type} onChange={setType} items={[{ id: 'All', label: 'All', count: data.contacts.length }, ...TYPES.map(t => ({ id: t, label: t + 's', count: data.contacts.filter(c => c.type === t).length }))]} /></div>
        <div className="flex flex-wrap items-center gap-2 p-4"><SearchInput value={q} onChange={v => { setQ(v); if (sp.get('q')) setSp({}) }} placeholder="Search contacts…" className="w-full sm:w-64" /><FilterSelect label="Segment" value={seg} onChange={setSeg} options={[...new Set(data.contacts.map(c => c.segment))]} /><FilterSelect label="Tag" value={tag} onChange={setTag} options={[...new Set(data.contacts.flatMap(c => c.tags))]} /></div>
        <DataTable rows={rows} cols={cols} pageSize={12} onRow={c => setOpen(c.id)} empty={<Empty title="No contacts found" body="Adjust filters or import a CSV with columns name, phone, email, type, city." />} />
      </Card>
      <Modal side open={!!cur} onClose={() => setOpen(null)} title="Contact" width={480}>
        {cur && <div className="space-y-5"><div className="flex items-center gap-3"><Avatar name={cur.name} size={48} /><div><p className="font-semibold">{cur.name}</p><Badge tone="brand">{cur.type}</Badge></div></div>
          <div className="grid gap-2 text-sm"><p className="flex items-center gap-2 text-ink-2"><Phone size={14} />{cur.phone}</p><p className="flex items-center gap-2 text-ink-2"><Mail size={14} />{cur.email}</p></div>
          <div><p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-4">Tags</p><div className="flex flex-wrap gap-1.5">{cur.tags.map(t => <Badge key={t} tone="brand">{t}{can('contacts') && <button aria-label={`Remove ${t}`} onClick={() => patch(cur.id, { tags: cur.tags.filter(x => x !== t) }, 'Removed tag', cur.name)}><X size={11} /></button>}</Badge>)}</div>
            {can('contacts') && <form className="mt-2 flex gap-2" onSubmit={e => { e.preventDefault(); const t = newTag.trim(); if (!t || cur.tags.includes(t)) return; patch(cur.id, { tags: [...cur.tags, t] }, 'Added tag', `${cur.name}: ${t}`); setNewTag('') }}><Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add tag…" /><Button type="submit" icon={<Tag size={13} />}>Add</Button></form>}</div>
          <div><p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-4">Custom fields</p><dl className="divide-y divide-line-2 rounded-xl border border-line text-sm">{Object.entries({ Segment: cur.segment, City: cur.city, ...cur.custom }).map(([k, v]) => <div key={k} className="flex justify-between px-3 py-2"><dt className="text-ink-3">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl></div>
          <div><p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-4">Communication history</p>{cur.history.length ? <ol className="space-y-3 border-l border-line pl-4">{cur.history.map(h => <li key={h.id}><p className="text-sm">{h.text}</p><p className="text-[11px] text-ink-4">{h.by} · {ago(h.at)}</p></li>)}</ol> : <p className="text-sm text-ink-3">No communication yet.</p>}</div></div>}
      </Modal>
      <Modal open={add} onClose={() => setAdd(false)} title="Add contact" footer={<><Button onClick={() => setAdd(false)}>Cancel</Button><Button variant="primary" onClick={() => {
        if (!form.name.trim()) return toast('Name is required', 'error'); if (form.email && !/\S+@\S+\.\S+/.test(form.email)) return toast('Invalid email', 'error')
        update(d => ({ ...d, contacts: [{ id: `P-${uid()}`, ...form, tags: [], segment: 'Manual', lastContact: new Date().toISOString(), custom: {}, history: [] }, ...d.contacts] }), { action: 'Created contact', target: form.name }); setAdd(false); setForm({ name: '', phone: '', email: '', type: 'Applicant', city: '' }); toast('Contact added') }}>Add contact</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><Field label="Full name"><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field></div><Field label="Phone"><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field><Field label="Email"><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Type"><Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Contact['type'] })}>{TYPES.map(t => <option key={t}>{t}</option>)}</Select></Field><Field label="City"><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></Field></div></Modal>
    </div>
  )
}
