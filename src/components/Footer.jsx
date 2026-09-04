/*
  The disclaimer is a marked deliverable and must appear word for word in the
  app footer and in the README. Do not reword it.
*/
export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
        <p className="text-xs leading-relaxed text-slate-500">
          Sample data compiled from publicly listed SLBFE information and
          fictional records, for academic demonstration only. This is not a live
          registry and must not be relied on for real hiring decisions.
        </p>
      </div>
    </footer>
  )
}
