import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, PhoneCall, GraduationCap, Globe, Users, BarChart3, Briefcase, Plug, Settings, Search, Bell, ChevronsUpDown, Menu, Check, LogOut, Shield, Command, RotateCcw, Waves } from 'lucide-react'
import { useApp } from '@/lib/store'
import { INSTITUTIONS } from '@/data/seed'
import { ROLE_LABEL, type Role } from '@/lib/types'
import { Avatar, Dropdown, MenuItem, IconButton, Modal, Badge, PageSkeleton, Toasts } from './ui'
import { cn, ago } from '@/lib/utils'

export const NAV = [
  { to: '/voice', label: 'AI Voice', icon: PhoneCall },
  { to: '/admissions', label: 'Admissions', icon: GraduationCap },
  { to: '/webconnect', label: 'WebConnect', icon: Globe },
  { to: '/contacts', label: 'Contacts', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/internships', label: 'Internships', icon: Briefcase },
  { to: '/integrations', label: 'Integrations', icon: Plug },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Logo({ light }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet2-500 shadow-md"><Waves size={17} className="text-white" /></div>
      <span className={cn('text-[17px] font-semibold tracking-tight', light ? 'text-white' : 'text-ink')}>Admivoice</span>
    </div>
  )
}

function SidebarBody({ onNav }: { onNav?: () => void }) {
  const { data, session } = useApp()
  const live = data.calls.filter(c => c.status === 'live').length
  return (
    <div className="flex h-full flex-col bg-navy-900 text-slate-300">
      <div className="px-5 pt-5 pb-6"><Logo light /></div>
      <nav className="flex-1 space-y-0.5 px-3" aria-label="Main">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} onClick={onNav}
            className={({ isActive }) => cn('group flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-all', isActive ? 'bg-white/10 text-white shadow-[inset_2px_0_0_#818cf8]' : 'hover:bg-white/5 hover:text-white')}>
            <n.icon size={17} className="opacity-80" />{n.label}
            {n.to === '/voice' && <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-500/15 px-1.5 text-[10px] font-semibold text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />LIVE</span>}
            {n.to === '/internships' && <span className="ml-auto rounded-full bg-violet2-500/20 px-1.5 text-[10px] font-semibold text-violet-300">NEW</span>}
          </NavLink>))}
      </nav>
      <div className="m-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-2 text-xs"><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="font-medium text-white">Demo mode</span></div>
        <p className="mt-1 text-[11.5px] leading-snug text-slate-400">Telephony &amp; voice providers aren't connected. Calls are simulated.</p>
      </div>
      <div className="px-5 pb-4 text-[11px] text-slate-500">{session?.role && ROLE_LABEL[session.role]}</div>
    </div>
  )
}

function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data } = useApp(); const nav = useNavigate(); const [q, setQ] = useState(''); const [i, setI] = useState(0)
  useEffect(() => { if (open) { setQ(''); setI(0) } }, [open])
  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    const pages = NAV.map(n => ({ label: n.label, sub: 'Page', to: n.to }))
    if (!s) return pages
    return [
      ...pages.filter(p => p.label.toLowerCase().includes(s)),
      ...data.leads.filter(l => (l.name + l.phone + l.course + l.id).toLowerCase().includes(s)).slice(0, 5).map(l => ({ label: l.name, sub: `Lead · ${l.course}`, to: `/admissions?lead=${l.id}` })),
      ...data.contacts.filter(c => (c.name + c.phone + c.email).toLowerCase().includes(s)).slice(0, 4).map(c => ({ label: c.name, sub: `Contact · ${c.type}`, to: `/contacts?q=${encodeURIComponent(c.name)}` })),
      ...data.internships.filter(x => x.title.toLowerCase().includes(s)).slice(0, 3).map(x => ({ label: x.title, sub: 'Internship', to: '/internships' })),
      ...data.campaigns.filter(x => x.name.toLowerCase().includes(s)).slice(0, 3).map(x => ({ label: x.name, sub: 'Campaign', to: '/voice' })),
    ]
  }, [q, data])
  const go = (to: string) => { nav(to); onClose() }
  return (
    <Modal open={open} onClose={onClose} title="Search Admivoice" width={560}>
      <input autoFocus value={q} onChange={e => { setQ(e.target.value); setI(0) }} placeholder="Search leads, contacts, internships, campaigns, pages…" aria-label="Global search"
        onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); setI(x => Math.min(results.length - 1, x + 1)) } if (e.key === 'ArrowUp') { e.preventDefault(); setI(x => Math.max(0, x - 1)) } if (e.key === 'Enter' && results[i]) go(results[i].to) }}
        className="h-10 w-full rounded-lg border border-line px-3 text-sm focus:border-brand-500" />
      <ul className="mt-3 max-h-80 overflow-y-auto" role="listbox">
        {results.length === 0 && <li className="py-8 text-center text-sm text-ink-3">No matches for “{q}”</li>}
        {results.map((r, k) => <li key={r.to + r.label + k} role="option" aria-selected={k === i}><button onMouseEnter={() => setI(k)} onClick={() => go(r.to)} className={cn('flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm', k === i && 'bg-brand-50')}><span className="font-medium">{r.label}</span><span className="text-xs text-ink-3">{r.sub}</span></button></li>)}
      </ul>
    </Modal>
  )
}

