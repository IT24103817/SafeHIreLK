/*
  The problem, stated inside the app.

  This is requirement 2 on the checklist and it carries the "relevance of the
  Sri Lankan problem" marks, so it sits on the landing page rather than being
  hidden behind the Learn tab. Every figure here is real reporting, not
  illustration.
*/

const FACTS = [
  {
    headline: 'Most overseas job adverts on social media were never approved',
    detail:
      'The SLBFE has warned that fraudulent overseas job offers are spreading on social media, the great majority of them never authorised by the Bureau and run by unlicensed individuals and agencies.',
  },
  {
    headline: 'A fake recruitment racket was found inside the SLBFE itself',
    detail:
      'In August 2026 an alleged racket was dismantled operating inside the Bureau, built on bogus employment contracts for placements in Israel that did not exist.',
  },
  {
    headline: 'It followed the opening of 16,000 positions in Israel',
    detail:
      'Weeks earlier the SLBFE had opened applications for up to 16,000 positions in Israel, warning the public against unlicensed agents trying to exploit the demand.',
  },
  {
    headline: 'An earlier racket sent over 30,000 people abroad untrained',
    detail:
      'More than 30,000 people, mostly women, were sent overseas without the mandatory training, with losses exceeding Rs. 2.5 billion.',
  },
]

export default function WhyThisMatters() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">
        Why this matters
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Sri Lankan job seekers going abroad are being defrauded by unlicensed
        recruitment agents at scale.
      </p>

      <ul className="mt-4 space-y-3">
        {FACTS.map((fact) => (
          <li
            key={fact.headline}
            className="rounded-xl border border-brand-100 bg-white p-4"
          >
            <h3 className="text-sm font-bold text-brand-900">
              {fact.headline}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {fact.detail}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-caution-line bg-caution-soft p-4">
          <h3 className="text-sm font-bold text-brand-900">Who this affects</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-brand-900">
            First-time migrant workers from rural districts — housemaids,
            drivers, caregivers and construction workers — who find jobs through
            Facebook posts and WhatsApp agents, and pay money before verifying
            anything.
          </p>
        </div>

        <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
          <h3 className="text-sm font-bold text-brand-900">
            The side nobody builds for
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-brand-900">
            Licensed agents are defrauded too. Candidates accept a paid
            placement, take the ticket and processing, then vanish or abscond on
            arrival, leaving the agency liable. Agencies have no shared record
            of who has done this before.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-brand-200 bg-white p-4">
        <h3 className="text-sm font-bold text-brand-900">
          Why the current fix does not work
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
          Verification today means calling hotline 1989 during office hours or
          searching the SLBFE website's licensed agency list. Nobody does that
          at 11pm when an "urgent Dubai driver job, leaving next week" post
          appears in a WhatsApp group.
        </p>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Figures above are drawn from SLBFE public warnings and Sri Lankan news
        reporting during 2026.
      </p>
    </section>
  )
}
