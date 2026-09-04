/*
  Owner: A — searching the registry and the candidate blacklist.

  Everything here is plain string work over the static JSON. There is no
  network call and no library, so the search works offline and every line can
  be explained.
*/

// Words that appear in almost every company name and carry no meaning for a
// search. Dropping them is what lets "Al Falah Manpower" match
// "Al-Falah Manpower (Pvt) Ltd".
const NOISE_WORDS = ['pvt', 'private', 'ltd', 'limited']

// A query shorter than this returns nothing, otherwise one letter would
// match half the registry.
const MIN_QUERY_LENGTH = 2

// Results below this score are too weak to show.
const MIN_SCORE = 20

/*
  When only some of the typed words match, we show the record only if at
  least this many words matched and they are at least this share of what was
  typed.

  These two numbers matter. Without them "Gulf Star Manpower" matches
  "Northern Star Manpower" on two words out of three, and the app shows a
  green Licensed card for an agency that is not in the registry at all. A
  wrong "licensed" is the one mistake this app must never make, so a weak
  match is treated as no match.
*/
const MIN_PARTIAL_WORDS = 2
const MIN_PARTIAL_SHARE = 0.75

/*
  Scores, highest first. They are named so the ranking is readable:
  a licence number match beats a name match, an exact name beats a
  partial one, and a word match beats a match in the middle of a word.
*/
const SCORE = {
  LICENCE_EXACT: 100,
  NAME_EXACT: 95,
  LICENCE_PARTIAL: 90,
  NAME_STARTS_WITH: 85,
  NAME_STARTS_WITH_NO_SPACES: 80,
  ALL_WORDS_MATCH: 70,
  NAME_CONTAINS: 45,
  MOST_WORDS_MATCH: 30,
}

/*
  Compare a record's name against the query. Both strings must already be
  normalised. Returns 0 when the match is too weak to show.

  Used by the registry search and the candidate search, which score names the
  same way.
*/
function scoreNameMatch(recordName, queryName) {
  if (recordName === queryName) return SCORE.NAME_EXACT
  if (recordName.startsWith(queryName)) return SCORE.NAME_STARTS_WITH

  // Catches a name typed without spaces, e.g. "alfalah".
  const compactRecord = recordName.replace(/ /g, '')
  const compactQuery = queryName.replace(/ /g, '')
  if (compactQuery !== '' && compactRecord.startsWith(compactQuery)) {
    return SCORE.NAME_STARTS_WITH_NO_SPACES
  }

  // Word by word, so the words can be in any order and can be half typed:
  // "manpower falah" and "falah manpo" both still find Al-Falah Manpower.
  const queryWords = queryName.split(' ')
  const recordWords = recordName.split(' ')
  const matchedWords = queryWords.filter((queryWord) =>
    recordWords.some((recordWord) => recordWord.startsWith(queryWord))
  )

  if (matchedWords.length === queryWords.length) return SCORE.ALL_WORDS_MATCH

  // Checked after the word match on purpose. Searching "al" should rank
  // "Al-Falah" above "Nilwala", even though "Nilwala" contains the letters.
  if (recordName.includes(queryName)) return SCORE.NAME_CONTAINS

  const share = matchedWords.length / queryWords.length
  if (matchedWords.length >= MIN_PARTIAL_WORDS && share >= MIN_PARTIAL_SHARE) {
    return SCORE.MOST_WORDS_MATCH
  }

  return 0
}

/*
  Lower case, punctuation to spaces, noise words removed.
    "Al-Falah Manpower (Pvt) Ltd"  ->  "al falah manpower"
    "AL FALAH  manpower"           ->  "al falah manpower"
  Both sides of every comparison go through this, so the two strings above
  are treated as the same text.
*/
export function normaliseName(text) {
  if (typeof text !== 'string') return ''

  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter((word) => word !== '' && !NOISE_WORDS.includes(word))
    .join(' ')
}

