/*
  Label, input and inline error for one field.

  The input itself is passed in as children, so the same wrapper works for a
  text box, a dropdown and a textarea, and every field gets the same spacing
  and the same error treatment.
*/
export default function FormField({ id, label, hint, error, children }) {
  const hasError = typeof error === 'string' && error !== ''

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-brand-900">
        {label}
      </label>

      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}

      <div className="mt-1.5">{children}</div>

      {hasError && (
        <p
          id={id + '-error'}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger"
        >
          <span aria-hidden="true" className="mt-0.5 shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v6M12 16h.01" />
            </svg>
          </span>
          {error}
        </p>
      )}
    </div>
  )
}
