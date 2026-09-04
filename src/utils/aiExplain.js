/*
  Owner: B — the optional AI layer.

  This is the only place in the app that touches the network. Everything else
  works with the wifi unplugged.

  The contract for this function is simple on purpose: it returns an analysis,
  or it returns null. There is no error object and nothing for a caller to
  handle, because on any failure the AI section is hidden and the rules result
  is left exactly as it was.
*/

const TIMEOUT_MS = 10000

export async function explainAdvert(advertText, ruleFlags) {
  // AbortController is what actually enforces the timeout. Without it a slow
  // network would leave the loading spinner running forever.
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ advert: advertText, ruleFlags }),
      signal: controller.signal,
    })

    if (!response.ok) return null

    const data = await response.json()

    // Check the shape here too. The page should never try to render a reply
    // that arrived in the wrong form.
    if (!Array.isArray(data.tactics) || data.tactics.length === 0) return null
    if (typeof data.warning !== 'string' || data.warning === '') return null
    if (!Array.isArray(data.next_steps) || data.next_steps.length === 0) {
      return null
    }

    return data
  } catch (error) {
    // Timed out, offline, blocked by campus wifi, function not deployed,
    // reply was not JSON. All the same outcome: no AI section.
    return null
  } finally {
    clearTimeout(timer)
  }
}