/*
  Letters and digits only, upper case. Used for licence numbers and for the
  masked NIC on the blacklist, so "FE/1001", "fe 1001" and "FE1001" are all
  the same code.
*/
export function normaliseCode(text) {
  if (typeof text !== 'string') return ''
  return text.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

/*
  How well one registry record matches the query. Returns 0 for no match.
*/
export function scoreRecord(record, query) {
  // Only try a licence match when the query contains a digit. Licence numbers
  // have digits and agency names do not, so this keeps "Al-Noor" from being
  // compared against every licence in the file.
  if (/[0-9]/.test(query)) {
    const queryCode = normaliseCode(query)
    const recordCode = normaliseCode(record.licence_no)

    if (queryCode.length >= 3) {
      if (recordCode === queryCode) return SCORE.LICENCE_EXACT
      if (recordCode.includes(queryCode)) return SCORE.LICENCE_PARTIAL
    }
  }

  const queryName = normaliseName(query)
  if (queryName === '') return 0

  return scoreNameMatch(normaliseName(record.name), queryName)
}

/*
  Ranked registry search. Ties break towards the shorter name, because a
  shorter name containing the query is usually the more exact result.
*/
export function searchRegistry(records, query, limit = 8) {
  if (typeof query !== 'string' || query.trim().length < MIN_QUERY_LENGTH) {
    return []
  }

  const matches = []

  for (const record of records) {
    const score = scoreRecord(record, query)
    if (score >= MIN_SCORE) {
      matches.push({ record, score })
    }
  }

  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (a.record.name.length !== b.record.name.length) {
      return a.record.name.length - b.record.name.length
    }
    return a.record.name.localeCompare(b.record.name)
  })

  return matches.slice(0, limit).map((match) => match.record)
}

/*
  Find one record by its licence number. Used to turn a sub-agent's
  parent_licence into the agency it claims to work under.
*/
export function findByLicence(records, licence) {
  const target = normaliseCode(licence)
  if (target === '') return null

  return (
    records.find((record) => normaliseCode(record.licence_no) === target) || null
  )
}

/*
  Decide which verdict a record gets. Kept here rather than in the card so the
  card only has to draw what it is told.

  Order matters. A sub-agent whose parent licence does not exist is the worst
  case and is checked first.
*/
export function getVerdict(record, records) {
  if (record.type === 'sub_agent') {
    const parent = findByLicence(records, record.parent_licence)

    if (parent === null) return { state: 'sub_agent_unverified', parent: null }
    if (record.status === 'expired') return { state: 'expired', parent }
    if (parent.status === 'expired') {
      return { state: 'sub_agent_parent_expired', parent }
    }
    return { state: 'sub_agent_verified', parent }
  }

  if (record.status === 'expired') return { state: 'expired', parent: null }
  return { state: 'licensed', parent: null }
}

/*
  How well one blacklist record matches the query. Same idea as the registry,
  but it also searches the masked NIC.
*/
export function scoreCandidate(record, query) {
  const queryCode = normaliseCode(query)
  const recordNic = normaliseCode(record.nic_masked)

  if (queryCode.length >= 4 && recordNic.includes(queryCode)) {
    return SCORE.LICENCE_EXACT
  }

  const queryName = normaliseName(query)
  if (queryName === '') return 0

  return scoreNameMatch(normaliseName(record.name), queryName)
}

/*
  Ranked blacklist search over candidate name and masked NIC.
*/
export function searchBlacklist(records, query, limit = 8) {
  if (typeof query !== 'string' || query.trim().length < MIN_QUERY_LENGTH) {
    return []
  }

  const matches = []

  for (const record of records) {
    const score = scoreCandidate(record, query)
    if (score >= MIN_SCORE) {
      matches.push({ record, score })
    }
  }

  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.record.id.localeCompare(b.record.id)
  })

  return matches.slice(0, limit).map((match) => match.record)
}
