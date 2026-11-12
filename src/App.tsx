import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from '@/lib/store'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import { PageSkeleton } from '@/components/ui'
const Overview = lazy(() => import('@/pages/Overview'))
const Voice = lazy(() => import('@/pages/Voice'))
const Admissions = lazy(() => import('@/pages/Admissions'))
const WebConnect = lazy(() => import('@/pages/WebConnect'))
const Contacts = lazy(() => import('@/pages/Contacts'))
const Analytics = lazy(() => import('@/pages/Analytics'))
const Internships = lazy(() => import('@/pages/Internships'))
const Integrations = lazy(() => import('@/pages/Integrations'))
const SettingsPage = lazy(() => import('@/pages/Settings'))

function Routed() {
  const { session } = useApp()
  if (!session) return <Login />
  return (
    <Suspense fallback={<div className="p-8"><PageSkeleton /></div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Overview />} /><Route path="voice" element={<Voice />} /><Route path="admissions" element={<Admissions />} />
          <Route path="webconnect" element={<WebConnect />} /><Route path="contacts" element={<Contacts />} /><Route path="analytics" element={<Analytics />} />
          <Route path="internships" element={<Internships />} /><Route path="integrations" element={<Integrations />} /><Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
export default function App() { return <AppProvider><HashRouter><Routed /></HashRouter></AppProvider> }
