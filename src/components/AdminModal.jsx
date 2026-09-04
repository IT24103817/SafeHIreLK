import { useEffect, useState } from 'react'

/*
  The moderator passcode box.

  This is NOT authentication and we say so out loud in the demo. The passcode
  sits in the source, which anyone can read. It exists to demonstrate the
  moderation workflow — approve, reject, publish — without spending an hour of
  a four hour build on a login system that earns no marks.

  A real version would check the moderator on a server.
*/
const DEMO_PASSCODE = 'admin2026'

export default function AdminModal({ onUnlock, onClose }) {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')

  // Escape closes the box, which is what people expect from a dialog.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handleSubmit(event) {
    event.preventDefault()

    if (passcode.trim() === '') {
      setError('Please enter the moderator passcode to continue.')
      return
    }

    if (passcode.trim() !== DEMO_PASSCODE) {
      setError('That passcode is not correct. Please check it and try again.')
      return
    }

    onUnlock()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-brand-900/60 p-4 sm:items-center">
      {/* Clicking the dark area behind the box closes it. */}
      <button
        type="button"
        aria-label="Close the moderator sign in"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-title"
        className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <h2 id="admin-title" className="text-lg font-bold text-brand-900">
          Moderator sign in
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Moderators check reports before they appear on the public board.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-4">
          <label
            htmlFor="admin-passcode"
            className="block text-sm font-semibold text-brand-900"
          >
            Passcode
          </label>
          <input
            id="admin-passcode"
            type="password"
            autoFocus
            value={passcode}
            onChange={(event) => {
              setPasscode(event.target.value)
              if (error !== '') setError('')
            }}
            aria-invalid={error !== ''}
            aria-describedby={error !== '' ? 'admin-error' : undefined}
            className={
              'mt-1.5 w-full rounded-xl border bg-white px-3.5 py-3 text-base text-brand-900 focus:outline-none ' +
              (error !== ''
                ? 'border-danger focus:border-danger'
                : 'border-brand-200 focus:border-brand-600')
            }
          />

          {error !== '' && (
            <p
              id="admin-error"
              role="alert"
              className="mt-2 text-sm font-medium text-danger"
            >
              {error}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-brand-800 px-4 py-3 text-sm font-bold text-white hover:bg-brand-900"
            >
              Unlock
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50"
            >
              Cancel
            </button>
          </div>
        </form>

        <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
          Demonstration only. This passcode is written into the source code and
          is not real authentication.
        </p>
      </div>
    </div>
  )
}
