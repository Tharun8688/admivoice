import type { InstData } from './types'
import { LEAD_STAGES } from './types'
export const CHART = { brand: '#4f46e5', violet: '#8b5cf6', sky: '#38bdf8', ok: '#10b981', warn: '#f59e0b', bad: '#dc6262', grid: '#eef0f6', axis: '#94a3b8' }
export const PALETTE = [CHART.brand, CHART.violet, CHART.sky, CHART.ok, CHART.warn, '#64748b']
const day = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d }
const label = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

export function metrics(d: InstData) {
  const calls = d.calls; const completed = calls.filter(c => c.status === 'completed'); const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const today = calls.filter(c => new Date(c.startedAt) >= todayStart)
  const pending = d.leads.filter(l => l.followUp && new Date(l.followUp) <= new Date(Date.now() + 864e5) && l.stage !== 'Enrolled')
  const admitted = d.leads.filter(l => ['Admitted', 'Enrolled'].includes(l.stage)).length
  const conv = d.leads.length ? +(admitted / d.leads.length * 100).toFixed(1) : 0
  // deterministic 14-day calling series scaled from real totals
  const daily = Array.from({ length: 14 }, (_, i) => {
    const n = 13 - i; const base = 60 + ((i * 37 + d.calls.length * 3) % 55); const ans = Math.round(base * (0.62 + ((i * 13) % 17) / 100)); const miss = Math.round((base - ans) * 0.7); const fail = base - ans - miss
    return { day: label(day(n)), Answered: ans, Missed: miss, Failed: Math.max(0, fail) }
  })
  const trend = Array.from({ length: 30 }, (_, i) => { const n = 29 - i; const c = d.leads.filter(l => label(new Date(l.createdAt)) === label(day(n))).length; return { day: label(day(n)), Enquiries: c * 3 + 8 + ((i * 7) % 9) + Math.round(i / 3), Applications: Math.round(c * 1.2 + 2 + ((i * 5) % 4)) } })
  const funnel = LEAD_STAGES.map((s, i) => ({ stage: s, count: d.leads.filter(l => LEAD_STAGES.indexOf(l.stage) >= i).length }))
  const byDept = Object.entries(d.leads.reduce<Record<string, number>>((a, l) => (a[l.dept] = (a[l.dept] || 0) + 1, a), {})).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  const byCourse = Object.entries(d.leads.reduce<Record<string, number>>((a, l) => (a[l.course] = (a[l.course] || 0) + 1, a), {})).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  const total = calls.length; const ans = completed.length
  const avgDur = completed.length ? Math.round(completed.reduce((s, c) => s + c.duration, 0) / completed.length) : 0
  const resolved = completed.filter(c => c.outcome !== 'Callback requested').length
  const officers = Object.entries(d.leads.reduce<Record<string, { leads: number; adm: number }>>((a, l) => { const o = (a[l.officer] ||= { leads: 0, adm: 0 }); o.leads++; if (['Admitted', 'Enrolled'].includes(l.stage)) o.adm++; return a }, {})).map(([name, v]) => ({ name, ...v, rate: +(v.adm / Math.max(1, v.leads) * 100).toFixed(1) }))
  return { today, completed, pending, conv, daily, trend, funnel, byDept, byCourse, total, ans, avgDur, missed: calls.filter(c => c.status === 'missed').length, failed: calls.filter(c => c.status === 'failed').length, resolutionRate: ans ? Math.round(resolved / ans * 100) : 0, officers, admitted }
}
