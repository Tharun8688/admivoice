import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { X, ChevronDown, Search, Inbox, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { cn, initials } from '@/lib/utils'
import { useApp } from '@/lib/store'

/* Button */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark'; size?: 'sm' | 'md'; icon?: ReactNode }
export function Button({ variant = 'secondary', size = 'md', icon, className, children, ...p }: BtnProps) {
  const v = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
    dark: 'bg-navy-900 text-white hover:bg-navy-800',
    secondary: 'bg-white text-ink-2 border border-line hover:bg-slate-50 hover:border-slate-300',
    ghost: 'text-ink-2 hover:bg-slate-100',
    danger: 'bg-bad-600 text-white hover:bg-bad-700',
  }[variant]
  return <button {...p} className={cn('inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap', size === 'sm' ? 'h-8 px-2.5 text-[13px]' : 'h-9 px-3.5 text-sm', v, className)}>{icon}{children}</button>
}
export function IconButton({ label, children, className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return <button aria-label={label} title={label} {...p} className={cn('h-8 w-8 inline-flex items-center justify-center rounded-lg text-ink-3 hover:bg-slate-100 hover:text-ink transition-colors', className)}>{children}</button>
}

/* Badge */
const TONES = { slate: 'bg-slate-100 text-slate-700', brand: 'bg-brand-50 text-brand-700', violet: 'bg-violet2-50 text-violet-700', ok: 'bg-ok-50 text-ok-700', warn: 'bg-warn-50 text-warn-700', bad: 'bg-bad-50 text-bad-700' }
export type Tone = keyof typeof TONES
export const Badge = ({ tone = 'slate', children, dot, className }: { tone?: Tone; children: ReactNode; dot?: boolean; className?: string }) => (
  <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap', TONES[tone], className)}>
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}{children}</span>
)

/* Card */
export const Card = ({ children, className, ...p }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) => <div {...p} className={cn('card', className)}>{children}</div>
export const CardHeader = ({ title, sub, action }: { title: ReactNode; sub?: ReactNode; action?: ReactNode }) => (
  <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3"><div><h3 className="font-semibold text-[15px] text-ink">{title}</h3>{sub && <p className="text-xs text-ink-3 mt-0.5">{sub}</p>}</div>{action}</div>
)
export const PageHeader = ({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
    <div><h1 className="text-[22px] font-semibold tracking-tight text-ink">{title}</h1>{sub && <p className="text-sm text-ink-3 mt-1 max-w-2xl">{sub}</p>}</div>
    <div className="flex flex-wrap items-center gap-2">{actions}</div>
  </div>
)

/* Avatar */
const AV = ['bg-indigo-100 text-indigo-700', 'bg-violet-100 text-violet-700', 'bg-sky-100 text-sky-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700']
export const Avatar = ({ name, size = 32 }: { name: string; size?: number }) => (
  <span style={{ width: size, height: size, fontSize: size * 0.38 }} className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold', AV[name.charCodeAt(0) % AV.length])}>{initials(name)}</span>
)

/* Form */
const inputCls = 'h-9 w-full rounded-lg border border-line bg-white px-3 text-sm placeholder:text-ink-4 hover:border-slate-300 focus:border-brand-500 transition-colors'
export const Input = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cn(inputCls, className)} />
export const Textarea = ({ className, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={cn(inputCls, 'h-auto py-2 leading-relaxed', className)} />
export const Select = ({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={cn(inputCls, 'pr-8 appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2394a3b8%27 stroke-width=%272.5%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-no-repeat bg-[right_10px_center]', className)}>{children}</select>
export const Field = ({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) => (
  <label className="block"><span className="block text-xs font-medium text-ink-2 mb-1.5">{label}</span>{children}{hint && <span className="block text-xs text-ink-3 mt-1">{hint}</span>}</label>
)
export const SearchInput = ({ value, onChange, placeholder = 'Search…', className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) => (
  <div className={cn('relative', className)}><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" /><Input aria-label={placeholder} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="pl-9" /></div>
)
export const Switch = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <button role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cn('relative h-5 w-9 rounded-full transition-colors', checked ? 'bg-brand-600' : 'bg-slate-300')}>
    <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all', checked ? 'left-[18px]' : 'left-0.5')} /></button>
)

/* Tabs / segmented */
export function Tabs<T extends string>({ value, onChange, items, className }: { value: T; onChange: (v: T) => void; items: { id: T; label: ReactNode; count?: number }[]; className?: string }) {
  return (
    <div role="tablist" className={cn('flex items-center gap-1 border-b border-line overflow-x-auto', className)}>
      {items.map(i => (
        <button key={i.id} role="tab" aria-selected={value === i.id} onClick={() => onChange(i.id)}
          className={cn('relative px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors', value === i.id ? 'text-brand-700' : 'text-ink-3 hover:text-ink')}>
          {i.label}{i.count !== undefined && <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 text-[11px] text-ink-3">{i.count}</span>}
          {value === i.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-brand-600" />}
        </button>))}
    </div>
  )
}
export function Segmented<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { id: T; label: ReactNode }[] }) {
  return <div className="inline-flex rounded-lg bg-slate-100 p-0.5">{items.map(i => <button key={i.id} onClick={() => onChange(i.id)} aria-pressed={value === i.id} className={cn('h-8 px-3 rounded-md text-[13px] font-medium inline-flex items-center gap-1.5 transition-all', value === i.id ? 'bg-white text-ink shadow-sm' : 'text-ink-3 hover:text-ink')}>{i.label}</button>)}</div>
}

/* Click-outside + Dropdown */
export function useOutside(cb: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) cb() }
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') cb() }
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k)
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k) }
  })
  return ref
}
export function Dropdown({ trigger, children, align = 'right', width = 220 }: { trigger: (open: boolean) => ReactNode; children: (close: () => void) => ReactNode; align?: 'left' | 'right'; width?: number }) {
  const [open, setOpen] = useState(false); const ref = useOutside(() => setOpen(false))
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(o => !o)}>{trigger(open)}</div>
      {open && <div style={{ width }} className={cn('absolute z-40 mt-1.5 rounded-xl border border-line bg-white p-1 shadow-pop animate-fadeUp', align === 'right' ? 'right-0' : 'left-0')}>{children(() => setOpen(false))}</div>}
    </div>
  )
}
export const MenuItem = ({ children, onClick, icon, danger, active }: { children: ReactNode; onClick?: () => void; icon?: ReactNode; danger?: boolean; active?: boolean }) => (
  <button onClick={onClick} className={cn('flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors hover:bg-slate-100', danger ? 'text-bad-600' : 'text-ink-2', active && 'bg-brand-50 text-brand-700')}>{icon}{children}</button>
)
export function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Dropdown align="left" width={200} trigger={() => <Button size="sm" className={cn(value !== 'All' && 'border-brand-200 bg-brand-50 text-brand-700')}>{label}{value !== 'All' && `: ${value}`}<ChevronDown size={14} /></Button>}>
      {close => ['All', ...options].map(o => <MenuItem key={o} active={o === value} onClick={() => { onChange(o); close() }}>{o}</MenuItem>)}
    </Dropdown>
  )
}

