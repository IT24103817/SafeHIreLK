const ROLE_CARDS = [
  {
    id: 'seeker',
    title: "I'm a Job Seeker",
    detail: 'Check an agency licence or scan a job advert before you pay.',
  },
  {
    id: 'agent',
    title: "I'm an Agent",
    detail: 'Check whether a candidate has been reported by another agency.',
  },
]

/*
  The role chooser on the landing hero.

  Deliberately not the same control as the pill toggle in the header. That one
  is a compact switch for someone already using the app; this one is the first
  question a new visitor has to answer, so it gets room to explain what each
  side actually does.
*/
export default function RoleChooser({ role, onRoleChange }) {
  return (
    <div>
      <p className="text-sm font-semibold text-brand-100">I am a…</p>

      <div
        role="group"
        aria-label="Choose who you are"
        className="mt-2 grid gap-2 sm:grid-cols-2"
      >
        {ROLE_CARDS.map((card) => {
          const isSelected = card.id === role

          return (
            <button
              key={card.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onRoleChange(card.id)}
              className={
                'rounded-xl border-2 p-3.5 text-left transition-colors ' +
                (isSelected
                  ? 'border-white bg-white'
                  : 'border-white/25 bg-white/5 hover:border-white/50')
              }
            >
              <span
                className={
                  'block text-sm font-bold ' +
                  (isSelected ? 'text-brand-900' : 'text-white')
                }
              >
                {card.title}
              </span>
              <span
                className={
                  'mt-0.5 block text-xs leading-relaxed ' +
                  (isSelected ? 'text-slate-600' : 'text-brand-200')
                }
              >
                {card.detail}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
