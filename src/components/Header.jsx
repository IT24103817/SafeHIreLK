import RoleToggle from './RoleToggle.jsx'

export default function Header({ role, onRoleChange }) {
  return (
    <header className="bg-brand-900 text-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 3 5 6v6c0 4 3 7.4 7 9 4-1.6 7-5 7-9V6l-7-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>

          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">
              SafeHire LK
            </h1>
            <p className="mt-0.5 text-sm text-brand-200">
              Check the licence before you pay a recruitment agent.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <RoleToggle role={role} onRoleChange={onRoleChange} />
        </div>
      </div>
    </header>
  )
}
