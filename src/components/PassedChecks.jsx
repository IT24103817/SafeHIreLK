/*
  The checks that came back clean.

  This list exists because a page of only red flags feels like an accusation
  the user cannot argue with. Showing all eight checks — the ones that failed
  and the ones that passed — makes the score look like what it is: a fixed
  list of tests, applied the same way to every advert.
*/
export default function PassedChecks({ passed }) {
  if (passed.length === 0) return null

  return (
    <section>
      <h3 className="text-sm font-bold uppercase tracking-wide text-brand-900">
        Checks this advert passed
      </h3>

      <ul className="mt-3 space-y-2 rounded-xl border border-safe-line bg-white p-4">
        {passed.map((check) => (
          <li key={check.id} className="flex items-start gap-2.5">
            <span aria-hidden="true" className="mt-0.5 shrink-0 text-safe">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m5 13 4 4L19 7" />
              </svg>
            </span>
            <span className="text-sm text-brand-900">{check.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
