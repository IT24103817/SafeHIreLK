/*
  Shown to an agent when a candidate is not on the shared record.

  This is deliberately not a red screen. For an agent, no record is the good
  outcome — but it is not a clearance, and saying so protects the candidate
  from being treated as guilty by absence.
*/
export default function NoRecordPanel({ query, onGoToReports }) {
  return (
    <section className="rounded-xl border border-safe-line bg-safe-soft p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="mt-0.5 shrink-0 text-safe">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12.5 2.5 2.5 4.5-5" />
          </svg>
        </span>

        <div className="min-w-0">
          <h3 className="text-lg font-bold text-safe sm:text-xl">
            No record found.
          </h3>
          <p className="mt-1 text-sm text-brand-900">
            No agency has reported{' '}
            <span className="font-semibold break-words">“{query}”</span> for
            absconding or defaulting.
          </p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-safe-line bg-white px-3 py-2.5 text-sm text-brand-900">
        This is not a clearance. It only means no agency has filed a report
        here. Keep your own signed agreement and receipts for every placement.
      </p>

      <button
        type="button"
        onClick={onGoToReports}
        className="mt-5 w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-sm font-bold text-brand-800 hover:border-brand-500 hover:bg-brand-50 sm:w-auto"
      >
        Report a candidate
      </button>
    </section>
  )
}
