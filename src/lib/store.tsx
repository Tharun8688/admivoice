import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { InstData, Role, Perm, AuditLog } from './types'
import { ROLE_PERMS } from './types'
import { INSTITUTIONS, buildInstitution } from '@/data/seed'
import { uid } from './utils'

interface Session { name: string; email: string; role: Role }
interface Toast { id: string; kind: 'success' | 'error' | 'info'; text: string }
interface Ctx {
  session: Session | null; login: (s: Session) => void; logout: () => void; setRole: (r: Role) => void
  instId: string; setInstId: (id: string) => void; data: InstData
  update: (fn: (d: InstData) => InstData, audit?: { action: string; target: string }) => void
  can: (p: Perm) => boolean; toast: (text: string, kind?: Toast['kind']) => void; toasts: Toast[]; dismiss: (id: string) => void
  resetDemo: () => void; loading: boolean
}
const C = createContext<Ctx>(null as never)
export const useApp = () => useContext(C)
const KEY = 'admivoice.v1'

function load(): { session: Session | null; instId: string; store: Record<string, InstData> } {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw) } catch { /* ignore */ }
  return { session: null, instId: INSTITUTIONS[0].id, store: {} }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(load)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [loading, setLoading] = useState(false)
  const idx = Math.max(0, INSTITUTIONS.findIndex(i => i.id === state.instId))
  const data = useMemo(() => state.store[state.instId] ?? buildInstitution(idx), [state.store, state.instId, idx])

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* quota */ } }, [state])

  const toast = useCallback((text: string, kind: Toast['kind'] = 'success') => {
    const id = uid(); setToasts(t => [...t, { id, kind, text }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])
  const dismiss = useCallback((id: string) => setToasts(t => t.filter(x => x.id !== id)), [])

  const update: Ctx['update'] = useCallback((fn, audit) => {
    setState(s => {
      const i = Math.max(0, INSTITUTIONS.findIndex(x => x.id === s.instId))
      let next = fn(s.store[s.instId] ?? buildInstitution(i))
      if (audit && s.session) {
        const entry: AuditLog = { id: uid(), at: new Date().toISOString(), user: s.session.name, role: s.session.role, ...audit }
        next = { ...next, audit: [entry, ...next.audit].slice(0, 200) }
      }
      return { ...s, store: { ...s.store, [s.instId]: next } }
    })
  }, [])

  const value: Ctx = {
    session: state.session, instId: state.instId, data, loading, toasts, toast, dismiss, update,
    login: s => setState(p => ({ ...p, session: s })),
    logout: () => setState(p => ({ ...p, session: null })),
    setRole: role => setState(p => p.session ? { ...p, session: { ...p.session, role } } : p),
    setInstId: id => { setLoading(true); setState(p => ({ ...p, instId: id })); setTimeout(() => setLoading(false), 450) },
    can: p => !!state.session && ROLE_PERMS[state.session.role].includes(p),
    resetDemo: () => { setState(p => ({ ...p, store: {} })); toast('Demo data reset') },
  }
  return <C.Provider value={value}>{children}</C.Provider>
}
