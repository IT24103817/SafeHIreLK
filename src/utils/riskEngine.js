/*
  Owner: B — the rules engine that scores a pasted job advert.

  This file is the product. It is a pure function over a string: same text in,
  same score out. No network call, no API key, no async. It works with the
  wifi unplugged, and the optional AI layer can only add explanation on top of
  what this already decided.

  scoreAdvert(text) -> { score, band, flags, passed }
*/

const MAX_SCORE = 100

// A salary above this, for a job that needs no qualifications, is the number
// used to draw people in. Real Gulf driver and housemaid packages sit well
// below it.
const SALARY_ALARM_LKR = 250000

/*
  Find the first pattern that matches, and remember where it matched so we can
  show the phrase in its context later.

  The patterns must not use the /g flag. A global regex remembers lastIndex
  between calls and would skip matches on the second advert scanned.
*/
function findAny(text, patterns) {
  for (const pattern of patterns) {
    const match = pattern.exec(text)
    if (match !== null) {
      return { phrase: match[0].trim(), index: match.index }
    }
  }
  return null
}

// A mobile number: 07 followed by 8 more characters. X is allowed because our
// sample data masks the last digits.
const MOBILE_NUMBER = /\b0?7[\dX][\s-]?[\dX]{7}\b/i

// A fixed line: 0, then two digits that are not 7, then 7 more.
const FIXED_LINE = /\b0(?!7)[\dX]{2}[\s-]?[\dX]{7}\b/i

