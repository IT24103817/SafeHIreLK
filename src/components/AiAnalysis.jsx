/*
  The optional AI layer, shown underneath the rules result.

  Clearly labelled as AI analysis, and clearly secondary. The score above it
  was produced by the rules engine and does not change because of anything
  written here.
*/
export default function AiAnalysis({ analysis }) {
  return (
    <section className="rounded-xl border border-brand-200 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-100 text-brand-700"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
          </svg>
        </span>
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-900">
          AI analysis
        </h3>
      </div>

      <p className="mt-3 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2.5 text-sm leading-relaxed text-brand-900">
        {analysis.warning}
      </p>

      <h4 className="mt-4 text-sm font-bold text-brand-900">
        How this advert is trying to work on you
      </h4>
      <ul className="mt-2 space-y-2">
        {/*
          Keyed by position, not by name. The model could return two tactics
          with the same name, and duplicate keys are a React warning in the
          console.
        */}
        {analysis.tactics.map((tactic, index) => (
          <li key={index} className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
            />
            <p className="text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-brand-900">
                {tactic.name}.
              </span>{' '}
              {tactic.explanation}
            </p>
          </li>
        ))}
      </ul>

      <h4 className="mt-4 text-sm font-bold text-brand-900">What to do next</h4>
      <ol className="mt-2 space-y-2">
        {analysis.next_steps.map((step, index) => (
          <li key={index} className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-800 text-xs font-bold text-white"
            >
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-slate-600">{step}</p>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Written by Claude from the text you pasted. It explains the score above
        — it does not change it. Check anything important against the SLBFE
        hotline 1989.
      </p>
    </section>
  )
}
