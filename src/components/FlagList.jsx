/*
  The warning signs found in the advert.

  Every flag shows the exact words that triggered it. A score with no evidence
  behind it is just an opinion — showing the phrase lets the user check our
  working against their own advert.
*/

/*
  Split the context so the matched phrase can be highlighted inside it.
  Returns three pieces: before, the phrase as it appears, and after.
*/
function splitOnPhrase(context, phrase) {
  if (!context || !phrase) return null

  const position = context.toLowerCase().indexOf(phrase.toLowerCase())
  if (position === -1) return null

  return {
    before: context.slice(0, position),
    match: context.slice(position, position + phrase.length),
    after: context.slice(position + phrase.length),
  }
}

export default function FlagList({ flags }) {
  if (flags.length === 0) return null

  return (
    <section>
      <h3 className="text-sm font-bold uppercase tracking-wide text-brand-900">
        What we found
      </h3>

      <ul className="mt-3 space-y-3">
        {flags.map((flag) => {
          const parts = splitOnPhrase(flag.context, flag.matchedPhrase)

          return (
            <li
              key={flag.id}
              className="rounded-xl border border-danger-line bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-bold text-brand-900">
                  {flag.label}
                </h4>
                <span className="shrink-0 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-bold text-danger">
                  +{flag.points}
                </span>
              </div>

              {parts !== null ? (
                <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-slate-600">
                  {parts.before}
                  <mark className="rounded bg-caution-soft px-1 font-semibold text-brand-900">
                    {parts.match}
                  </mark>
                  {parts.after}
                </p>
              ) : (
                <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-sm italic text-slate-600">
                  Nothing matching was found anywhere in the advert.
                </p>
              )}

              <p className="mt-2.5 text-sm text-brand-900">{flag.advice}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
