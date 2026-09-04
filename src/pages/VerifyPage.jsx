import { useMemo, useState } from 'react'
import registry from '../data/registry.json'
import { searchRegistry } from '../utils/search.js'
import useDebouncedValue from '../utils/useDebouncedValue.js'
import PageHeading from '../components/PageHeading.jsx'
import SearchInput from '../components/SearchInput.jsx'
import ExampleSearches from '../components/ExampleSearches.jsx'
import VerdictCard from '../components/VerdictCard.jsx'
import NotFoundPanel from '../components/NotFoundPanel.jsx'

// Owner: A — registry search, fuzzy matching, verdict cards.

const EXAMPLES = [
  { query: 'Al Falah Manpower', hint: 'Licensed agency' },
  { query: 'FE/2014', hint: 'Sub-agent with a licence that does not exist' },
  { query: 'Sahara Job Agency', hint: 'Expired licence' },
  { query: 'Gulf Star Manpower', hint: 'Not in the registry' },
]

export default function VerifyPage({ onNavigate }) {
  const [query, setQuery] = useState('')

  // Search the debounced value, not the live one, so the results do not
  // rebuild on every keystroke.
  const debouncedQuery = useDebouncedValue(query, 250)

  const results = useMemo(
    () => searchRegistry(registry, debouncedQuery),
    [debouncedQuery]
  )

  const trimmedQuery = debouncedQuery.trim()
  const hasSearched = trimmedQuery.length >= 2
  const isTooShort = trimmedQuery.length === 1

  return (
    <div>
      <PageHeading
        title="Verify an agent"
        intro="Search a recruitment agency or sub-agent by name or licence number to see whether the SLBFE licence is active, expired or not on record."
      />

      <SearchInput
        id="registry-search"
        label="Search the registry by agency name or licence number"
        value={query}
        onChange={setQuery}
        placeholder="Enter agency name or licence number"
      />

      <div className="mt-5 space-y-4">
        {query.trim() === '' && (
          <ExampleSearches examples={EXAMPLES} onPick={setQuery} />
        )}

        {isTooShort && (
          <p className="text-sm text-slate-600">
            Please type at least two letters, for example "Al Falah" or
            "FE/1001".
          </p>
        )}

        {hasSearched && results.length > 0 && (
          <>
            <p className="text-sm text-slate-600">
              {results.length === 1
                ? '1 match'
                : results.length + ' matches'}{' '}
              for “{trimmedQuery}”
            </p>

            {results.map((record) => (
              <VerdictCard
                key={record.licence_no}
                record={record}
                registry={registry}
              />
            ))}
          </>
        )}

        {hasSearched && results.length === 0 && (
          <NotFoundPanel
            query={trimmedQuery}
            onGoToReports={() => onNavigate('reports')}
          />
        )}
      </div>
    </div>
  )
}
