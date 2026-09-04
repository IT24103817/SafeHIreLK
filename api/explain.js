import Anthropic from '@anthropic-ai/sdk'

/*
  Vercel serverless function: POST /api/explain

  Why this file exists at all.

  The rule is that the API key must never be in the source. A Vite variable
  (VITE_ANYTHING) is compiled into the JavaScript bundle that every visitor
  downloads, so putting the key there would publish it. The browser also
  cannot call the Anthropic API directly without CORS problems.

  So the key lives in a Vercel environment variable named ANTHROPIC_API_KEY,
  read here on the server, where the browser never sees it. This is not a
  backend server we run or host — it is one file that Vercel deploys with the
  same git push as the site.

  Everything in here is optional. If this function is missing, misconfigured,
  slow or broken, the browser hides the AI section and the rules engine
  result is untouched.
*/

// Longest advert we will send. Keeps the request fast and the cost bounded.
const MAX_ADVERT_CHARS = 6000

// Give up before the browser's own 10 second timeout, so the failure is
// clean rather than the connection being cut mid-response.
const API_TIMEOUT_MS = 8500

const SYSTEM_PROMPT = `You are helping Sri Lankan job seekers judge overseas job adverts that may be recruitment fraud.

Many readers are first-time migrant workers — housemaids, drivers, caregivers, construction workers — reading on a phone, in a second language, often while an agent is pressuring them to pay.

Write for that reader. Short sentences. No jargon. Never use the words "algorithm", "heuristic" or "flag".

Reply with ONLY a JSON object, no markdown fence and no text around it:

{
  "tactics": [{ "name": "short name for the tactic", "explanation": "one sentence on how it is being used in THIS advert" }],
  "warning": "2-3 sentences a first-time job seeker would understand, telling them plainly what is going on and what the risk is",
  "next_steps": ["short specific action", "short specific action", "short specific action"]
}

Give between 1 and 4 tactics and exactly 3 next steps. If the advert looks legitimate, say so honestly in the warning rather than inventing problems.`

// Pull the JSON object out of the reply, even if it arrives inside a fence.
function parseAnalysis(text) {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null

  const parsed = JSON.parse(text.slice(start, end + 1))

  // Check the shape before trusting it. A reply that does not match is
  // treated the same as no reply at all.
  const tacticsOk =
    Array.isArray(parsed.tactics) &&
    parsed.tactics.length > 0 &&
    parsed.tactics.every(
      (tactic) =>
        tactic &&
        typeof tactic.name === 'string' &&
        typeof tactic.explanation === 'string'
    )

  const warningOk =
    typeof parsed.warning === 'string' && parsed.warning.trim() !== ''

  const stepsOk =
    Array.isArray(parsed.next_steps) &&
    parsed.next_steps.length > 0 &&
    parsed.next_steps.every((step) => typeof step === 'string')

  if (!tacticsOk || !warningOk || !stepsOk) return null

  return {
    tactics: parsed.tactics.slice(0, 4),
    warning: parsed.warning,
    next_steps: parsed.next_steps.slice(0, 3),
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  // No key configured on this deployment. Not an error worth shouting about —
  // the app simply runs without the AI layer.
  if (!process.env.ANTHROPIC_API_KEY) {
    return response.status(503).json({ error: 'AI analysis is not configured' })
  }

  const advert = request.body?.advert
  const ruleFlags = Array.isArray(request.body?.ruleFlags)
    ? request.body.ruleFlags.slice(0, 8)
    : []

  if (typeof advert !== 'string' || advert.trim().length < 30) {
    return response.status(400).json({ error: 'No advert text supplied' })
  }

  try {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      timeout: API_TIMEOUT_MS, // milliseconds in the TypeScript/JavaScript SDK
      maxRetries: 0, // a retry would blow past the browser's timeout
    })

    const flagContext =
      ruleFlags.length > 0
        ? '\n\nOur own checks already flagged: ' + ruleFlags.join('; ') + '.'
        : ''

    const message = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      output_config: { effort: 'low' }, // a short task; keeps it inside the timeout
      messages: [
        {
          role: 'user',
          content:
            'Here is the job advertisement:\n\n' +
            advert.slice(0, MAX_ADVERT_CHARS) +
            flagContext,
        },
      ],
    })

    // A safety refusal returns HTTP 200, so check before reading the content.
    if (message.stop_reason === 'refusal') {
      return response.status(502).json({ error: 'No analysis available' })
    }

    const text = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')

    const analysis = parseAnalysis(text)
    if (analysis === null) {
      return response.status(502).json({ error: 'No analysis available' })
    }

    return response.status(200).json(analysis)
  } catch (error) {
    // Any failure at all — bad key, rate limit, timeout, network — is handled
    // the same way. The browser hides the section and the rules result stands.
    return response.status(502).json({ error: 'No analysis available' })
  }
}
