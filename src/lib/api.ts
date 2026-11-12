/** Web3Forms public access key (designed to be used client-side). Submissions are emailed to the key owner. */
const WEB3FORMS_KEY = 'e1a27e4d-2f69-4a8d-b2d0-7f6a3db3febe'
export async function submitToWeb3Forms(fields: Record<string, string>, subject: string): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: 'Admivoice website', ...fields }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && data.success !== false) return { ok: true, message: 'Sent' }
    return { ok: false, message: data.message || 'Could not send. Please try again.' }
  } catch { return { ok: false, message: 'Network error. Check your connection and try again.' } }
}