function Topbar({ onMenu, onSearch }: { onMenu: () => void; onSearch: () => void }) {
  const { session, logout, instId, setInstId, data, update, setRole, resetDemo, toast } = useApp(); const nav = useNavigate()
  const inst = INSTITUTIONS.find(i => i.id === instId)!; const unread = data.notifications.filter(n => !n.read).length
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-white/85 px-3 sm:px-6 backdrop-blur">
      <IconButton label="Open menu" className="lg:hidden" onClick={onMenu}><Menu size={18} /></IconButton>
      <Dropdown align="left" width={290} trigger={() => (
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100" aria-label="Switch institution">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-navy-900 text-[10px] font-bold text-white">{inst.short.slice(0, 3)}</span>
          <span className="hidden sm:block text-left leading-tight"><span className="block text-[13px] font-semibold max-w-[200px] truncate">{inst.name}</span><span className="block text-[11px] text-ink-3">{inst.city}</span></span>
          <ChevronsUpDown size={14} className="text-ink-4" /></button>)}>
        {close => <><p className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-4">Institutions</p>
          {INSTITUTIONS.map(i => <MenuItem key={i.id} active={i.id === instId} onClick={() => { if (i.id !== instId) { setInstId(i.id); toast(`Switched to ${i.name}`, 'info') } close() }} icon={<span className="flex h-6 w-6 items-center justify-center rounded bg-navy-900 text-[9px] font-bold text-white">{i.short.slice(0, 3)}</span>}><span className="flex-1">{i.name}</span>{i.id === instId && <Check size={14} />}</MenuItem>)}
          <p className="px-2.5 py-1.5 text-[11px] text-ink-4">Data is isolated per institution.</p></>}
      </Dropdown>
      <button onClick={onSearch} className="ml-2 hidden h-9 flex-1 max-w-md items-center gap-2 rounded-lg border border-line bg-slate-50 px-3 text-sm text-ink-3 hover:border-slate-300 md:flex" aria-label="Open global search">
        <Search size={15} /><span className="flex-1 text-left">Search leads, contacts, campaigns…</span><kbd className="flex items-center gap-0.5 rounded border border-line bg-white px-1.5 text-[11px]"><Command size={10} />K</kbd></button>
      <div className="flex-1 md:hidden" />
      <IconButton label="Search" className="md:hidden" onClick={onSearch}><Search size={18} /></IconButton>
      <Dropdown width={340} trigger={() => <button aria-label="Notifications" className="relative flex h-8 w-8 items-center justify-center rounded-lg text-ink-3 hover:bg-slate-100"><Bell size={18} />{unread > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white" />}</button>}>
        {close => <>
          <div className="flex items-center justify-between px-2.5 py-1.5"><span className="text-sm font-semibold">Notifications</span><button className="text-xs text-brand-600 hover:underline" onClick={() => update(d => ({ ...d, notifications: d.notifications.map(n => ({ ...n, read: true })) }))}>Mark all read</button></div>
          {data.notifications.map(n => <button key={n.id} onClick={() => { update(d => ({ ...d, notifications: d.notifications.map(x => x.id === n.id ? { ...x, read: true } : x) })); close(); nav(n.title.includes('Knowledge') ? '/webconnect' : n.title.includes('follow') ? '/admissions' : '/voice') }} className="flex w-full gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50">
            <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-slate-200' : n.kind === 'warn' ? 'bg-warn-500' : n.kind === 'success' ? 'bg-ok-500' : 'bg-brand-500')} />
            <span><span className="block text-[13px] font-medium">{n.title}</span><span className="block text-xs text-ink-3">{n.body}</span><span className="text-[11px] text-ink-4">{ago(n.at)}</span></span></button>)}
        </>}
      </Dropdown>
      <Dropdown width={250} trigger={() => <button className="rounded-full" aria-label="Profile menu"><Avatar name={session?.name ?? 'U'} size={32} /></button>}>
        {close => <>
          <div className="px-2.5 py-2"><p className="text-sm font-semibold">{session?.name}</p><p className="text-xs text-ink-3">{session?.email}</p><Badge tone="brand" className="mt-1.5">{session && ROLE_LABEL[session.role]}</Badge></div>
          <div className="my-1 border-t border-line" />
          <p className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-ink-4">Preview as role</p>
          {(Object.keys(ROLE_LABEL) as Role[]).map(r => <MenuItem key={r} active={r === session?.role} icon={<Shield size={14} />} onClick={() => { setRole(r); toast(`Now viewing as ${ROLE_LABEL[r]}`, 'info'); close() }}>{ROLE_LABEL[r]}</MenuItem>)}
          <div className="my-1 border-t border-line" />
          <MenuItem icon={<Settings size={14} />} onClick={() => { nav('/settings'); close() }}>Settings</MenuItem>
          <MenuItem icon={<RotateCcw size={14} />} onClick={() => { resetDemo(); close() }}>Reset demo data</MenuItem>
          <MenuItem icon={<LogOut size={14} />} danger onClick={() => { logout(); close() }}>Sign out</MenuItem>
        </>}
      </Dropdown>
    </header>
  )
}

export default function Layout() {
  const [drawer, setDrawer] = useState(false); const [search, setSearch] = useState(false); const loc = useLocation(); const { loading } = useApp()
  useEffect(() => { setDrawer(false); window.scrollTo(0, 0) }, [loc.pathname])
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch(s => !s) } }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [])
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 lg:block"><SidebarBody /></aside>
      {drawer && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-navy-950/50" onClick={() => setDrawer(false)} /><div className="absolute inset-y-0 left-0 w-64 animate-fadeUp"><SidebarBody onNav={() => setDrawer(false)} /></div></div>}
      <div className="lg:pl-60">
        <Topbar onMenu={() => setDrawer(true)} onSearch={() => setSearch(true)} />
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 animate-fadeUp" key={loc.pathname}>{loading ? <PageSkeleton /> : <Outlet />}</main>
      </div>
      <SearchPalette open={search} onClose={() => setSearch(false)} />
      <Toasts />
    </div>
  )
}
