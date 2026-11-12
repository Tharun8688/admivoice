export interface Enquiry { id: string; name: string; phone: string; email: string; city: string; course: string; time: string; message: string; at: string }
const KEY = 'admivoice.enquiries'
export const loadEnquiries = (): Enquiry[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
export const saveEnquiries = (e: Enquiry[]) => { try { localStorage.setItem(KEY, JSON.stringify(e)) } catch { /* ignore */ } }