// An SLBFE licence, written any of the ways an advert might write it.
const LICENCE_PATTERNS = [
  /\bFE\s*[/\-]?\s*\d{3,5}\b/i,
  /licen[cs]e\s*(?:no|number|#)?\s*[:.\-]?\s*[A-Z]{0,3}\s*[/\-]?\s*\d{3,}/i,
  /\bSLBFE\b[^.\n]{0,30}\d{3,}/i,
]

// Jobs advertised as needing no qualifications, where a huge salary is bait.
const LOW_SKILL_ROLE =
  /\b(driver|housemaid|house maid|maid|cleaner|helper|labou?r|caregiver|care giver|security guard|waiter|packer|construction|farm work)\b/i

/*
  The eight checks, in the order they are shown to the user.

  Each rule owns its own detection. `find` returns where it matched, or null
  when the advert is clean on that point. Two of the rules are the other way
  round: they fire because something is missing.
*/
export const RULES = [
  {
    id: 'upfront_payment',
    label: 'Upfront payment requested before the job is confirmed',
    points: 25,
    advice:
      'A licensed agency collects its fee after the job order and visa are confirmed, and gives you a receipt. Do not pay to hold a slot.',
    passLabel: 'No payment is demanded before the job is confirmed',
    /*
      A fee on its own is not a red flag — licensed agencies charge fees too,
      after the job order is confirmed. What matters is being asked to pay
      *before* anything is confirmed, so each pattern needs the fee AND a sign
      that the money is wanted up front.

      Without that second half, "Agency fees are payable only after the visa
      is approved" scores 25 points, which is exactly backwards.
    */
    find: (text) =>
      findAny(text, [
        // A named fee, with an "up front" signal close by.
        /\b(?:registration|processing|service|booking|agency|documentation|placement)\s*(?:fee|charge)s?[^.\n]{0,60}?\b(?:in\s*advance|advance|before|first|upfront|up\s*front|now|to\s*(?:confirm|reserve|book|secure))\b/i,
        // A named fee quoting a rupee amount. "agency fee" is left out here on
        // purpose, because that is the legitimate industry term.
        /\b(?:registration|processing|service|booking|documentation|placement)\s*(?:fee|charge)s?[^.\n]{0,30}(?:rs\.?|lkr)\s*[\d,]{4,}/i,
        /\b(?:advance|initial|first)\s*payment\b/i,
        /\bpay(?:ment)?\s*(?:in\s*)?advance\b/i,
        /\bpay\s*(?:rs\.?|lkr)?\s*[\d,]{4,}[^.\n]{0,40}\b(?:to\s*(?:confirm|reserve|book)|first|before)\b/i,
        /\b(?:to\s*(?:confirm|reserve|book)|before\s*(?:the\s*)?(?:visa|departure))[^.\n]{0,40}\b(?:pay|deposit|fee)\b/i,
        /\bdeposit\s*(?:of\s*)?(?:rs\.?|lkr)?\s*[\d,]{4,}/i,
      ]),
  },
  {
    id: 'no_licence_number',
    label: 'No SLBFE licence number anywhere in the advert',
    points: 20,
    advice:
      'Every licensed agency must show its licence number. Ask for it, then check it on the Verify tab or call the hotline 1989.',
    passLabel: 'An SLBFE licence number is shown',
    // Fires on absence, so the advert is clean when a licence IS found.
    find: (text) =>
      findAny(text, LICENCE_PATTERNS) === null
        ? { phrase: null, index: -1 }
        : null,
  },
  {
    id: 'personal_contact_only',
    label: 'A personal mobile or WhatsApp is the only way to make contact',
    points: 15,
    advice:
      'A licensed agency has a registered office and a fixed line. A number that only works on WhatsApp can disappear the day after you pay.',
    passLabel: 'An office fixed line is given, not only a mobile number',
    find: (text) => {
      const hasMobileOrWhatsApp =
        MOBILE_NUMBER.test(text) || /\bwhat'?s\s?app\b/i.test(text)
      if (!hasMobileOrWhatsApp) return null
      if (FIXED_LINE.test(text)) return null

      return findAny(text, [/\bwhat'?s\s?app\b[^.\n]{0,40}/i, MOBILE_NUMBER])
    },
  },
  {
    id: 'unrealistic_promises',
    label: 'Promises no real employer can make',
    points: 15,
    advice:
      'No agent can guarantee a visa. The embassy decides, and an agency that promises otherwise is selling you something it does not control.',
    passLabel: 'No guaranteed-visa or no-experience-needed promises',
    find: (text) =>
      findAny(text, [
        /\b(?:visa|job|selection)\s*(?:is\s*)?guarantee?d\b/i,
        /\bguarantee?d\s*(?:visa|job|placement|selection)\b/i,
        /\bno\s*(?:experience|qualification|education)\s*(?:needed|required|necessary)?\b/i,
        /\b100\s*%\s*(?:job|visa|guarantee?d?|sure|success)\b/i,
        /\bfree\s*visa\b/i,
        /\bdirect\s*visa\b/i,
      ]),
  },
  {
    id: 'urgency_pressure',
    label: 'Pressure to decide immediately',
    points: 10,
    advice:
      'Urgency stops you checking. A real job order stays open long enough for you to verify the licence first.',
    passLabel: 'No pressure to decide immediately',
    find: (text) =>
      findAny(text, [
        /\burgent(?:ly)?\b/i,
        /\bonly\s*\d+\s*(?:slots?|seats?|vacanc(?:y|ies)|places?)\s*(?:left|remaining|available)?/i,
        /\b(?:today|tomorrow)\s*only\b/i,
        /\b(?:closing|apply|register)\s*(?:today|tomorrow)\b/i,
        /\blimited\s*(?:slots?|seats?|vacancies|time|offer)\b/i,
        /\b(?:hurry|last chance|don'?t miss|act fast|immediately)\b/i,
        /\bfew\s*(?:slots?|seats?)\s*(?:left|remaining)\b/i,
      ]),
  },
  {
    id: 'passport_handover',
    label: 'Asks for your passport to be handed over',
    points: 10,
    advice:
      'Give a photocopy, never the original. An agent holding your passport controls whether you can leave or go elsewhere.',
    passLabel: 'Does not ask you to hand over your passport',
    find: (text) =>
      findAny(text, [
        /\b(?:original\s*)?passport[^.\n]{0,40}(?:hand(?:ed)?\s*over|submit(?:ted)?|deposit(?:ed)?|give[nn]?|surrender)/i,
        /\b(?:hand\s*over|submit|send|bring|give)\s*(?:your\s*|the\s*)?(?:original\s*)?passport\b/i,
        /\bpassport\s*(?:must|should|to)\s*be\s*(?:hand(?:ed)?|submit|given|deposit)/i,
      ]),
  },
  {
    id: 'personal_bank_account',
    label: 'Payment asked into a personal bank account',
    points: 10,
    advice:
      'A licensed agency banks in the company name and issues a receipt. Money sent to a personal account is almost impossible to trace back.',
    passLabel: 'No personal bank account given for payment',
    find: (text) =>
      findAny(text, [
        /\bpersonal\s*(?:bank\s*)?account\b/i,
        /\b(?:my|his|her)\s*(?:bank\s*)?account\b/i,
        /\baccount\s*(?:no|number|#)\s*[:.\-]?\s*[\dX]{4,}/i,
        /\b(?:deposit|transfer|send)\s*(?:the\s*)?(?:money|payment|amount|cash)?\s*to\s*(?:this|my|the following)\s*account/i,
      ]),
  },
  {
    id: 'salary_above_market',
    label: 'Salary far above the market rate for this role',
    points: 5,
    advice:
      'Compare the figure with the SLBFE minimum wage for that country and job. A number well above it is bait, not an offer.',
    passLabel: 'Salary looks realistic for the role',
    find: (text) => {
      // Only a concern for jobs advertised as needing no qualifications.
      if (!LOW_SKILL_ROLE.test(text)) return null

      // Fresh regexes each call, because these use /g.
      const salaryPatterns = [
        /salary[^0-9]{0,30}([0-9][0-9,]{3,})/gi,
        /([0-9][0-9,]{3,})[^0-9]{0,20}(?:per month|a month|monthly)/gi,
      ]

      for (const pattern of salaryPatterns) {
        for (const match of text.matchAll(pattern)) {
          const amount = Number(match[1].replace(/,/g, ''))
          if (!Number.isNaN(amount) && amount >= SALARY_ALARM_LKR) {
            return { phrase: match[0].trim(), index: match.index }
          }
        }
      }

      return null
    },
  },
]

/*
  Pull the matched phrase out with a little of the advert either side, so the
  user can see where in their advert the flag came from.
*/
function buildContext(text, index, phrase) {
  if (index < 0 || phrase === null) return null

  const padding = 45
  const start = Math.max(0, index - padding)
  const end = Math.min(text.length, index + phrase.length + padding)

  let snippet = text.slice(start, end).replace(/\s+/g, ' ').trim()
  if (start > 0) snippet = '… ' + snippet
  if (end < text.length) snippet = snippet + ' …'

  return snippet
}

// 0-29 low, 30-59 caution, 60-100 high.
export function bandForScore(score) {
  if (score < 30) return 'low'
  if (score < 60) return 'caution'
  return 'high'
}

/*
  Run every rule over the advert.

  Returns the triggered flags and, just as importantly, the checks that
  passed. A list of only red flags reads like an accusation; showing what was
  checked and found clean makes it read like an analysis.
*/
export function scoreAdvert(text) {
  const advert = typeof text === 'string' ? text : ''

  const flags = []
  const passed = []
  let total = 0

  for (const rule of RULES) {
    const hit = rule.find(advert)

    if (hit === null) {
      passed.push({ id: rule.id, label: rule.passLabel })
      continue
    }

    total = total + rule.points
    flags.push({
      id: rule.id,
      label: rule.label,
      points: rule.points,
      matchedPhrase: hit.phrase,
      context: buildContext(advert, hit.index, hit.phrase),
      advice: rule.advice,
    })
  }

  // The eight rules add up to 110, so the cap is what keeps the score out of 100.
  const score = Math.min(total, MAX_SCORE)

  return { score, band: bandForScore(score), flags, passed }
}