/* Modal / Drawer */
export function Modal({ open, onClose, title, children, footer, width = 520, side }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode; width?: number; side?: boolean }) {
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k); document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <div style={{ maxWidth: width }} className={cn('relative bg-white shadow-pop flex flex-col w-full animate-fadeUp', side ? 'ml-auto h-full' : 'm-auto rounded-2xl max-h-[90vh]')}>
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5"><h2 className="font-semibold text-[15px]">{title}</h2><IconButton label="Close" onClick={onClose}><X size={16} /></IconButton></div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line px-5 py-3 bg-slate-50/60 rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  )
}
export function Confirm({ open, onClose, onConfirm, title, body, confirmLabel = 'Confirm', danger }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; body: string; confirmLabel?: string; danger?: boolean }) {
  return <Modal open={open} onClose={onClose} title={title} width={420} footer={<><Button onClick={onClose}>Cancel</Button><Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</Button></>}><p className="text-sm text-ink-2 leading-relaxed">{body}</p></Modal>
}

/* Empty + Skeleton */
export const Empty = ({ title, body, action, icon }: { title: string; body?: string; action?: ReactNode; icon?: ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center px-6">
    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">{icon ?? <Inbox size={20} />}</div>
    <p className="font-medium text-ink">{title}</p>{body && <p className="mt-1 max-w-xs text-sm text-ink-3">{body}</p>}{action && <div className="mt-4">{action}</div>}
  </div>
)
export const Skeleton = ({ className }: { className?: string }) => <div className={cn('skeleton', className)} />
export function PageSkeleton() {
  return <div className="space-y-5"><Skeleton className="h-8 w-56" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
    <div className="grid lg:grid-cols-3 gap-4"><Skeleton className="h-72 rounded-2xl lg:col-span-2" /><Skeleton className="h-72 rounded-2xl" /></div></div>
}

/* Progress */
export const Progress = ({ value, tone = 'brand' }: { value: number; tone?: 'brand' | 'ok' | 'warn' }) => (
  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden"><div style={{ width: `${Math.min(100, value)}%` }} className={cn('h-full rounded-full transition-all', tone === 'ok' ? 'bg-ok-500' : tone === 'warn' ? 'bg-warn-500' : 'bg-brand-600')} /></div>
)

/* Stat */
export function Stat({ label, value, delta, icon, hint }: { label: string; value: ReactNode; delta?: number; icon?: ReactNode; hint?: string }) {
  return (
    <Card className="p-4 hover:shadow-pop transition-shadow">
      <div className="flex items-center justify-between text-ink-3"><span className="text-xs font-medium">{label}</span><span className="text-ink-4">{icon}</span></div>
      <div className="mt-2 text-[26px] font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="mt-1 flex items-center gap-1.5 text-xs">
        {delta !== undefined && <span className={cn('font-medium', delta >= 0 ? 'text-ok-600' : 'text-bad-600')}>{delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%</span>}
        {(hint || delta !== undefined) && <span className="text-ink-4">{hint ?? 'vs last week'}</span>}</div>
    </Card>
  )
}

/* Data table: sort, paginate */
export interface Col<T> { key: string; header: string; render: (r: T) => ReactNode; sort?: (r: T) => string | number; className?: string }
export function DataTable<T extends { id: string }>({ rows, cols, pageSize = 10, onRow, empty, selected, onSelect }: { rows: T[]; cols: Col<T>[]; pageSize?: number; onRow?: (r: T) => void; empty?: ReactNode; selected?: Set<string>; onSelect?: (s: Set<string>) => void }) {
  const [sort, setSort] = useState<{ k: string; dir: 1 | -1 } | null>(null)
  const [page, setPage] = useState(0)
  const sorted = useMemo2(() => {
    if (!sort) return rows; const c = cols.find(c => c.key === sort.k); if (!c?.sort) return rows
    return [...rows].sort((a, b) => { const x = c.sort!(a), y = c.sort!(b); return (x < y ? -1 : x > y ? 1 : 0) * sort.dir })
  }, [rows, sort])
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize)); const cur = Math.min(page, pages - 1)
  const slice = sorted.slice(cur * pageSize, cur * pageSize + pageSize)
  useEffect(() => setPage(0), [rows.length])
  if (!rows.length) return <>{empty ?? <Empty title="No results" body="Try adjusting your search or filters." />}</>
  const allSel = onSelect && slice.every(r => selected?.has(r.id))
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-y border-line bg-slate-50/70 text-left text-xs font-medium text-ink-3">
            {onSelect && <th className="w-10 pl-5"><input type="checkbox" aria-label="Select all" checked={!!allSel} onChange={() => { const s = new Set(selected); slice.forEach(r => allSel ? s.delete(r.id) : s.add(r.id)); onSelect(s) }} className="accent-brand-600" /></th>}
            {cols.map(c => (
              <th key={c.key} className={cn('px-4 py-2.5 first:pl-5 last:pr-5 font-medium', c.className)} aria-sort={sort?.k === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
                {c.sort ? <button onClick={() => setSort(s => s?.k === c.key ? (s.dir === 1 ? { k: c.key, dir: -1 } : null) : { k: c.key, dir: 1 })} className="inline-flex items-center gap-1 hover:text-ink">{c.header}{sort?.k === c.key ? (sort.dir === 1 ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ChevronsUpDown size={12} className="opacity-40" />}</button> : c.header}
              </th>))}
          </tr></thead>
          <tbody>
            {slice.map(r => (
              <tr key={r.id} tabIndex={onRow ? 0 : undefined} onKeyDown={e => e.key === 'Enter' && onRow?.(r)} onClick={() => onRow?.(r)} className={cn('border-b border-line-2 last:border-0 transition-colors hover:bg-slate-50/80', onRow && 'cursor-pointer')}>
                {onSelect && <td className="pl-5" onClick={e => e.stopPropagation()}><input type="checkbox" aria-label="Select row" checked={!!selected?.has(r.id)} onChange={() => { const s = new Set(selected); s.has(r.id) ? s.delete(r.id) : s.add(r.id); onSelect(s) }} className="accent-brand-600" /></td>}
                {cols.map(c => <td key={c.key} className={cn('px-4 py-3 first:pl-5 last:pr-5', c.className)}>{c.render(r)}</td>)}
              </tr>))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-5 py-3 text-xs text-ink-3">
        <span>{cur * pageSize + 1}–{Math.min(sorted.length, (cur + 1) * pageSize)} of {sorted.length}</span>
        <div className="flex items-center gap-1.5"><Button size="sm" disabled={cur === 0} onClick={() => setPage(cur - 1)}>Previous</Button><span className="px-1">{cur + 1} / {pages}</span><Button size="sm" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>Next</Button></div>
      </div>
    </div>
  )
}
import { useMemo as useMemo2 } from 'react'

/* Toasts */
export function Toasts() {
  const { toasts, dismiss } = useApp()
  const tone = { success: 'border-ok-500/30 bg-white', error: 'border-bad-500/40 bg-white', info: 'border-brand-200 bg-white' }
  const dot = { success: 'bg-ok-500', error: 'bg-bad-500', info: 'bg-brand-500' }
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2" role="status" aria-live="polite">
      {toasts.map(t => <div key={t.id} className={cn('flex items-center gap-3 rounded-xl border px-4 py-3 shadow-pop text-sm animate-fadeUp min-w-[240px]', tone[t.kind])}>
        <span className={cn('h-2 w-2 rounded-full', dot[t.kind])} /><span className="flex-1">{t.text}</span><button aria-label="Dismiss" onClick={() => dismiss(t.id)} className="text-ink-4 hover:text-ink"><X size={14} /></button></div>)}
    </div>
  )
}
export const DemoBadge = ({ text = 'Demo' }: { text?: string }) => <Badge tone="warn" className="uppercase tracking-wide text-[10px]">{text}</Badge>
export function Permit({ perm, children, fallback }: { perm: Parameters<ReturnType<typeof useApp>['can']>[0]; children: ReactNode; fallback?: ReactNode }) {
  const { can } = useApp(); return <>{can(perm) ? children : fallback ?? null}</>
}
