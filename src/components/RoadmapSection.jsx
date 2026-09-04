/*
  What we would build next.

  Each item names the limitation in the current build that it removes, so the
  roadmap reads as an honest account of where this version stops rather than a
  wish list.
*/

const ROADMAP = [
  {
    title: 'Live SLBFE registry integration',
    detail:
      'Read the licence register directly instead of a static sample, so a licence that lapsed this morning shows as expired this afternoon.',
  },
  {
    title: 'Verified agent accounts',
    detail:
      'Let a licensed agency claim its own entry, so reports about a candidate come from a confirmed agency rather than a typed name.',
  },
  {
    title: 'SMS verification for feature phones',
    detail:
      'Text an agency name to a short code and get the licence status back. Many of the people most at risk are not using a smartphone.',
  },
  {
    title: 'Full Sinhala and Tamil interface',
    detail:
      'The people this protects mostly do not read English. An English-only safety tool reaches the wrong half of the audience.',
  },
  {
    title: 'Embassy escalation workflow',
    detail:
      'Route a report from someone already overseas to the relevant Sri Lankan mission, instead of leaving it on a public board.',
  },
]

export default function RoadmapSection() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">
        What we would build next
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        This build is a four hour prototype. These are the five things that
        would take it from a demonstration to something usable in the field.
      </p>

      <ul className="mt-4 space-y-3">
        {ROADMAP.map((item) => (
          <li
            key={item.title}
            className="flex gap-3 rounded-xl border border-brand-100 bg-white p-4"
          >
            <span aria-hidden="true" className="mt-0.5 shrink-0 text-brand-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-brand-900">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
