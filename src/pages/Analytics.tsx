import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Download, FileText, Phone, PhoneMissed, Timer, Bot, TrendingUp, PhoneCall } from 'lucide-react'
import { useApp } from '@/lib/store'
import { metrics, CHART, PALETTE } from '@/lib/metrics'
import { INTERN_STAGES } from '@/lib/types'
import { Button, Card, CardHeader, PageHeader, Stat, Tabs } from '@/components/ui'
import { download, fmtDur, toCSV } from '@/lib/utils'

const tip = { contentStyle: { borderRadius: 10, border: '1px solid #e6e8f0', fontSize: 12 } }
const axis = { tick: { fontSize: 11, fill: CHART.axis }, axisLine: false, tickLine: false } as const
export default function Analytics() {
  const { data, can, toast, update } = useApp(); const m = metrics(data); const [tab, setTab] = useState<'calls' | 'admissions' | 'internships'>('calls')
  const camp = data.campaigns.filter(c => c.targets && c.reached).map(c => ({ name: c.name.length > 22 ? c.name.slice(0, 21) + '…' : c.name, Reached: c.reached, Converted: c.converted }))
  const internStats = INTERN_STAGES.map(s => ({ name: s, value: data.internApps.filter(a => a.stage === s).length }))
  const guard = () => { if (!can('export')) { toast('You do not have export permission', 'error'); return false } return true }
  const exportCSV = () => {
    if (!guard()) return
    const rows = tab === 'calls' ? data.calls.map(c => ({ id: c.id, student: c.student, campaign: c.campaign, status: c.status, outcome: c.outcome, duration_s: c.duration, started: c.startedAt })) : tab === 'admissions' ? data.leads.map(l => ({ id: l.id, name: l.name, course: l.course, stage: l.stage, officer: l.officer, source: l.source })) : data.internApps.map(a => ({ id: a.id, student: a.student, internship: data.internships.find(i => i.id === a.internshipId)?.title, stage: a.stage }))
    download(`admivoice-${tab}-report.csv`, toCSV(rows)); update(d => d, { action: 'Exported CSV report', target: tab }); toast('CSV downloaded')
  }
  const exportPDF = () => { if (!guard()) return; update(d => d, { action: 'Exported PDF report', target: tab }); toast('Choose “Save as PDF” in the print dialog', 'info'); setTimeout(() => window.print(), 400) }
  return (
    <div className="space-y-5">
      <PageHeader title="Analytics & reports" sub="Measure calling performance, admissions conversion and internship activity." actions={<><Button icon={<Download size={15} />} onClick={exportCSV}>Export CSV</Button><Button icon={<FileText size={15} />} onClick={exportPDF}>Export PDF</Button></>} />
      <Tabs value={tab} onChange={setTab} items={[{ id: 'calls', label: 'Calling' }, { id: 'admissions', label: 'Admissions' }, { id: 'internships', label: 'Internships' }]} />
      {tab === 'calls' && <>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5"><Stat label="Total calls" value={m.total} icon={<Phone size={16} />} delta={9} /><Stat label="Answered" value={m.ans} icon={<PhoneCall size={16} />} delta={4} hint={`${Math.round(m.ans / Math.max(1, m.total) * 100)}% rate`} /><Stat label="Missed" value={m.missed} icon={<PhoneMissed size={16} />} delta={-3} /><Stat label="Avg duration" value={fmtDur(m.avgDur)} icon={<Timer size={16} />} delta={2} /><Stat label="AI resolution rate" value={`${m.resolutionRate}%`} icon={<Bot size={16} />} delta={6} /></div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card><CardHeader title="Daily calls" sub="Answered vs missed" /><div className="h-64 px-3 pb-3"><ResponsiveContainer><LineChart data={m.daily}><CartesianGrid stroke={CHART.grid} vertical={false} /><XAxis dataKey="day" {...axis} interval={2} /><YAxis {...axis} width={30} /><Tooltip {...tip} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} /><Line dataKey="Answered" stroke={CHART.brand} strokeWidth={2} dot={false} /><Line dataKey="Missed" stroke={CHART.warn} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></Card>
          <Card><CardHeader title="Campaign performance" sub="Reached vs converted" /><div className="h-64 px-3 pb-3"><ResponsiveContainer><BarChart data={camp} barSize={18}><CartesianGrid stroke={CHART.grid} vertical={false} /><XAxis dataKey="name" {...axis} /><YAxis {...axis} width={34} /><Tooltip {...tip} cursor={{ fill: '#f1f3fa' }} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} /><Bar dataKey="Reached" fill={CHART.brand} radius={[4, 4, 0, 0]} /><Bar dataKey="Converted" fill={CHART.ok} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
        </div></>}
      {tab === 'admissions' && <>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><Stat label="Total leads" value={data.leads.length} icon={<TrendingUp size={16} />} /><Stat label="Admitted + enrolled" value={m.admitted} /><Stat label="Conversion" value={`${m.conv}%`} delta={1.8} /><Stat label="Open follow-ups" value={m.pending.length} /></div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card><CardHeader title="Course-wise demand" /><div className="h-72 px-3 pb-3"><ResponsiveContainer><BarChart data={m.byCourse} layout="vertical" barSize={14} margin={{ left: 30 }}><XAxis type="number" hide /><YAxis type="category" dataKey="name" {...axis} width={120} /><Tooltip {...tip} cursor={{ fill: '#f1f3fa' }} /><Bar dataKey="value" radius={[0, 6, 6, 0]}>{m.byCourse.map((_, i) => <Cell key={i} fill={PALETTE[i % 6]} />)}</Bar></BarChart></ResponsiveContainer></div></Card>
          <Card><CardHeader title="Officer performance" sub="Leads handled and admission rate" /><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-y border-line bg-slate-50/70 text-left text-xs text-ink-3"><th className="px-5 py-2.5 font-medium">Officer</th><th className="px-4 font-medium">Leads</th><th className="px-4 font-medium">Admitted</th><th className="px-5 text-right font-medium">Rate</th></tr></thead><tbody>{m.officers.map(o => <tr key={o.name} className="border-b border-line-2 last:border-0"><td className="px-5 py-3 font-medium">{o.name}</td><td className="px-4">{o.leads}</td><td className="px-4">{o.adm}</td><td className="px-5 text-right font-semibold tabular-nums">{o.rate}%</td></tr>)}</tbody></table></div></Card>
        </div></>}
      {tab === 'internships' && <>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><Stat label="Applications" value={data.internApps.length} /><Stat label="Selected" value={data.internApps.filter(a => ['Selected', 'In Progress', 'Completed'].includes(a.stage)).length} /><Stat label="Interviews" value={data.internApps.filter(a => a.stage === 'Interview').length} /><Stat label="Completion rate" value={`${Math.round(data.internApps.filter(a => a.stage === 'Completed').length / Math.max(1, data.internApps.length) * 100)}%`} /></div>
        <Card><CardHeader title="Applications by stage" /><div className="h-72 px-3 pb-3"><ResponsiveContainer><BarChart data={internStats} barSize={28}><CartesianGrid stroke={CHART.grid} vertical={false} /><XAxis dataKey="name" {...axis} /><YAxis {...axis} width={30} /><Tooltip {...tip} cursor={{ fill: '#f1f3fa' }} /><Bar dataKey="value" fill={CHART.violet} radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Card></>}
    </div>
  )
}
