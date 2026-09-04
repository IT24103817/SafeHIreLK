import { useMemo, useState } from 'react'
import blacklist from '../data/blacklist.json'
import { searchBlacklist } from '../utils/search.js'
import useDebouncedValue from '../utils/useDebouncedValue.js'
import PageHeading from '../components/PageHeading.jsx'
import SearchInput from '../components/SearchInput.jsx'
import ExampleSearches from '../components/ExampleSearches.jsx'
import CandidateCard from '../components/CandidateCard.jsx'
import NoRecordPanel from '../components/NoRecordPanel.jsx'

// Owner: A — blacklist search and candidate result cards.

const EXAMPLES = [
  { query: 'K. Perera', hint: 'Verified record' },
  { query: 'H. Ameena', hint: 'Report still under review' },
  { query: '9XXXXXXXXV', hint: 'Search by masked NIC' },
  { query: 'M. Silva', hint: 'No record on file' },
]

export default function CandidatePage({ onNavigate }) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 250)

  const results = useMemo(
    () => searchBlacklist(blacklist, debouncedQuery),
    [debouncedQuery]
  )

  const trimmedQuery = debouncedQuery.trim()
  const hasSearched = trimmedQuery.length >= 2
  const isTooShort = trimmedQuery.length === 1

  return (
    <div>
      <PageHeading
        title="Check a candidate"
        intro="Search the shared record of candidates reported by licensed agencies for absconding or defaulting after a paid placement."
      />

      <SearchInput
        id="candidate-search"
        label="Search candidates by name or masked NIC"
        value={query}
        onChange={setQuery}
        placeholder="Enter candidate name or masked NIC"
      />

      <div className="mt-5 space-y-4">
        {query.trim() === '' && (
          <ExampleSearches examples={EXAMPLES} onPick={setQuery} />
        )}

        {isTooShort && (
          <p className="text-sm text-slate-600">
            Please type at least two letters, for example "Perera" or the
            masked NIC "9XXXXXXXXV".
          </p>
        )}

        {hasSearched && results.length > 0 && (
          <>
            <p className="text-sm text-slate-600">
              {results.length === 1
                ? '1 record'
                : results.length + ' records'}{' '}
              for “{trimmedQuery}”
            </p>

            {results.map((record) => (
              <CandidateCard key={record.id} record={record} />
            ))}
          </>
        )}

        {hasSearched && results.length === 0 && (
          <NoRecordPanel
            query={trimmedQuery}
            onGoToReports={() => onNavigate('reports')}
          />
        )}
      </div>
    </div>
  )
}
