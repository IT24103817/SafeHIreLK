const ROLES = [
  { id: 'seeker', label: "I'm a Job Seeker" },
  { id: 'agent', label: "I'm an Agent" },
]

/*
  A two-state segmented control. The whole app switches audience from here,
  so it stays in the sticky header and is reachable at any scroll position.
*/
export default function RoleToggle({ role, onRoleChange }) {
  return (
    <div
      role="group"
      aria-label="Choose who you are"
      className="grid grid-cols-2 gap-1 rounded-xl bg-white/10 p-1"
    >
      {ROLES.map((option) => {
        const isSelected = option.id === role

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onRoleChange(option.id)}
            className={
              'rounded-lg px-3 py-2 text-sm font-semibold transition-colors ' +
              (isSelected
                ? 'bg-white text-brand-900 shadow-sm'
                : 'text-brand-100 hover:bg-white/10')
            }
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
