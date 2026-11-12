import clsx, { type ClassValue } from 'clsx'
export const cn = (...a: ClassValue[]) => clsx(a)
export const fmtDur = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
export const initials = (n: string) => n.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase()
export const ago = (iso: string) => {
  const d = (Date.now() - new Date(iso).getTime()) / 1000
  if (d < 0) { const f = -d; return f < 3600 ? `in ${Math.round(f / 60)}m` : f < 86400 ? `in ${Math.round(f / 3600)}h` : `in ${Math.round(f / 86400)}d` }
  if (d < 60) return 'just now'
  if (d < 3600) return `${Math.floor(d / 60)}m ago`
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`
  return `${Math.floor(d / 86400)}d ago`
}
export const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
export const fmtDateTime = (iso: string) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
export function toCSV(rows: Record<string, unknown>[]) {
  if (!rows.length) return ''
  const k = Object.keys(rows[0]); const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [k.join(','), ...rows.map(r => k.map(x => esc(r[x])).join(','))].join('\n')
}
export function download(name: string, content: string, type = 'text/csv') {
  const url = URL.createObjectURL(new Blob([content], { type })); const a = document.createElement('a')
  a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url)
}
export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/); if (lines.length < 2) return []
  const split = (l: string) => (l.match(/("([^"]|"")*"|[^,]*)(,|$)/g) || []).map(s => s.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"'))
  const h = split(lines[0]).slice(0, -1 < 0 ? undefined : undefined).map(x => x.trim().toLowerCase())
  return lines.slice(1).map(l => { const c = split(l); const o: Record<string, string> = {}; h.forEach((k, i) => o[k] = c[i] ?? ''); return o })
}
export const uid = () => Math.random().toString(36).slice(2, 10)
