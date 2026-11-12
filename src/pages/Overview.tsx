import { Link, useNavigate } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { PhoneCall, Users, CheckCircle2, Clock, UserPlus, TrendingUp, ArrowRight, Plus, Sparkles, Briefcase, Globe } from 'lucide-react'
import { useApp } from '@/lib/store'
import { metrics, CHART, PALETTE } from '@/lib/metrics'
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, Stat, Progress } from '@/components/ui'
import { ago, fmtDur, fmtDateTime } from '@/lib/utils'
import { SIM_LIVE, useTick } from '@/lib/useSim'

const tip = { contentStyle: { borderRadius: 10, border: '1px solid #e6e8f0', fontSize: 12, boxShadow: '0 8px 24px rgba(15,23,42,.1)' } }
const axis = { tick: { fontSize: 11, fill: CHART.axis }, axisLine: false, tickLine: false } as const

export default function Overview() {
  const { data, session, can } = useApp(); const m = metrics(data); const nav = useNavigate(); const t = useTick()
  const newApplicants = data.leads.filter(l => l.stage === 'Application Started').length
  const hour = new Date().getHours(); const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const callsToday = Math.max(m.today.length, 0) + 118
  const success = m.total ? Math.round(m.ans / m.total * 100) : 0
  const live = SIM_LIVE
  const pieData = [{ name: 'Answered', value: m.ans }, { name: 'Missed', value: m.missed }, { name: 'Failed', value: m.failed }]
  return (
    <div className="space-y-6">
      <PageHeader title={`${greet}, ${session?.name.split(' ')[0]}`} sub="All admission communication is under control. AI is handling repetitive calling and enquiry workflows."
        actions={<>{can('internships') && <Button icon={<Briefcase size={15} />} onClick={() => nav('/internships')}>Internships</Button>}
          {can('calls') && <Button variant="primary" icon={<Plus size={15} />} onClick={() => nav('/voice?new=1')}>New AI call</Button>}</>} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="Admission enquiries" value={data.leads.length * 19 + 36} delta={12.4} icon={<Users size={16} />} />
        <Stat label="Calls made today" value={callsToday} delta={8.1} icon={<PhoneCall size={16} />} />
        <Stat label="Successful conversations" value={`${success}%`} delta={3.2} icon={<CheckCircle2 size={16} />} hint={`${m.ans} of ${m.total} calls`} />
        <Stat label="Pending follow-ups" value={m.pending.length} delta={-5.6} icon={<Clock size={16} />} />
        <Stat label="New applicants" value={newApplicants + 14} delta={18.9} icon={<UserPlus size={16} />} />
        <Stat label="Conversion rate" value={`${m.conv}%`} delta={1.8} icon={<TrendingUp size={16} />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="AI calling activity" sub="Last 14 days — answered, missed and failed calls" action={<Badge tone="brand">Simulated trend</Badge>} />
          <div className="h-64 px-3 pb-3"><ResponsiveContainer><BarChart data={m.daily} barSize={14}>
            <CartesianGrid stroke={CHART.grid} vertical={false} /><XAxis dataKey="day" {...axis} interval={1} /><YAxis {...axis} width={30} /><Tooltip {...tip} cursor={{ fill: '#f1f3fa' }} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Answered" stackId="a" fill={CHART.brand} /><Bar dataKey="Missed" stackId="a" fill={CHART.warn} /><Bar dataKey="Failed" stackId="a" fill={CHART.bad} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <CardHeader title={<span className="flex items-center gap-2">Live AI voice activity <span className="h-2 w-2 rounded-full bg-ok-500 animate-pulseRing" /></span>} sub="Simulated — no real calls placed in demo mode" />
          <ul className="space-y-1 px-3 pb-3">
            {live.map(c => <li key={c.id}><Link to="/voice" className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50">
              <Avatar name={c.student} /><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{c.student}</p><p className="truncate text-xs text-ink-3">{c.campaign}</p></div>
              <div className="text-right"><p className="font-mono text-[13px] tabular-nums text-ok-600">{fmtDur(c.start + t)}</p><div className="flex h-3 items-end justify-end gap-0.5">{[0, 1, 2, 3].map(i => <span key={i} style={{ animationDelay: `${i * 120}ms` }} className="h-3 w-0.5 origin-bottom rounded bg-ok-500 animate-wave" />)}</div></div></Link></li>)}
          </ul>
          <div className="border-t border-line px-5 py-3 text-xs text-ink-3">3 active · 12 in queue · AI assistant <span className="font-medium text-ok-600">online</span></div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Admission enquiry trends" sub="Enquiries vs applications started, last 30 days" />
          <div className="h-64 px-3 pb-3"><ResponsiveContainer><AreaChart data={m.trend}>
            <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={CHART.brand} stopOpacity={0.25} /><stop offset="100%" stopColor={CHART.brand} stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid stroke={CHART.grid} vertical={false} /><XAxis dataKey="day" {...axis} interval={4} /><YAxis {...axis} width={30} /><Tooltip {...tip} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Area dataKey="Enquiries" stroke={CHART.brand} strokeWidth={2} fill="url(#g1)" /><Area dataKey="Applications" stroke={CHART.violet} strokeWidth={2} fill="none" /></AreaChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <CardHeader title="Call success vs failure" sub="All recorded calls" />
          <div className="relative h-52"><ResponsiveContainer><PieChart><Pie data={pieData} dataKey="value" innerRadius={58} outerRadius={80} paddingAngle={3} stroke="none">{pieData.map((_, i) => <Cell key={i} fill={[CHART.brand, CHART.warn, CHART.bad][i]} />)}</Pie><Tooltip {...tip} /></PieChart></ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-semibold">{success}%</span><span className="text-xs text-ink-3">answered</span></div></div>
          <div className="flex justify-center gap-4 pb-4 text-xs text-ink-2">{pieData.map((p, i) => <span key={p.name} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: [CHART.brand, CHART.warn, CHART.bad][i] }} />{p.name} {p.value}</span>)}</div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Lead conversion funnel" sub="Leads reaching each stage" />
          <ul className="space-y-2.5 px-5 pb-5">{m.funnel.map((f, i) => <li key={f.stage}><div className="mb-1 flex justify-between text-xs"><span className="text-ink-2">{f.stage}</span><span className="font-medium tabular-nums">{f.count}</span></div>
            <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${f.count / Math.max(1, m.funnel[0].count) * 100}%`, background: `hsl(${245 + i * 4} ${70 - i * 3}% ${62 - i * 3}%)` }} /></div></li>)}</ul>
        </Card>
        <Card>
          <CardHeader title="Department-wise enquiries" />
          <div className="h-64 px-3 pb-3"><ResponsiveContainer><BarChart data={m.byDept} layout="vertical" barSize={14} margin={{ left: 20 }}>
            <XAxis type="number" hide /><YAxis type="category" dataKey="name" {...axis} width={110} /><Tooltip {...tip} cursor={{ fill: '#f1f3fa' }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>{m.byDept.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}</Bar></BarChart></ResponsiveContainer></div>
        </Card>
        <Card>
          <CardHeader title="Upcoming follow-ups" action={<Link to="/admissions" className="flex items-center gap-1 text-xs font-medium text-brand-600">View all <ArrowRight size={12} /></Link>} />
          <ul className="px-3 pb-3">{m.pending.slice(0, 5).map(l => <li key={l.id}><Link to={`/admissions?lead=${l.id}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50"><Avatar name={l.name} size={30} /><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{l.name}</p><p className="truncate text-xs text-ink-3">{l.course}</p></div><Badge tone={new Date(l.followUp!) < new Date() ? 'bad' : 'warn'}>{ago(l.followUp!)}</Badge></Link></li>)}</ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent admission enquiries" action={<Link to="/admissions" className="flex items-center gap-1 text-xs font-medium text-brand-600">Open admissions <ArrowRight size={12} /></Link>} />
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-y border-line bg-slate-50/70 text-left text-xs text-ink-3"><th className="px-5 py-2.5 font-medium">Student</th><th className="px-4 font-medium">Course</th><th className="px-4 font-medium">Source</th><th className="px-4 font-medium">Stage</th><th className="px-5 text-right font-medium">Received</th></tr></thead>
          <tbody>{[...data.leads].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6).map(l => <tr key={l.id} onClick={() => nav(`/admissions?lead=${l.id}`)} className="cursor-pointer border-b border-line-2 last:border-0 hover:bg-slate-50"><td className="px-5 py-3"><span className="flex items-center gap-2.5"><Avatar name={l.name} size={28} /><span className="font-medium">{l.name}</span></span></td><td className="px-4 text-ink-2">{l.course}</td><td className="px-4 text-ink-2">{l.source}</td><td className="px-4"><Badge tone="brand">{l.stage}</Badge></td><td className="px-5 text-right text-xs text-ink-3">{ago(l.createdAt)}</td></tr>)}</tbody></table></div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/webconnect"><Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-pop"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet2-50 text-violet-600"><Globe size={18} /></span><div className="flex-1"><p className="font-medium">WebConnect knowledge</p><p className="text-xs text-ink-3">{data.knowledge.filter(k => k.status === 'synced').length} of {data.knowledge.length} sources synced · {data.knowledge.some(k => k.status === 'error') ? '1 needs attention' : 'healthy'}</p></div><ArrowRight size={16} className="text-ink-4" /></Card></Link>
        <Link to="/internships"><Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-pop"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Sparkles size={18} /></span><div className="flex-1"><p className="font-medium">Internships</p><p className="text-xs text-ink-3">{data.internApps.filter(a => a.stage === 'In Progress').length} active interns · {data.internships.filter(i => i.status === 'open').length} open programmes</p></div><ArrowRight size={16} className="text-ink-4" /></Card></Link>
      </div>
    </div>
  )
}
