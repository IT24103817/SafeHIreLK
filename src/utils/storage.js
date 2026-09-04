import seedReports from '../data/reports.seed.json'

/*
  Owner: C and D — reports saved in the browser with localStorage.

  Two separate keys, on purpose:

    submitted  the reports a user typed into the form
    statuses   an id -> status map, the moderator's decisions

  Keeping the moderator's decisions apart from the reports themselves is what
  lets an admin approve a seeded report. The seed file is read-only, so we
  cannot write "verified" back into it — instead we record the decision and
  apply it on top when the list is read.

  It also means the team can keep editing reports.seed.json all afternoon and
  those edits show up straight away, instead of being hidden behind a copy
  that was written into localStorage on someone's first visit.

  ---------------------------------------------------------------------------
  REPORT SHAPE — one shape for both sides, so we build one form and one board.
  This matches src/data/reports.seed.json exactly.

    id                "R-009"                     R-001..R-008 are seeded
    type              "agent" | "candidate"       what is being reported
    reported_by_role  "seeker" | "agent"          who filed it
    subject_name      "Gulf Star Manpower Services"
    subject_phone     "0771234567" | null         seeker reports only
    subject_nic       "9XXXXXXXXV" | null         candidate reports only
    destination       "UAE"                       drives the board filter
    district          "Gampaha" | null            seed data only
    amount_lkr        275000                      number, never a string
    contact_method    "Facebook post" | null      seed data only
    description       min 20 characters
    reported_by       "Job seeker (name withheld)" | an agency name
    date              "2026-08-12"                ISO, sorts correctly as text
    created_at        ISO timestamp               submitted reports only
    status            "pending" | "verified" | "rejected"
*/

const SUBMITTED_KEY = 'safehire.reports.submitted'
const STATUS_KEY = 'safehire.reports.statuses'

/*
  Read and parse one key.

  Everything is wrapped because localStorage fails in more ways than people
  expect: private browsing can throw on access, the value can be half-written,
  and anyone can open devtools and put nonsense in it. A demo must not show a
  blank screen because of any of that — so on any problem we drop the bad key
  and carry on with the seed data.
*/
function readStore(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback

    const parsed = JSON.parse(raw)
    const wantsArray = Array.isArray(fallback)

    if (wantsArray && !Array.isArray(parsed)) return fallback
    if (!wantsArray && (parsed === null || typeof parsed !== 'object')) {
      return fallback
    }

    return parsed
  } catch (error) {
    // Corrupt or unreadable. Remove it so the app is not stuck on every load.
    try {
      window.localStorage.removeItem(key)
    } catch (removeError) {
      // Nothing else we can do; the fallback below still works.
    }
    return fallback
  }
}

// Returns true when the write succeeded, so the UI can tell the user honestly
// if their report could not be saved on this device.
function writeStore(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    return false
  }
}

// A stored report we are willing to display. Guards against a hand-edited or
// partly written localStorage entry taking the page down.
function isUsableReport(report) {
  return (
    report !== null &&
    typeof report === 'object' &&
    typeof report.id === 'string' &&
    typeof report.subject_name === 'string' &&
    typeof report.description === 'string'
  )
}

// Newest first. Dates are ISO, so comparing them as text sorts correctly.
function byNewestFirst(a, b) {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1
  return a.id < b.id ? 1 : -1
}

/*
  Every report: the seeded ones plus everything submitted on this device, with
  the moderator's decisions applied on top.
*/
export function loadReports() {
  const submitted = readStore(SUBMITTED_KEY, []).filter(isUsableReport)
  const statuses = readStore(STATUS_KEY, {})

  const all = seedReports.concat(submitted)

  return all
    .map((report) => {
      const decided = statuses[report.id]
      if (typeof decided !== 'string') return report
      return { ...report, status: decided }
    })
    .sort(byNewestFirst)
}

// "R-008" -> "R-009". Looks at every existing id so a submitted report can
// never reuse the number of a seeded one.
function nextReportId(existingReports) {
  let highest = 0

  for (const report of existingReports) {
    const match = /^R-(\d+)$/.exec(report.id)
    if (match !== null) {
      const number = Number(match[1])
      if (number > highest) highest = number
    }
  }

  return 'R-' + String(highest + 1).padStart(3, '0')
}

/*
  Save a new report. It always starts as pending — nothing a user types goes
  straight onto the public board.

  Returns the saved report and whether the write actually worked.
*/
export function saveReport(report) {
  const submitted = readStore(SUBMITTED_KEY, []).filter(isUsableReport)
  const now = new Date()

  const newReport = {
    ...report,
    id: nextReportId(seedReports.concat(submitted)),
    date: now.toISOString().slice(0, 10),
    created_at: now.toISOString(),
    status: 'pending',
  }

  const saved = writeStore(SUBMITTED_KEY, submitted.concat([newReport]))

  return { report: newReport, saved }
}

/*
  Record a moderator decision. Works for seeded and submitted reports alike,
  because the decision is stored against the id rather than inside the report.
*/
export function updateStatus(id, status) {
  const statuses = readStore(STATUS_KEY, {})
  return writeStore(STATUS_KEY, { ...statuses, [id]: status })
}
