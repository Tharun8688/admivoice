import { useEffect, useState } from 'react'
/** Ticks every second – drives clearly-labelled simulated live call activity. */
export function useTick(ms = 1000) { const [t, setT] = useState(0); useEffect(() => { const i = setInterval(() => setT(x => x + 1), ms); return () => clearInterval(i) }, [ms]); return t }
export const SIM_LIVE = [
  { id: 'live-1', student: 'Ananya Reddy', phone: '+91 98765 43210', campaign: 'B.Tech 2026 Early Bird', start: 74, lang: 'English' },
  { id: 'live-2', student: 'Rohan Patel', phone: '+91 91234 56780', campaign: 'MBA Admissions Drive', start: 31, lang: 'Hindi' },
  { id: 'live-3', student: 'Kavya Nair', phone: '+91 99887 76655', campaign: 'B.Tech 2026 Early Bird', start: 142, lang: 'Telugu' },
]
