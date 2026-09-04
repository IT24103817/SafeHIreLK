/*
  Tappable example searches shown before anyone has typed anything.

  They do two jobs: they show the user what this box expects, and they give
  the demo a one-tap route to each verdict state without typing on stage.
*/
export default function ExampleSearches({ examples, onPick }) {
  return (
    <div className="rounded-xl border border-brand-100 bg-white p-4">
      <p className="text-sm font-semibold text-brand-900">Try one of these</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example.query}
            type="button"
            onClick={() => onPick(example.query)}
            className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-left text-sm text-brand-800 hover:border-brand-500 hover:bg-brand-100"
          >
            <span className="font-semibold">{example.query}</span>
            <span className="block text-xs text-slate-500">
              {example.hint}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
