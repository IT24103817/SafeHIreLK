import RoleChooser from './RoleChooser.jsx'

/*
  The landing hero. Shown above the search box on whichever tab a role opens
  on, so the first thing a visitor sees is what the tool is for and the two
  ways into it — and the search box is still one screen away, not buried
  under the explanation.
*/
export default function Hero({ role, onRoleChange }) {
  return (
    <section className="mb-6 rounded-2xl bg-brand-900 p-5 text-white sm:p-7">
      <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
        Verify before you pay.
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-brand-100 sm:text-base">
        SafeHire LK checks recruitment agencies, sub-agents, job adverts and
        candidates against one shared record — in seconds, on the phone in your
        hand.
      </p>

      <div className="mt-5">
        <RoleChooser role={role} onRoleChange={onRoleChange} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/15 pt-4 text-xs text-brand-200">
        <span>50 agencies and sub-agents on record</span>
        {/* The separator only makes sense when the two sit on one line. */}
        <span aria-hidden="true" className="hidden sm:inline">
          ·
        </span>
        <span>8 fraud checks on every advert</span>
      </div>

      <p className="mt-3 text-sm text-brand-100">
        Being pressured to pay right now? Call the SLBFE hotline{' '}
        <a
          href="tel:1989"
          className="font-bold text-white underline underline-offset-2"
        >
          1989
        </a>
        .
      </p>
    </section>
  )
}
