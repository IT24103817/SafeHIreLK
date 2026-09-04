/*
  The six checks that protect someone before they pay anyone.

  Ordered the way the decision actually happens, not by importance: you check
  the licence first because everything else depends on it.
*/

const CHECKS = [
  {
    action: 'Verify the licence before anything else',
    detail:
      'Ask for the SLBFE licence number and check it on the Verify tab. An agent who will not give you a number has already told you something.',
  },
  {
    action: 'Never pay before the job is confirmed in writing',
    detail:
      'A licensed agency collects its fee after the job order and visa are confirmed, and gives you a receipt. No registration fee, no advance to hold a slot.',
  },
  {
    action: 'Never hand over your passport',
    detail:
      'Give a photocopy. An agent holding your original passport controls whether you can leave or go to another agency.',
  },
  {
    action: 'Insist on seeing SLBFE approval for the advert',
    detail:
      'Every overseas job advertisement has to be approved by the Bureau. Ask to see that approval for the specific job you were offered.',
  },
  {
    action: 'Register with the SLBFE before you depart',
    detail:
      'Registration is what gives you insurance, a record of your contract, and somewhere to turn if the job is not what you were promised.',
  },
  {
    action: 'Call 1989 to confirm an agent',
    detail:
      'The SLBFE hotline can check the live register. It takes one call, and it is free.',
  },
]

export default function SafeHiringChecklist() {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">
        Safe hiring checklist
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Six checks, in the order they matter. Every one of them is free.
      </p>

      <ol className="mt-4 space-y-3">
        {CHECKS.map((check, index) => (
          <li
            key={check.action}
            className="flex gap-3 rounded-xl border border-brand-100 bg-white p-4"
          >
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-brand-900">
                {check.action}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {check.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-sm font-medium text-brand-900">
        If you have already paid and cannot reach the agent, call{' '}
        <a href="tel:1989" className="font-bold text-danger underline">
          1989
        </a>{' '}
        and report it on the Reports tab so the next person searching that name
        finds your report.
      </p>
    </section>
  )
}
