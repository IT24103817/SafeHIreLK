/*
  The one search box used by both the Verify page and the Check Candidate
  page. It holds no state of its own — the page owns the query.
*/
export default function SearchInput({
  id,
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>

        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="has-custom-clear w-full rounded-xl border border-brand-200 bg-white py-4 pl-12 pr-11 text-base text-brand-900 shadow-sm placeholder:text-slate-400 focus:border-brand-600 focus:outline-none"
        />

        {value !== '' && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear the search box"
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-brand-700"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
