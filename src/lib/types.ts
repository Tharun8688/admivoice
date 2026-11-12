export type Role = 'super_admin' | 'college_admin' | 'admission_officer' | 'internship_coordinator' | 'read_only'
export const ROLE_LABEL: Record<Role, string> = {
  super_admin: 'Super Admin', college_admin: 'College Admin', admission_officer: 'Admission Officer',
  internship_coordinator: 'Internship Coordinator', read_only: 'Read-Only Management',
}
export type Perm = 'view' | 'calls' | 'admissions' | 'webconnect' | 'contacts' | 'internships' | 'integrations' | 'settings' | 'export'
export const ROLE_PERMS: Record<Role, Perm[]> = {
  super_admin: ['view','calls','admissions','webconnect','contacts','internships','integrations','settings','export'],
  college_admin: ['view','calls','admissions','webconnect','contacts','internships','integrations','settings','export'],
  admission_officer: ['view','calls','admissions','webconnect','contacts','export'],
  internship_coordinator: ['view','internships','contacts','export'],
  read_only: ['view','export'],
}

export const LEAD_STAGES = ['New Enquiry','Contacted','Interested','Application Started','Documents Submitted','Under Review','Admitted','Enrolled'] as const
export type LeadStage = typeof LEAD_STAGES[number]
export const INTERN_STAGES = ['Applied','Under Review','Shortlisted','Interview','Selected','In Progress','Completed'] as const
export type InternStage = typeof INTERN_STAGES[number]

export interface Note { id: string; at: string; by: string; text: string; kind: 'note' | 'call' | 'email' | 'system' }
export interface Lead {
  id: string; name: string; phone: string; email: string; course: string; dept: string; stage: LeadStage
  source: string; officer: string; progress: number; docs: { name: string; status: 'verified' | 'pending' | 'rejected' | 'missing' }[]
  followUp: string | null; createdAt: string; notes: Note[]; score: number
}
export interface TranscriptLine { who: 'ai' | 'student'; text: string; t: number }
export type CallStatus = 'live' | 'completed' | 'missed' | 'failed' | 'scheduled'
export interface Call {
  id: string; student: string; phone: string; campaign: string; status: CallStatus; duration: number; startedAt: string
  outcome: 'Interested' | 'Callback requested' | 'Not interested' | 'Application started' | 'No answer' | 'Wrong number' | 'Pending'
  summary: string; transcript: TranscriptLine[]; direction: 'outbound' | 'inbound'; language: string; sentiment: 'positive' | 'neutral' | 'negative'
}
export interface Campaign {
  id: string; name: string; status: 'active' | 'paused' | 'draft' | 'completed'; script: string; language: string
  window: string; days: string[]; retries: number; retryGap: number; targets: number; reached: number; converted: number
  approved: boolean; course: string; startsAt: string
}
export interface Internship {
  id: string; title: string; dept: string; duration: string; positions: number; filled: number; coordinator: string
  status: 'open' | 'closed' | 'draft'; mode: 'On-campus' | 'Remote' | 'Hybrid'; stipend: string; deadline: string
  description: string; skills: string[]; certTemplate: string
}
export interface InternApp {
  id: string; student: string; email: string; college: string; internshipId: string; stage: InternStage; cgpa: number
  interview: string | null; appliedAt: string; coordinator: string; certificate: 'none' | 'issued' | 'pending'; hours: number; skills: string[]
}
export interface Contact {
  id: string; name: string; type: 'Student' | 'Parent' | 'Applicant' | 'Existing Student'; phone: string; email: string
  tags: string[]; segment: string; city: string; lastContact: string; history: Note[]; custom: Record<string, string>
}
export interface Knowledge {
  id: string; label: string; url: string; kind: 'Website' | 'PDF' | 'FAQ'; status: 'synced' | 'syncing' | 'error' | 'queued'
  lastSync: string | null; pages: number; items: Record<string, number>; error?: string
}
export interface Integration { id: string; name: string; category: string; desc: string; connected: boolean; configured: string; demo: boolean }
export interface AuditLog { id: string; at: string; user: string; role: Role; action: string; target: string }
export interface Notification { id: string; at: string; title: string; body: string; read: boolean; kind: 'info' | 'success' | 'warn' }
export interface Institution { id: string; name: string; short: string; city: string }
export interface InstData {
  leads: Lead[]; calls: Call[]; campaigns: Campaign[]; internships: Internship[]; internApps: InternApp[]
  contacts: Contact[]; knowledge: Knowledge[]; integrations: Integration[]; audit: AuditLog[]; notifications: Notification[]
}
