/*
  What changes if this exists.

  Written as today versus with the tool, because the value of SafeHire LK is
  not that verification becomes possible — it already is — but that it becomes
  fast enough that somebody actually does it before paying.
*/

const CHANGES = [
  {
    title: 'Verification takes seconds, not a phone call',
    today:
      'Call 1989 in office hours, or search the SLBFE website. Most people skip it and pay.',
    withTool:
      'Type the agency name into a phone and get a verdict before the money moves.',
  },
  {
    title: 'Fraud reports become searchable',
    today:
      'A warning sits in one Facebook comment thread and is gone by the next week.',
    withTool:
      'A verified report is attached to that agent name for everyone who searches it afterwards.',
  },
  {
    title: 'Both sides of the industry share one record',
    today:
      'Agencies have no way to know a candidate absconded on another agency last year.',
    withTool:
      'One record covers agencies, sub-agents, adverts and candidates, so neither side is working blind.',
  },
]

export default function ImpactSection() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">
        What changes if this exists
      </h2>

      <div className="mt-4 space-y-3">
        {CHANGES.map((change) => (
          <div
            key={change.title}
            className="rounded-xl border border-brand-100 bg-white p-4"
          >
            <h3 className="text-sm font-bold text-brand-900">{change.title}</h3>

            <div className="mt-3 space-y-2">
              <div className="rounded-lg bg-brand-50 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Today
                </p>
                <p className="mt-0.5 text-sm text-slate-600">{change.today}</p>
              </div>

              <div className="rounded-lg border border-safe-line bg-safe-soft px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-safe">
                  With SafeHire LK
                </p>
                <p className="mt-0.5 text-sm text-brand-900">
                  {change.withTool}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
