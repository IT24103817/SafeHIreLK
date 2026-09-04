/*
  The disclaimer is a marked deliverable and must appear word for word in the
  app footer and in the README. Do not reword it.

  The moderator link lives down here rather than in the main navigation,
  because it is not a feature for the public — it is the way a moderator gets
  to the approve and reject buttons during the demo.
*/
export default function Footer({ isAdmin, onAdminClick, onAdminSignOut }) {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
        <p className="text-xs leading-relaxed text-slate-500">
          Sample data compiled from publicly listed SLBFE information and
          fictional records, for academic demonstration only. This is not a live
          registry and must not be relied on for real hiring decisions.
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-brand-100 pt-4">
          {isAdmin ? (
            <>
              <span className="rounded-full bg-safe-soft px-2.5 py-1 text-xs font-bold text-safe">
                Moderator mode on
              </span>
              <button
                type="button"
                onClick={onAdminSignOut}
                className="text-xs font-semibold text-brand-600 underline hover:text-brand-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onAdminClick}
              className="text-xs font-semibold text-slate-500 underline hover:text-brand-700"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </footer>
  )
}
