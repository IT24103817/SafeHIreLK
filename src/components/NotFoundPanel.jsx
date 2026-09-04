/*
  Shown when nothing in the registry matches. This is the screen that has to
  do the real work of the app: the person reading it is probably being asked
  for money right now, so it tells them exactly what to do next.
*/

const NEXT_STEPS = [
  {
    action: 'Call the SLBFE hotline 1989 and ask them to confirm the licence.',
    detail:
      'The hotline can check the live register. Our sample data can be out of date.',
  },
  {
    action: 'Do not pay any money yet.',
    detail:
      'No registration fee, no advance, no "ticket money". Licensed agencies charge after the job order is confirmed.',
  },
  {
    action: 'Do not hand over your passport.',
    detail:
      'Keep the original. An agent only needs a copy to start the paperwork.',
  },
  {
    action: 'Report it on the Reports tab.',
    detail:
      'Other job seekers searching this name will then see your report.',
  },
]

export default function NotFoundPanel({ query, onGoToReports }) {
  return (
    <section className="rounded-xl border-2 border-danger-line bg-danger-soft p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="mt-0.5 shrink-0 text-danger">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            <path d="M12 9v4M12 17h.01" />
          </svg>
        </span>

        <div className="min-w-0">
          <h3 className="text-lg font-bold text-danger sm:text-xl">
            No match found in the registry.
          </h3>
          <p className="mt-1 text-sm text-brand-900">
            We could not find{' '}
            <span className="font-semibold break-words">“{query}”</span> as a
            licensed agency or as a registered sub-agent.
          </p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-danger-line bg-white px-3 py-2.5 text-sm text-brand-900">
        This does not prove the agent is a fraud, but it does mean nobody has
        confirmed their licence. Treat them as unverified until the SLBFE tells
        you otherwise.
      </p>

      <h4 className="mt-5 text-sm font-bold uppercase tracking-wide text-brand-900">
        What to do now
      </h4>

      <ol className="mt-3 space-y-3">
        {NEXT_STEPS.map((step, index) => (
          <li key={step.action} className="flex gap-3">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-danger text-xs font-bold text-white"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-900">
                {step.action}
              </p>
              <p className="mt-0.5 text-sm text-slate-600">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={onGoToReports}
        className="mt-5 w-full rounded-xl bg-danger px-4 py-3 text-sm font-bold text-white hover:bg-red-800 sm:w-auto"
      >
        Report this agent
      </button>
    </section>
  )
}
