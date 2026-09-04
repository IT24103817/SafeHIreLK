/*
  Tab bar. The tab list is passed in from App.jsx because it depends on the
  role, so this component never needs to know about roles at all.

  overflow-x-auto keeps all four job-seeker tabs usable on a 375px phone.
*/
export default function TabNav({ tabs, activeTab, onTabChange }) {
  return (
    <nav
      aria-label="Sections"
      className="border-b border-brand-100 bg-white shadow-sm"
    >
      <div className="mx-auto w-full max-w-3xl overflow-x-auto px-2 sm:px-6">
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab

            return (
              <button
                key={tab.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onTabChange(tab.id)}
                className={
                  'whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:px-4 ' +
                  (isActive
                    ? 'border-brand-600 text-brand-800'
                    : 'border-transparent text-slate-500 hover:text-brand-700')
                }
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
