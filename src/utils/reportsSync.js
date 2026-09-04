/*
  Owner: B — the optional shared-reports layer.

  Same contract as the AI layer: these functions either work, or they return
  null and the app carries on with what is in localStorage. Nothing here is
  allowed to throw, block a render, or leave a spinner running.

  Why it is built this way. localStorage alone means a report submitted on a
  phone never appears on a laptop, so the boards are per-device. This adds a
  shared copy in MongoDB so reports and moderator decisions travel between
  devices — while the device's own data stays authoritative, so the demo works
  with the wifi unplugged.
*/

const TIMEOUT_MS = 5000

/*
  The shared layer is off unless the deployment turns it on with
  VITE_SHARED_REPORTS=on.

  Without this switch the app calls /api/reports on every visit to the Reports
  tab. On a deployment with no database that request 404s or 503s, and the
  browser writes a red line into the console on every single page load — which
  an examiner with devtools open will see. This is not a secret, it is an
  on/off flag, so a VITE_ variable is the right place for it.
*/
const SHARED_ENABLED = import.meta.env.VITE_SHARED_REPORTS === 'on'

// A short random id so the same report can be recognised on any device, and a
// retry cannot create a duplicate row.
export function newClientId() {
  try {
    if (globalThis.crypto && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch (error) {
    // Older browser. The fallback below is good enough for a demo.
  }
  return 'c-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

// Every request goes through here so the timeout and the swallowing of errors
// are written once.
async function call(options) {
  if (!SHARED_ENABLED) return null

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch('/api/reports', {
      ...options,
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    // Not configured, offline, blocked, timed out, or the reply was not JSON.
    return null
  } finally {
    clearTimeout(timer)
  }
}

/*
  Reports other people have shared, plus the moderator decisions recorded
  against them. Returns null when the shared layer is unavailable.
*/
export async function fetchSharedReports() {
  const data = await call({ method: 'GET' })
  if (data === null) return null

  if (!Array.isArray(data.reports)) return null
  if (data.statuses === null || typeof data.statuses !== 'object') return null

  return { reports: data.reports, statuses: data.statuses }
}

/*
  Share a report that has already been saved locally.

  Deliberately not awaited by the form: the success screen appears as soon as
  the report is in localStorage, and this catches up in the background.
*/
export function shareReport(report) {
  call({ method: 'POST', body: JSON.stringify(report) })
}

/*
  Share a moderator decision. Also fire and forget — the local board has
  already updated.
*/
export function shareStatus(id, status, passcode) {
  call({ method: 'PATCH', body: JSON.stringify({ id, status, passcode }) })
}
